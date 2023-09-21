using Abp.AutoMapper;
using Abp.Modules;
using Abp.Reflection.Extensions;
using EMS.Authorization;

namespace EMS
{
    [DependsOn(
        typeof(EMSCoreModule), 
        typeof(AbpAutoMapperModule))]
    public class EMSApplicationModule : AbpModule
    {
        public override void PreInitialize()
        {
            Configuration.Authorization.Providers.Add<EMSAuthorizationProvider>();
        }

        public override void Initialize()
        {
            var thisAssembly = typeof(EMSApplicationModule).GetAssembly();

            IocManager.RegisterAssemblyByConvention(thisAssembly);

            Configuration.Modules.AbpAutoMapper().Configurators.Add(
                // Scan the assembly for classes which inherit from AutoMapper.Profile
                cfg => cfg.AddMaps(thisAssembly)
            );
        }
    }
}
