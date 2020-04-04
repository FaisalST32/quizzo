using AutoMapper;
using Quizzo.Api.DTOs;
using Quizzo.Api.Models;

namespace Quizzo.Api.Mappers
{
    public class ApiMapping : Profile
    {
        public ApiMapping()
        {
            CreateMap<QuizRoom, QuizRoomDto>();

            CreateMap<Question, QuestionDto>();
        }
    }
}
