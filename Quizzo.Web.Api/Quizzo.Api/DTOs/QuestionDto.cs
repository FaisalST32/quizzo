using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Quizzo.Api.DTOs
{
    public class QuestionDto
    {
        public Guid? Id { get; set; }

        [Required]
        public string QuestionText { get; set; }

        public ICollection<AnswerDto> Answers { get; set; }
    }
}
