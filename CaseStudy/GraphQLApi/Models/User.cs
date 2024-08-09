using System;
using System.Collections.Generic;

namespace GraphQLApi.Models;

public partial class User
{
    public int UserId { get; set; }

    public string Username { get; set; } = null!;

    public string? Firstname { get; set; }

    public string? Lastname { get; set; }

    public string Email { get; set; } = null!;

    public string? Token { get; set; }

    public bool EmailVerified { get; set; }

    public string Upassword { get; set; } = null!;

    public string? Urole { get; set; }

    public DateTime? TokenExpiry { get; set; }

    public string? PhoneNumber { get; set; }

    public string? ProfilePicture { get; set; }

    public virtual ICollection<Address> Addresses { get; set; } = new List<Address>();

    public virtual ICollection<Cart> Carts { get; set; } = new List<Cart>();

    public virtual ICollection<Notification> Notifications { get; set; } = new List<Notification>();

    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();

    public virtual ICollection<Review> Reviews { get; set; } = new List<Review>();

    public virtual Wishlist? Wishlist { get; set; }
}
