using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using EMS.Social.Comments;
using EMS.Social.Posts;
using System.ComponentModel.DataAnnotations;

namespace EMS.Socials.Comments.Dto
{
    [AutoMapTo(typeof(Comment))]
    public class UpdateCommentDto : EntityDto<long>
    {
        [Required]
        public long PostId { get; set; }
        [Required]
        public string ContentComment { get; set; }
    }
}
