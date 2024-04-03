using Auction_Marketplace.Services.Abstract;

namespace Auction_Marketplace.Services.Interface
{
	public interface IEmailService : IService
	{
		Task SendEmail(string subject, string toEmail, string username, string message);
	}
}

