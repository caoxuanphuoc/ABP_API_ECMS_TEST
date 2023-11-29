using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.Domain.Entities;
using Abp.Domain.Repositories;
using Abp.Extensions;
using Abp.UI;
using EMS.Authorization;
using EMS.Homeworks.SubmitHomeworks.Dtos;
using EMS.Users;
using EMS.Users.Dto;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace EMS.Homeworks.SubmitHomeworks;

[AbpAuthorize(PermissionNames.Pages_Users)]
public class SubmitHomeworkAppService : AsyncCrudAppService<SubmitHomeWork, SubmitHomeworkDto, long, PagedSubmitHomeworkResultRequestDto, CreateSubmitHomeworkDto, UpdateSubmitHomeworkDto>, ISubmitHomeworkAppService
{
    private readonly IRepository<Homework, long> _homeworkRepository;
    private readonly UserAppService _userAppService;
    public SubmitHomeworkAppService(
        IRepository<SubmitHomeWork, long> repository,
        IRepository<Homework, long> homeworkRepository,
        UserAppService userAppService)
        : base(repository)
    {
        _homeworkRepository = homeworkRepository;
        _userAppService = userAppService;
    }
    protected async Task<Homework> CheckHomeworkIsExists(long homeworkId)
    {
        var homework = await _homeworkRepository.GetAsync(homeworkId);
        if ((homework != null && homework.IsDeleted) || homework == null)
        {
            throw new EntityNotFoundException("Not found Homework");
        }
        return homework;
    }

    protected async Task<bool> CheckIsLated(long homeworkId)
    {
        var homework = await _homeworkRepository.GetAsync(homeworkId);
        var endTime = homework.EndTime;
        if (DateTime.Now > endTime)
        {
            return false;
        }
        return true;
    }
    public override async Task<SubmitHomeworkDto> CreateAsync([FromForm] CreateSubmitHomeworkDto input)
    {
        CheckCreatePermission();
        await CheckHomeworkIsExists(input.HomeworkId);

        var fileKey = await _userAppService.UploadFileToDrive(input.fileDto);
        var isLate = await CheckIsLated(input.HomeworkId);
        var submitHomework = new SubmitHomeWork
        {
            HomeworkId = input.HomeworkId,
            Title = input.Title,
            Score = input.Score,
            Content = input.Content,
            FileKey = fileKey,
            Islate = isLate,
        };
        var createSubmit = await Repository.InsertAndGetIdAsync(submitHomework);
        var getCreatePostId = new EntityDto<long> { Id = createSubmit };
        return await GetAsync(getCreatePostId);
    }

    public override async Task<SubmitHomeworkDto> UpdateAsync([FromForm] UpdateSubmitHomeworkDto input)
    {
        CheckUpdatePermission();
        await CheckHomeworkIsExists(input.HomeworkId);
        var isLated = await CheckIsLated(input.HomeworkId);

        var existsSubmit = await Repository.GetAsync(input.Id) ?? throw new EntityNotFoundException("Not found SubmitHomework");
        FileDto fileDto = input.fileDto;
        string fileKey;

        if (fileDto.file == null && fileDto.DriveUrl == null)
        {
            fileKey = existsSubmit.FileKey;
        }
        else
        {
            if (fileDto.file == null || fileDto.DriveUrl == null)
            {
                throw new UserFriendlyException("Please fill in the drive's folder information and select the file");
            }
            else
            {
                fileKey = await _userAppService.UploadFileToDrive(fileDto);
            }
        }

        var submitHomework = new SubmitHomeWork
        {
            Id = input.Id,
            HomeworkId = input.HomeworkId,
            Title = input.Title,
            Score = input.Score,
            Content = input.Content,
            FileKey = fileKey,
            Islate = isLated,
        };
        ObjectMapper.Map(input, submitHomework);
        await base.UpdateAsync(input);
        return await GetAsync(new EntityDto<long> { Id = input.Id });
    }

    protected override IQueryable<SubmitHomeWork> CreateFilteredQuery(PagedSubmitHomeworkResultRequestDto input)
    {
        var query = Repository.GetAllIncluding();

        if (input.FromUserId != 0)
        {
            query = query.Where(x => x.CreatorUserId == input.FromUserId);
        }

        if (!input.Keyword.IsNullOrWhiteSpace())
        {
            query = query.Where(x => x.Title.ToLower().Contains(input.Keyword.ToLower()) ||
                                    x.Content.ToLower().Contains(input.Keyword.ToLower())
                                    && !x.IsDeleted);

        }
        else
        {
            query = query.Where(x => !x.IsDeleted);
        }
        return query;
    }

    // Sorting by User
    protected override IQueryable<SubmitHomeWork> ApplySorting(IQueryable<SubmitHomeWork> query, PagedSubmitHomeworkResultRequestDto input)
    {
        return query.OrderBy(r => r.Title).ThenBy(r => r.Content);
    }
}
