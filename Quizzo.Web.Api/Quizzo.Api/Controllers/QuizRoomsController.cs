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

        [HttpGet("{id}")]
        [ApiExplorerSettings(IgnoreApi = true)]
        public async Task<ActionResult<QuizRoomDto>> GetQuizRoom(Guid id)
        {
            var quizRoom = await _context.QuizRooms.FindAsync(id);

            if (quizRoom == null)
            {
                return NotFound();
            }

            return _mapper.Map<QuizRoomDto>(quizRoom);
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

        [HttpPost]
        public async Task<ActionResult<QuizRoom>> PostQuizRoom()
        {
            var quizRoom = new QuizRoom()
            {
                RoomCode = RandomString(6),
                Name = $"Quizzo_{DateTime.UtcNow}", // some temporary name since we don't have a quiz name set in the app right now
            };

            _context.QuizRooms.Add(quizRoom);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetQuizRoom", new { id = quizRoom.Id }, quizRoom);
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
                    }
                }

                leaderboard.Add(participant);
            }

            return Ok(leaderboard.OrderByDescending(l => l.Score));
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
    }
}
