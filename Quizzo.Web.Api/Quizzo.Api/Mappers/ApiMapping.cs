using AutoMapper;
using Quizzo.Api.DTOs;
using Quizzo.Api.Models;
using System.Linq;

namespace Quizzo.Api.Mappers
{
    public class ApiMapping : Profile
    {
        public ApiMapping()
        {
            CreateMap<QuizRoom, QuizRoomDto>();

            CreateMap<AnswerDto, Answer>().ReverseMap();

            CreateMap<QuestionDto, Question>().ReverseMap();
        }
    }
}
