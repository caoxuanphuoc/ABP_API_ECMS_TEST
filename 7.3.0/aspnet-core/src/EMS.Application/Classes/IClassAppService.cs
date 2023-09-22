using Abp.Application.Services;
using EMS.Classes.Dto;

namespace EMS.Classes
{
    public interface IClassAppService : IAsyncCrudAppService<ClassDto, long, PagedClassResultRequestDto, CreateOrUpdateClassDto, CreateOrUpdateClassDto>
    {
    }
}
