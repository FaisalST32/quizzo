using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Quizzo.Api.Models
{
    public class Question : AuditableEntity
    {
        [Required]
        public string QuestionText { get; set; }

        public virtual ICollection<Answer> Answers { get; set; }

        [Required]
        [JsonIgnore]
        public virtual QuizRoom QuizRoom { get; set; }
    }
}
