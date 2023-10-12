using Abp.Application.Services;
using EMS.Homeworks.HomeworkApp.Dtos;
using EMS.Homeworks.HomeworkApp;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using EMS.Homeworks.SubmitHomeworks.Dtos;
using Abp.Domain.Repositories;

namespace EMS.Homeworks.SubmitHomeworks
{
    public class SubmitHomeworkAppService : AsyncCrudAppService<SubmitHomeWork, SubmitHomeworkDto, long, PagedSubmitHomeworkResultRequestDto, CreateSubmitHomeworkDto, UpdateSubmitHomeworkDto>, ISubmitHomeworkAppService
    {
        public SubmitHomeworkAppService(IRepository<SubmitHomeWork, long> repository) : base(repository)
        {
        }
    }
}
