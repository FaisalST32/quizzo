using System;
using System.ComponentModel.DataAnnotations;

namespace Quizzo.Models
{
    interface IAuditableEntity
    {
        Guid Id { get; set; }

        DateTime CreatedOnUtc { get; set; }

        DateTime? LastUpdatedOnUtc { get; set; }
    }
}
