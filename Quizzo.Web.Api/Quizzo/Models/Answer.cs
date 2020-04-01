namespace Quizzo.Models
{
    public class Answer : AuditableEntity
    {
        public string AnswerText { get; set; }

        public bool IsCorrect { get; set; }
    }
}
