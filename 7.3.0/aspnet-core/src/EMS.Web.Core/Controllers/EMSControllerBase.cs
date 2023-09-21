using Abp.AspNetCore.Mvc.Controllers;
using Abp.IdentityFramework;
using Microsoft.AspNetCore.Identity;

namespace EMS.Controllers
{
    public abstract class EMSControllerBase: AbpController
    {
        protected EMSControllerBase()
        {
            LocalizationSourceName = EMSConsts.LocalizationSourceName;
        }

        protected void CheckErrors(IdentityResult identityResult)
        {
            identityResult.CheckErrors(LocalizationManager);
        }
    }
}
