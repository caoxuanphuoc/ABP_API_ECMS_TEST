using Abp.Application.Services.Dto;

namespace EMS.Socials.Posts.Dto
{
    public class PagedPostResultRequestDto : PagedAndSortedResultRequestDto
    {
        public string Keyword { get; set; }
        public long FromUserId { get; set; }
    }
}