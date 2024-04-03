using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Auction_Marketplace.Data.Entities.Abstract;

namespace Auction_Marketplace.Data.Entities
{
    public class Cause : IBaseEntity
    {
        [Key]
        public int CauseId { get; set; }

        [ForeignKey("User")]
        public int UserId { get; set; }
        public User User { get; set; }

        [Required]
        public string Name { get; set; }

        public string Description { get; set; }

        public string Photo { get; set; }

        [Required]
        [Column(TypeName = "decimal(18, 2)")]
        public decimal AmountNeeded { get; set; }

 
        [Column(TypeName = "decimal(18, 2)")]
        public decimal AmountCurrent { get; set; }

        [Required]
        [DefaultValue(false)]
        public bool IsCompleted { get; set; }

        public ICollection<Payment> Donations { get; set; } = new List<Payment>();

        // Implementing IBaseEntity interface
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public DateTime? DeletedOn { get; set; }
    }
}

