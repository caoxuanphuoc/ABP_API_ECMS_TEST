using Abp.Application.Services;
using Abp.Application.Services.Dto;
using EMS.Authorization.Schedules;
using EMS.Schedules.Dto;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EMS.Schedules
{
    public interface IScheduleAppService : IAsyncCrudAppService<ScheduleDto, long, PagedScheduleResultRequestDto, CreateScheduleDto, UpdateScheduleDto>
    {
        Task<PagedResultDto<ScheduleDto>> GetAllWithClassIdFilter(PagedScheduleResultRequestDto input, long classId);
        public Task<PagedResultDto<ScheduleDto>> CreateAutomatic(DateTime startTime, DateTime endTime, long classId, int roomId, List<WorkShiftDto> LsWorkShift);
    }
}
