using Abp.Application.Services.Dto;

namespace EMS.Positions.dto
{
    public class PagedPositionResultRequestDto : PagedAndSortedResultRequestDto
    {
        public string Keyword { get; set; }
    }
}
