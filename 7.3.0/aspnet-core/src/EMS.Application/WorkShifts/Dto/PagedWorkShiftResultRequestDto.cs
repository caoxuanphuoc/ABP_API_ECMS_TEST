using Abp.Application.Services.Dto;

namespace EMS.WorkShifts.Dto
{
    public class PagedWorkShiftResultRequestDto : PagedAndSortedResultRequestDto
    {
        public string Keyword { get; set; }
    }
}
