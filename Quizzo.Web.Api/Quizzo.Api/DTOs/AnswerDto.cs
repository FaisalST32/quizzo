using System.ComponentModel.DataAnnotations;

namespace Quizzo.Api.DTOs
{
    public class AnswerDto
    {
        [Required]
        public string AnswerText { get; set; }

        public bool IsCorrect { get; set; }
    }
}
