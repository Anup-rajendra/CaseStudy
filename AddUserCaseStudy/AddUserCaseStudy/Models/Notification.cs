﻿using System;
using System.Collections.Generic;

namespace AddUserCaseStudy.Models;

public partial class Notification
{
    public int NotificationId { get; set; }

    public int? UserId { get; set; }

    public string? Message { get; set; }

    public virtual User? User { get; set; }
}
