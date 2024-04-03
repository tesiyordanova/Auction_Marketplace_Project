using System;
using Auction_Marketplace.Data.Entities.Abstract;
using Microsoft.AspNetCore.Identity;

namespace Auction_Marketplace.Data.Entities
{
	public class UserClaim : IdentityUserClaim<int>, IBaseEntity
	{
        // Implementing IBaseEntity interface
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public DateTime? DeletedOn { get; set; }
    }
}

