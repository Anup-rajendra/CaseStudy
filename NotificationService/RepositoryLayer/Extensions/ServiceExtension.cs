using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

using RepositoryLayer.Models;
using RepositoryLayer.Repo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;



namespace RepositoryLayer.Extensions
{
    public static class ServiceExtension
    {
        public static IServiceCollection MyServiceForRegistration(this IServiceCollection services, string connectionString)
        {
            // Register DbContext with SQL Server
            services.AddDbContext<RetailApplicationContext>(options =>
                options.UseSqlServer(connectionString));
            
            services.AddScoped(typeof(INotification), typeof(INotificationImplementation));

            return services;
        }
    }
}
