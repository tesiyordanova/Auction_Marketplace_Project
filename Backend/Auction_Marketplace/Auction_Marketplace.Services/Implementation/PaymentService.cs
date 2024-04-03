using System;
using System.Security.Claims;
using Auction_Marketplace.Data.Entities;
using Auction_Marketplace.Data.Models.Donation;
using Auction_Marketplace.Data.Models.Payment;
using Auction_Marketplace.Data.Repositories.Interfaces;
using Auction_Marketplace.Services.Interface;

namespace Auction_Marketplace.Services.Implementation
{
    public class PaymentService : IPaymentService
    {
        private readonly ICauseRepository _causeRepository;
        private readonly IPaymentRepository _paymentRepository;

        public PaymentService(ICauseRepository causeRepository,
                            IPaymentRepository paymentRepository)
        {
            _causeRepository = causeRepository;
            _paymentRepository = paymentRepository;
        }



        public void CreatePayment(CreatePaymentViewModel model)
        {

            try
            {
                var payment = new Payment()
                {
                    Amount = model.Amount / 100,
                    IsCompleted = model.IsCompleted,
                    StripePaymentId = model.PaymentId,
                    EndUserId = model.EndUser,
                    UserId = model.StartUser
                };

                var cause = _causeRepository.FindCauseByUserId(model.EndUser);
                var causeId = cause.Result.CauseId;

                payment.CauseId = causeId;

                _paymentRepository.AddPayment(payment);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<IList<Payment>> GetPaymentsAsync(int userId)
        {
            return await _paymentRepository.GetPaymentsByUserId(userId);
        }
    }
}

