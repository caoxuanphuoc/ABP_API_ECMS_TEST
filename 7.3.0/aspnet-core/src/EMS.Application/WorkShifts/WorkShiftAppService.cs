using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.Collections.Extensions;
using Abp.Domain.Repositories;
using Abp.Extensions;
using Abp.Linq.Extensions;
using Abp.UI;
using EMS.Authorization;
using EMS.Authorization.Schedules;
using EMS.Authorization.WorkShifts;
using EMS.WorkShifts.Dto;
using System.Linq;
using System.Threading.Tasks;

namespace EMS.WorkShifts
{
    [AbpAuthorize(PermissionNames.Pages_Users)]
    public class WorkShiftAppService : AsyncCrudAppService<WorkShift, WorkShiftDto, long, PagedWorkShiftResultRequestDto, CreateOrUpdateWorkShiftDto, CreateOrUpdateWorkShiftDto>, IWorkShiftAppService
    {
        private readonly IRepository<Schedule, long> _scheduleRepository;
        public WorkShiftAppService(IRepository<WorkShift, long> repository, IRepository<Schedule, long> scheduleRepository) : base(repository)
        {
            _scheduleRepository = scheduleRepository;
        }

        public override async Task DeleteAsync(EntityDto<long> input)
        {
            CheckDeletePermission();
            if (await _scheduleRepository.CountAsync(x => x.WorkShiftId == input.Id) > 0)
            {
                throw new UserFriendlyException($"Schedule is using WorkShift with id = {input.Id} ");
            }
            await Repository.DeleteAsync(input.Id);
        }

        protected override IQueryable<WorkShift> CreateFilteredQuery(PagedWorkShiftResultRequestDto input)
        {
            return Repository.GetAllIncluding()
                    .WhereIf(!input.Keyword.IsNullOrWhiteSpace(),
                            x => x.Code.ToLower().Contains(input.Keyword.ToLower()));
        }
        protected override IQueryable<WorkShift> ApplySorting(IQueryable<WorkShift> query, PagedWorkShiftResultRequestDto input)
        {
            return query.OrderBy(r => r.Code);
        }
    }
}
