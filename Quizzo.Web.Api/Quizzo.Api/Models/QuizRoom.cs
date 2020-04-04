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

        public virtual ICollection<Question> Questions { get; set; }

        public virtual ICollection<Participant> Participants { get; set; }
    }
}
