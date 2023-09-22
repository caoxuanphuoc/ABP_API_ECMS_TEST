using Abp.Application.Services;
using EMS.Courses.Dto;

namespace EMS.Courses
{
    public interface ICourseAppService : IAsyncCrudAppService<CourseDto, long, PagedCourseResultRequestDto, CreateOrUpdateCourse, CreateOrUpdateCourse>
    {
    }
}
