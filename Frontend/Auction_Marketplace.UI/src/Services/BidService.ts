import ApiService from './ApiService';
import ApiResponseDTO from '../Interfaces/DTOs/ApiResponseDTO';
import BidDTO from '../Interfaces/DTOs/BidDTO';

class BidService {
    private PLACE_BID_ENDPOINT = import.meta.env.VITE_PLACE_BID_ENDPOINT;
    private apiService: ApiService;

    constructor(apiService: ApiService) {
        this.apiService = apiService;
    }

    async placeBid(data: BidDTO): Promise<ApiResponseDTO> {
        const formData = new FormData();
        formData.append('auctionId', String(data.auctionId));
        formData.append('amount', String(data.amount));
        return this.apiService.post<ApiResponseDTO>(this.PLACE_BID_ENDPOINT, formData);
    }

}

export default BidService;