using Abp.Application.Services;
using EMS.Homeworks.HomeworkApp.Dtos;
using EMS.Homeworks.SubmitHomeworks.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EMS.Homeworks.SubmitHomeworks
{
    public interface ISubmitHomeworkAppService : IAsyncCrudAppService<SubmitHomeworkDto, long, PagedSubmitHomeworkResultRequestDto, CreateSubmitHomeworkDto, UpdateSubmitHomeworkDto>
    {
    }
}
