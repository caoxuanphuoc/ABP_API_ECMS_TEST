using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.Domain.Entities;
using Abp.Domain.Repositories;
using Abp.Extensions;
using EMS.Authorization;
using EMS.ClassTimelines.Dto;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace EMS.ClassTimelines
{
    [AbpAuthorize(PermissionNames.Pages_Users)]
    public class ClassTimelineAppService : AsyncCrudAppService<ClassTimeline, ClassTimelineDto, long, PagedClassTimelineResultRequestDto, CreateClassTimelineDto, UpdateClassTimelineDto>, IClassTimelineAppService
    {
        public ClassTimelineAppService(IRepository<ClassTimeline, long> repository) : base(repository)
        {
        }

        // Create Query
        protected override IQueryable<ClassTimeline> CreateFilteredQuery(PagedClassTimelineResultRequestDto input)
        {
            var query = Repository.GetAllIncluding(x => x.Class, x => x.Class.Course,
                                                    x => x.Schedule, x => x.Schedule.Room);
            if (!input.Keyword.IsNullOrWhiteSpace())
            {
                query = query.Where(x => x.Class.Code.ToLower().Contains(input.Keyword.ToLower()) ||
                                        x.Schedule.Room.RoomName.ToLower().Contains(input.Keyword.ToLower()));
            }
            if (input.ClassId != 0)
            {
                query = query.Where(x => (input.Keyword.IsNullOrWhiteSpace() ||
                                          (x.Class.Code.ToLower().Contains(input.Keyword.ToLower()) ||
                                           x.Schedule.Room.RoomName.ToLower().Contains(input.Keyword.ToLower()))) &&
                                           x.ClassId == input.ClassId);
            }
            if (input.CourseId != 0)
            {
                query = query.Where(x => x.Class.CourseId == input.CourseId);
            }

            return query;
        }

        protected override IQueryable<ClassTimeline> ApplySorting(IQueryable<ClassTimeline> query, PagedClassTimelineResultRequestDto input)
        {
            return query.OrderBy(r => r.StartDate);
        }

        public override async Task<ClassTimelineDto> GetAsync(EntityDto<long> input)
        {
            CheckGetPermission();
            var classTimeline = await Repository.GetAllIncluding(x => x.Class, x => x.Schedule)
                                        .FirstOrDefaultAsync(x => x.Id == input.Id)
                                        ?? throw new EntityNotFoundException("Not found ClassTimeline");
            var classTimelineDto = ObjectMapper.Map<ClassTimelineDto>(classTimeline);
            return classTimelineDto;
        }

        public async Task<string> HashSchedule(long id)
        {
            var schedule = await Repository.GetAsync(id);
            var concatenatedIds = $"{schedule.Id}-{schedule.ClassId}";

            string hashedString;
            using var sha256 = SHA256.Create();
            byte[] hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(concatenatedIds));
            hashedString = BitConverter.ToString(hashedBytes).Replace("-", "").ToLower();
            return hashedString;
        }
    }
}
