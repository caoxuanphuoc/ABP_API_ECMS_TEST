using Abp.Application.Services;
using EMS.UserClasses.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EMS.Rooms
{
    public  interface IRoomAppService : IAsyncCrudAppService<RoomDto, int, PagedRoomResultRequestDto, CreateRoomDto, UpdateRoomDto>
    {
    }
}
