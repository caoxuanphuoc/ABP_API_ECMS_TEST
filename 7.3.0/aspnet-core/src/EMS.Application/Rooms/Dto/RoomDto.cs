using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using EMS.Authorization.Rooms;

namespace EMS.UserClasses.Dto
{
    [AutoMapFrom(typeof(Room))]
    public class RoomDto : EntityDto<int>
    {
        public string RoomName { get; set; }
        public int MaxContainer { get; set; }
    }
}
