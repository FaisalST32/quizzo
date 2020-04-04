using System.ComponentModel.DataAnnotations;

namespace Quizzo.Api.Models
{
    public class Answer : AuditableEntity
    {
        [Required]
        public string AnswerText { get; set; }

        public bool IsCorrect { get; set; }
    }
}
