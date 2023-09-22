using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using EMS.Authorization.WorkShifts;
using System;

namespace EMS.WorkShifts.Dto
{
    [AutoMapFrom(typeof(WorkShift))]
    public class WorkShiftDto : EntityDto<long>
    {
        public string Code { get; set; }
        public DateTime TimeStart { get; set; }
        public DateTime TimeEnd { get; set; }
    }
}
