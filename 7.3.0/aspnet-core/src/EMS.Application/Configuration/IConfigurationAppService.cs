using System.Threading.Tasks;
using EMS.Configuration.Dto;

namespace EMS.Configuration
{
    public interface IConfigurationAppService
    {
        Task ChangeUiTheme(ChangeUiThemeInput input);
    }
}
