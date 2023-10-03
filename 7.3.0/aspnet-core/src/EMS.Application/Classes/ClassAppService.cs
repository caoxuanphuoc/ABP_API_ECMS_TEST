﻿using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.Domain.Entities;
using Abp.Domain.Repositories;
using Abp.Domain.Uow;
using Abp.Extensions;
using Abp.UI;
using EMS.Authorization;
using EMS.Authorization.Classes;
using EMS.Authorization.Courses;
using EMS.Authorization.Schedules;
using EMS.Classes.Dto;
using EMS.Schedules;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

namespace EMS.Classes
{
    [AbpAuthorize(PermissionNames.Pages_Users)]
    public class ClassAppService : AsyncCrudAppService<Class, ClassDto, long, PagedClassResultRequestDto, CreateClassDto, UpdateClassDto>, IClassAppService
    {
        private readonly IRepository<Schedule, long> _scheduleRepository;
        private readonly IScheduleAppService _scheduleService;
        private readonly IRepository<Course, long> _courseRepository;
        public ClassAppService(
            IRepository<Class, long> repository,
            IRepository<Schedule, long> scheduleRepository,
            IRepository<Course, long> courseRepository,
            IScheduleAppService scheduleService
        ) : base(repository)
        {
            _scheduleRepository = scheduleRepository;
            _scheduleService = scheduleService;
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
            await CurrentUnitOfWork.SaveChangesAsync();
            var resScheduleList = _scheduleService.CreateAutomatic(input.StartDate, input.EndDate, createClassId, input.RoomId, input.lsWorkSheet);
           
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
