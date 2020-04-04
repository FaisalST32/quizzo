using System;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Quizzo.Api.Models
{
    public class Response : AuditableEntity
    {
        [Required]
        public Guid QuestionId { get; set; }

        [Required]
        public virtual Question Question { get; set; }

        [Required]
        public Guid AnswerId { get; set; }

        [Required]
        public virtual Answer Answer { get; set; }

        public long ResponseTime { get; set; }
    }
}
