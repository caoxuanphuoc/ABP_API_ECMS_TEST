using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.Domain.Entities;
using Abp.Domain.Repositories;
using Abp.Extensions;
using EMS.Authorization;
using EMS.Authorization.Roles;
using EMS.Authorization.TuitionFees;
using EMS.Authorization.UserClasses;
using EMS.TuitionFees.Dto;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EMS.TuitionFees
{
    [AbpAuthorize(PermissionNames.Pages_Users)]
    public class TuitionFeeAppService : AsyncCrudAppService<TuitionFee, TuitionFeeDto, long, PagedTuitionFeeResultRequestDto, CreateOrUpdateTuitionFeeDto, CreateOrUpdateTuitionFeeDto>, ITuitionFeeAppService
    {
        private readonly RoleManager _roleManager;
        private readonly IRepository<UserClass, long> _userClassRepository;
        public TuitionFeeAppService(
            IRepository<TuitionFee, long> repository,
            RoleManager roleManager,
            IRepository<UserClass, long> userClassRepository)
            : base(repository)
        {
            _roleManager = roleManager;
            _userClassRepository = userClassRepository;
        }

        // Get RoleNames from AbpRoles
        protected async Task<String[]> GetRoleNames(TuitionFee tuitionFee)
        {
            var roles = tuitionFee.UserClass.User.Roles;
            List<string> roleNames = new();
            foreach (var role in roles)
            {
                var roleName = await _roleManager.FindByIdAsync(role.RoleId.ToString());
                roleNames.Add(roleName.Name);
            }
            return roleNames.ToArray();
        }

        // Create Query
        protected override IQueryable<TuitionFee> CreateFilteredQuery(PagedTuitionFeeResultRequestDto input)
        {
            var query = Repository.GetAllIncluding(x => x.UserClass, x => x.UserClass.User, x => x.UserClass.User.Roles);

            if (!input.Keyword.IsNullOrWhiteSpace())
            {
                query = query.Where(x => x.UserClass.User.UserName.ToLower().Contains(input.Keyword.ToLower()) ||
                                        x.UserClass.User.Name.ToLower().Contains(input.Keyword.ToLower()) ||
                                        x.UserClass.User.EmailAddress.ToLower().Contains(input.Keyword.ToLower()) ||
                                        x.Fee.ToString() == input.Keyword
                                        && x.UserClass.User.IsActive && x.UserClass.IsActive);
            }
            else
            {
                query = query.Where(x => x.UserClass.User.IsActive && x.UserClass.IsActive);
            }
            return query;
        }

        // Sorting by User
        protected override IQueryable<TuitionFee> ApplySorting(IQueryable<TuitionFee> query, PagedTuitionFeeResultRequestDto input)
        {
            return query.OrderBy(r => r.Fee).ThenBy(r => r.UserClass.User.Surname);
        }

        // Check UserClass exists or not
        protected async Task<UserClass> GetEntitiesAsync(CreateOrUpdateTuitionFeeDto input)
        {
            var userClass = await _userClassRepository.GetAsync(input.StudentId);
            if (userClass != null && userClass.IsActive && !userClass.IsDeleted)
            {
                return userClass;
            }
            throw new EntityNotFoundException("Not found UserClass");
        }

        // Get All TuitionFee
        public override async Task<PagedResultDto<TuitionFeeDto>> GetAllAsync(PagedTuitionFeeResultRequestDto input)
        {
            CheckGetAllPermission();
            var query = CreateFilteredQuery(input);
            var totalCount = await AsyncQueryableExecuter.CountAsync(query);
            query = ApplySorting(query, input);
            query = ApplyPaging(query, input);
            var tuitionFees = await AsyncQueryableExecuter.ToListAsync(query);
            List<TuitionFeeDto> listTuitionFeeDtos = new();
            foreach (var TuitionFee in tuitionFees)
            {
                var tuitionFeeDto = ObjectMapper.Map<TuitionFeeDto>(TuitionFee);
                tuitionFeeDto.Student.User.RoleNames = await GetRoleNames(TuitionFee);
                listTuitionFeeDtos.Add(tuitionFeeDto);
            }
            return new PagedResultDto<TuitionFeeDto>(totalCount, listTuitionFeeDtos);
        }

        // Get TuitionFee
        public override async Task<TuitionFeeDto> GetAsync(EntityDto<long> input)
        {
            CheckGetPermission();
            var tuitionFee = await Repository.GetAllIncluding(x => x.UserClass, x => x.UserClass.User, x => x.UserClass.User.Roles)
                                             .FirstOrDefaultAsync(x => x.Id == input.Id)
                                             ?? throw new EntityNotFoundException("Not found UserClass");
            var tuitionFeeDto = ObjectMapper.Map<TuitionFeeDto>(tuitionFee);
            tuitionFeeDto.Student.User.RoleNames = await GetRoleNames(tuitionFee);
            return tuitionFeeDto;
        }

        // Create new TuitionFee
        public override async Task<TuitionFeeDto> CreateAsync(CreateOrUpdateTuitionFeeDto input)
        {
            CheckCreatePermission();
            var userClass = await GetEntitiesAsync(input);
            var tuitionFee = new TuitionFee
            {
                StudentId = userClass.Id,
                Fee = input.Fee,
                DatePayment = input.DatePayment,
            };
            var createTuitionFee = await Repository.InsertAndGetIdAsync(tuitionFee);
            var getCreateTuitionFeeId = new EntityDto<long> { Id = createTuitionFee };
            return await GetAsync(getCreateTuitionFeeId);
        }
    }
}
