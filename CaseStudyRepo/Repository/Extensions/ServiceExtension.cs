using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Repository.Models;
using Repository.Repo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using YourNamespace.Repositories;

namespace Repository.Extensions
{
    public static class ServiceExtension
    {
        public static IServiceCollection MyServiceForRegistration(this IServiceCollection services, string connectionString)
        {
            // Register DbContext with SQL Server
            services.AddDbContext<RetailApplicationContext>(options =>
                options.UseSqlServer(connectionString));

            // Register the generic repository
            services.AddScoped(typeof(IRetailApplication<>), typeof(IRetailImplementation<>));

            return services;
        }
    }
}
