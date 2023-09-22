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
using EMS.Authorization.Roles;
using EMS.Authorization.Schedules;
using EMS.Authorization.UserClasses;
using EMS.Classes.Dto;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EMS.Classes
{
    [AbpAuthorize(PermissionNames.Pages_Users)]
    public class ClassAppService : AsyncCrudAppService<Class, ClassDto, long, PagedClassResultRequestDto, CreateOrUpdateClassDto, CreateOrUpdateClassDto>, IClassAppService
    {
        private readonly RoleManager _roleManager;
        private readonly IRepository<Schedule, long> _scheduleRepository;
        private readonly IRepository<UserClass, long> _userClassRepository;
        private readonly IRepository<Course, long> _courseRepository;
        public ClassAppService(
            IRepository<Class, long> repository,
            RoleManager roleManager,
            IRepository<Schedule, long> scheduleRepository,
            IRepository<UserClass, long> userClassRepository,
            IRepository<Course, long> courseRepository)
            : base(repository)
        {
            _roleManager = roleManager;
            _scheduleRepository = scheduleRepository;
            _userClassRepository = userClassRepository;
            _courseRepository = courseRepository;
        }

        // Get RoleNames from AbpRoles
        protected async Task<String[]> GetRoleNames(Class classRoom)
        {
            var roles = classRoom.UserClass.User.Roles;
            List<string> roleNames = new();
            foreach (var role in roles)
            {
                var roleName = await _roleManager.FindByIdAsync(role.RoleId.ToString());
                roleNames.Add(roleName.Name);
            }
            return roleNames.ToArray();
        }
        // Create Query
        protected override IQueryable<Class> CreateFilteredQuery(PagedClassResultRequestDto input)
        {
            var query = Repository.GetAllIncluding(x => x.UserClass, x => x.UserClass.User, x => x.UserClass.User.Roles);

            if (!input.Keyword.IsNullOrWhiteSpace())
            {
                query = query.Where(x => x.UserClass.User.UserName.ToLower().Contains(input.Keyword.ToLower()) ||
                                        x.UserClass.User.Name.ToLower().Contains(input.Keyword.ToLower()) ||
                                        x.UserClass.User.EmailAddress.ToLower().Contains(input.Keyword.ToLower())
                                        && x.UserClass.User.IsActive && x.UserClass.IsActive);
            }
            else
            {
                query = query.Where(x => x.UserClass.User.IsActive && x.UserClass.IsActive);
            }
            return query;
        }
        // Sorting by User
        protected override IQueryable<Class> ApplySorting(IQueryable<Class> query, PagedClassResultRequestDto input)
        {
            return query.OrderBy(r => r.UserClass.User.Surname);
        }
        // Check UserClass exists or not
        protected async Task<(UserClass userClass, Course course)> GetEntitiesAsync(CreateOrUpdateClassDto input)
        {
            var userClass = await _userClassRepository.GetAsync(input.TeacherId);
            var course = await _courseRepository.GetAsync(input.CourseId);
            if (userClass != null && userClass.IsActive && !userClass.IsDeleted)
            {
                if ((course != null && course.IsDeleted) || course == null)
                {
                    throw new EntityNotFoundException("Not found Course");
                }
                return (userClass, course);
            }
            throw new EntityNotFoundException("Not found UserClass");
        }
        // Get All Class
        public override async Task<PagedResultDto<ClassDto>> GetAllAsync(PagedClassResultRequestDto input)
        {
            CheckGetAllPermission();
            var query = CreateFilteredQuery(input);
            var totalCount = await AsyncQueryableExecuter.CountAsync(query);
            query = ApplySorting(query, input);
            query = ApplyPaging(query, input);
            var classes = await AsyncQueryableExecuter.ToListAsync(query);
            List<ClassDto> listClassDtos = new();
            foreach (var classRoom in classes)
            {
                var classDto = ObjectMapper.Map<ClassDto>(classRoom);
                classDto.Teacher.User.RoleNames = await GetRoleNames(classRoom);
                listClassDtos.Add(classDto);
            }
            return new PagedResultDto<ClassDto>(totalCount, listClassDtos);
        }

        // Get Class
        public override async Task<ClassDto> GetAsync(EntityDto<long> input)
        {
            CheckGetPermission();
            var classRoom = await Repository.GetAllIncluding(
                                        x => x.UserClass, x => x.Course, x => x.UserClass.User, x => x.UserClass.User.Roles)
                                        .FirstOrDefaultAsync(x => x.Id == input.Id)
                                        ?? throw new EntityNotFoundException("Not found Class");
            var classDto = ObjectMapper.Map<ClassDto>(classRoom);
            classDto.Teacher.User.RoleNames = await GetRoleNames(classRoom);
            return classDto;
        }

        //Create new Class
        public override async Task<ClassDto> CreateAsync(CreateOrUpdateClassDto input)
        {
            CheckCreatePermission();
            var (userClass, course) = await GetEntitiesAsync(input);
            var classRoom = new Class
            {
                TeacherId = userClass.Id,
                CourseId = course.Id,
                StartDate = input.StartDate,
                EndDate = input.EndDate,
                LimitStudent = input.LimitStudent,
                CurrentStudent = input.CurrentStudent,
                LessionTimes = input.LessionTimes,
                CycleTimes = input.CycleTimes,
                IsActive = input.IsActive,
            };
            var createClass = await Repository.InsertAndGetIdAsync(classRoom);
            var getCreateClassId = new EntityDto<long> { Id = createClass };
            return await GetAsync(getCreateClassId);
        }

        // Update new Class
        public override async Task<ClassDto> UpdateAsync(CreateOrUpdateClassDto input)
        {
            CheckUpdatePermission();
            var (userClass, course) = await GetEntitiesAsync(input);
            var classRoom = await Repository.GetAsync(input.Id);
            classRoom.UserClass = userClass;
            classRoom.Course = course;
            classRoom.StartDate = input.StartDate;
            classRoom.EndDate = input.EndDate;
            classRoom.LimitStudent = input.LimitStudent;
            classRoom.CurrentStudent = input.CurrentStudent;
            classRoom.LessionTimes = input.LessionTimes;
            classRoom.CycleTimes = input.CycleTimes;
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
