using Auction_Marketplace.Data.Entities;
using Auction_Marketplace.Data.Models.Payment;
using Auction_Marketplace.Services.Abstract;
namespace Auction_Marketplace.Services.Interface
{
    public interface IPaymentService: IService
    {
        void CreatePayment(CreatePaymentViewModel model);

        Task<IList<Payment>> GetPaymentsAsync(int userId);

    }
}

