
import ApiResponseDTO from '../Interfaces/DTOs/ApiResponseDTO';
import ApiService from './ApiService';

class PaymentService {
  private GET_PAYMENT_BY_ID_ENDPOINT = import.meta.env.VITE_GET_PAYMENTS_BY_USER_ID_ENDPOINT;
  private apiService: ApiService;

  constructor(apiService: ApiService) {
    this.apiService = apiService;
  }

  async getPaymentByUserId(): Promise<ApiResponseDTO> {
    return this.apiService.get<ApiResponseDTO>(`${this.GET_PAYMENT_BY_ID_ENDPOINT}`);
  }
}

export default PaymentService;
