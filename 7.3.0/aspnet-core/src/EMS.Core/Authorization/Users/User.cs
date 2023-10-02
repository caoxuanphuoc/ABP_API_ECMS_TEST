using Abp.Authorization.Users;
using Abp.Extensions;
using EMS.Authorization.Teachers;
using EMS.Authorization.UserClasses;
using System;
using System.Collections.Generic;

namespace EMS.Authorization.Users
{
    public class User : AbpUser<User>
    {
        public const string DefaultPassword = "123qwe";
        public ICollection<UserClass> UserClasses { get; set; }
        public ICollection<Teacher> Teachers { get; set; }

        public static string CreateRandomPassword()
        {
            return Guid.NewGuid().ToString("N").Truncate(16);
        }

        public static User CreateTenantAdminUser(int tenantId, string emailAddress)
        {
            var user = new User
            {
                TenantId = tenantId,
                UserName = AdminUserName,
                Name = AdminUserName,
                Surname = AdminUserName,
                EmailAddress = emailAddress,
                Roles = new List<UserRole>()
            };

            user.SetNormalizedNames();

            return user;
        }
    }
}
