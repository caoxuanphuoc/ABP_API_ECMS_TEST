using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.Domain.Entities;
using Abp.Domain.Repositories;
using Abp.Extensions;
using EMS.Authorization;
using EMS.Authorization.Rooms;
using EMS.Authorization.Schedules;
using EMS.Schedules.Dto;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

namespace EMS.Schedules
{
    [AbpAuthorize(PermissionNames.Pages_Users)]
    public class ScheduleAppService : AsyncCrudAppService<Schedule, ScheduleDto, long, PagedScheduleResultRequestDto, CreateScheduleDto, UpdateScheduleDto>, IScheduleAppService
    {
        private readonly IRepository<Room, int> _roomRepository;
        public ScheduleAppService(
            IRepository<Schedule, long> repository,
            IRepository<Room, int> roomRepository)
            : base(repository)
        {
            _roomRepository = roomRepository;
        }

        // Sorting by User
        protected override IQueryable<Schedule> ApplySorting(IQueryable<Schedule> query, PagedScheduleResultRequestDto input)
        {
            return query.OrderBy(r => r.Date).ThenBy(r => r.Shift);
        }

        protected override IQueryable<Schedule> CreateFilteredQuery(PagedScheduleResultRequestDto input)
        {
            var query = Repository.GetAllIncluding(x => x.Room);
            if (!input.Keyword.IsNullOrWhiteSpace())
            {
                query = query.Where(x => x.Room.RoomName.ToLower().Contains(input.Keyword.ToLower()));
            }
            return query;
        }

        // Check Class and Room is exists or not
        protected async Task<Room> CheckRoomIsExists(int roomId)
        {
            var room = await _roomRepository.GetAsync(roomId);
            if (room != null && !room.IsDeleted)
            {
                return room;
            }
            throw new EntityNotFoundException("Not found Class");
        }

        // Get Schedule
        public override async Task<ScheduleDto> GetAsync(EntityDto<long> input)
        {
            CheckGetPermission();
            var schedule = await Repository.GetAllIncluding(x => x.Room)
                                        .FirstOrDefaultAsync(x => x.Id == input.Id)
                                        ?? throw new EntityNotFoundException("Not found Schedule");
            var scheduleDto = ObjectMapper.Map<ScheduleDto>(schedule);
            return scheduleDto;
        }

        // Create new Schedule
        public override async Task<ScheduleDto> CreateAsync(CreateScheduleDto input)
        {
            CheckCreatePermission();
            await CheckRoomIsExists(input.RoomId);
            var schedule = ObjectMapper.Map<Schedule>(input);
            var createSchedule = await Repository.InsertAndGetIdAsync(schedule);
            var getCreateScheduleId = new EntityDto<long> { Id = createSchedule };
            return await GetAsync(getCreateScheduleId);
        }
        // Update Schedule
        public override async Task<ScheduleDto> UpdateAsync(UpdateScheduleDto input)
        {
            CheckUpdatePermission();
            await CheckRoomIsExists(input.RoomId);
            var schedule = await Repository.GetAsync(input.Id);
            ObjectMapper.Map(schedule, input);
            await base.UpdateAsync(input);
            return await GetAsync(new EntityDto<long> { Id = input.Id });
        }

        //public async Task<string> HashSchedule(long id)
        //{
        //    var schedule = await Repository.GetAsync(id);
        //    var concatenatedIds = $"{schedule.Id}-{schedule.ClassId}";

        //    string hashedString;
        //    using var sha256 = SHA256.Create();
        //    byte[] hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(concatenatedIds));
        //    hashedString = BitConverter.ToString(hashedBytes).Replace("-", "").ToLower();
        //    return hashedString;
        //}
    }
}
