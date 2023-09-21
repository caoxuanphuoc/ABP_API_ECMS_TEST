using System.Data.Common;
using Microsoft.EntityFrameworkCore;

namespace EMS.EntityFrameworkCore
{
    public static class EMSDbContextConfigurer
    {
        public static void Configure(DbContextOptionsBuilder<EMSDbContext> builder, string connectionString)
        {
            builder.UseSqlServer(connectionString);
        }

        public static void Configure(DbContextOptionsBuilder<EMSDbContext> builder, DbConnection connection)
        {
            builder.UseSqlServer(connection);
        }
    }
}
