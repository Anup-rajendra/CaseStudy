using System;
using System.Collections.Generic;

namespace ReviewWishlistMicroService.Models;

public partial class ProductNotification
{
    public int Userid { get; set; }

    public int Productid { get; set; }

    public bool? Isread { get; set; }
}
