using Abp.Application.Services.Dto;

namespace EMS.Homeworks.SubmitHomeworks.Dtos
{
    public class PagedSubmitHomeworkResultRequestDto : PagedAndSortedResultRequestDto
    {
        public string Keyword { get; set; }
        public long FromUserId { get; set; }
    }
}