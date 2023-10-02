using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using EMS.Authorization.Teachers;
using System;
using System.ComponentModel.DataAnnotations;

namespace EMS.Teachers.Dto
{
    [AutoMapTo(typeof(Teacher))]
    public class UpdateTeacherDto : EntityDto<long>
    {
        [Required]
        public long UserId { get; set; }
        [Required]
        public string SchoolName { get; set; }
        [Required]
        public string Certificate { get; set; }
        [Required]
        public long Wage { get; set; }
        [Required]
        public DateTime StartTime { get; set; }
    }
}
