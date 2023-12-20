using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.Domain.Entities;
using Abp.Domain.Repositories;
using Abp.Extensions;
using Abp.UI;
using EMS.Authorization;
using EMS.Authorization.Classes;
using EMS.Authorization.Courses;
using EMS.Authorization.UserClasses;
using EMS.Classes.Dto;
using EMS.ClassTimelines;
using EMS.Social.Posts;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

namespace EMS.Classes
{
    [AbpAuthorize(PermissionNames.Pages_Users)]
    public class ClassAppService : AsyncCrudAppService<Class, ClassDto, long, PagedClassResultRequestDto, CreateClassDto, UpdateClassDto>, IClassAppService
    {
        private readonly IRepository<Course, long> _courseRepository;
        private readonly IRepository<Post, long> _postRepository;
        private readonly IRepository<UserClass, long> _userClassRepository;
        private readonly IRepository<ClassTimeline, long> _timelineRepository;
        public ClassAppService(
            IRepository<Class, long> repository,
            IRepository<Course, long> courseRepository,
            IRepository<Post, long> postRepository,
            IRepository<UserClass, long> userClassRepository,
            IRepository<ClassTimeline, long> timelineRepository
        ) : base(repository)
        {
            _courseRepository = courseRepository;
            _postRepository = postRepository;
            _userClassRepository = userClassRepository;
            _timelineRepository = timelineRepository;
        }
        // Create Query
        protected override IQueryable<Class> CreateFilteredQuery(PagedClassResultRequestDto input)
        {
            var query = Repository.GetAllIncluding(x => x.Course);

            if (!input.Keyword.IsNullOrWhiteSpace())
            {
                query = query.Where(x => x.LimitStudent.ToString() == input.Keyword ||
                                        x.Code.ToLower().Contains(input.Keyword.ToLower())
                                        && x.IsActive);
            }
            else
            {
                query = query.Where(x => x.IsActive);
            }
            return query;
        }
        // Sorting by User
        protected override IQueryable<Class> ApplySorting(IQueryable<Class> query, PagedClassResultRequestDto input)
        {
            return query.OrderBy(r => r.Code);
        }
        // Check Course exists or not
        protected async Task CheckCourseIsExists(long courseId)
        {
            var course = await _courseRepository.CountAsync(x => x.Id == courseId);
            if (course == 0)
            {
                throw new UserFriendlyException("Not found Course");
            }
        }

        protected async Task CheckClassIsUsed(long classId)
        {
            var post = await _postRepository.CountAsync(x => x.ClassId == classId);
            var userClass = await _userClassRepository.CountAsync(x => x.ClassId == classId);
            var classTimeline = await _timelineRepository.CountAsync(x => x.ClassId == classId);
            if (post != 0 || userClass != 0 || classTimeline != 0)
            {
                throw new UserFriendlyException("Cannot delete this Class because Class is used");
            }
        }

        // Get Class
        public override async Task<ClassDto> GetAsync(EntityDto<long> input)
        {
            CheckGetPermission();
            var classRoom = await Repository.GetAllIncluding(x => x.Course)
                                        .FirstOrDefaultAsync(x => x.Id == input.Id)
                                        ?? throw new EntityNotFoundException("Not found Class");
            var classDto = ObjectMapper.Map<ClassDto>(classRoom);
            return classDto;
        }

        // Create automatic schedule
        // Thuật toán
        /// <summary>
        /// Với mỗi lịch học (workShift)
        ///  Thì mỗi ngày nằm trong khoảng từ startDate đên EndDate 
        ///      + Kiểm tra xem ngày đó là ngày thứ mấy.
        ///          + Nếu ngày đó trong với lịch học (workShift) đã nhập ở class)
        ///          + thì tạo một bản ghi lưu vào schedule table và ClassTimeline table
        ///          Tiếp tục cho đến khi đến ngày kết thúc.
        /// </summary>
        /// <param name="classId"></param>
        /// <param name="roomId"></param>
        /// <param name="LsWorkShift"></param>
        /// <returns></returns>

        //protected async Task CreateAutomatic(Dto.CreateAutomaticDto input)
        //{
        //    foreach (var workShift in input.ListWorkShifts)
        //    {
        //        DateTime temp = workShift.StartDate;

        //        Schedule schedule = new()
        //        {
        //            RoomId = input.RoomId,
        //            DayOfWeek = workShift.DateOfWeek,
        //            Shift = workShift.ShiftTime
        //        };

        //        while (temp <= workShift.EndDate)
        //        {
        //            if (temp.DayOfWeek.ToString() == workShift.DateOfWeek.ToString())
        //            {
        //                schedule.Date = temp;

        //                var createScheduleId = await _scheduleRepository.InsertAndGetIdAsync(schedule);
        //                var workShiftDto = new WorkShiftDto
        //                {
        //                    StartDate = temp,
        //                    EndDate = workShift.EndDate,
        //                };
        //                var classTimelineDto = new CreateClassTimelineDto
        //                {
        //                    workShift = workShiftDto,
        //                    ClassId = input.ClassId,
        //                    ScheduleId = createScheduleId,
        //                };

        //                await CreateClassTimelineAsync(classTimelineDto);
        //            }
        //            temp = temp.AddDays(1);
        //        }
        //    }
        //}

        //// Create new ClassTimeline
        //protected async Task CreateClassTimelineAsync(CreateClassTimelineDto input)
        //{
        //    var ClassTimeline = ObjectMapper.Map<ClassTimeline>(input);
        //    await _classTimelineRepository.InsertAsync(ClassTimeline);
        //}

        //Create new Class
        public override async Task<ClassDto> CreateAsync(CreateClassDto input)
        {
            CheckCreatePermission();
            await CheckCourseIsExists(input.CourseId);

            var classRoom = ObjectMapper.Map<Class>(input);
            var createClassId = await Repository.InsertAndGetIdAsync(classRoom);
            var getCreateClassId = new EntityDto<long> { Id = createClassId };
            return await GetAsync(getCreateClassId);
        }

        // Update new Class
        public override async Task<ClassDto> UpdateAsync(UpdateClassDto input)
        {
            CheckUpdatePermission();
            await CheckCourseIsExists(input.CourseId);
            var classRoom = await Repository.GetAsync(input.Id);
            ObjectMapper.Map(input, classRoom);
            await base.UpdateAsync(input);
            return await GetAsync(new EntityDto<long> { Id = input.Id });
        }

        // Delete Class
        public override async Task DeleteAsync(EntityDto<long> input)
        {
            CheckDeletePermission();
            await CheckClassIsUsed(input.Id);
            await base.DeleteAsync(input);
        }
    }
}
