using System;
using Auction_Marketplace.Data.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Auction_Marketplace.Data.Configuration
{
	public class RoleConfig : IEntityTypeConfiguration<Role>
	{
        public void Configure(EntityTypeBuilder<Role> builder)
		{
			builder.ToTable("Roles");
		}
	}
}

