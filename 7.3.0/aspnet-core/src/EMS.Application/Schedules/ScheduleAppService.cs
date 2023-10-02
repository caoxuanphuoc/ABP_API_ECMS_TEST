using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.Domain.Entities;
using Abp.Domain.Repositories;
using Abp.Extensions;
using EMS.Authorization;
using EMS.Authorization.Classes;
using EMS.Authorization.Roles;
using EMS.Authorization.Rooms;
using EMS.Authorization.Schedules;
using EMS.Schedules.Dto;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EMS.Schedules
{
    [AbpAuthorize(PermissionNames.Pages_Users)]
    public class ScheduleAppService : AsyncCrudAppService<Schedule, ScheduleDto, long, PagedScheduleResultRequestDto, CreateScheduleDto, UpdateScheduleDto>, IScheduleAppService
    {
        private readonly IRepository<Class, long> _classRepository;
        private readonly IRepository<Room, int> _roomRepository;
        private readonly RoleManager _roleManager;
        public ScheduleAppService(
            IRepository<Schedule, long> repository,
            IRepository<Class, long> classRepository,
            IRepository<Room, int> roomRepository,
        RoleManager roleManager)
            : base(repository)
        {
            _classRepository = classRepository;
            _roleManager = roleManager;
            _roomRepository = roomRepository;
        }

        // Sorting by User
        protected override IQueryable<Schedule> ApplySorting(IQueryable<Schedule> query, PagedScheduleResultRequestDto input)
        {
            return query.OrderBy(x => x.DayOfWeek).ThenBy(r => r.Date);
        }

        protected override IQueryable<Schedule> CreateFilteredQuery(PagedScheduleResultRequestDto input)
        {
            var query = Repository.GetAllIncluding(x => x.Class, x => x.Class.Course);
            return query;
        }

        // Check Class and WorkShift is exists or not
        protected async Task<(Class classRoom,  Room room)> GetEntitiesAsync(CreateScheduleDto input)
        {
            var classRoom = await _classRepository.GetAsync(input.ClassId);
            var room  = await _roomRepository.GetAsync(input.RoomId);
            if (classRoom != null && classRoom.IsActive && !classRoom.IsDeleted)
            {
                return (classRoom, room);
            }
            throw new EntityNotFoundException("Not found Class");
        }
        protected async Task<(Class classRoom, Room room)> GetEntitiesAsync(UpdateScheduleDto input)
        {
            var classRoom = await _classRepository.GetAsync(input.ClassId);
            var room = await _roomRepository.GetAsync(input.RoomId);
            if (classRoom != null && classRoom.IsActive && !classRoom.IsDeleted)
            {
                return (classRoom, room);
            }
            throw new EntityNotFoundException("Not found Class");
        }

        // Get Schedule
        public override async Task<ScheduleDto> GetAsync(EntityDto<long> input)
        {
            CheckGetPermission();
            var schedule = await Repository.GetAllIncluding(
                                        x => x.Class,  x => x.Class.Course)
                                        .FirstOrDefaultAsync(x => x.Id == input.Id)
                                        ?? throw new EntityNotFoundException("Not found Schedule");
            var scheduleDto = ObjectMapper.Map<ScheduleDto>(schedule);
            return scheduleDto;
        }
        // Create new Schedule
        public override async Task<ScheduleDto> CreateAsync(CreateScheduleDto input)
        {
            CheckCreatePermission();
            var (classRoom,  room) = await GetEntitiesAsync(input);
            var schedule = new Schedule
            {
                ClassId = classRoom.Id,
                RoomId = room.Id,
                Date = input.Date,
                DayOfWeek = input.DayOfWeek,
                Shift = input.Shift,
            };
            var createSchedule = await Repository.InsertAndGetIdAsync(schedule);
            var getCreateScheduleId = new EntityDto<long> { Id = createSchedule };
            return await GetAsync(getCreateScheduleId);
        }
        // Update Schedule
        public override async Task<ScheduleDto> UpdateAsync(UpdateScheduleDto input)
        {
            CheckUpdatePermission();
            var (classRoom, room) = await GetEntitiesAsync(input);
            var schedule = await Repository.GetAsync(input.Id);
            schedule.Class = classRoom;
            schedule.Date = input.Date;
            schedule.RoomId = room.Id;
            schedule.DayOfWeek = input.DayOfWeek;
            schedule.Shift = input.Shift;
            await base.UpdateAsync(input);
            return await GetAsync(new EntityDto<long> { Id = input.Id });
        }

        protected IQueryable<Schedule> CreateFilteredQueryWithClassId(PagedScheduleResultRequestDto input, long classId)
        {
            var query = Repository.GetAllIncluding(x => x.Class, x => x.Class.Course);
            if (!input.Keyword.IsNullOrWhiteSpace())
            {
                query = query.Where(x => x.ClassId == classId);
            }
            return query;
        }

        public async Task<PagedResultDto<ScheduleDto>> GetAllWithClassIdFilter(PagedScheduleResultRequestDto input, long classId)
        {
            CheckGetAllPermission();
            var query = CreateFilteredQueryWithClassId(input, classId);
            var totalCount = await AsyncQueryableExecuter.CountAsync(query);
            query = ApplySorting(query, input);
            query = ApplyPaging(query, input);
            var schedules = await AsyncQueryableExecuter.ToListAsync(query);
            List<ScheduleDto> listScheduleDtos = new();
            foreach (var schedule in schedules)
            {
                var scheduleDto = ObjectMapper.Map<ScheduleDto>(schedule);
                listScheduleDtos.Add(scheduleDto);
            }
            return new PagedResultDto<ScheduleDto>(totalCount, listScheduleDtos);
        }
    }
}
