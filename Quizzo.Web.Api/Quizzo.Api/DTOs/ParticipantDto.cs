using System;
using System.ComponentModel.DataAnnotations;

namespace Quizzo.Api.DTOs
{
    public class ParticipantDto
    {
        public Guid? Id { get; set; }

        [Required]
        public string Name { get; set; }

        public int Score { get; set; }

        public int Rank { get; set; }
    }
}
