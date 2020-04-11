using System;

namespace Quizzo.Api.Models
{
    interface IAuditableEntity
    {
        int Id { get; set; }

        DateTime CreatedOnUtc { get; set; }

        DateTime? LastUpdatedOnUtc { get; set; }
    }
}
