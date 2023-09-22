using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using EMS.Authorization.TrackingClasses;
using EMS.UserClasses.Dto;
using System;

namespace EMS.TrackingClasses.Dto
{
    [AutoMapFrom(typeof(TrackingClass))]
    public class TrackingClassDto : EntityDto<long>
    {
        public UserClassDto Student { get; set; }
        public DateTime Date { get; set; }
        public DateTime CheckInTime { get; set; }
    }
}
