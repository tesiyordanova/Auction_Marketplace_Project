using Auction_Marketplace.Data.Entities;
using Auction_Marketplace.Data.Models.Payment;
using Auction_Marketplace.Services.Implementation;
using Auction_Marketplace.Services.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Auction_Marketplace.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentController : ControllerBase
    {
        private readonly IPaymentService _paymentService;
        private readonly IUserService _userService;

        public PaymentController(IPaymentService paymentService, IUserService userService)
        {
            _paymentService = paymentService;
            _userService = userService;
        }

        [HttpGet]
        [Authorize]
        public async Task<ActionResult<IEnumerable<Payment>>> GetPayments([FromRoute] int id)
        {
            var user = await _userService.GetUser();

            var payments = await _paymentService.GetPaymentsAsync(user.Data.UserId);
            return Ok(payments);
        }
        
    }
}

