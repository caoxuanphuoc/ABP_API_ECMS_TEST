using Abp.Application.Services.Dto;

namespace EMS.Homeworks.HomeworkApp.Dtos
{
    public class PagedHomeworkResultRequestDto : PagedAndSortedResultRequestDto
    {
        public string Keyword { get; set; } 
    }
}