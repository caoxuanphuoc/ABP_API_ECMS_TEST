using Abp.AspNetCore;
using Abp.AspNetCore.TestBase;
using Abp.Modules;
using Abp.Reflection.Extensions;
using EMS.EntityFrameworkCore;
using EMS.Web.Startup;
using Microsoft.AspNetCore.Mvc.ApplicationParts;

namespace EMS.Web.Tests
{
    [DependsOn(
        typeof(EMSWebMvcModule),
        typeof(AbpAspNetCoreTestBaseModule)
    )]
    public class EMSWebTestModule : AbpModule
    {
        public EMSWebTestModule(EMSEntityFrameworkModule abpProjectNameEntityFrameworkModule)
        {
            abpProjectNameEntityFrameworkModule.SkipDbContextRegistration = true;
        } 
        
        public override void PreInitialize()
        {
            Configuration.UnitOfWork.IsTransactional = false; //EF Core InMemory DB does not support transactions.
        }

        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(EMSWebTestModule).GetAssembly());
        }
        
        public override void PostInitialize()
        {
            IocManager.Resolve<ApplicationPartManager>()
                .AddApplicationPartsIfNotAddedBefore(typeof(EMSWebMvcModule).Assembly);
        }
    }
}