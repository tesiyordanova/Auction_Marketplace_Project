using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Auction_Marketplace.Data.Entities.Abstract;

namespace Auction_Marketplace.Data.Entities
{
	public class Auction : IBaseEntity
	{
        [Key]
        public int AuctionId { get; set; }

        [ForeignKey("User")]
        public int UserId { get; set; }
        public User User { get; set; }

        [Required]
        [StringLength(255)]
        public string Name { get; set; }

        [StringLength(1000)]
        public string Description { get; set; }

        public string Photo { get; set; }

        [Required]
        [Column(TypeName = "decimal(18, 2)")]
        public decimal StartPrice { get; set; }

        [Column(TypeName = "decimal(18, 2)")]
        public decimal FinalPrice { get; set; }

        [Required]
        public DateTime EndDate { get; set; }

        [Required]
        [DefaultValue(false)]
        public bool IsCompleted { get; set; }

        // Implementing IBaseEntity interface
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public DateTime? DeletedOn { get; set; }
    }
}

