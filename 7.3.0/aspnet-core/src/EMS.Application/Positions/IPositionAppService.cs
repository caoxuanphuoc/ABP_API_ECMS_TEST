using Abp.Application.Services;
using EMS.Positions.dto;

namespace EMS.Positions
{
    public interface IPositionAppService : IAsyncCrudAppService<PositionDto, long, PagedPositionResultRequestDto, CreateOrUpdatePositionDto, CreateOrUpdatePositionDto>
    {
    }
}
