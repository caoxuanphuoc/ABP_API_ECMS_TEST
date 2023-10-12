using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using System;

namespace EMS.Homeworks.HomeworkApp.Dtos
{
    [AutoMapTo(typeof(Homework))]
    public class UpdateHomeworkDto : EntityDto<long>
    {
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
    }
}