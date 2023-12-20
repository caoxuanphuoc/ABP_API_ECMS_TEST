using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.Domain.Entities;
using Abp.Domain.Repositories;
using Abp.Extensions;
using Abp.UI;
using EMS.Authorization;
using EMS.Authorization.Classes;
using EMS.Authorization.Rooms;
using EMS.Authorization.Schedules;
using EMS.ClassTimelines.Dto;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace EMS.ClassTimelines
{
    [AbpAuthorize(PermissionNames.Pages_Users)]
    public class ClassTimelineAppService : AsyncCrudAppService<ClassTimeline, ClassTimelineDto, long, PagedClassTimelineResultRequestDto, CreateClassTimelineDto, UpdateClassTimelineDto>, IClassTimelineAppService
    {
        private readonly IRepository<Room, int> _roomRepository;
        private readonly IRepository<Schedule, long> _scheduleRepository;
        private readonly IRepository<Class, long> _classRepository;
        public ClassTimelineAppService(
            IRepository<ClassTimeline, long> repository,
            IRepository<Room, int> roomRepository,
            IRepository<Schedule, long> scheduleRepository,
            IRepository<Class, long> classRepository)
            : base(repository)
        {
            _roomRepository = roomRepository;
            _scheduleRepository = scheduleRepository;
            _classRepository = classRepository;
        }

        // Create Query
        protected override IQueryable<ClassTimeline> CreateFilteredQuery(PagedClassTimelineResultRequestDto input)
        {
            var query = Repository.GetAllIncluding(x => x.Class, x => x.Class.Course,
                                                    x => x.Schedule, x => x.Schedule.Room);
            if (!input.Keyword.IsNullOrWhiteSpace())
            {
                query = query.Where(x => x.Class.Code.ToLower().Contains(input.Keyword.ToLower()) ||
                                        x.Schedule.Room.RoomName.ToLower().Contains(input.Keyword.ToLower()));
            }
            if (input.ClassId != 0)
            {
                query = query.Where(x => (input.Keyword.IsNullOrWhiteSpace() ||
                                          (x.Class.Code.ToLower().Contains(input.Keyword.ToLower()) ||
                                           x.Schedule.Room.RoomName.ToLower().Contains(input.Keyword.ToLower()))) &&
                                           x.ClassId == input.ClassId);
            }
            if (input.CourseId != 0)
            {
                query = query.Where(x => x.Class.CourseId == input.CourseId);
            }

            return query;
        }

        protected override IQueryable<ClassTimeline> ApplySorting(IQueryable<ClassTimeline> query, PagedClassTimelineResultRequestDto input)
        {
            return query.OrderBy(r => r.StartDate);
        }

        public override async Task<ClassTimelineDto> GetAsync(EntityDto<long> input)
        {
            CheckGetPermission();
            var classTimeline = await Repository.GetAllIncluding(x => x.Class, x => x.Schedule)
                                        .FirstOrDefaultAsync(x => x.Id == input.Id)
                                        ?? throw new EntityNotFoundException("Not found ClassTimeline");
            var classTimelineDto = ObjectMapper.Map<ClassTimelineDto>(classTimeline);
            return classTimelineDto;
        }

        public async Task<string> HashSchedule(long id)
        {
            var schedule = await Repository.GetAsync(id);
            var concatenatedIds = $"{schedule.Id}-{schedule.ClassId}";

            string hashedString;
            using var sha256 = SHA256.Create();
            byte[] hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(concatenatedIds));
            hashedString = BitConverter.ToString(hashedBytes).Replace("-", "").ToLower();
            return hashedString;
        }

        protected async Task CheckClassIsExists(long classId)
        {
            var classroom = await _classRepository.CountAsync(x => x.Id == classId);
            if (classroom == 0)
            {
                throw new UserFriendlyException("Not found Class");
            }
        }
        protected async Task CheckRoomIsExists(int roomId)
        {
            var room = await _roomRepository.CountAsync(x => x.Id == roomId);
            if (room == 0)
            {
                throw new UserFriendlyException("Not found Room");
            }
        }

        // Create automatic schedule
        // Thuật toán
        /// <summary>
        /// Với mỗi lịch học (workShift)
        ///  Thì mỗi ngày nằm trong khoảng từ startDate đên EndDate 
        ///      + Kiểm tra xem ngày đó là ngày thứ mấy.
        ///          + Nếu ngày đó trong với lịch học (workShift) đã nhập ở class)
        ///          + thì tạo một bản ghi lưu vào schedule table và ClassTimeline table
        ///          Tiếp tục cho đến khi đến ngày kết thúc.
        /// </summary>
        /// <param name="classId"></param>
        /// <param name="roomId"></param>
        /// <param name="LsWorkShift"></param>
        /// <returns></returns>
        protected async Task<PagedResultDto<ClassTimelineDto>> CreateAutomatic(CreateAutomaticDto input)
        {
            var listClassTimeline = new List<ClassTimelineDto>();
            foreach (var workShift in input.ListWorkShifts)
            {
                DateTime temp = workShift.StartDate;

                while (temp <= workShift.EndDate)
                {
                    if (temp.DayOfWeek.ToString() == workShift.DateOfWeek.ToString())
                    {
                        var schedule = new Schedule
                        {
                            RoomId = input.RoomId,
                            DayOfWeek = workShift.DateOfWeek,
                            Shift = workShift.ShiftTime,
                            Date = temp
                        };

                        var createScheduleId = await _scheduleRepository.InsertAndGetIdAsync(schedule);

                        var classTimelineDto = new CreateClassTimelineDto
                        {
                            ListWorkShifts = input.ListWorkShifts,
                            ClassId = input.ClassId,
                            ScheduleId = createScheduleId,
                            StartDate = workShift.StartDate,
                            EndDate = workShift.EndDate,
                        };

                        var classTimeline = ObjectMapper.Map<ClassTimeline>(classTimelineDto);
                        var classTimelineId = await Repository.InsertAndGetIdAsync(classTimeline);
                        var getClassTimelineId = new EntityDto<long> { Id = classTimelineId };
                        listClassTimeline.Add(await GetAsync(getClassTimelineId));
                    }
                    temp = temp.AddDays(1);
                }
            }

            return new PagedResultDto<ClassTimelineDto>(listClassTimeline.Count, listClassTimeline);
        }

        public async Task<PagedResultDto<ClassTimelineDto>> CreateClassTimeline(CreateClassTimelineDto input)
        {
            CheckCreatePermission();
            await CheckClassIsExists(input.ClassId);
            await CheckRoomIsExists(input.RoomId);
            var createAutomaticDto = new CreateAutomaticDto
            {
                ClassId = input.ClassId,
                RoomId = input.RoomId,
                ListWorkShifts = input.ListWorkShifts
            };
            return await CreateAutomatic(createAutomaticDto);
        }
    }
}
