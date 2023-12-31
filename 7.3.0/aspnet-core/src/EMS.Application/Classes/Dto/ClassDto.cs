﻿using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using EMS.Authorization.Classes;
using EMS.Courses.Dto;
using System;

namespace EMS.Classes.Dto
{
    [AutoMapFrom(typeof(Class))]
    public class ClassDto : EntityDto<long>
    {
        public string Code { get; set; }
        public CourseDto Course { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public long LimitStudent { get; set; }
        public long CurrentStudent { get; set; }
        public int LessionTimes { get; set; }
        public bool IsActive { get; set; }
    }
}
