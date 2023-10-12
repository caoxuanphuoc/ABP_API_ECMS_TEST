using Abp.Application.Services.Dto;

namespace EMS.Homeworks.SubmitHomeworks.Dtos
{
    public class PagedSubmitHomeworkResultRequestDto : PagedAndSortedResultRequestDto
    {
        public string Keywoed { get; set; }
    }
}