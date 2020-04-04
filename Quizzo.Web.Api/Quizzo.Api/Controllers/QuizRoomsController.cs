using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Quizzo.Api.DTOs;
using Quizzo.Api.Models;

namespace Quizzo.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class QuizRoomsController : ControllerBase
    {
        private readonly QuizzoContext _context;
        private readonly IMapper _mapper;
        private static Random random = new Random();

        public QuizRoomsController(QuizzoContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // GET: api/QuizRooms
        [HttpGet]
        public async Task<ActionResult<IEnumerable<QuizRoom>>> GetQuizRooms()
        {
            return await _context.QuizRooms.ToListAsync();
        }

        // GET: api/QuizRooms/5
        [HttpGet("{id}")]
        public async Task<ActionResult<QuizRoomDto>> GetQuizRoom(Guid id)
        {
            var quizRoom = await _context.QuizRooms.FindAsync(id);

            if (quizRoom == null)
            {
                return NotFound();
            }

            return _mapper.Map<QuizRoomDto>(quizRoom);
        }

        // PUT: api/QuizRooms/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPut("{id}")]
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

        // POST: api/QuizRooms
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
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

        // DELETE: api/QuizRooms/5
        [HttpDelete("{id}")]
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
