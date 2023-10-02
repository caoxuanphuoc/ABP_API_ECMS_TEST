using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.Domain.Entities;
using Abp.Domain.Repositories;
using Abp.Extensions;
using EMS.Authorization;
using EMS.Authorization.Roles;
using EMS.Authorization.TrackingClasses;
using EMS.Authorization.UserClasses;
using EMS.TrackingClasses.Dto;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EMS.TrackingClasses
{
    [AbpAuthorize(PermissionNames.Pages_Users)]
    public class TrackingClassAppService : AsyncCrudAppService<TrackingClass, TrackingClassDto, long, PagedTrackingClassResultRequestDto, CreateTrackingClassDto, UpdateTrackingClassDto>, ITrackingClassAppService
    {
        private readonly IRepository<UserClass, long> _userClassRepository;
        private readonly RoleManager _roleManager;
        public TrackingClassAppService(
            IRepository<TrackingClass, long> repository,
            IRepository<UserClass, long> userClassRepository,
            RoleManager roleManager)
            : base(repository)
        {
            _roleManager = roleManager;
            _userClassRepository = userClassRepository;
        }

        // Get RoleNames from AbpRoles
        protected async Task<String[]> GetRoleNames(TrackingClass trackingClass)
        {
            var roles = trackingClass.UserClass.User.Roles;
            List<string> roleNames = new();
            foreach (var role in roles)
            {
                var roleName = await _roleManager.FindByIdAsync(role.RoleId.ToString());
                roleNames.Add(roleName.Name);
            }
            return roleNames.ToArray();
        }

        // Create Query
        protected override IQueryable<TrackingClass> CreateFilteredQuery(PagedTrackingClassResultRequestDto input)
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
        protected override IQueryable<TrackingClass> ApplySorting(IQueryable<TrackingClass> query, PagedTrackingClassResultRequestDto input)
        {
            return query.OrderBy(r => r.UserClass.User.Surname);
        }

        // Check UserClass exists or not
        protected async Task<UserClass> GetEntitiesAsync(long studentId)
        {
            var userClass = await _userClassRepository.GetAsync(studentId);
            if (userClass != null && userClass.IsActive && !userClass.IsDeleted)
            {
                return userClass;
            }
            throw new EntityNotFoundException("Not found UserClass");
        }

        // Get All TrackingClass
        public override async Task<PagedResultDto<TrackingClassDto>> GetAllAsync(PagedTrackingClassResultRequestDto input)
        {
            CheckGetAllPermission();
            var query = CreateFilteredQuery(input);
            var totalCount = await AsyncQueryableExecuter.CountAsync(query);
            query = ApplySorting(query, input);
            query = ApplyPaging(query, input);
            var trackingClasses = await AsyncQueryableExecuter.ToListAsync(query);
            List<TrackingClassDto> listTrackingClassDtos = new();
            foreach (var trackingClass in trackingClasses)
            {
                var trackingClassDto = ObjectMapper.Map<TrackingClassDto>(trackingClass);
                trackingClassDto.Student.User.RoleNames = await GetRoleNames(trackingClass);
                listTrackingClassDtos.Add(trackingClassDto);
            }
            return new PagedResultDto<TrackingClassDto>(totalCount, listTrackingClassDtos);
        }

        // Get TrackingClass
        public override async Task<TrackingClassDto> GetAsync(EntityDto<long> input)
        {
            CheckGetPermission();
            var trackingClass = await Repository.GetAllIncluding(x => x.UserClass, x => x.UserClass.User, x => x.UserClass.User.Roles)
                                             .FirstOrDefaultAsync(x => x.Id == input.Id)
                                             ?? throw new EntityNotFoundException("Not found TrackingClass");
            var trackingClassDto = ObjectMapper.Map<TrackingClassDto>(trackingClass);
            trackingClassDto.Student.User.RoleNames = await GetRoleNames(trackingClass);
            return trackingClassDto;
        }

        // Create new TrackingClass
        public override async Task<TrackingClassDto> CreateAsync(CreateTrackingClassDto input)
        {
            CheckCreatePermission();
            var userClass = await GetEntitiesAsync(input.StudentId);
            var trackingClass = new TrackingClass
            {
                StudentId = userClass.Id,
                Date = input.Date,
                CheckInTime = input.CheckInTime,
            };
            var createTrackingClass = await Repository.InsertAndGetIdAsync(trackingClass);
            var getCreateTrackingClassId = new EntityDto<long> { Id = createTrackingClass };
            return await GetAsync(getCreateTrackingClassId);
        }

        // Update TrackingClass
        public override async Task<TrackingClassDto> UpdateAsync(UpdateTrackingClassDto input)
        {
            CheckUpdatePermission();
            var userClass = await GetEntitiesAsync(input.StudentId);
            var trackingClass = await Repository.GetAsync(input.Id);
            trackingClass.UserClass = userClass;
            trackingClass.Date = input.Date;
            trackingClass.CheckInTime = input.CheckInTime;
            await base.UpdateAsync(input);
            return await GetAsync(new EntityDto<long> { Id = input.Id });
        }
    }
}
