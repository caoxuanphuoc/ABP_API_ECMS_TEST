using Abp.AutoMapper;
using EMS.Social.Posts;
using EMS.Users.Dto;
using System;
using System.ComponentModel.DataAnnotations;

namespace EMS.Socials.Posts.Dto
{
    [AutoMapTo(typeof(Post))]
    public class CreatePostDto
    {
        [Required]
        public long ClassId { get; set; }
        [Required]
        public string Title { get; set; }
        [Required]
        public string ContentPost { get; set; }
        [Required]
        public TypePost Type { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        [Required]
        public FileDto fileDto { get; set; }

    }
}