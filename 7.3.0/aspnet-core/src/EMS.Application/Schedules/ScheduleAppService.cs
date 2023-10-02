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
using EMS.Authorization.WorkShifts;
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
        private readonly IRepository<WorkShift, long> _workShiftRepository;
        private readonly IRepository<Room, int> _roomRepository;
        private readonly RoleManager _roleManager;
        public ScheduleAppService(
            IRepository<Schedule, long> repository,
            IRepository<Class, long> classRepository,
            IRepository<WorkShift, long> workShiftRepository,
            IRepository<Room, int> roomRepository,
        RoleManager roleManager)
            : base(repository)
        {
            _classRepository = classRepository;
            _workShiftRepository = workShiftRepository;
            _roleManager = roleManager;
            _roomRepository = roomRepository;
        }

        // Sorting by User
        protected override IQueryable<Schedule> ApplySorting(IQueryable<Schedule> query, PagedScheduleResultRequestDto input)
        {
            return query.OrderBy(x => x.WorkShift.Code).ThenBy(r => r.Date);
        }

        protected override IQueryable<Schedule> CreateFilteredQuery(PagedScheduleResultRequestDto input)
        {
            var query = Repository.GetAllIncluding(x => x.Class, x => x.WorkShift, x => x.Class.Course);
            return query;
        }

        // Check Class and WorkShift is exists or not
        protected async Task<(Class classRoom, WorkShift workShift, Room room)> GetEntitiesAsync(CreateScheduleDto input)
        {
            var classRoom = await _classRepository.GetAsync(input.ClassId);
            var workShift = await _workShiftRepository.GetAsync(input.WorkShiftId);
            var room  = await _roomRepository.GetAsync(input.RoomId);
            if (classRoom != null && classRoom.IsActive && !classRoom.IsDeleted)
            {
                if (workShift == null || (workShift != null && workShift.IsDeleted))
                {
                    throw new EntityNotFoundException("Not Found WorkShift");
                }
                return (classRoom, workShift, room);
            }
            throw new EntityNotFoundException("Not found Class");
        }
        protected async Task<(Class classRoom, WorkShift workShift, Room room)> GetEntitiesAsync(UpdateScheduleDto input)
        {
            var classRoom = await _classRepository.GetAsync(input.ClassId);
            var workShift = await _workShiftRepository.GetAsync(input.WorkShiftId);
            var room = await _roomRepository.GetAsync(input.RoomId);
            if (classRoom != null && classRoom.IsActive && !classRoom.IsDeleted)
            {
                if (workShift == null || (workShift != null && workShift.IsDeleted))
                {
                    throw new EntityNotFoundException("Not Found WorkShift");
                }
                return (classRoom, workShift, room);
            }
            throw new EntityNotFoundException("Not found Class");
        }

        // Get Schedule
        public override async Task<ScheduleDto> GetAsync(EntityDto<long> input)
        {
            CheckGetPermission();
            var schedule = await Repository.GetAllIncluding(
                                        x => x.Class, x => x.WorkShift, x => x.Class.Course)
                                        .FirstOrDefaultAsync(x => x.Id == input.Id)
                                        ?? throw new EntityNotFoundException("Not found Schedule");
            var scheduleDto = ObjectMapper.Map<ScheduleDto>(schedule);
            return scheduleDto;
        }
        // Create new Schedule
        public override async Task<ScheduleDto> CreateAsync(CreateScheduleDto input)
        {
            CheckCreatePermission();
            var (classRoom, workShift, room) = await GetEntitiesAsync(input);
            var schedule = new Schedule
            {
                ClassId = classRoom.Id,
                WorkShiftId = workShift.Id,
                RoomId = room.Id,
                Date = input.Date,
            };
            var createSchedule = await Repository.InsertAndGetIdAsync(schedule);
            var getCreateScheduleId = new EntityDto<long> { Id = createSchedule };
            return await GetAsync(getCreateScheduleId);
        }
        // Update Schedule
        public override async Task<ScheduleDto> UpdateAsync(UpdateScheduleDto input)
        {
            CheckUpdatePermission();
            var (classRoom, workShift, room) = await GetEntitiesAsync(input);
            var schedule = await Repository.GetAsync(input.Id);
            schedule.Class = classRoom;
            schedule.WorkShift = workShift;
            schedule.Date = input.Date;
            schedule.RoomId = room.Id;
            await base.UpdateAsync(input);
            return await GetAsync(new EntityDto<long> { Id = input.Id });
        }

        protected IQueryable<Schedule> CreateFilteredQueryWithClassId(PagedScheduleResultRequestDto input, long classId)
        {
            var query = Repository.GetAllIncluding(x => x.Class, x => x.WorkShift, x => x.Class.Course);
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
