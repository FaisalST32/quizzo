using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Quizzo.Api.Models
{
    public class Participant : AuditableEntity
    {
        [Required]
        public string Name { get; set; }

        public virtual ICollection<Response> Responses { get; set; }
    }
}
