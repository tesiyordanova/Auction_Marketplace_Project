using System;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Auction_Marketplace.Data.Enums;
using Auction_Marketplace.Data.Entities.Abstract;

namespace Auction_Marketplace.Data.Entities
{
	public class Review : IBaseEntity
	{
        [Key]
        public int ReviewId { get; set; }

        [ForeignKey("Cause")]
        public int CauseId { get; set; }
        public Cause Cause { get; set; }

        [ForeignKey("User")]
        public int UserId { get; set; }
        public User User { get; set; }

        [StringLength(1000)]
        public string Comment { get; set; }

        [Required]
        public RatingStar Rating { get; set; }

        [Required]
        [DefaultValue(false)]
        public bool IsDeleted { get; set; }

        // Implementing IBaseEntity interface
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public DateTime? DeletedOn { get; set; }
    }
}

