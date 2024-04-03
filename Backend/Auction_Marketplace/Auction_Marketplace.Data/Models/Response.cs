namespace Auction_Marketplace.Data.Models
{
	public class Response<T>
	{
        public bool Succeed { get; set; }

        public string? Message { get; set; }

        public T? Data { get; set; }
    }
}

