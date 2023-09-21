using System.Threading.Tasks;
using Abp.Application.Services;
using EMS.Sessions.Dto;

namespace EMS.Sessions
{
    public interface ISessionAppService : IApplicationService
    {
        Task<GetCurrentLoginInformationsOutput> GetCurrentLoginInformations();
    }
}
