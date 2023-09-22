using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using EMS.Authorization.TuitionFees;
using EMS.UserClasses.Dto;
using System;

namespace EMS.TuitionFees.Dto
{
    [AutoMapFrom(typeof(TuitionFee))]
    public class TuitionFeeDto : EntityDto<long>
    {
        public UserClassDto Student { get; set; }
        public long Fee { get; set; }
        public DateTime DatePayment { get; set; }
    }
}
