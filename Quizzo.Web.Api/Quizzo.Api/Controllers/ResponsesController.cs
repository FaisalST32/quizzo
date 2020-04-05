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
    public class ResponsesController : ControllerBase
    {
        private readonly QuizzoContext _context;
        private readonly IMapper _mapper;

        public ResponsesController(QuizzoContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet]
        [ApiExplorerSettings(IgnoreApi = true)]
        public async Task<ActionResult<IEnumerable<Response>>> GetResponses()
        {
            return await _context.Responses.ToListAsync();
        }

        [HttpGet("{id}")]
        [ApiExplorerSettings(IgnoreApi = true)]
        public async Task<ActionResult<Response>> GetResponse(Guid id)
        {
            var response = await _context.Responses.FindAsync(id);

            if (response == null)
            {
                return NotFound();
            }

            return response;
        }

        [HttpPut("{id}")]
        [ApiExplorerSettings(IgnoreApi = true)]
        public async Task<IActionResult> PutResponse(Guid id, Response response)
        {
            if (id != response.Id)
            {
                return BadRequest();
            }

            _context.Entry(response).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ResponseExists(id))
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

        [HttpPost("{roomCode}/{username}/PostResponse")]
        public async Task<IActionResult> PostResponse(string roomCode, string username, ResponseDto responseDto)
        {
            var response = _mapper.Map<Response>(responseDto);

            var participantResponse = await _context.Participants.Include(c => c.Responses).SingleAsync(p => p.QuizRoom.RoomCode.ToLower() == roomCode.ToLower() && p.Name.ToLower() == username.ToLower());

            if (!participantResponse.Responses.Any(r => r.QuestionId == response.QuestionId))
            {
                participantResponse.Responses.Add(response);
                await _context.SaveChangesAsync();
            }

            return Ok();
        }

        [HttpDelete("{id}")]
        [ApiExplorerSettings(IgnoreApi = true)]
        public async Task<ActionResult<Response>> DeleteResponse(Guid id)
        {
            var response = await _context.Responses.FindAsync(id);
            if (response == null)
            {
                return NotFound();
            }

            _context.Responses.Remove(response);
            await _context.SaveChangesAsync();

            return response;
        }

        private bool ResponseExists(Guid id)
        {
            return _context.Responses.Any(e => e.Id == id);
        }
    }
}
