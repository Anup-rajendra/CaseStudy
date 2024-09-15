using System;
using System.Collections.Generic;

namespace OrderProcessing.Models;

public partial class Admin
{
    public string Username { get; set; } = null!;

    public string? Password { get; set; }
}
