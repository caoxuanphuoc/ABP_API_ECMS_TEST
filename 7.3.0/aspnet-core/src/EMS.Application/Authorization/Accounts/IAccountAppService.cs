using System.Threading.Tasks;
using Abp.Application.Services;
using EMS.Authorization.Accounts.Dto;

namespace EMS.Authorization.Accounts
{
    public interface IAccountAppService : IApplicationService
    {
        Task<IsTenantAvailableOutput> IsTenantAvailable(IsTenantAvailableInput input);

        Task<RegisterOutput> Register(RegisterInput input);
    }
}
