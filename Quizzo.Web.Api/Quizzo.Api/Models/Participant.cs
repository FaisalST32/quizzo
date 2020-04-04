using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Quizzo.Api.Models
{
    public class Participant : AuditableEntity
    {
        [Required]
        public string Name { get; set; }

        [Required]
        [JsonIgnore]
        public Guid QuizRoomId { get; set; }

        [Required]
        [JsonIgnore]
        public virtual QuizRoom QuizRoom { get; set; }

        public virtual ICollection<Response> Responses { get; set; }
    }
}
