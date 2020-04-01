namespace Quizzo.Models
{
    public class Participant : AuditableEntity
    {
        public string Name { get; set; }

        public virtual Quiz Quiz { get; set; }
    }
}
