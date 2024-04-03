import ApiResponseDTO from '../Interfaces/DTOs/ApiResponseDTO';
import GoogleLoginDTO from '../Interfaces/DTOs/GoogleLoginDTO';
import LoginDTO from '../Interfaces/DTOs/LoginDTO';
import RegisterDTO from '../Interfaces/DTOs/RegisterDTO';
import UserDTO from '../Interfaces/DTOs/UserDTO';
import ApiService from './ApiService';


async function getDefaultProfilePicture(): Promise<File> {
  try {
    const response = await fetch('https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png');
    const blob = await response.blob();
    const file = new File([blob], 'default.jpg', { type: blob.type });
    return file;
  } catch (error) {
    console.error('Error fetching default profile picture:', error);
    throw error;
  }
}

class UserService {
  private REGISTER_ENDPOINT = import.meta.env.VITE_REGISTER_ENDPOINT;
  private LOGIN_ENDPOINT = import.meta.env.VITE_LOGIN_ENDPOINT;
  private GOOGLE_LOGIN_ENDPOINT = import.meta.env.VITE_GOOGLE_LOGIN_ENDPOINT;
  private LOGOUT_ENDPOINT = import.meta.env.VITE_LOGOUT_ENDPOINT;
  private GET_USER_ENDPOINT = import.meta.env.VITE_GET_USER_ENDPOINT;
  private GET_USER_BY_EMAIL = import.meta.env.VITE_GET_USER_BY_EMAIL_ENDPOINT;
  private UPDATE_USER_ENDPOINT = import.meta.env.VITE_UPDATE_USER_ENDPOINT;

  private apiService: ApiService;

  constructor(apiService: ApiService) {
    this.apiService = apiService;
  }

  async registerUser(data: RegisterDTO) : Promise<ApiResponseDTO> {
    const formData = new FormData();
    formData.append('firstName', data.firstName);
    formData.append('lastName', data.lastName);
    formData.append('email', data.email);
    formData.append('password', data.password);
    if (!data.profilePicture) {
      const defaultProfilePicture = await getDefaultProfilePicture();
      formData.append('profilePicture', defaultProfilePicture, 'default.jpg');
    } else {
      formData.append('profilePicture', data.profilePicture);
    }

    return this.apiService.post<ApiResponseDTO>(this.REGISTER_ENDPOINT, formData);
  }

  async loginUser(data: LoginDTO): Promise<ApiResponseDTO> {
    return this.apiService.post<ApiResponseDTO>(this.LOGIN_ENDPOINT, data);
  }

  async loginUserWithGoogle(data: GoogleLoginDTO): Promise<ApiResponseDTO> {
    return this.apiService.post<ApiResponseDTO>(this.GOOGLE_LOGIN_ENDPOINT, data);
  }

  async logout(): Promise<ApiResponseDTO> {
    return this.apiService.get<ApiResponseDTO>(this.LOGOUT_ENDPOINT);
  }

  async fetchUser(): Promise<ApiResponseDTO> {
    return this.apiService.get<ApiResponseDTO>(this.GET_USER_ENDPOINT);
  }

  async updateUser(data: UserDTO) : Promise<ApiResponseDTO> {
    const formData = new FormData();
    formData.append('userId', String(data.userId))
    formData.append('firstName', data.firstName);
    formData.append('lastName', data.lastName);
    formData.append('email', data.email);
    if (data.profilePicture) {
      formData.append('profilePicture', data.profilePicture);
    }

    return this.apiService.put<ApiResponseDTO>(this.UPDATE_USER_ENDPOINT, formData);
  }

  async getUserByEmail(email: string): Promise<ApiResponseDTO> {
    return this.apiService.get<ApiResponseDTO>(`${this.GET_USER_BY_EMAIL}${email}`);
  }

}

export default UserService;