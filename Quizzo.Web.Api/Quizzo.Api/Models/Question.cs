using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Quizzo.Api.Models
{
    public class Question : AuditableEntity
    {
        [Required]
        public string QuestionText { get; set; }

        public virtual ICollection<Answer> Answers { get; set; }
    }
}
