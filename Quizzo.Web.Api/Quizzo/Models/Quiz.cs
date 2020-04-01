using System.Collections.Generic;

namespace Quizzo.Models
{
    public class Quiz : AuditableEntity
    {
        public string Name { get; set; }

        public virtual ICollection<Question> Questions { get; set; }

        public virtual ICollection<Participant> Participants { get; set; }
    }
}
