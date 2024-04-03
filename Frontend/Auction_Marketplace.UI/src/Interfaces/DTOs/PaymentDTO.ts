interface PaymentDTO {
    paymentId: number;
    userId: number;
    user: any; 
    endUserId: number;
    endUser: any;
    causeId: number;
    cause: any;
    auctionId: number;
    auction: any;
    amount: number;
    stripePaymentId: string;
    isCompleted: boolean;
    createdAt: string;
    updatedAt: string;
    deletedOn: string | null;
  }

export default PaymentDTO;