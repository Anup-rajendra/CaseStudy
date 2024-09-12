using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using RepositoryLayer.Repo;
using RepositoryLayer.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace RepositoryLayer.Extensions
{
    public static class ServiceExtension
    {
        public static IServiceCollection MyServiceForRegistration(this IServiceCollection services, string connectionString)
        {
            // Register DbContext with SQL Server
            services.AddDbContext<RetailApplicationContext>(options =>
                options.UseSqlServer(connectionString));

            // Register the generic RepositoryLayer
            services.AddScoped(typeof(IRetailApplication<>), typeof(IRetailImplementation<>));
            
            return services;
        }
    }
}
