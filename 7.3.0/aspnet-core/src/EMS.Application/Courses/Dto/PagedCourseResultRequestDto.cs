using Abp.Application.Services.Dto;

namespace EMS.Courses.Dto
{
    public class PagedCourseResultRequestDto : PagedAndSortedResultRequestDto
    {
        public string Keyword { get; set; }
    }
}
