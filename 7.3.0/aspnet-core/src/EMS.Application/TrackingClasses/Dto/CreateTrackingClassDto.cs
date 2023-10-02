using Abp.AutoMapper;
using EMS.Authorization.TrackingClasses;
using System;
using System.ComponentModel.DataAnnotations;

namespace EMS.TrackingClasses.Dto
{
    [AutoMapTo(typeof(TrackingClass))]
    public class CreateTrackingClassDto
    {
        [Required]
        public long StudentId { get; set; }
        [Required]
        public DateTime Date { get; set; }
        [Required]
        public DateTime CheckInTime { get; set; }
    }
}
