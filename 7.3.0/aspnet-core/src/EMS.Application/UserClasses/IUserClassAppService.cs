using Abp.Application.Services;
using Abp.Application.Services.Dto;
using EMS.UserClasses.Dto;
using System.Threading.Tasks;

namespace EMS.UserClasses
{
    public interface IUserClassAppService : IAsyncCrudAppService<UserClassDto, long, PagedUserClassResultRequestDto, CreateOrUpdateUserClassDto, CreateOrUpdateUserClassDto>
    {
        Task<PagedResultDto<UserClassDto>> GetAllWithClassIdFilter(PagedUserClassResultRequestDto input, long classId);
    }
}
