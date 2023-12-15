using Abp.Application.Services.Dto;

namespace EMS.ClassTimelines.Dto
{
    public class PagedClassTimelineResultRequestDto : PagedAndSortedResultRequestDto
    {
        public string Keyword { get; set; }
        public long ClassId { get; set; }
        public long CourseId { get; set; }
    }
}
