using Abp.Application.Services;
using EMS.Social.Posts;
using EMS.Socials.Posts.Dto;
using EMS.Socials.Posts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using EMS.Social.Comments;
using EMS.Socials.Comments.Dto;
using Abp.Domain.Repositories;

namespace EMS.Socials.Comments
{
    public class CommentAppService : AsyncCrudAppService<Comment, CommentDto, long, PagedCommentResultRequestDto, CreateCommentDto, UpdateCommentDto>, ICommentAppService
    {
        public CommentAppService(IRepository<Comment, long> repository) : base(repository)
        {
        }
    }
}
