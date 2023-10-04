using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.Domain.Entities;
using Abp.Domain.Repositories;
using Abp.Extensions;
using Abp.UI;
using EMS.Authorization;
using EMS.Authorization.Classes;
using EMS.Authorization.Courses;
using EMS.Authorization.Schedules;
using EMS.Classes.Dto;
using EMS.Schedules.Dto;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EMS.Classes
{
    [AbpAuthorize(PermissionNames.Pages_Users)]
    public class ClassAppService : AsyncCrudAppService<Class, ClassDto, long, PagedClassResultRequestDto, CreateClassDto, UpdateClassDto>, IClassAppService
    {
        private readonly IRepository<Schedule, long> _scheduleRepository;
        private readonly IRepository<Course, long> _courseRepository;
        public ClassAppService(
            IRepository<Class, long> repository,
            IRepository<Schedule, long> scheduleRepository,
            IRepository<Course, long> courseRepository
        ) : base(repository)
        {
            _scheduleRepository = scheduleRepository;
            _courseRepository = courseRepository;
        }
        // Create Query
        protected override IQueryable<Class> CreateFilteredQuery(PagedClassResultRequestDto input)
        {
            var query = Repository.GetAllIncluding(x => x.Course);

            if (!input.Keyword.IsNullOrWhiteSpace())
            {
                query = query.Where(x => x.LimitStudent.ToString() == input.Keyword ||
                                        x.Code.ToLower().Contains(input.Keyword.ToLower())
                                        && x.IsActive);
            }
            else
            {
                query = query.Where(x => x.IsActive);
            }
            return query;
        }
        // Sorting by User
        protected override IQueryable<Class> ApplySorting(IQueryable<Class> query, PagedClassResultRequestDto input)
        {
            return query.OrderBy(r => r.StartDate);
        }
        // Check Course exists or not
        protected async Task<Course> GetEntitiesAsync(long courseId)
        {
            var course = await _courseRepository.GetAsync(courseId);
            if ((course != null && course.IsDeleted) || course == null)
            {
                throw new EntityNotFoundException("Not found Course");
            }
            return course;
        }

        // Get Class
        public override async Task<ClassDto> GetAsync(EntityDto<long> input)
        {
            CheckGetPermission();
            var classRoom = await Repository.GetAllIncluding(x => x.Course)
                                        .FirstOrDefaultAsync(x => x.Id == input.Id)
                                        ?? throw new EntityNotFoundException("Not found Class");
            var classDto = ObjectMapper.Map<ClassDto>(classRoom);
            return classDto;
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
        protected async Task<PagedResultDto<ScheduleDto>> CreateAutomatic(CreateAutomaticDto input)
        {
            DateTime Temp = input.StartTime;
            List<ScheduleDto> result = new();
            while (Temp <= input.EndTime)
            {
                DayOfWeek checkDOW = Temp.DayOfWeek;
                input.ListWorkShifts.ForEach(async e =>
                {
                    if (e.DateOfWeek.ToString() == checkDOW.ToString())
                    {

                        Schedule schedule = new()
                        {
                            Date = Temp,
                            ClassId = input.ClassId,
                            RoomId = input.RoomId,
                            DayOfWeek = e.DateOfWeek,
                            Shift = e.ShiftTime
                        };
                        await _scheduleRepository.InsertAsync(schedule);
                        var scheduleDto = ObjectMapper.Map<ScheduleDto>(schedule);
                        result.Add(scheduleDto);
                    }
                });

                Temp = Temp.AddDays(1);

            }
            return new PagedResultDto<ScheduleDto>(result.Count, result); ;
        }

        //Create new Class
        public override async Task<ClassDto> CreateAsync(CreateClassDto input)
        {
            CheckCreatePermission();
            var course = await GetEntitiesAsync(input.CourseId);
            var classRoom = new Class
            {
                Code = input.Code,
                CourseId = course.Id,
                StartDate = input.StartDate,
                EndDate = input.EndDate,
                LimitStudent = input.LimitStudent,
                CurrentStudent = input.CurrentStudent,
                LessionTimes = input.LessionTimes,
                IsActive = input.IsActive,
            };
            var createClassId = await Repository.InsertAndGetIdAsync(classRoom);
            // Xử lý vừa thêm vào class vừa thêm vào schedule
            //await CurrentUnitOfWork.SaveChangesAsync();

            var createAutomaticDto = new CreateAutomaticDto
            {
                StartTime = input.StartDate,
                EndTime = input.EndDate,
                ClassId = createClassId,
                RoomId = input.RoomId,
                ListWorkShifts = input.lsWorkSheet,
            };

            await CreateAutomatic(createAutomaticDto);

            var getCreateClassId = new EntityDto<long> { Id = createClassId };
            return await GetAsync(getCreateClassId);
        }

        // Update new Class
        public override async Task<ClassDto> UpdateAsync(UpdateClassDto input)
        {
            CheckUpdatePermission();
            var course = await GetEntitiesAsync(input.CourseId);
            var classRoom = await Repository.GetAsync(input.Id);
            classRoom.Code = input.Code;
            classRoom.Course = course;
            classRoom.StartDate = input.StartDate;
            classRoom.EndDate = input.EndDate;
            classRoom.LimitStudent = input.LimitStudent;
            classRoom.CurrentStudent = input.CurrentStudent;
            classRoom.LessionTimes = input.LessionTimes;
            classRoom.IsActive = input.IsActive;
            await base.UpdateAsync(input);
            return await GetAsync(new EntityDto<long> { Id = input.Id });
        }

        // Delete Class
        public override async Task DeleteAsync(EntityDto<long> input)
        {
            CheckDeletePermission();
            var scheduleCount = await _scheduleRepository.CountAsync(x => x.ClassId == input.Id);
            if (scheduleCount > 0)
            {
                throw new UserFriendlyException($"Class is being used with id = {input.Id}");
            }
            await base.DeleteAsync(input);
        }
    }
}
