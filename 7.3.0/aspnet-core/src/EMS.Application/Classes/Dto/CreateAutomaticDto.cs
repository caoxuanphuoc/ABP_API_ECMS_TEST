using EMS.Schedules.Dto;
using System.Collections.Generic;

namespace EMS.Classes.Dto
{
    public class CreateAutomaticDto
    {
        public long ClassId { get; set; }
        public int RoomId { get; set; }
        public List<WorkShiftDto> ListWorkShifts { get; set; }
    }
}
