using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using EMS.Social.Posts;
using System;

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
        public DateTime TimeToPost { get; set; }
        public long FromUserId { get; set; }
    }
}