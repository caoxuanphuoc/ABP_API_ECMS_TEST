using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using EMS.Authorization.TuitionFees;
using System;
using System.ComponentModel.DataAnnotations;

namespace EMS.TuitionFees.Dto
{
    [AutoMapTo(typeof(TuitionFee))]
    public class UpdateTuitionFeeDto : EntityDto<long>
    {
        [Required]
        public long StudentId { get; set; }
        [Required]
        public long Fee { get; set; }
        [Required]
        public DateTime DatePayment { get; set; }
    }
}
