using AutoMapper;
using EMS.Authorization.TuitionFees;
using EMS.Authorization.UserClasses;
using EMS.UserClasses.Dto;

namespace EMS.TuitionFees.Dto
{
    public class TuitionMapProfile : Profile
    {
        public TuitionMapProfile()
        {
            CreateMap<UserClassDto, UserClass>().ReverseMap();
            CreateMap<TuitionFeeDto, TuitionFee>().ReverseMap();

            CreateMap<TuitionFee, TuitionFeeDto>()
                .ForMember(dest => dest.Student, opt => opt.MapFrom(src => src.UserClass));
        }
    }
}
