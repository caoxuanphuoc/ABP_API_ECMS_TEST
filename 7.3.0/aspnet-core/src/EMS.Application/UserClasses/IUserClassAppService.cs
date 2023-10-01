using Abp.Application.Services;
using EMS.UserClasses.Dto;

namespace EMS.UserClasses
{
    public interface IUserClassAppService : IAsyncCrudAppService<UserClassDto, long, PagedUserClassResultRequestDto, CreateOrUpdateUserClassDto, CreateOrUpdateUserClassDto>
    {
    }
}
