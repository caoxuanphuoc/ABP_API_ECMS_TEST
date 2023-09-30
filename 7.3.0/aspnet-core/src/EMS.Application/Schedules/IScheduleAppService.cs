using Abp.Application.Services;
using Abp.Application.Services.Dto;
using EMS.Schedules.Dto;
using System.Threading.Tasks;

namespace EMS.Schedules
{
    public interface IScheduleAppService : IAsyncCrudAppService<ScheduleDto, long, PagedScheduleResultRequestDto, CreateOrUpdateScheduleDto, CreateOrUpdateScheduleDto>
    {
        Task<PagedResultDto<ScheduleDto>> GetAllWithClassIdFilter(PagedScheduleResultRequestDto input, long classId);
    }
}
