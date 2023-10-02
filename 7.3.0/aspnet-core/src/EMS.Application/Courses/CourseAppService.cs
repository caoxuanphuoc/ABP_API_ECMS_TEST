using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.Domain.Repositories;
using Abp.Extensions;
using Abp.Linq.Extensions;
using Abp.UI;
using EMS.Authorization;
using EMS.Authorization.Classes;
using EMS.Authorization.Courses;
using EMS.Courses.Dto;
using System.Linq;
using System.Threading.Tasks;

namespace EMS.Courses
{
    [AbpAuthorize(PermissionNames.Pages_Users)]
    public class CourseAppService : AsyncCrudAppService<Course, CourseDto, long, PagedCourseResultRequestDto, CreateCourseDto, UpdateCourseDto>, ICourseAppService
    {
        private readonly IRepository<Class, long> _classRepository;
        public CourseAppService(IRepository<Course, long> repository, IRepository<Class, long> classRepository) : base(repository)
        {
            _classRepository = classRepository;
        }

        public override async Task DeleteAsync(EntityDto<long> input)
        {
            CheckDeletePermission();
            if (await _classRepository.CountAsync(x => x.CourseId == input.Id) > 0)
            {
                throw new UserFriendlyException($"Class is using Course with id = {input.Id} ");
            }
            await base.DeleteAsync(input);
        }

        protected override IQueryable<Course> CreateFilteredQuery(PagedCourseResultRequestDto input)
        {
            return Repository.GetAllIncluding()
                    .WhereIf(!input.Keyword.IsNullOrWhiteSpace(),
                            x => x.CourseName.ToLower().Contains(input.Keyword.ToLower()) ||
                            x.Quantity.ToString() == input.Keyword.ToLower());
        }
        protected override IQueryable<Course> ApplySorting(IQueryable<Course> query, PagedCourseResultRequestDto input)
        {
            return query.OrderBy(r => r.CourseName).ThenBy(r => r.CourseFee);
        }
    }
}
