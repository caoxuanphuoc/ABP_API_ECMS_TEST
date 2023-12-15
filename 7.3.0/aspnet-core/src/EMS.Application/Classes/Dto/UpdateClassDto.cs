using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using EMS.Authorization.Classes;
using System.ComponentModel.DataAnnotations;

namespace EMS.Classes.Dto
{
    [AutoMapTo(typeof(Class))]
    public class UpdateClassDto : EntityDto<long>
    {
        [Required]
        public string Code { get; set; }
        [Required]
        public long CourseId { get; set; }
        [Required]
        public long LimitStudent { get; set; }
        [Required]
        public long CurrentStudent { get; set; }
        [Required]
        public int LessionTimes { get; set; }
        [Required]
        public bool IsActive { get; set; }
    }
}
