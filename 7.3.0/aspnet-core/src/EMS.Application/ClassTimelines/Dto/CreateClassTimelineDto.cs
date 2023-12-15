using Abp.AutoMapper;
using System;
using System.ComponentModel.DataAnnotations;

namespace EMS.ClassTimelines.Dto
{
    [AutoMapTo(typeof(ClassTimeline))]
    public class CreateClassTimelineDto
    {
        [Required]
        public DateTime StartDate { get; set; }
        [Required]
        public DateTime EndDate { get; set; }
        [Required]
        public long ClassId { get; set; }
        [Required]
        public long ScheduleId { get; set; }
    }
}
