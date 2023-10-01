using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.Domain.Repositories;
using Abp.UI;
using EMS.Authorization;
using EMS.Authorization.Positions;
using EMS.Authorization.UserClasses;
using EMS.Positions.dto;
using System.Threading.Tasks;

namespace EMS.Positions
{
    [AbpAuthorize(PermissionNames.Pages_Users)]
    public class PositionAppService : AsyncCrudAppService<Position, PositionDto, long, PagedPositionResultRequestDto, CreateOrUpdatePositionDto, CreateOrUpdatePositionDto>, IPositionAppService
    {
        public readonly IRepository<UserClass, long> _userClassRepository;
        public PositionAppService(
            IRepository<Position, long> repository,
            IRepository<UserClass, long> userClassRepository
            )
            : base(repository)
        {
            _userClassRepository = userClassRepository;
        }

        public override async Task DeleteAsync(EntityDto<long> input)
        {
            CheckDeletePermission();
            if (await _userClassRepository.CountAsync(x => x.PositionId == input.Id) > 0)
            {
                throw new UserFriendlyException($"UserClass is using Position with id = {input.Id} ");
            }
            await Repository.DeleteAsync(input.Id);
        }
    }
}
