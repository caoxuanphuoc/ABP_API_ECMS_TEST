using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Abp.Domain.Entities;
using EMS.Social.Comments;
using EMS.Social.Posts;
using System;

namespace EMS.Homeworks.HomeworkApp.Dtos
{
    [AutoMapFrom(typeof(Homework))]
    public class HomeworkDto : EntityDto<long>
    {
        public long PostId { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
    }
}