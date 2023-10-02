using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using EMS.Authorization.Rooms;
using EMS.Authorization.UserClasses;
using System;
using System.ComponentModel.DataAnnotations;

namespace EMS.UserClasses.Dto
{
    [AutoMapTo(typeof(Room))]
    public class UpdateRoomDto : EntityDto<int>
    {
        [Required]
        public string RoomName { get; set; }
        [Required]
        public int MaxContainer { get; set; }
    }
}
