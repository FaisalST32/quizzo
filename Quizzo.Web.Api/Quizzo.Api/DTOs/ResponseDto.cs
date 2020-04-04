using System;
using System.ComponentModel.DataAnnotations;

namespace Quizzo.Api.DTOs
{
    public class ResponseDto
    {
        public Guid? Id { get; set; }

        [Required]
        public Guid QuestionId { get; set; }

        [Required]
        public Guid AnswerId { get; set; }
    }
}
