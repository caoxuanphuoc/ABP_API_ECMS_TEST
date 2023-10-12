
using Abp.Application.Services;
using EMS.Socials.Comments.Dto;
using EMS.Socials.Posts.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EMS.Socials.Comments
{
    public interface ICommentAppService : IAsyncCrudAppService<CommentDto, long, PagedCommentResultRequestDto, CreateCommentDto, UpdateCommentDto>
    {
    }
}
