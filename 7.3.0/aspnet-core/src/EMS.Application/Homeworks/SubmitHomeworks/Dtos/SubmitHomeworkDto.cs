using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using System;

namespace EMS.Homeworks.SubmitHomeworks.Dtos
{
    [AutoMapFrom(typeof(SubmitHomeWork))]
    public class SubmitHomeworkDto : EntityDto<long>
    {
        public long HomeworkId { get; set; }
        public string Title { get; set; }
        public int Score { get; set; }
        public string Content { get; set; }
        public string FileKey { get; set; }
        public bool Islate { get; set; }
        public DateTime TimeToSubmit { get; set; }
        public long FromUserId { get; set; }
    }
}