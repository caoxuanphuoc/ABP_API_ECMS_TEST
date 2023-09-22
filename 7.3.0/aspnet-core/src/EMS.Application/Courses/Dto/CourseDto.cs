using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using EMS.Authorization.Courses;

namespace EMS.Courses.Dto
{
    [AutoMapFrom(typeof(Course))]
    public class CourseDto : EntityDto<long>
    {
        public string CourseName { get; set; }
        public long CourseFee { get; set; }
        public long Quantity { get; set; }
    }
}
