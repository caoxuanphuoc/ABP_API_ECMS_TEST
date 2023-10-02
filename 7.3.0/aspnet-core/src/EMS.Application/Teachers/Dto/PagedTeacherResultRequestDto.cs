using Abp.Application.Services.Dto;

namespace EMS.Teachers.Dto
{
    public class PagedTeacherResultRequestDto : PagedAndSortedResultRequestDto
    {
        public string Keyword { get; set; }
    }
}
