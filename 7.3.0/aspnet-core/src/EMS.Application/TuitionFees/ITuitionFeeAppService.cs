using Abp.Application.Services;
using EMS.TuitionFees.Dto;

namespace EMS.TuitionFees
{
    public interface ITuitionFeeAppService : IAsyncCrudAppService<TuitionFeeDto, long, PagedTuitionFeeResultRequestDto, CreateTuitionFeeDto, UpdateTuitionFeeDto>
    {
    }
}
