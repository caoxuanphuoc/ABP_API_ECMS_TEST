using EMS.Authorization.Schedules;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EMS.Schedules.Dto
{
    // để lưu lại các ca học được nhập từ Class
    public class WorkShiftDto
    {
        public DayOfTheWeek DateOfWeek { get; set; }
        public Shift ShiftTime { get; set; }
    }
}
