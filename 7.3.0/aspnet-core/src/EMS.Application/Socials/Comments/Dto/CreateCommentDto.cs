using Abp.AutoMapper;
using EMS.Social.Comments;
using EMS.Social.Posts;
using System.ComponentModel.DataAnnotations;

namespace EMS.Socials.Comments.Dto
{
    [AutoMapTo(typeof(Comment))]
    public class CreateCommentDto
    {
        [Required]
        public long PostId { get; set; }
        [Required]
        public bool IsPrivate { get; set; } = false;
        [Required]
        public string ContentComment { get; set; }
    }
}