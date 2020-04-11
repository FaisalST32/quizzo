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

        [HttpGet("GetQuizRoomForAdmin/{roomCode}/{adminCode}")]
        public async Task<IActionResult> GetQuizRoomForAdmin(string roomCode, string adminCode)
        {
            var quizRoom = await _context.QuizRooms
                .Include(q => q.Questions)
                .ThenInclude(q => q.Answers)
                .SingleOrDefaultAsync(q => q.RoomCode == roomCode && q.AdminCode == adminCode);

            if (quizRoom == null)
            {
                return NotFound();
            }

            var questions = quizRoom.Questions
                .Select(q => new QuestionDto()
                {
                    Id = q.Id,
                    QuestionText = q.QuestionText,
                    Answers = q.Answers.Select(a => new AnswerDto()
                    {
                        Id = a.Id,
                        AnswerText = a.AnswerText,
                        IsCorrect = a.IsCorrect
                    }).ToList()
                });

            var quizRoomDto = _mapper.Map<QuizRoomDto>(quizRoom);

            return Ok(new { quizRoom = quizRoomDto, questions });
        }

        [HttpPut("{id}")]
        [ApiExplorerSettings(IgnoreApi = true)]
        public async Task<IActionResult> PutQuizRoom(int id, QuizRoom quizRoom)
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

        [HttpPost("Create")]
        public async Task<ActionResult<QuizRoom>> PostQuizRoom()
        {
            var quizRoom = new QuizRoom()
            {
                RoomCode = RandomString(6),
                AdminCode = RandomString(4, true),
                Name = $"Quizzo_{DateTime.UtcNow}", // some temporary name since we don't have a quiz name set in the app right now
            };

            _context.QuizRooms.Add(quizRoom);
            await _context.SaveChangesAsync();

            return Ok(quizRoom);
        }

        [HttpDelete("{id}")]
        [ApiExplorerSettings(IgnoreApi = true)]
        public async Task<ActionResult<QuizRoom>> DeleteQuizRoom(int id)
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

        [HttpGet("{roomCode}/IsQuizReady")]
        public async Task<IActionResult> IsQuizReady(string roomCode)
        {
            var quizRoom = await _context.QuizRooms.SingleAsync(q => q.RoomCode == roomCode);

            return Ok(quizRoom.IsReady);
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
            var quizRoom = await _context.QuizRooms.SingleAsync(q => q.RoomCode.ToLower() == roomCode.ToLower());

            if (!quizRoom.StoppedAtUtc.HasValue)
            {
                var questions = await _context.Questions.Include(q => q.Answers.Where(a => a.IsCorrect)).Where(q => q.QuizRoom.RoomCode.ToLower() == roomCode.ToLower()).ToListAsync();
                var participants = await _context.Participants.Include(p => p.Responses).Where(p => p.QuizRoom.RoomCode == roomCode).ToListAsync();
                var responses = participants.SelectMany(c => c.Responses).ToList();

                foreach (var item in participants)
                {
                    var participantQuestions = new List<int>();

                    foreach (var response in item.Responses)
                    {
                        var question = questions.Single(q => q.Id == response.QuestionId);

                        if (!participantQuestions.Any(q => q == response.QuestionId) && question.Answers.Any(a => a.Id == response.AnswerId))
                        {
                            item.Score += points;

                            var fastestResponseTime = responses.Where(r => r.QuestionId == response.QuestionId && question.Answers.Any(a => a.Id == r.AnswerId)).Min(r => r.ResponseTime);

                            if (response.ResponseTime == fastestResponseTime)
                            {
                                item.Score += points;
                            }

                            participantQuestions.Add(response.QuestionId);
                        }
                    }
                }

                var rank = 1;

                foreach (var item in participants.OrderByDescending(l => l.Score).GroupBy(l => l.Score))
                {
                    foreach (var participant in item)
                    {
                        participant.Rank = rank;
                    }

                    rank++;
                }

                quizRoom.StoppedAtUtc = DateTime.UtcNow;

                await _context.SaveChangesAsync();
            }

            return Ok();
        }

        [HttpGet("{roomCode}/GetLeaderboard")]
        public async Task<IActionResult> GetLeaderboard(string roomCode)
        {
            var leaderboard = await _context.Participants.Where(p => p.QuizRoom.RoomCode.ToLower() == roomCode.ToLower()).OrderByDescending(p => p.Rank).Select(p => new ParticipantDto()
            {
                Name = p.Name,
                Rank = p.Rank,
                Score = p.Score
            }).Where(l => l.Rank <= 10).ToListAsync();

            return Ok(leaderboard);
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
                var response = participant.Responses.Where(a => a.QuestionId == item.Id).OrderBy(a => a.CreatedOnUtc).FirstOrDefault(a => a.QuestionId == item.Id);

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

        [HttpGet("RoomExists/{roomCode}")]
        public async Task<IActionResult> CheckRoomExists(string roomCode)
        {
            if (string.IsNullOrEmpty(roomCode))
            {
                return Ok(false);
            }

            var roomExists = await _context.QuizRooms.AnyAsync(qr => qr.RoomCode.ToLower() == roomCode.ToLower());
            return Ok(roomExists);
        }

        private bool QuizRoomExists(int id)
        {
            return _context.QuizRooms.Any(e => e.Id == id);
        }

        private static string RandomString(int length, bool isNumeric = false)
        {
            string chars = isNumeric ? "0123456789" : "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

            return new string(Enumerable.Repeat(chars, length)
              .Select(s => s[random.Next(s.Length)]).ToArray());
        }

        private async Task<List<int>> GetQuestionsAlreadyRespondedTo(string roomCode, string username)
        {
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
