using Abp.AutoMapper;
using EMS.Authorization.WorkShifts;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EMS.WorkShifts.Dto
{
    [AutoMapTo(typeof(WorkShift))]
    public class CreateWorkShiftDto
    {
        
        [Required]
        public string Code { get; set; }
        [Required]
        public DateTime TimeStart { get; set; }
        [Required]
        public DateTime TimeEnd { get; set; }
    }
}
