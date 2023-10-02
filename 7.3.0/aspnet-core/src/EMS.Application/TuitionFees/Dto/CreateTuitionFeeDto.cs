using Abp.AutoMapper;
using EMS.Authorization.TuitionFees;
using System;
using System.ComponentModel.DataAnnotations;

namespace EMS.TuitionFees.Dto
{
    [AutoMapTo(typeof(TuitionFee))]
    public class CreateTuitionFeeDto
    {
        [Required]
        public long StudentId { get; set; }
        [Required]
        public long Fee { get; set; }
        [Required]
        public DateTime DatePayment { get; set; }
    }
}
