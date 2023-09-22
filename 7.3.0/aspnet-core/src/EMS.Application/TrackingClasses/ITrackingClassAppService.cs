using Abp.Application.Services;
using EMS.TrackingClasses.Dto;

namespace EMS.TrackingClasses
{
    public interface ITrackingClassAppService : IAsyncCrudAppService<TrackingClassDto, long, PagedTrackingClassResultRequestDto, CreateOrUpdateTrackingClassDto, CreateOrUpdateTrackingClassDto>
    {
    }
}
