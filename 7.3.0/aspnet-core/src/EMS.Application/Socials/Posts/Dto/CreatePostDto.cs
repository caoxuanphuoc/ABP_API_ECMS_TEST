using Abp.AutoMapper;
using EMS.Authorization.Classes;
using EMS.Homeworks;
using EMS.Social.Posts;
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
        public string FileKey { get; set; }
    }
}