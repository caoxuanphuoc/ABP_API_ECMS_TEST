using Abp.Application.Services;
using EMS.Teachers.Dto;

namespace EMS.Teachers
{
    public interface ITeacherAppService : IAsyncCrudAppService<TeacherDto, long, PagedTeacherResultRequestDto, CreateTeacherDto, UpdateTeacherDto>
    {
    }
}
