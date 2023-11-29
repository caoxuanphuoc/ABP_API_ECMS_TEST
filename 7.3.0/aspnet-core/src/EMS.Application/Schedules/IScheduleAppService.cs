using Abp.Application.Services;
using EMS.Schedules.Dto;
using System.Threading.Tasks;

namespace EMS.Schedules
{
    public interface IScheduleAppService : IAsyncCrudAppService<ScheduleDto, long, PagedScheduleResultRequestDto, CreateScheduleDto, UpdateScheduleDto>
    {
        Task<string> HashSchedule(long id);
    }
}
