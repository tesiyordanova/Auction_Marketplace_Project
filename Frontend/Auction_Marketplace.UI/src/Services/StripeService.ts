import ApiService from './ApiService';


class StripeService {
    private CHECK_STRIPE_USER = import.meta.env.VITE_CHECK_STRIPE_USER;
    private apiService: ApiService;
  
    constructor(apiService: ApiService) {
      this.apiService = apiService;
    }

  async StripeUserExists(): Promise<boolean> {
    return this.apiService.post<boolean>(this.CHECK_STRIPE_USER, '');
  }
}

export default StripeService;
