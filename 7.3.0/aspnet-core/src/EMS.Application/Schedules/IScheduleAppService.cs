using Abp.Application.Services;
using EMS.Schedules.Dto;

namespace EMS.Schedules
{
    public interface IScheduleAppService : IAsyncCrudAppService<ScheduleDto, long, PagedScheduleResultRequestDto, CreateOrUpdateScheduleDto, CreateOrUpdateScheduleDto>
    {
    }
}
