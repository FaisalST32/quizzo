using Microsoft.EntityFrameworkCore;

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
    }
}
