using Abp.Application.Services.Dto;

namespace EMS.Classes.Dto
{
    public class PagedClassResultRequestDto : PagedAndSortedResultRequestDto
    {
        public string Keyword { get; set; }
    }
}
