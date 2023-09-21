using System.Threading.Tasks;
using Abp.Authorization;
using Abp.Runtime.Session;
using EMS.Configuration.Dto;

namespace EMS.Configuration
{
    [AbpAuthorize]
    public class ConfigurationAppService : EMSAppServiceBase, IConfigurationAppService
    {
        public async Task ChangeUiTheme(ChangeUiThemeInput input)
        {
            await SettingManager.ChangeSettingForUserAsync(AbpSession.ToUserIdentifier(), AppSettingNames.UiTheme, input.Theme);
        }
    }
}
