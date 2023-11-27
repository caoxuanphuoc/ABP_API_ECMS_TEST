using AutoMapper;

namespace EMS.Homeworks.SubmitHomeworks.Dtos
{
    public class SubmitHomeworkMapProfile : Profile
    {
        public SubmitHomeworkMapProfile()
        {
            CreateMap<SubmitHomeWork, SubmitHomeworkDto>()
            .ForMember(dest => dest.FromUserId, opt => opt.MapFrom(src => src.CreatorUserId))
            .ForMember(dest => dest.TimeToSubmit, opt => opt.MapFrom(
                src => (src.LastModificationTime != null) ? src.LastModificationTime : src.CreationTime));
        }
    }
}
