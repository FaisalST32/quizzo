using System;
using System.ComponentModel.DataAnnotations;

namespace Quizzo.Api.DTOs
{
    public class AnswerDto
    {
        public Guid? Id { get; set; }

        [Required]
        public string AnswerText { get; set; }

        public bool? IsCorrect { get; set; }
    }
}
