using Abp.Zero.EntityFrameworkCore;
using EMS.Authorization.Classes;
using EMS.Authorization.Courses;
using EMS.Authorization.Roles;
using EMS.Authorization.Rooms;
using EMS.Authorization.Schedules;
using EMS.Authorization.Teachers;
using EMS.Authorization.TrackingClasses;
using EMS.Authorization.TuitionFees;
using EMS.Authorization.UserClasses;
using EMS.Authorization.Users;
using EMS.Homeworks;
using EMS.MultiTenancy;
using EMS.Social.Comments;
using EMS.Social.Posts;
using Microsoft.EntityFrameworkCore;
using System;

namespace EMS.EntityFrameworkCore
{
    public class EMSDbContext : AbpZeroDbContext<Tenant, Role, User, EMSDbContext>
    {
        /* Define a DbSet for each entity of the application */
        public DbSet<UserClass> UserClasses { get; set; }
        public DbSet<TuitionFee> TuitionFees { get; set; }
        public DbSet<TrackingClass> TrackingClasses { get; set; }
        public DbSet<Class> Classes { get; set; }
        public DbSet<Schedule> Schedules { get; set; }
        public DbSet<Course> Courses { get; set; }
        public DbSet<Teacher> Teachers { get; set; }
        public DbSet<Room> Rooms { get; set; }
        public DbSet<Post> Posts { get; set; }
        public DbSet<Homework> Homeworks { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<SubmitHomeWork> SubmitHomeWorks { get; set; }

        public EMSDbContext(DbContextOptions<EMSDbContext> options)
            : base(options)
        {
        }
     /*   protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Post>()
                .HasOne(p => p.Homework)
                .WithOne()
                .HasForeignKey<Homework>(p => p.PostId);
        }*/
    }
}
