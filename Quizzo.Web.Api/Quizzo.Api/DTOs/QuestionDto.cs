using System;
using System.ComponentModel.DataAnnotations;

namespace Quizzo.Api.DTOs
{
    public class QuestionDto
    {
        [Required]
        public string QuestionText { get; set; }

        [Required]
        public Guid QuizRoomId { get; set; }
    }
}
