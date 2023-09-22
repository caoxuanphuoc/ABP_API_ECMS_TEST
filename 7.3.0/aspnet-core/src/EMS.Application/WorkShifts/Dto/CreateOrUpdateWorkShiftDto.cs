using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using EMS.Authorization.WorkShifts;
using System;
using System.ComponentModel.DataAnnotations;

namespace EMS.WorkShifts.Dto
{
    [AutoMapTo(typeof(WorkShift))]
    public class CreateOrUpdateWorkShiftDto : EntityDto<long>
    {
        [Required]
        public string Code { get; set; }
        [Required]
        public DateTime TimeStart { get; set; }
        [Required]
        public DateTime TimeEnd { get; set; }
    }
}
