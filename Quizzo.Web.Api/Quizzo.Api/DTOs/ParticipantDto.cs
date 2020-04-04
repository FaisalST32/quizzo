using System;
using System.ComponentModel.DataAnnotations;

namespace Quizzo.Api.DTOs
{
    public class ParticipantDto
    {
        [Required]
        public string Name { get; set; }

        [Required]
        public Guid QuizRoomId { get; set; }
    }
}
