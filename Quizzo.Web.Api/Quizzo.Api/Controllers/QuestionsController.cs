using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Quizzo.Api.DTOs;
using Quizzo.Api.Models;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Quizzo.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class QuestionsController : ControllerBase
    {
        private readonly QuizzoContext _context;
        private readonly IMapper _mapper;

        public QuestionsController(QuizzoContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet("GetQuestionsByQuizRoom/{roomCode}")]
        public async Task<IActionResult> GetQuestionsByQuizRoom(string roomCode)
        {
            var quizRoom = await _context.QuizRooms.SingleAsync(q => q.RoomCode.ToLower() == roomCode.ToLower());
            if (quizRoom.StartedAtUtc.HasValue)
            {
                return BadRequest();
            }

            var questions = await _context.Questions.Include(q => q.Answers).OrderBy(q => q.CreatedOnUtc).Where(q => q.QuizRoom.RoomCode == roomCode)
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
                }).ToListAsync();

            return Ok(questions);
        }

        [HttpGet("{id}")]
        [ApiExplorerSettings(IgnoreApi = true)]
        public async Task<ActionResult<QuestionDto>> GetQuestion(int id)
        {
            var question = await _context.Questions.FindAsync(id);

            if (question == null)
            {
                return NotFound();
            }

            return _mapper.Map<QuestionDto>(question);
        }

        [HttpPut("{id}")]
        [ApiExplorerSettings(IgnoreApi = true)]
        public async Task<IActionResult> PutQuestion(int id, Question question)
        {
            if (id != question.Id)
            {
                return BadRequest();
            }

            _context.Entry(question).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!QuestionExists(id))
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

        [HttpPost("{roomCode}/PostQuestion")]
        public async Task<ActionResult<Question>> PostQuestion(string roomCode, QuestionDto questionDto)
        {
            var question = _mapper.Map<Question>(questionDto);

            var quizRoom = await _context.QuizRooms.Include(q => q.Questions).SingleAsync(q => q.RoomCode == roomCode);

            quizRoom.Questions.Add(question);
            await _context.SaveChangesAsync();

            return Ok(question);
        }

        [HttpDelete("{id}")]
        [ApiExplorerSettings(IgnoreApi = true)]
        public async Task<ActionResult<Question>> DeleteQuestion(int id)
        {
            var question = await _context.Questions.FindAsync(id);
            if (question == null)
            {
                return NotFound();
            }

            _context.Questions.Remove(question);
            await _context.SaveChangesAsync();

            return question;
        }

        private bool QuestionExists(int id)
        {
            return _context.Questions.Any(e => e.Id == id);
        }
    }
}
