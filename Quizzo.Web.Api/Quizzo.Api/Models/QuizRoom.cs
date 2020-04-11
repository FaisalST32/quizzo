using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Quizzo.Api.Models
{
    public class QuizRoom : AuditableEntity
    {
        [Required]
        public string Name { get; set; }

        [Required]
        public string RoomCode { get; set; }

        public string AdminCode { get; set; }

        public bool IsReady { get; set; }

        public DateTime? StartedAtUtc { get; set; }

        public DateTime? StoppedAtUtc { get; set; }

        public virtual ICollection<Question> Questions { get; set; }

        public virtual ICollection<Participant> Participants { get; set; }
    }
}
