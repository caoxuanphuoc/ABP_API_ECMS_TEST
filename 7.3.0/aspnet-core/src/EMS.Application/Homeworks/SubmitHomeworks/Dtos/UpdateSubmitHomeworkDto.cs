using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using EMS.Users.Dto;
using System.ComponentModel.DataAnnotations;

namespace EMS.Homeworks.SubmitHomeworks.Dtos
{
    [AutoMapTo(typeof(SubmitHomeWork))]
    public class UpdateSubmitHomeworkDto : EntityDto<long>
    {
        [Required]
        public long HomeworkId { get; set; }
        [Required]
        public string Title { get; set; }
        public int Score { get; set; }
        [Required]
        public string Content { get; set; }
        public FileDto fileDto { get; set; }
    }
}