using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using EMS.Authorization.Schedules;
using System;
using System.ComponentModel.DataAnnotations;

namespace EMS.Homeworks.HomeworkApp.Dtos
{
    [AutoMapTo(typeof(Homework))]
    public class CreateHomeworkDto 
    {
        [Required]
        public long PostId { get; set; }
        [Required]
        public DateTime StartTime { get; set; }
        [Required]
        public DateTime EndTime { get; set; }
    }
}