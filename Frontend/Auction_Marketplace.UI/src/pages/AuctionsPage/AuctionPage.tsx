import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { clearToken, getToken, isTokenExpired } from '../../utils/GoogleToken';
import '../../Components/TokenExp/TokenExpContainer.css';
import Navbar from '../../components/Navbar/Navbar';
import ApiResponseDTO from '../../Interfaces/DTOs/ApiResponseDTO';
import AuctionService from '../../Services/AuctionService';
import ApiService from '../../Services/ApiService';
import UpdateAuctionForm from '../../components/AuctionsForm/UpdateAuctionForm';
import UserDTO from '../../Interfaces/DTOs/UserDTO';
import UpdateAuctionDTO from '../../Interfaces/DTOs/UpdateAuctionDTO';
import UserService from '../../Services/UserService';

const apiService = new ApiService();
const auctionService = new AuctionService(apiService);
const userService = new UserService(apiService);

const AuctionPage: React.FC = () => {
    const token = getToken();
    const [auction, setAuction] = useState<UpdateAuctionDTO>(); 
    const [user, setUser] = useState<UserDTO>({
        firstName: '',
        lastName: '',
        email: '',
        userId: 0,
        profilePicture: undefined
    });

    const { auctionId } = useParams<{ auctionId: string }>();

    const fetchAuctionDetails = async () => {
        try {
            const response: ApiResponseDTO = await auctionService.getAuctionById(Number(auctionId));
            const auctionData = response.data;
            setAuction(auctionData);
        } catch (error) {
            console.error('Error fetching auction details:', error);
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
            fetchAuctionDetails();
        }
        if (isTokenExpired()) {
            clearToken();
        }
    }, [token, auctionId]);

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
            <div className="update-auction-container">
                <UpdateAuctionForm
                    onClose={close}
                    auctionId={Number(auctionId)}
                    initialAuctionData={auction || null}
                />
            </div>
        </div>
    );
};

export default AuctionPage;
