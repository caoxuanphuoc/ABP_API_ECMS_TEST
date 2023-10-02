using Abp.AutoMapper;
using EMS.Authorization.Courses;
using System.ComponentModel.DataAnnotations;

namespace EMS.Courses.Dto
{
    [AutoMapTo(typeof(Course))]
    public class CreateCourseDto
    {
        [Required]
        public string CourseName { get; set; }
        [Required]
        public long CourseFee { get; set; }
        [Required]
        public long Quantity { get; set; }
    }
}
