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

            CreateMap<AnswerDto, Answer>().ReverseMap();

            CreateMap<QuestionDto, Question>().ReverseMap();

            CreateMap<ParticipantDto, Participant>().ReverseMap().PreserveReferences();
        }
    }
}
