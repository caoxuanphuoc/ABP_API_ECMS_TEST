using AutoMapper;
using EMS.Authorization.Classes;

namespace EMS.Classes.Dto
{
    public class ClassMapProfile : Profile
    {
        public ClassMapProfile()
        {
            CreateMap<Class, ClassDto>()
                .ForMember(dest => dest.Teacher, opt => opt.MapFrom(src => src.UserClass));
        }
    }
}
