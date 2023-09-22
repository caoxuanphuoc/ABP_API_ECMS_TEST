using Abp.Application.Services.Dto;

namespace EMS.TrackingClasses.Dto
{
    public class PagedTrackingClassResultRequestDto : PagedAndSortedResultRequestDto
    {
        public string Keyword { get; set; }
    }
}
