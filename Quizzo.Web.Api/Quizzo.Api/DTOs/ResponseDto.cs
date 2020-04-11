using System;
using System.ComponentModel.DataAnnotations;

namespace Quizzo.Api.DTOs
{
    public class ResponseDto
    {
        [Required]
        public int QuestionId { get; set; }

        public int? AnswerId { get; set; }

        [Required]
        public long ResponseTime { get; set; }
    }
}
