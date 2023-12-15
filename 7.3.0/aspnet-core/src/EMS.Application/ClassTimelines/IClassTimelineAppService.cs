using Abp.Application.Services;
using EMS.ClassTimelines.Dto;
using System.Threading.Tasks;

namespace EMS.ClassTimelines
{
    public interface IClassTimelineAppService : IAsyncCrudAppService<ClassTimelineDto, long, PagedClassTimelineResultRequestDto, CreateClassTimelineDto, UpdateClassTimelineDto>
    {
        Task<string> HashSchedule(long id);
    }
}
