import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { clearToken, getToken, isTokenExpired } from '../../utils/GoogleToken';
import '../../Components/TokenExp/TokenExpContainer.css';
import ApiResponseDTO from '../../Interfaces/DTOs/ApiResponseDTO';
import ApiService from '../../Services/ApiService';
import UserDTO from '../../Interfaces/DTOs/UserDTO';
import UserService from '../../Services/UserService';
import CauseService from '../../Services/CauseService';
import UpdateCauseDTO from '../../Interfaces/DTOs/UpdateCauseDTP';
import Navbar from '../../components/Navbar/Navbar';
import UpdateCauseForm from '../../Components/CausesForm/UpdateCauseForm';

const apiService = new ApiService();
const causeService = new CauseService(apiService);
const userService = new UserService(apiService);

const CausePage: React.FC = () => {
    const token = getToken();
    const [cause, setCause] = useState<UpdateCauseDTO>(); 
    const [user, setUser] = useState<UserDTO>({
        firstName: '',
        lastName: '',
        email: '',
        userId: 0,
        profilePicture: undefined
    });
    const { causeId } = useParams<{ causeId: string }>();  
    const fetchCauseDetails = async () => {
        try {
            const response: ApiResponseDTO = await causeService.getCauseById(Number(causeId));
            const causeData = response.data;
            setCause(causeData);
        } catch (error) {
            console.error('Error fetching cause details:', error);
        }
    };

    const fetchUserProfile = async () => {
        try {
            if (token) {
                const userResponse: ApiResponseDTO = await userService.fetchUser();
                const userData = userResponse.data;
                if (userResponse.succeed) {
                    setUser(userData);
                }
            }
        } catch (error) {
            console.error('Error during user profile fetch:', error);
        }
    };

    useEffect(() => {
        if (token) {
            fetchUserProfile();
            fetchCauseDetails();
        }
        if (isTokenExpired()) {
            clearToken();
        }
    }, [token, causeId]);

    if (!token) {
        return (
            <div className='token-exp-container'>
                <div className='token-exp-content'>
                    <p>Please log in to access this page.</p>
                    <Link to="/login">Login</Link>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Navbar showAuthButtons={false} />
            <form className="update-auction-container">
                <UpdateCauseForm
                    onClose={close}
                    causeId={Number(causeId)}
                    initialCauseData={cause || null}
                />
            </form>
        </div>
    );
};

export default CausePage;
