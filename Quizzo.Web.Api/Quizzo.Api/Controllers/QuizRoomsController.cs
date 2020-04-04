using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Quizzo.Api.Models;

namespace Quizzo.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class QuizRoomsController : ControllerBase
    {
        private readonly QuizzoContext _context;

        public QuizRoomsController(QuizzoContext context)
        {
            _context = context;
        }

        // GET: api/QuizRooms
        [HttpGet]
        public async Task<ActionResult<IEnumerable<QuizRoom>>> GetQuizRooms()
        {
            return await _context.QuizRooms.ToListAsync();
        }

        // GET: api/QuizRooms/5
        [HttpGet("{id}")]
        public async Task<ActionResult<QuizRoom>> GetQuizRoom(Guid id)
        {
            var quizRoom = await _context.QuizRooms.FindAsync(id);

            if (quizRoom == null)
            {
                return NotFound();
            }

            return quizRoom;
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
        public async Task<ActionResult<QuizRoom>> PostQuizRoom(QuizRoom quizRoom)
        {
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
    }
}
