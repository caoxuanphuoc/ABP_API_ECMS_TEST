using Abp.Authorization;
using EMS.Authorization.Roles;
using EMS.Authorization.Users;

namespace EMS.Authorization
{
    public class PermissionChecker : PermissionChecker<Role, User>
    {
        public PermissionChecker(UserManager userManager)
            : base(userManager)
        {
        }
    }
}
