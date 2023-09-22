using Abp.Application.Services.Dto;

namespace EMS.TuitionFees.Dto
{
    public class PagedTuitionFeeResultRequestDto : PagedAndSortedResultRequestDto
    {
        public string Keyword { get; set; }
    }
}
