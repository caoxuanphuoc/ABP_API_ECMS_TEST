using Abp.AutoMapper;
using EMS.Schedules.Dto;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace EMS.ClassTimelines.Dto
{
    [AutoMapTo(typeof(ClassTimeline))]
    public class CreateClassTimelineDto
    {
        [Required]
        public long ClassId { get; set; }
        [Required]
        public long ScheduleId { get; set; }
        [Required]
        public int RoomId { get; set; }
        [Required]
        public DateTime StartDate { get; set; }
        [Required]
        public DateTime EndDate { get; set; }
        [Required]
        public List<WorkShiftDto> ListWorkShifts { get; set; }
    }
}
