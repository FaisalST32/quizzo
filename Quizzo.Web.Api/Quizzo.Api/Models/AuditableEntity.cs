using System;
using System.ComponentModel.DataAnnotations;

namespace Quizzo.Api.Models
{
    public class AuditableEntity : IAuditableEntity
    {
        [Required]
        public int Id { get; set; }

        [Required]
        public DateTime CreatedOnUtc { get; set; }
        
        public DateTime? LastUpdatedOnUtc { get; set; } 
    }
}
