using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.Domain.Entities;
using Abp.Domain.Repositories;
using Abp.Extensions;
using EMS.Authorization;
using EMS.Authorization.Roles;
using EMS.Authorization.Teachers;
using EMS.Authorization.Users;
using EMS.Teachers.Dto;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EMS.Teachers
{
    [AbpAuthorize(PermissionNames.Pages_Users)]
    public class TeacherAppService : AsyncCrudAppService<Teacher, TeacherDto, long, PagedTeacherResultRequestDto, CreateTeacherDto, UpdateTeacherDto>, ITeacherAppService
    {
        private readonly RoleManager _roleManager;
        private readonly UserManager _userManager;
        public TeacherAppService(
            IRepository<Teacher, long> repository,
            RoleManager roleManager,
            UserManager userManager)
            : base(repository)
        {
            _roleManager = roleManager;
            _userManager = userManager;
        }

        // Kiểm tra xem User có tồn tại hay không
        protected async Task<User> GetEntitiesAsync(long UserId)
        {
            var user = await _userManager.GetUserByIdAsync(UserId);
            if (user != null && user.IsActive && !user.IsDeleted)
            {
                return user;
            }
            throw new EntityNotFoundException("Not found User");
        }

        // Get RoleNames from AbpRoles
        protected async Task<String[]> GetRoleNames(User user)
        {
            var roles = user.Roles;
            List<string> roleNames = new();
            foreach (var role in roles)
            {
                var roleName = await _roleManager.FindByIdAsync(role.RoleId.ToString());
                roleNames.Add(roleName.Name);
            }
            return roleNames.ToArray();
        }

        // Create Query
        protected override IQueryable<Teacher> CreateFilteredQuery(PagedTeacherResultRequestDto input)
        {
            var query = Repository.GetAllIncluding(x => x.User, x => x.User.Roles);

            if (!input.Keyword.IsNullOrWhiteSpace())
            {
                query = query.Where(x => x.User.UserName.ToLower().Contains(input.Keyword.ToLower()) ||
                                        x.User.Name.ToLower().Contains(input.Keyword.ToLower()) ||
                                        x.User.EmailAddress.ToLower().Contains(input.Keyword.ToLower()) ||
                                        x.SchoolName.ToLower().Contains(input.Keyword.ToLower()) ||
                                        x.Certificate.ToLower().Contains(input.Keyword.ToLower())
                                        && x.User.IsActive);
            }
            else
            {
                query = query.Where(x => x.User.IsActive);
            }
            return query;
        }

        // Sorting by User
        protected override IQueryable<Teacher> ApplySorting(IQueryable<Teacher> query, PagedTeacherResultRequestDto input)
        {
            return query.OrderBy(r => r.User.FullName);
        }

        // Get All Teacher
        public override async Task<PagedResultDto<TeacherDto>> GetAllAsync(PagedTeacherResultRequestDto input)
        {
            CheckGetAllPermission();
            var query = CreateFilteredQuery(input);
            var totalCount = await AsyncQueryableExecuter.CountAsync(query);
            query = ApplySorting(query, input);
            query = ApplyPaging(query, input);
            var teachers = await AsyncQueryableExecuter.ToListAsync(query);
            List<TeacherDto> listTeacherDtos = new();
            foreach (var teacher in teachers)
            {
                var teacherDto = ObjectMapper.Map<TeacherDto>(teacher);
                teacherDto.User.RoleNames = await GetRoleNames(teacher.User);
                listTeacherDtos.Add(teacherDto);
            }
            return new PagedResultDto<TeacherDto>(totalCount, listTeacherDtos);
        }

        // Get Teacher
        public override async Task<TeacherDto> GetAsync(EntityDto<long> input)
        {
            CheckGetPermission();
            var teacher = await Repository.GetAllIncluding(x => x.User, x => x.User.Roles)
                                             .FirstOrDefaultAsync(x => x.Id == input.Id)
                                             ?? throw new EntityNotFoundException("Not found Teacher");
            var teacherDto = ObjectMapper.Map<TeacherDto>(teacher);
            teacherDto.User.RoleNames = await GetRoleNames(teacher.User);
            return teacherDto;
        }

        // Create new Teacher
        public override async Task<TeacherDto> CreateAsync(CreateTeacherDto input)
        {
            CheckCreatePermission();
            var user = await GetEntitiesAsync(input.UserId);
            var teacher = new Teacher
            {
                User = user,
                SchoolName = input.SchoolName,
                Certificate = input.Certificate,
                Wage = input.Wage,
                StartTime = input.StartTime,
            };
            var createTeacher = await Repository.InsertAndGetIdAsync(teacher);
            var getCreateTeacherId = new EntityDto<long> { Id = createTeacher };
            return await GetAsync(getCreateTeacherId);
        }

        // Update Teacher
        public override async Task<TeacherDto> UpdateAsync(UpdateTeacherDto input)
        {
            CheckUpdatePermission();
            var user = await GetEntitiesAsync(input.UserId);
            var teacher = await Repository.GetAsync(input.Id);
            teacher.User = user;
            teacher.SchoolName = input.SchoolName;
            teacher.Certificate = input.Certificate;
            teacher.Wage = input.Wage;
            teacher.StartTime = input.StartTime;
            await base.UpdateAsync(input);
            return await GetAsync(new EntityDto<long> { Id = input.Id });
        }
    }
}
