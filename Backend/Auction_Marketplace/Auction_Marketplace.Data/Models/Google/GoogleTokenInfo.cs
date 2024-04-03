using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;

namespace Auction_Marketplace.Data.Models.Google
{
    public class GoogleTokenInfo
	{
        [Required]
        public bool Succeed { get; set; }

        public string? Message { get; set; }

        [JsonProperty("given_name")]
        public string? FirstName { get; set; }

        [JsonProperty("family_name")]
        public string? LastName { get; set; }

        [JsonProperty("picture")]
        public string? ProfilePicture { get; set; }

        [JsonProperty("email")]
        public string? Email { get; set; }
    }
}

