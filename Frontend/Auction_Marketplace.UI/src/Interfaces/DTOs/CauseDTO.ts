interface CauseDTO {
  causeId: number;
  userId: number;
  user: any; 
  name: string;
  description: string;
  photo: string;
  amountNeeded: number;
  amountCurrent: number;
  isCompleted: boolean;
  donations: any[]; 
  createdAt: string;
  updatedAt: string;
  deletedOn: string | null;
}

export default CauseDTO;