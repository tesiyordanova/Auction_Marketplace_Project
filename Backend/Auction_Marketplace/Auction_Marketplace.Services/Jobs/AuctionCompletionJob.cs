using Microsoft.Extensions.DependencyInjection;
using System.Threading.Tasks;
using Auction_Marketplace.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Quartz;
using Auction_Marketplace.Services.Interface;

namespace Auction_Marketplace.Services.Jobs
{
    [DisallowConcurrentExecution]
    public class AuctionCompletionJob : IJob
    {
        private readonly ILogger<AuctionCompletionJob> _logger;
        private readonly IServiceProvider _serviceProvider;

        public AuctionCompletionJob(ILogger<AuctionCompletionJob> logger, IServiceProvider serviceProvider)
        {
            _logger = logger;
            _serviceProvider = serviceProvider;
        }

        public async Task Execute(IJobExecutionContext context)
        {
            _logger.LogInformation("{Now}", DateTime.Now);

            using (var scope = _serviceProvider.CreateScope())
            {
                var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

                var auctionsToComplete = await dbContext.Auctions
                        .Where(a => !a.IsCompleted)
                        .ToListAsync();

                foreach (var auction in auctionsToComplete)
                {
                    if (auction.EndDate < DateTime.Now)
                    {
                        var mAuctionService = scope.ServiceProvider.GetRequiredService<IAuctionsService>();
                        var emailResponse = await mAuctionService.SendEmailToWinner(auction.AuctionId);
                        if (!emailResponse.Succeed)
                        {
                            _logger.LogError($"Failed to send email to winner of auction {auction.AuctionId}: {emailResponse.Message}");
                            continue;
                        }

                        auction.IsCompleted = true;
                    }

                }

                await dbContext.SaveChangesAsync();
            }
        }
    }
}
