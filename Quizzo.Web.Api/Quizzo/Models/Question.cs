using System.Collections.Generic;

namespace Quizzo.Models
{
    public class Question : AuditableEntity
    {
        public string QuestionText { get; set; }

        public virtual ICollection<Answer> Answers { get; set; }
    }
}
