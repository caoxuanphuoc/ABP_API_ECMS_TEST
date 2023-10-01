using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using EMS.Authorization.Positions;
using System.ComponentModel.DataAnnotations;

namespace EMS.Positions.dto
{
    [AutoMapTo(typeof(Position))]
    public class CreateOrUpdatePositionDto : EntityDto<long>
    {
        [Required]
        public string PositionName { get; set; }
    }
}
