using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Domain.Entities;
using Abp.Domain.Repositories;
using Abp.Extensions;
using Abp.UI;
using EMS.Authorization.Classes;
using EMS.Homeworks;
using EMS.Homeworks.HomeworkApp.Dtos;
using EMS.Social.Posts;
using EMS.Socials.Posts.Dto;
using EMS.Users;
using EMS.Users.Dto;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Threading.Tasks;

namespace EMS.Socials.Posts
{
    public class PostAppService : AsyncCrudAppService<Post, PostDto, long, PagedPostResultRequestDto, CreatePostDto, UpdatePostDto>, IPostAppService
    {
        private readonly IRepository<Homework, long> _homeworkRepository;
        private readonly UserAppService _userAppService;
        private readonly IRepository<Class, long> _classRepository;
        public PostAppService(
                IRepository<Post, long> repository,
                IRepository<Homework, long> homeworkRepository,
                UserAppService userAppService,
                IRepository<Class, long> classRepository)
            : base(repository)
        {
            _homeworkRepository = homeworkRepository;
            _userAppService = userAppService;
            _classRepository = classRepository;
        }

        protected async void CreateHomeWorkAsync(CreateHomeworkDto input)
        {
            var homework = ObjectMapper.Map<Homework>(input);
            var createHomework = await _homeworkRepository.InsertAndGetIdAsync(homework);
        }
        protected async Task<Class> CheckClassIsExists(long classId)
        {
            var classroom = await _classRepository.GetAsync(classId);
            if (classroom == null || (classroom != null & classroom.IsDeleted))
            {
                throw new EntityNotFoundException("Not found Class");
            }
            return classroom;
        }
        public override async Task<PostDto> CreateAsync([FromForm] CreatePostDto input)
        {
            CheckCreatePermission();
            await CheckClassIsExists(input.ClassId);
            var fileKey = await _userAppService.UploadFileToDrive(input.fileDto);
            var post = new Post
            {
                ClassId = input.ClassId,
                Title = input.Title,
                ContentPost = input.ContentPost,
                Type = input.Type,
                FileKey = fileKey,
            };
            var createPost = await Repository.InsertAndGetIdAsync(post);
            var getCreatePostId = new EntityDto<long> { Id = createPost };
            if (input.Type == 0)
            {
                CreateHomeworkDto autoHomework = new()
                {
                    PostId = createPost,
                    StartTime = input.StartTime,
                    EndTime = input.EndTime

                };
                CreateHomeWorkAsync(autoHomework);
            }
            return await GetAsync(getCreatePostId);
        }

        public override async Task<PostDto> UpdateAsync([FromForm] UpdatePostDto input)
        {
            CheckUpdatePermission();
            await CheckClassIsExists(input.ClassId);
            var existsPost = await Repository.GetAsync(input.Id) ?? throw new EntityNotFoundException("Not found Post");
            FileDto fileDto = input.fileDto;
            string fileKey;

            if (fileDto.file == null && fileDto.DriveUrl == null)
            {
                fileKey = existsPost.FileKey;
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

            var post = new Post
            {
                Id = input.Id,
                ClassId = input.ClassId,
                Title = input.Title,
                ContentPost = input.ContentPost,
                Type = existsPost.Type,
                FileKey = fileKey,
            };

            ObjectMapper.Map(input, post);
            await base.UpdateAsync(input);
            return await GetAsync(new EntityDto<long> { Id = input.Id });
        }

        protected override IQueryable<Post> CreateFilteredQuery(PagedPostResultRequestDto input)
        {
            var query = Repository.GetAllIncluding();

            if (input.FromUserId != 0)
            {
                query = query.Where(x => x.CreatorUserId == input.FromUserId);
            }

            if (!input.Keyword.IsNullOrWhiteSpace())
            {
                query = query.Where(x => x.Title.ToLower().Contains(input.Keyword.ToLower()) ||
                                        x.ContentPost.ToLower().Contains(input.Keyword.ToLower())
                                        && !x.IsDeleted);

            }
            else
            {
                query = query.Where(x => !x.IsDeleted);
            }
            return query;
        }

        // Sorting by User
        protected override IQueryable<Post> ApplySorting(IQueryable<Post> query, PagedPostResultRequestDto input)
        {
            return query.OrderBy(r => r.Title).ThenBy(r => r.ContentPost);
        }
    }
}
