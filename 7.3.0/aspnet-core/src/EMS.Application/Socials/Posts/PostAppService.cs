using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Domain.Entities;
using Abp.Domain.Repositories;
using EMS.Authorization.Schedules;
using EMS.Homeworks;
using EMS.Homeworks.HomeworkApp.Dtos;
using EMS.Schedules.Dto;
using EMS.Social.Posts;
using EMS.Socials.Posts.Dto;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EMS.Socials.Posts
{
    public class PostAppService : AsyncCrudAppService<Post, PostDto, long, PagedPostResultRequestDto, CreatePostDto, UpdatePostDto>, IPostAppService
    {
        private readonly IRepository<Homework, long> _homeworkRepository;
        public PostAppService(IRepository<Post, long> repository,
                IRepository<Homework, long> homeworkRepository
            ) : base(repository)
        {
            _homeworkRepository = homeworkRepository;
        }

        protected async void CreateHomeWorkAsync( CreateHomeworkDto input)
        {
            var homework = ObjectMapper.Map<Homework>(input);
            var createHomework = await _homeworkRepository.InsertAndGetIdAsync(homework);
        }
        public override async Task<PostDto> CreateAsync(CreatePostDto input)
        {
           
                CheckCreatePermission();
                //await CheckClassAndRoomIsExists(input.ClassId, input.RoomId);
                var post = ObjectMapper.Map<Post>(input);
                var createPost = await Repository.InsertAndGetIdAsync(post);
                var getCreatePostId = new EntityDto<long> { Id = createPost };
                if (input.Type == 0)
                {
                
                    if(input.StartTime == DateTime.MinValue || input.EndTime == DateTime.MinValue)
                {
                        throw new EntityNotFoundException("Not found Start time and End time for Homework");
                    }
                    else { 
                        CreateHomeworkDto autoHomework = new CreateHomeworkDto
                        {
                            PostId = createPost,
                            StartTime = input.StartTime,
                            EndTime = input.EndTime

                        };
                        CreateHomeWorkAsync(autoHomework);
                    }
                }
                return await GetAsync(getCreatePostId);
            
        }
    }
}
