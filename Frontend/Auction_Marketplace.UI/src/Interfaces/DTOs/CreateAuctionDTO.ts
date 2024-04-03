interface CreateAuctionDTO {
    name: string;
    description: string;
    photo: File | null;
    isCompleted: boolean;
    startPrice : number;
    existingDays: number;
}

export default CreateAuctionDTO