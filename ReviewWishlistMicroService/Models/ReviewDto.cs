namespace ReviewWishlistMicroService.Models
{
    public class ReviewDto
    {
        public int ReviewId { get; set; }

        public int? Rating { get; set; }

        public string? Comment { get; set; }

        public DateOnly? ReviewDate { get; set; }

        public string Username { get; set; }
    }
}
