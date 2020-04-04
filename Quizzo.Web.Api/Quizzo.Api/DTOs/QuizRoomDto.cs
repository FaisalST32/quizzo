﻿using System;
using System.ComponentModel.DataAnnotations;

namespace Quizzo.Api.DTOs
{
    public class QuizRoomDto
    {
        public Guid? Id { get; set; }

        [Required]
        public string Name { get; set; }

        public string RoomCode { get; set; }

        public DateTime? StartedAtUtc { get; set; }

        public DateTime? StoppedAtUtc { get; set; }
    }
}
