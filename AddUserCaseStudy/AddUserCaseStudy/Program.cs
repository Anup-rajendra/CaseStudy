using AddUserCaseStudy.Services;
using RepositoryLayer.Extensions;
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

builder.Services.MyServiceForRegistration(builder.Configuration.GetConnectionString("Constr"));
builder.Services.AddSingleton<SendEmailService>();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(options => options.AddPolicy("policy", builder =>
    builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader()
    ));
var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseDeveloperExceptionPage();
    app.UseDeveloperExceptionPage();
}
app.UseCors("policy");
app.UseAuthorization();

app.MapControllers();

app.Run();
