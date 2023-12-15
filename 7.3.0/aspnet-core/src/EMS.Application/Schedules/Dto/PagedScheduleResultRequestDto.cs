using Abp.Application.Services.Dto;

namespace EMS.Schedules.Dto
{
    public class PagedScheduleResultRequestDto : PagedAndSortedResultRequestDto
    {
        public string Keyword { get; set; }
    }
}
