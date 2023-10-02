using Abp.AutoMapper;
using EMS.Authorization.Schedules;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EMS.Schedules.Dto
{
    [AutoMapTo(typeof(Schedule))]
    public class CreateScheduleDto
    {
        [Required]
        public DateTime Date { get; set; }
        [Required]
        public long ClassId { get; set; }
        [Required]
        public int RoomId { get; set; }
        [Required]
        public DayOfTheWeek DayOfWeek { get; set; }
        [Required]
        public Shift Shift { get; set; }
    }
}
