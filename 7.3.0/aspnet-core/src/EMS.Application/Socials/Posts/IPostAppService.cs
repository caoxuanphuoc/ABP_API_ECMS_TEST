using Abp.Application.Services;
using EMS.Socials.Posts.Dto;

namespace EMS.Socials.Posts
{
    public interface IPostAppService : IAsyncCrudAppService<PostDto, long, PagedPostResultRequestDto, CreatePostDto, UpdatePostDto>
    {
    }
}
