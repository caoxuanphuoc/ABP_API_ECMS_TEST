using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using EMS.Authorization.Positions;

namespace EMS.Positions.dto
{
    [AutoMapFrom(typeof(Position))]
    public class PositionDto : EntityDto<long>
    {
        public string PositionName;
    }
}
