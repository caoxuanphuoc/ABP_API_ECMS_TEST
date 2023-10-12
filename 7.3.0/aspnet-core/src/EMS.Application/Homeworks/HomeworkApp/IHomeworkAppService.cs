using Abp.Application.Services;
using EMS.Homeworks.HomeworkApp.Dtos;
using EMS.Socials.Comments.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EMS.Homeworks.HomeworkApp
{
    public interface IHomeworkAppService : IAsyncCrudAppService<HomeworkDto, long, PagedHomeworkResultRequestDto, CreateHomeworkDto, UpdateHomeworkDto>
    {
    }
}
