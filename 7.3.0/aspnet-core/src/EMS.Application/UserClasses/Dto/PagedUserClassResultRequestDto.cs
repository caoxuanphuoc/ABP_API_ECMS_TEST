using Abp.Application.Services.Dto;

namespace EMS.UserClasses.Dto
{
    public class PagedUserClassResultRequestDto : PagedAndSortedResultRequestDto
    {
        public string Keyword { get; set; }
        public bool IsActive { get; set; } = true;
        public long ClassId { get; set; } 
    }
}
