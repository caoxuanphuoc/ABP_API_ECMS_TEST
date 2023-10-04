using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.Domain.Repositories;
using Abp.Extensions;
using Abp.Linq.Extensions;
using Abp.UI;
using EMS.Authorization;
using EMS.Authorization.Rooms;
using EMS.Authorization.Schedules;
using EMS.UserClasses.Dto;
using System.Linq;
using System.Threading.Tasks;

namespace EMS.Rooms
{
    [AbpAuthorize(PermissionNames.Pages_Users)]
    public class RoomAppService : AsyncCrudAppService<Room, RoomDto, int, PagedRoomResultRequestDto, CreateRoomDto, UpdateRoomDto>, IRoomAppService
    {
        private readonly IRepository<Schedule, long> _scheduleRepository;
        public RoomAppService(
            IRepository<Room, int> repository,
            IRepository<Schedule, long> scheduleRepository
            ) : base(repository)
        {
            _scheduleRepository = scheduleRepository;
        }

        public override async Task DeleteAsync(EntityDto<int> input)
        {
            CheckDeletePermission();
            if (await _scheduleRepository.CountAsync(x => x.RoomId == input.Id) > 0)
            {
                throw new UserFriendlyException($"Class is using Course with id = {input.Id} ");
            }
            await base.DeleteAsync(input);
        }

        protected override IQueryable<Room> CreateFilteredQuery(PagedRoomResultRequestDto input)
        {
            return Repository.GetAllIncluding()
                    .WhereIf(!input.Keyword.IsNullOrWhiteSpace(),
                            x => x.RoomName.ToLower().Contains(input.Keyword.ToLower()) ||
                            x.MaxContainer.ToString() == input.Keyword.ToLower());
        }
        protected override IQueryable<Room> ApplySorting(IQueryable<Room> query, PagedRoomResultRequestDto input)
        {
            return query.OrderBy(r => r.RoomName);
        }
    }
}
