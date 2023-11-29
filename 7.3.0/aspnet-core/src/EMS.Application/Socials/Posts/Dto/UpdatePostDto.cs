using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using EMS.Social.Posts;
using EMS.Users.Dto;
using System.ComponentModel.DataAnnotations;

namespace EMS.Socials.Posts.Dto
{
    [AutoMapTo(typeof(Post))]
    public class UpdatePostDto : EntityDto<long>
    {
        [Required]
        public long ClassId { get; set; }
        [Required]
        public string Title { get; set; }
        [Required]
        public string ContentPost { get; set; }
        public FileDto fileDto { get; set; }
    }
}