namespace ReviewWishlistMicroService.Models
{
    public class ReviewProductUserDTO
    {
        public int ReviewId { get; set; }

        public int? ProductId { get; set; }

        public int? UserId { get; set; }

        public int? Rating { get; set; }

        public string? Comment { get; set; }

        public DateOnly? ReviewDate { get; set; }
    }
}
