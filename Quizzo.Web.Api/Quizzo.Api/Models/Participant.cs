using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Quizzo.Api.Models
{
    public class Participant : AuditableEntity
    {
        [Required]
        public string Name { get; set; }

        [Required]
        public Guid QuizRoomId { get; set; }

        [Required]
        public virtual QuizRoom QuizRoom { get; set; }

        public virtual ICollection<Response> Responses { get; set; }
    }
}
