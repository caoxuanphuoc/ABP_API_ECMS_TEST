using Abp.AutoMapper;
using System.ComponentModel.DataAnnotations;

namespace EMS.Homeworks.SubmitHomeworks.Dtos
{
    [AutoMapTo(typeof(SubmitHomeWork))]
    public class CreateSubmitHomeworkDto
    {
        [Required]
        public long HomeworkId { get; set; }
        [Required]
        public string Title { get; set; }
        public int Score { get; set; }
        [Required]
        public string Content { get; set; }
        public string FileKey { get; set; }
        public bool Islate { get; set; }
    }
}