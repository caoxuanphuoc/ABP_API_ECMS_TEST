using AutoMapper;
using EMS.Social.Posts;

namespace EMS.Socials.Posts.Dto
{
    public class PostMapProfile : Profile
    {
        public PostMapProfile()
        {
            CreateMap<Post, PostDto>()
                .ForMember(dest => dest.FromUserId, opt => opt.MapFrom(src => src.CreatorUserId))
                .ForMember(dest => dest.TimeToPost, opt => opt.MapFrom(
                            src => (src.LastModificationTime != null) ? src.LastModificationTime : src.CreationTime));
        }
    }
}
