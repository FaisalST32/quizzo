using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Quizzo.Api.DTOs;
using Quizzo.Api.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Quizzo.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class QuizRoomsController : ControllerBase
    {
        private readonly QuizzoContext _context;
        private readonly IMapper _mapper;
        private static readonly Random random = new Random();
        private static readonly int points = 10;

        public QuizRoomsController(QuizzoContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet]
        [ApiExplorerSettings(IgnoreApi = true)]
        public async Task<ActionResult<IEnumerable<QuizRoom>>> GetQuizRooms()
        {
            return await _context.QuizRooms.ToListAsync();
        }

        [HttpGet("{roomCode}")]
        public async Task<IActionResult> GetQuizRoom(string roomCode)
        {
            var quizRoom = await _context.QuizRooms.Include(q => q.Questions).ThenInclude(q => q.Answers).SingleAsync(q => q.RoomCode == roomCode);

            var questions = quizRoom.Questions
                .Select(q => new QuestionDto()
                {
                    Id = q.Id,
                    QuestionText = q.QuestionText,
                    Answers = q.Answers.Select(a => new AnswerDto()
                    {
                        Id = a.Id,
                        AnswerText = a.AnswerText
                    }).ToList()
                });

            var quizRoomDto = _mapper.Map<QuizRoomDto>(quizRoom);

            return Ok(new { quizRoom = quizRoomDto, questions });
        }

        [HttpGet("{roomCode}/{username}")]
        public async Task<IActionResult> GetQuizRoomForParticipant(string roomCode, string username)
        {
            var quizRoom = await _context.QuizRooms
                .Include(q => q.Participants)
                .Include(q => q.Questions)
                .ThenInclude(q => q.Answers)
                .SingleOrDefaultAsync(q => q.RoomCode == roomCode && q.Participants.Any(p => p.Name.ToLower() == username.ToLower()));

            if (quizRoom == null)
            {
                return NotFound();
            }

            var questionsAlreadyRespondedTo = await GetQuestionsAlreadyRespondedTo(roomCode, username);

            var questions = quizRoom.Questions
                .Where(q => !questionsAlreadyRespondedTo.Contains(q.Id))
                .Select(q => new QuestionDto()
                {
                    Id = q.Id,
                    QuestionText = q.QuestionText,
                    Answers = q.Answers.Select(a => new AnswerDto()
                    {
                        Id = a.Id,
                        AnswerText = a.AnswerText
                    }).ToList()
                });

            var quizRoomDto = _mapper.Map<QuizRoomDto>(quizRoom);

            return Ok(new { quizRoom = quizRoomDto, questions });
        }

        [HttpPut("{id}")]
        [ApiExplorerSettings(IgnoreApi = true)]
        public async Task<IActionResult> PutQuizRoom(Guid id, QuizRoom quizRoom)
        {
            if (id != quizRoom.Id)
            {
                return BadRequest();
            }

            _context.Entry(quizRoom).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!QuizRoomExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        [HttpPost("create")]
        public async Task<ActionResult<QuizRoom>> PostQuizRoom()
        {
            var quizRoom = new QuizRoom()
            {
                RoomCode = RandomString(6),
                Name = $"Quizzo_{DateTime.UtcNow}", // some temporary name since we don't have a quiz name set in the app right now
            };

            _context.QuizRooms.Add(quizRoom);
            await _context.SaveChangesAsync();

            return Ok(quizRoom);
        }

        [HttpDelete("{id}")]
        [ApiExplorerSettings(IgnoreApi = true)]
        public async Task<ActionResult<QuizRoom>> DeleteQuizRoom(Guid id)
        {
            var quizRoom = await _context.QuizRooms.FindAsync(id);
            if (quizRoom == null)
            {
                return NotFound();
            }

            _context.QuizRooms.Remove(quizRoom);
            await _context.SaveChangesAsync();

            return quizRoom;
        }

        [HttpGet("{roomCode}/IsQuizActive")]
        public async Task<IActionResult> IsQuizActive(string roomCode)
        {
            var quizRoom = await _context.QuizRooms.SingleAsync(q => q.RoomCode == roomCode);

            return Ok(quizRoom.StartedAtUtc.HasValue && !quizRoom.StoppedAtUtc.HasValue);
        }

        [HttpPost("{roomCode}/StartQuiz")]
        public async Task<IActionResult> StartQuiz(string roomCode)
        {
            var quizRoom = await _context.QuizRooms.SingleAsync(q => q.RoomCode == roomCode);

            if (!quizRoom.StartedAtUtc.HasValue)
            {
                quizRoom.StartedAtUtc = DateTime.UtcNow;
                quizRoom.StoppedAtUtc = null;
                await _context.SaveChangesAsync();
            }

            return Ok();
        }

        [HttpPost("{roomCode}/StopQuiz")]
        public async Task<IActionResult> StopQuiz(string roomCode)
        {
            var quizRoom = await _context.QuizRooms.SingleAsync(q => q.RoomCode == roomCode);

            if (!quizRoom.StoppedAtUtc.HasValue)
            {
                quizRoom.StoppedAtUtc = DateTime.UtcNow;
                await _context.SaveChangesAsync();
            }

            return Ok();
        }

        [HttpGet("{roomCode}/GetLeaderboard")]
        public async Task<IActionResult> GetLeaderboard(string roomCode)
        {
            var leaderboard = new List<ParticipantDto>();

            var participants = await _context.Participants.Include(p => p.Responses).ThenInclude(r => r.Question).ThenInclude(q => q.Answers).Where(p => p.QuizRoom.RoomCode == roomCode).ToListAsync();

            foreach (var item in participants)
            {
                var participant = new ParticipantDto()
                {
                    Name = item.Name
                };

                foreach (var response in item.Responses)
                {
                    if (response.Question.Answers.Any(a => a.IsCorrect && a.Id == response.AnswerId))
                    {
                        participant.Score += points;

                        var isFastestCorrectReponse = response.ResponseTime == _context.Responses
                            .Where(q => q.QuestionId == response.QuestionId && q.Answer.Id == q.Question.Answers.First(a => a.IsCorrect).Id).Min(q => q.ResponseTime);

                        if (isFastestCorrectReponse)
                        {
                            participant.Score += points;
                        }
                    }
                }

                leaderboard.Add(participant);
            }

            leaderboard = leaderboard.OrderByDescending(l => l.Score).ToList();

            var currentScore = 0;
            var rank = 1;

            foreach (var item in leaderboard)
            {
                if (item.Score < currentScore)
                {
                    rank++;
                }

                item.Rank = rank;
                currentScore = item.Score;
            }

            return Ok(leaderboard.Where(l => l.Rank <= 10));
        }

        [HttpGet("{roomCode}/{username}/GetSolution")]
        public async Task<IActionResult> GetSolution(string roomCode, string username)
        {
            var quizRoom = await _context.QuizRooms.Select(q => new { q.RoomCode, q.StartedAtUtc, q.StoppedAtUtc, q.Id }).SingleAsync(q => q.RoomCode == roomCode);

            if (!quizRoom.StartedAtUtc.HasValue || !quizRoom.StoppedAtUtc.HasValue)
            {
                return BadRequest();
            }

            var solutions = new List<SolutionDto>();
            var participant = await _context.Participants.Include(p => p.Responses).SingleAsync(p => p.Name.ToLower() == username.ToLower() && p.QuizRoom.Id == quizRoom.Id);
            var questions = await _context.Questions.Include(q => q.Answers).OrderBy(q => q.CreatedOnUtc).Where(q => q.QuizRoom.RoomCode == roomCode).ToListAsync();

            foreach (var item in questions)
            {
                var correctAnswer = item.Answers.Single(a => a.IsCorrect);
                var response = participant.Responses.SingleOrDefault(a => a.QuestionId == item.Id);

                var solution = new SolutionDto()
                {
                    QuestionText = item.QuestionText,
                    CorrectAnswerText = correctAnswer.AnswerText,
                    SelectedAnswerText = response != null ? item.Answers.Single(a => a.Id == response.AnswerId).AnswerText : string.Empty
                };

                if (solution.CorrectAnswerText == solution.SelectedAnswerText)
                {
                    solution.Score += points;

                    if (response != null && response.ResponseTime == _context.Responses.Where(q => q.QuestionId == response.QuestionId).Min(q => q.ResponseTime))
                    {
                        solution.Score += points;
                    }
                }

                solutions.Add(solution);
            }

            return Ok(solutions);
        }

        [HttpGet("roomexists/{roomCode}")]
        public async Task<IActionResult> CheckRoomExists(string roomCode)
        {
            if (string.IsNullOrEmpty(roomCode))
            {
                return Ok(false);
            }

            var roomExists = await _context.QuizRooms.AnyAsync(qr => qr.RoomCode.ToLower() == roomCode.ToLower());
            return Ok(roomExists);
        }

        private bool QuizRoomExists(Guid id)
        {
            return _context.QuizRooms.Any(e => e.Id == id);
        }

        private static string RandomString(int length)
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            return new string(Enumerable.Repeat(chars, length)
              .Select(s => s[random.Next(s.Length)]).ToArray());
        }

        private async Task<List<Guid>> GetQuestionsAlreadyRespondedTo(string roomCode, string username)
        {
            var quiz = await _context.QuizRooms.Select(q => q.RoomCode).SingleOrDefaultAsync(q => q.ToLower() == roomCode.ToLower());
            if (quiz == null)
            {
                return null;
            }

            var participant = await _context.Participants.Include(c => c.Responses)
                .FirstOrDefaultAsync(p => p.QuizRoom.RoomCode.ToLower() == roomCode.ToLower() && p.Name.ToLower() == username.ToLower());

            if (participant == null)
            {
                return null;
            }

            return participant.Responses.Select(r => r.QuestionId).ToList();
        }
    }
}
