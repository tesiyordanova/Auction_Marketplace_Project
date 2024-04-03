using System;

namespace Auction_Marketplace.Data.Entities.Abstract
{
	public interface IBaseEntity
	{
        //created at
        //modified at
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public DateTime? DeletedOn { get; set; }
    }
	
}

