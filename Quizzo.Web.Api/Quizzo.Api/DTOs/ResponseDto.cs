using System;
using System.ComponentModel.DataAnnotations;

namespace Quizzo.Api.DTOs
{
    public class ResponseDto
    {
        [Required]
        public Guid QuestionId { get; set; }

        public Guid? AnswerId { get; set; }

        [Required]
        public long ResponseTime { get; set; }
    }
}
