namespace Quizzo.Api.DTOs
{
    public class SolutionDto
    {
        public string QuestionText { get; set; }

        public string SelectedAnswerText { get; set; }

        public string CorrectAnswerText { get; set; }

        public int Score { get; set; }
    }
}
