using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using EMS.Authorization.Schedules;
using EMS.Social.Posts;
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
        [Required]
        public TypePost Type { get; set; }
        public string FileKey { get; set; }
    }
}