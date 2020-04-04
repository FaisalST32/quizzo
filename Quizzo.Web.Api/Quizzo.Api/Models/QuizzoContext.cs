using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Quizzo.Api.Models
{
    public class QuizzoContext : DbContext
    {
        public QuizzoContext(DbContextOptions<QuizzoContext> options)
            : base(options)
        {
        }

        public DbSet<QuizRoom> QuizRooms { get; set; }
        public DbSet<Question> Questions { get; set; }
        public DbSet<Answer> Answers { get; set; }
        public DbSet<Participant> Participants { get; set; }
        public DbSet<Response> Responses { get; set; }

        public override int SaveChanges()
        {
            AddAuditInfo();

            return base.SaveChanges();
        }

        public override int SaveChanges(bool acceptAllChangesOnSuccess)
        {
            AddAuditInfo();

            return base.SaveChanges(acceptAllChangesOnSuccess);
        }

        public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default(CancellationToken))
        {
            AddAuditInfo();

            return await base.SaveChangesAsync(cancellationToken);
        }

        public override async Task<int> SaveChangesAsync(bool acceptAllChangesOnSuccess, CancellationToken cancellationToken = default(CancellationToken))
        {
            AddAuditInfo();

            return await base.SaveChangesAsync(acceptAllChangesOnSuccess, cancellationToken);
        }

        private void AddAuditInfo()
        {
            var addedAuditedEntities = ChangeTracker.Entries<IAuditableEntity>()
                                                    .Where(p => p.State == EntityState.Added)
                                                    .Select(p => p.Entity);

            var modifiedAuditedEntities = ChangeTracker.Entries<IAuditableEntity>()
                                                       .Where(p => p.State == EntityState.Modified)
                                                       .Select(p => p.Entity);

            var utcNow = DateTime.UtcNow;

            foreach (var added in addedAuditedEntities)
            {
                added.CreatedOnUtc = utcNow;
            }

            foreach (var modified in modifiedAuditedEntities)
            {
                modified.LastUpdatedOnUtc = utcNow;
            }
        }
    }
}
