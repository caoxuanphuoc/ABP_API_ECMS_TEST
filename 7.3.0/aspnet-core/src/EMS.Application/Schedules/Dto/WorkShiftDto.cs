using EMS.Authorization.Schedules;
using System;

namespace EMS.Schedules.Dto
{
    // để lưu lại các ca học được nhập từ Class
    public class WorkShiftDto
    {
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public DayOfTheWeek DateOfWeek { get; set; }
        public Shift ShiftTime { get; set; }
    }
}
