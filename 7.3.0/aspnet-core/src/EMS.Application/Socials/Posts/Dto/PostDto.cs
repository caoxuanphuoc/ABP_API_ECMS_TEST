using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using EMS.Authorization.Classes;
using EMS.Authorization.Schedules;
using EMS.Homeworks;
using EMS.Social.Posts;

namespace EMS.Socials.Posts.Dto
{
    [AutoMapFrom(typeof(Post))]
    public class PostDto : EntityDto<long>
    {
        public long ClassId { get; set; }
        public string Title { get; set; }
        public string ContentPost { get; set; }
        public string Type { get; set; }
        public string FileKey { get; set; }
    }
}