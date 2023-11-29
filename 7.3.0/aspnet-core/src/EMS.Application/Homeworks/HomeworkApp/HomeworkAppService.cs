using Abp.Application.Services;
using EMS.Social.Comments;
using EMS.Socials.Comments.Dto;
using EMS.Socials.Comments;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using EMS.Homeworks.HomeworkApp.Dtos;
using Abp.Domain.Repositories;

namespace EMS.Homeworks.HomeworkApp
{
    public class HomeworkAppService : AsyncCrudAppService<Homework, HomeworkDto, long, PagedHomeworkResultRequestDto, CreateHomeworkDto, UpdateHomeworkDto>, IHomeworkAppService
    {
        public HomeworkAppService(IRepository<Homework, long> repository) : base(repository)
        {
        }
    }
}
