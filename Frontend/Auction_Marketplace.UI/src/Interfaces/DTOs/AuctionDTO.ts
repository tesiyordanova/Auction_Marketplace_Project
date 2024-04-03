interface AuctionDTO {
    auctionId: number;
    userId: number;
    user: any;
    name: string;
    photo: string
    description: string;
    endDate: any;
    isCompleted: boolean;
    createdAt: string;
    updatedAt: string;
    deletedOn: string | null;
}

export default AuctionDTO;