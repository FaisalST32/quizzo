using System;
using System.ComponentModel.DataAnnotations;

namespace Quizzo.Api.Models
{
    public class Response : AuditableEntity
    {
        [Required]
        public int QuestionId { get; set; }

        [Required]
        public virtual Question Question { get; set; }

        public int? AnswerId { get; set; }

        public virtual Answer Answer { get; set; }

        public long ResponseTime { get; set; }
    }
}
