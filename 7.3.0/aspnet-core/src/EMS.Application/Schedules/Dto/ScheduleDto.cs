﻿using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using EMS.Authorization.Schedules;
using EMS.Classes.Dto;
using EMS.WorkShifts.Dto;
using System;

namespace EMS.Schedules.Dto
{
    [AutoMapFrom(typeof(Schedule))]
    public class ScheduleDto : EntityDto<long>
    {
        public ClassDto Class { get; set; }
        public WorkShiftDto WorkShift { get; set; }
        public DateTime Date { get; set; }
    }
}
