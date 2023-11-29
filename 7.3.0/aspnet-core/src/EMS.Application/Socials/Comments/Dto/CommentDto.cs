using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using EMS.Social.Comments;
using System;

namespace EMS.Socials.Comments.Dto
{
    [AutoMapFrom(typeof(Comment))]
    public class CommentDto : EntityDto<long>
    {
        public long PostId { get; set; }
        public bool IsPrivate { get; set; }
        public string ContentComment { get; set; }
        public long FromUserId { get; set; }
        public DateTime TimeToComment { get; set; }
    }
}