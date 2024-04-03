using Amazon.S3;
using Amazon.S3.Model;
using Amazon.S3.Transfer;
using Auction_Marketplace.Services.Interface;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using System;
using System.IO;
using System.Net;
using System.Threading.Tasks;

namespace Auction_Marketplace.Services.Implementation
{
    public class S3Service : IS3Service
    {
        private readonly IAmazonS3 _s3Client;
        private readonly IConfiguration _configuration;

        public S3Service(IConfiguration configuration, IAmazonS3 s3Client)
        {
            _s3Client = s3Client;
            _configuration = configuration;
        }

        public async Task<string> GetPreSignedUrlAsync(string bucketName, string key, int expirationDays)
        {
            var expiryUrlRequest = new GetPreSignedUrlRequest
            {
                BucketName = bucketName,
                Key = key,
                Expires = DateTime.UtcNow.AddDays(expirationDays)
            };

            var url = _s3Client.GetPreSignedURL(expiryUrlRequest);
            return url;
        }

        public async Task<string> UploadFileAsync(IFormFile file, string path, string fileName)
        {
            string bucketName = _configuration["AWS:BUCKET_NAME"];
            string key = $"{path}/{fileName}";

            var uploadRequest = new TransferUtilityUploadRequest
            {
                InputStream = file.OpenReadStream(),
                Key = key,
                BucketName = bucketName,
                CannedACL = S3CannedACL.NoACL,
                ContentType = file.ContentType
            };

            using (var fileTrasferUtility = new TransferUtility(_s3Client))
            {
                await fileTrasferUtility.UploadAsync(uploadRequest);
            }

            // Check if the pre-signed URL has expired
            var expiryUrlRequest = new GetPreSignedUrlRequest
            {
                BucketName = bucketName,
                Key = key,
                Expires = DateTime.UtcNow.AddDays(7)
            };

            var url = _s3Client.GetPreSignedURL(expiryUrlRequest);
            return url;
        }

        public async Task<byte[]> DownloadFileAsync(string file)
        {
            MemoryStream ms = null;

            try
            {
                var getObjectRequest = new Amazon.S3.Model.GetObjectRequest
                {
                    BucketName = _configuration["AWS:BUCKET_NAME"],
                    Key = file
                };

                using (var response = await _s3Client.GetObjectAsync(getObjectRequest))
                {
                    if (response.HttpStatusCode == HttpStatusCode.OK)
                    {
                        using (ms = new MemoryStream())
                        {
                            await response.ResponseStream.CopyToAsync(ms);
                        }
                    }
                }

                if (ms is null || ms.ToArray().Length < 1)
                    throw new FileNotFoundException($"The document '{file}' is not found");

                return ms.ToArray();
            }
            catch (Exception e)
            {
                throw new Exception($"Error downloading file '{file}' from S3: {e.Message}", e);
            }
        }
    }
}
