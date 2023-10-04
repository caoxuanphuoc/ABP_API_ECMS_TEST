using Abp.AutoMapper;
using EMS.Authorization.Classes;
using EMS.Authorization.Schedules;
using EMS.Schedules.Dto;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace EMS.Classes.Dto
{
    [AutoMapTo(typeof(Class))]
    public class CreateClassDto
    {
        [Required]
        public string Code { get; set; }
        [Required]
        public long CourseId { get; set; }
        [Required]
        public DateTime StartDate { get; set; }
        [Required]
        public DateTime EndDate { get; set; }
        [Required]
        public long LimitStudent { get; set; }
        [Required]
        public long CurrentStudent { get; set; }
        [Required]
        public int LessionTimes { get; set; }
        [Required]
        public bool IsActive { get; set; }
        // For schedule service
        // Tách RoomId và list workshift ra để tạo schedule
        [Required]
        public int RoomId { get; set; }
        [Required]
        public List<WorkShiftDto> lsWorkSheet { get; set; }

    }
}
