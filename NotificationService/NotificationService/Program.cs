using NotificationService.Services;
using RepositoryLayer.Extensions;
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle

builder.Services.MyServiceForRegistration(builder.Configuration.GetConnectionString("Constr"));
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSingleton<SendEmailService>();
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
}
app.UseCors("policy");
app.UseAuthorization();

app.MapControllers();

app.Run();
