using Abp.Application.Services;
using Abp.Domain.Repositories;
using EMS.Social.Posts;
using EMS.Socials.Posts.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EMS.Socials.Posts
{
    public class PostAppService : AsyncCrudAppService<Post, PostDto, long, PagedPostResultRequestDto, CreatePostDto, UpdatePostDto>, IPostAppService
    {
        public PostAppService(IRepository<Post, long> repository) : base(repository)
        {
        }
    }
}
