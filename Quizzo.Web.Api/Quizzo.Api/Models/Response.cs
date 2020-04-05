using System;
using System.ComponentModel.DataAnnotations;

namespace Quizzo.Api.Models
{
    public class Response : AuditableEntity
    {
        [Required]
        public Guid QuestionId { get; set; }

        [Required]
        public virtual Question Question { get; set; }

        public Guid? AnswerId { get; set; }

        public virtual Answer Answer { get; set; }

        public long ResponseTime { get; set; }
    }
}
