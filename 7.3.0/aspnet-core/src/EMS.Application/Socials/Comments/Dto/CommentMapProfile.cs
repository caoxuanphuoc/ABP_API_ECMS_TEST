using AutoMapper;
using EMS.Social.Comments;

namespace EMS.Socials.Comments.Dto
{
    public class CommentMapProfile : Profile
    {
        public CommentMapProfile()
        {
            CreateMap<Comment, CommentDto>()
                .ForMember(dest => dest.FromUserId, opt => opt.MapFrom(src => src.CreatorUserId))
                .ForMember(dest => dest.TimeToComment, opt => opt.MapFrom(
                            src => (src.LastModificationTime != null) ? src.LastModificationTime : src.CreationTime));
        }
    }
}
