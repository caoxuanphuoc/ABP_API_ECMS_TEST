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
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
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
            return query.OrderBy(x => x.ClassId).ThenBy(r => r.Date);
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
            var room  =  _roomRepository.Get(input.RoomId);
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
        // Create automatic schedule
       // Thuật toán
       /// <summary>
       ///  Với mỗi ngày nằm trong khoảng từ startTime đên EndTime 
       ///      + Kiểm tra xem ngày đó là ngày thứ mấy.
       ///          + Nếu ngày đó trong với lịch học (workShift) đã nhập ở class)
       ///          + thì tạo một bản ghi lưu vào schedule table
       ///          Tiếp tục cho đến khi đến ngày kết thúc.
       /// </summary>
       /// <param name="startTime"></param>
       /// <param name="endTime"></param>
       /// <param name="classId"></param>
       /// <param name="roomId"></param>
       /// <param name="LsWorkShift"></param>
       /// <returns></returns>
        public async Task<PagedResultDto<ScheduleDto>> CreateAutomatic(DateTime startTime, DateTime endTime,long classId, int roomId, List<WorkShiftDto> LsWorkShift)
        {
            DateTime Temp = startTime;
            List<ScheduleDto> result = new List<ScheduleDto>();
            while(Temp <= endTime)
            {
                DayOfWeek checkDOW = Temp.DayOfWeek;
                LsWorkShift.ForEach(async e =>
                {
                    if(e.DateOfWeek.ToString() == checkDOW.ToString())
                    {

                        Schedule createScheduleDto = new Schedule
                        {
                            Date = Temp,
                            ClassId = classId,
                            RoomId = roomId,
                            DayOfWeek  = e.DateOfWeek,
                            Shift = e.ShiftTime
                        };
                        var resId = await Repository.InsertAndGetIdAsync(createScheduleDto);
                        var getCreateScheduleId = new EntityDto<long> { Id = resId };
                        var a = await GetAsync(getCreateScheduleId);
                        result.Add(a);
                    }
                });
                
                Temp = Temp.AddDays(1);

            }
            return new PagedResultDto<ScheduleDto>(result.Count(), result); ;
        }

        // Create new Schedule
        public override async Task<ScheduleDto> CreateAsync(CreateScheduleDto input)
        {
            CheckCreatePermission();
            var (classRoom,  room) = await GetEntitiesAsync(input);
            var schedule = new Schedule
            {
                Date = input.Date,
                ClassId = classRoom.Id,
                RoomId = room.Id,
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
