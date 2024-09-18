using System;
using System.Collections.Generic;

namespace RepositoryLayer.Models;

public partial class WishlistItem
{
    public int WishlistitemId { get; set; }

    public int? WishlistId { get; set; }

    public int? ProductId { get; set; }

    public virtual Product? Product { get; set; }

    public virtual Wishlist? Wishlist { get; set; }
}
