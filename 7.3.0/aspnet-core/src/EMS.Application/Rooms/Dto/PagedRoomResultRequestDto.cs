using Abp.Application.Services.Dto;

namespace EMS.UserClasses.Dto
{
    public class PagedRoomResultRequestDto : PagedAndSortedResultRequestDto
    {
        public string Keyword { get; set; }
    }
}
