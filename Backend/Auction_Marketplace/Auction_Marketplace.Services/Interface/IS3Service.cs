using Auction_Marketplace.Services.Abstract;
using Microsoft.AspNetCore.Http;

namespace Auction_Marketplace.Services.Interface
{
	public interface IS3Service : IService
	{
		 Task<string> UploadFileAsync(IFormFile file, string path, string fileName);
		 Task<byte[]> DownloadFileAsync(string file);

    }
}

