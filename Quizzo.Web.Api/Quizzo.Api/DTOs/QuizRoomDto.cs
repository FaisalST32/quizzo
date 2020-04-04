using System.ComponentModel.DataAnnotations;

namespace Quizzo.Api.DTOs
{
    public class QuizRoomDto
    {
        [Required]
        public string Name { get; set; }

        public string RoomCode { get; set; }
    }
}
