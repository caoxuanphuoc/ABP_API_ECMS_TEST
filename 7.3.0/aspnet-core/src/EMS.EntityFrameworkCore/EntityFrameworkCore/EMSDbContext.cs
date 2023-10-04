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
using EMS.MultiTenancy;
using Microsoft.EntityFrameworkCore;

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
        public EMSDbContext(DbContextOptions<EMSDbContext> options)
            : base(options)
        {
        }
    }
}
