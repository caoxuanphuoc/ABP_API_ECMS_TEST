using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.Domain.Entities;
using Abp.Domain.Repositories;
using Abp.Extensions;
using Abp.UI;
using EMS.Authorization;
using EMS.Authorization.Classes;
using EMS.Authorization.Roles;
using EMS.Authorization.TrackingClasses;
using EMS.Authorization.TuitionFees;
using EMS.Authorization.UserClasses;
using EMS.Authorization.Users;
using EMS.UserClasses.Dto;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EMS.UserClasses
{
    [AbpAuthorize(PermissionNames.Pages_Users)]
    public class UserClassAppService : AsyncCrudAppService<UserClass, UserClassDto, long, PagedUserClassResultRequestDto, CreateOrUpdateUserClassDto, CreateOrUpdateUserClassDto>, IUserClassAppService
    {
        private readonly UserManager _userManager;
        private readonly RoleManager _roleManager;
        private readonly IRepository<TuitionFee, long> _tuitionFeeRepository;
        private readonly IRepository<TrackingClass, long> _trackingClassRepository;
        private readonly IRepository<Class, long> _classRepository;
        public UserClassAppService(
            IRepository<UserClass, long> repository,
            UserManager userManager,
            RoleManager roleManager,
            IRepository<TuitionFee, long> tuitionFeeRepository,
            IRepository<TrackingClass, long> trackingClassRepository,
            IRepository<Class, long> classRepository) : base(repository)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _tuitionFeeRepository = tuitionFeeRepository;
            _trackingClassRepository = trackingClassRepository;
            _classRepository = classRepository;
        }

        // Kiểm tra xem User có tồn tại hay không
        protected async Task<User> GetEntitiesAsync(CreateOrUpdateUserClassDto input)
        {
            var user = await _userManager.GetUserByIdAsync(input.UserId);
            if (user != null && user.IsActive && !user.IsDeleted)
            {
                return user;
            }
            throw new EntityNotFoundException("Not found User");
        }

        // Create new UserClass
        public override async Task<UserClassDto> CreateAsync(CreateOrUpdateUserClassDto input)
        {
            CheckCreatePermission();
            var user = await GetEntitiesAsync(input);
            var userClass = new UserClass
            {
                User = user,
                OffTimes = input.OffTimes,
                DateStart = input.DateStart,
                IsActive = input.IsActive,
            };
            var createUserClassId = await Repository.InsertAndGetIdAsync(userClass);
            var getCreateUserClassId = new EntityDto<long> { Id = createUserClassId };
            return await GetAsync(getCreateUserClassId);
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

        // Get UserClass by Id
        public override async Task<UserClassDto> GetAsync(EntityDto<long> input)
        {
            CheckGetPermission();
            var userClass = await Repository.GetAllIncluding(x => x.User, x => x.User.Roles)
                                    .FirstOrDefaultAsync(x => x.Id == input.Id)
                                    ?? throw new EntityNotFoundException("Not found UserClass");
            var userClassDto = ObjectMapper.Map<UserClassDto>(userClass);
            userClassDto.User.RoleNames = await GetRoleNames(userClass);
            return userClassDto;
        }

        // Create Query
        protected override IQueryable<UserClass> CreateFilteredQuery(PagedUserClassResultRequestDto input)
        {
            var query = Repository.GetAllIncluding(x => x.User, x => x.User.Roles);

            if (!input.Keyword.IsNullOrWhiteSpace())
            {
                query = query.Where(x => x.User.UserName.ToLower().Contains(input.Keyword.ToLower()) ||
                                        x.User.Name.ToLower().Contains(input.Keyword.ToLower()) ||
                                        x.User.EmailAddress.ToLower().Contains(input.Keyword.ToLower())
                                        && x.User.IsActive && x.IsActive);
            }
            else
            {
                query = query.Where(x => x.User.IsActive && x.IsActive);
            }
            return query;
        }

        // Sorting by User
        protected override IQueryable<UserClass> ApplySorting(IQueryable<UserClass> query, PagedUserClassResultRequestDto input)
        {
            return query.OrderBy(r => r.User.UserName);
        }

        // Get All UserClass
        public override async Task<PagedResultDto<UserClassDto>> GetAllAsync(PagedUserClassResultRequestDto input)
        {
            CheckGetAllPermission();
            var query = CreateFilteredQuery(input);
            var totalCount = await AsyncQueryableExecuter.CountAsync(query);
            query = ApplySorting(query, input);
            query = ApplyPaging(query, input);
            var userClasses = await AsyncQueryableExecuter.ToListAsync(query);
            List<UserClassDto> listUserClassDtos = new();
            foreach (var userClass in userClasses)
            {
                var userClassDto = ObjectMapper.Map<UserClassDto>(userClass);
                userClassDto.User.RoleNames = await GetRoleNames(userClass);
                listUserClassDtos.Add(userClassDto);
            }
            return new PagedResultDto<UserClassDto>(totalCount, listUserClassDtos);
        }

        // Update UserClass
        public override async Task<UserClassDto> UpdateAsync(CreateOrUpdateUserClassDto input)
        {
            CheckUpdatePermission();
            var userClass = await Repository.GetAsync(input.Id);
            var user = await GetEntitiesAsync(input);
            userClass.User = user;
            userClass.OffTimes = input.OffTimes;
            userClass.DateStart = input.DateStart;
            userClass.IsActive = input.IsActive;
            await base.UpdateAsync(input);
            return await GetAsync(new EntityDto<long> { Id = input.Id });
        }

        // Delete UserClass
        public override async Task DeleteAsync(EntityDto<long> input)
        {
            CheckDeletePermission();
            var tuitionFeeCount = await _tuitionFeeRepository.CountAsync(x => x.StudentId == input.Id);
            var trackingClassCount = await _trackingClassRepository.CountAsync(x => x.StudentId == input.Id);
            var classCount = await _classRepository.CountAsync(x => x.TeacherId == input.Id);
            if (tuitionFeeCount > 0 || trackingClassCount > 0 || classCount > 0)
            {
                throw new UserFriendlyException($"UseClass is being used with id = {input.Id}");
            }
            await base.DeleteAsync(input);
        }
    }
}
