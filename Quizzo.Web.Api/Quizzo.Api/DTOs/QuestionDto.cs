using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Quizzo.Api.DTOs
{
    public class QuestionDto
    {
        [Required]
        public string QuestionText { get; set; }

        public ICollection<AnswerDto> Answers { get; set; }
    }
}
