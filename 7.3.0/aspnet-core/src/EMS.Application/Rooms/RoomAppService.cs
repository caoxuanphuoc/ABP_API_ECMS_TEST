using Abp.Application.Services;
using Abp.Domain.Repositories;
using EMS.Authorization.Rooms;
using EMS.Authorization.UserClasses;
using EMS.UserClasses.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EMS.Rooms
{
    public class RoomAppService : AsyncCrudAppService<Room, RoomDto, int, PagedRoomResultRequestDto, CreateRoomDto, UpdateRoomDto>, IRoomAppService
    {
        public RoomAppService(IRepository<Room, int> repository) : base(repository)
        {
        }
    }
}
