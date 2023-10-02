using Abp.Application.Services;
using EMS.WorkShifts.Dto;

namespace EMS.WorkShifts
{
    public interface IWorkShiftAppService : IAsyncCrudAppService<WorkShiftDto, long, PagedWorkShiftResultRequestDto, CreateWorkShiftDto, UpdateWorkShiftDto>
    {
    }
}
