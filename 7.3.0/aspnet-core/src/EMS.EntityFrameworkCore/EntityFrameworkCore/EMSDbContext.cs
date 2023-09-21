using Microsoft.EntityFrameworkCore;
using Abp.Zero.EntityFrameworkCore;
using EMS.Authorization.Roles;
using EMS.Authorization.Users;
using EMS.MultiTenancy;

namespace EMS.EntityFrameworkCore
{
    public class EMSDbContext : AbpZeroDbContext<Tenant, Role, User, EMSDbContext>
    {
        /* Define a DbSet for each entity of the application */
        
        public EMSDbContext(DbContextOptions<EMSDbContext> options)
            : base(options)
        {
        }
    }
}
