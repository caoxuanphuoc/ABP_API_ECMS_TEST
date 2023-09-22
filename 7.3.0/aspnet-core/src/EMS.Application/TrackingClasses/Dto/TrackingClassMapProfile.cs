using AutoMapper;
using EMS.Authorization.TrackingClasses;

namespace EMS.TrackingClasses.Dto
{
    public class TrackingClassMapProfile : Profile
    {
        public TrackingClassMapProfile()
        {
            CreateMap<TrackingClass, TrackingClassDto>()
                .ForMember(dest => dest.Student, opt => opt.MapFrom(src => src.UserClass));
        }
    }
}
