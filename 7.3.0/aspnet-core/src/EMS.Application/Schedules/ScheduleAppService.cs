using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.Domain.Entities;
using Abp.Domain.Repositories;
using Abp.Extensions;
using EMS.Authorization;
using EMS.Authorization.Classes;
using EMS.Authorization.Roles;
using EMS.Authorization.Schedules;
using EMS.Authorization.UserClasses;
using EMS.Authorization.WorkShifts;
using EMS.Schedules.Dto;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EMS.Schedules
{
    [AbpAuthorize(PermissionNames.Pages_Users)]
    public class ScheduleAppService : AsyncCrudAppService<Schedule, ScheduleDto, long, PagedScheduleResultRequestDto, CreateOrUpdateScheduleDto, CreateOrUpdateScheduleDto>, IScheduleAppService
    {
        private readonly IRepository<Class, long> _classRepository;
        private readonly IRepository<WorkShift, long> _workShiftRepository;
        private readonly RoleManager _roleManager;
        public ScheduleAppService(
            IRepository<Schedule, long> repository,
            IRepository<Class, long> classRepository,
            IRepository<WorkShift, long> workShiftRepository,
            RoleManager roleManager)
            : base(repository)
        {
            _classRepository = classRepository;
            _workShiftRepository = workShiftRepository;
            _roleManager = roleManager;
        }

        // Get RoleNames from AbpRoles
        protected async Task<String[]> GetRoleNames(UserClass userClass)
        {
            var roles = userClass.User.Roles;
            List<string> roleNames = new();
            foreach (var role in roles)
            {
                var roleName = await _roleManager.FindByIdAsync(role.RoleId.ToString());
                roleNames.Add(roleName.Name);
            }
            return roleNames.ToArray();
        }
        // Create Query
        protected override IQueryable<Schedule> CreateFilteredQuery(PagedScheduleResultRequestDto input)
        {
            var query = Repository.GetAllIncluding(
                x => x.Class, x => x.WorkShift, x => x.Class.UserClass,
                x => x.Class.UserClass.User, x => x.Class.UserClass.User.Roles);

            if (!input.Keyword.IsNullOrWhiteSpace())
            {
                query = query.Where(x => x.Class.UserClass.User.UserName.ToLower().Contains(input.Keyword.ToLower()) ||
                                        x.Class.UserClass.User.Name.ToLower().Contains(input.Keyword.ToLower()) ||
                                        x.Class.UserClass.User.EmailAddress.ToLower().Contains(input.Keyword.ToLower()) ||
                                        x.WorkShift.Code.ToLower().Contains(input.Keyword.ToLower())
                                        && x.Class.UserClass.User.IsActive && x.Class.UserClass.IsActive);
            }
            else
            {
                query = query.Where(x => x.Class.UserClass.User.IsActive && x.Class.UserClass.IsActive);
            }
            return query;
        }

        // Sorting by User
        protected override IQueryable<Schedule> ApplySorting(IQueryable<Schedule> query, PagedScheduleResultRequestDto input)
        {
            return query.OrderBy(x => x.WorkShift.Code).ThenBy(r => r.Class.UserClass.User.UserName);
        }

        // Check Class and WorkShift is exists or not
        protected async Task<(Class classRoom, WorkShift workShift)> GetEntitiesAsync(CreateOrUpdateScheduleDto input)
        {
            var classRoom = await _classRepository.GetAsync(input.ClassId);
            var workShift = await _workShiftRepository.GetAsync(input.WorkShiftId);
            if (classRoom != null && classRoom.IsActive && !classRoom.IsDeleted)
            {
                if (workShift == null || (workShift != null && workShift.IsDeleted))
                {
                    throw new EntityNotFoundException("Not Found WorkShift");
                }
                return (classRoom, workShift);
            }
            throw new EntityNotFoundException("Not found Class");
        }

        // Get All Schedule
        public override async Task<PagedResultDto<ScheduleDto>> GetAllAsync(PagedScheduleResultRequestDto input)
        {
            CheckGetAllPermission();
            var query = CreateFilteredQuery(input);
            var totalCount = await AsyncQueryableExecuter.CountAsync(query);
            query = ApplySorting(query, input);
            query = ApplyPaging(query, input);
            var schedules = await AsyncQueryableExecuter.ToListAsync(query);
            List<ScheduleDto> listScheduleDtos = new();
            foreach (var schedule in schedules)
            {
                var scheduleDto = ObjectMapper.Map<ScheduleDto>(schedule);
                scheduleDto.Class.Teacher.User.RoleNames = await GetRoleNames(schedule.Class.UserClass);
                listScheduleDtos.Add(scheduleDto);
            }
            return new PagedResultDto<ScheduleDto>(totalCount, listScheduleDtos);
        }

        // Get Schedule
        public override async Task<ScheduleDto> GetAsync(EntityDto<long> input)
        {
            CheckGetPermission();
            var schedule = await Repository.GetAllIncluding(
                                        x => x.Class, x => x.WorkShift, x => x.Class.UserClass,
                                        x => x.Class.UserClass.User, x => x.Class.UserClass.User.Roles)
                                        .FirstOrDefaultAsync(x => x.Id == input.Id)
                                        ?? throw new EntityNotFoundException("Not found Schedule");
            var scheduleDto = ObjectMapper.Map<ScheduleDto>(schedule);
            scheduleDto.Class.Teacher.User.RoleNames = await GetRoleNames(schedule.Class.UserClass);
            return scheduleDto;
        }
        // Create new Schedule
        public override async Task<ScheduleDto> CreateAsync(CreateOrUpdateScheduleDto input)
        {
            CheckCreatePermission();
            var (classRoom, workShift) = await GetEntitiesAsync(input);
            var schedule = new Schedule
            {
                ClassId = classRoom.Id,
                WorkShiftId = workShift.Id,
                Date = input.Date,
            };
            var createSchedule = await Repository.InsertAndGetIdAsync(schedule);
            var getCreateScheduleId = new EntityDto<long> { Id = createSchedule };
            return await GetAsync(getCreateScheduleId);
        }
        // Update Schedule
        public override async Task<ScheduleDto> UpdateAsync(CreateOrUpdateScheduleDto input)
        {
            CheckUpdatePermission();
            var (classRoom, workShift) = await GetEntitiesAsync(input);
            var schedule = await Repository.GetAsync(input.Id);
            schedule.Class = classRoom;
            schedule.WorkShift = workShift;
            schedule.Date = input.Date;
            await base.UpdateAsync(input);
            return await GetAsync(new EntityDto<long> { Id = input.Id });
        }
    }
}
