import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { clearToken, getToken, isTokenExpired } from '../../utils/GoogleToken';
import { RefreshToken } from '../../utils/RefreshToken';
import '../../Components/TokenExp/TokenExpContainer.css';
import Navbar from '../../components/Navbar/Navbar';
import ApiResponseDTO from '../../Interfaces/DTOs/ApiResponseDTO';
import AuctionService from '../../Services/AuctionService';
import ApiService from '../../Services/ApiService';
import '../CausesPage/CausesPage.css';
import AuctionDTO from '../../Interfaces/DTOs/AuctionDTO';
import AddAuctionForm from '../../Components/AddAuctionForm/AddAuctionForm';
import DeleteAuctionForm from '../../Components/AuctionsForm/DeleteAuctionForm';
import UpdateAuctionForm from '../../Components/AuctionsForm/UpdateAuctionForm';
import UserService from '../../Services/UserService';
import UserDTO from '../../Interfaces/DTOs/UserDTO';
import AddStripeForm from '../../Components/AddStripeForm/AddStripeForm';
import StripeService from '../../Services/StripeService';

const apiService = new ApiService;
const auctionService = new AuctionService(apiService);
const userService = new UserService(apiService);

const AuctionsPage: React.FC = ({ }) => {
    const token = getToken();
    const navigate = useNavigate();
    const [showNewAuctionForm, setShowNewAuctionForm] = useState(false);
    const [showUpdateAuctionForm, setShowUpdateAuctionForm] = useState(false);
    const [showDeleteAuctionForm] = useState(false);
    const [showAddStrypeForm, setShowAddStrypeForm] = useState(false);
    const [auctions, setAuctions] = useState<AuctionDTO[]>([]);
    const [hideAuctionContainer, setHideAuctionContainer] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [selectedAuctionId, setSelectedAuctionId] = useState<number | null>(null);
    const auctionsPerPage = 6;
    const [user, setUser] = useState<UserDTO>({
        firstName: '',
        lastName: '',
        email: '',
        userId: 0,
        profilePicture: undefined
    });
    const [initialAuctionFormData, setInitialAuctionFormData] = useState<FormData>(new FormData());

    useEffect(() => {
        const saveTokenOnUnload = () => {
            const token = getToken();
            if (token) {
                localStorage.setItem('token', token);
            }
        };
        window.addEventListener('beforeunload', saveTokenOnUnload);
        return () => {
            window.removeEventListener('beforeunload', saveTokenOnUnload);
        };
    }, []);

    useEffect(() => {
        const persistedToken = localStorage.getItem('token');
        if (persistedToken) {
            sessionStorage.setItem('token', persistedToken);
            navigate('/auctions');
        }
    }, []);

    useEffect(() => {
        if (isTokenExpired()) {
            clearToken();
        }
    }, []);

    const fetchAuctions = async () => {
        try {
            const response: ApiResponseDTO = await auctionService.fetchAuctions();
            const fetchAuctions: AuctionDTO[] = response.data || [];
            setAuctions(fetchAuctions);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching auctions:', error);
            setLoading(false);
        }
    };

    const fetchUserProfile = async () => {
        try {
            if (token) {
                const response: ApiResponseDTO = await userService.fetchUser();
                const userData = response.data;
                if (response.succeed) {
                    setUser(userData);
                }
            }
        } catch (error) {
            console.error('Error during user profile fetch:', error);
        }
    };

    const handleUpdateAuctionClick = async (auctionId: number) => {
        try {
            const response: ApiResponseDTO = await auctionService.getAuctionById(auctionId);
            const auctionData = response.data;

            const auction = auctions.find((auction) => auction.auctionId === auctionId);
            if (auction && user.userId === auction.userId) {
                setSelectedAuctionId(auctionId);
                setInitialAuctionFormData(auctionData);
                navigate(`/auction/${auctionId}`);
            } else {
                console.warn('You are not the creator of this auction.');
            }
        } catch (error) {
            console.error('Error fetching auction details:', error);
        }
    };

    const handleDeleteAuction = async (auctionId: number) => {
        try {
            const response: ApiResponseDTO = await auctionService.deleteAuction(auctionId);
            const auctionData = response.data;
            location.reload();

            const auction = auctions.find((auction) => auction.auctionId === auctionId);
            if (auction && user.userId === auction.userId) {
                setSelectedAuctionId(auctionId);
                setInitialAuctionFormData(auctionData);
                navigate("/auctions");
            } else {
                console.warn('You are not the creator of this auction.');
            }
        } catch (error) {
            console.error('Error deleting auction details:', error);
        }
    };

    const handleCheckUserIdForAuction = (auction: AuctionDTO, userId: number): boolean => {
        return userId === auction.userId;
    };

    const handleCloseUpdateForm = () => {
        setShowUpdateAuctionForm(false);
    };

    useEffect(() => {
        if (token) {
            fetchUserProfile();
            fetchAuctions();
        }
        if (isTokenExpired()) {
            RefreshToken();
        }

    }, [token]);

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

    const handleAddAuctionClick = async () => {
        try {
            const apiService = new ApiService();
            const stripeService = new StripeService(apiService);
            const { hasStripeAccount } = await stripeService.StripeUserExists();
            setShowNewAuctionForm(true);

            if (hasStripeAccount) {
                setShowNewAuctionForm(true);
                 
            } else {
                setShowAddStrypeForm(true);
                setShowNewAuctionForm(false);
            }
            setHideAuctionContainer(true);
        } catch (error) {
            console.error('Error checking condition:', error);
        }
    };

    const handleCloseForm = () => {
        setShowNewAuctionForm(false)
        setShowAddStrypeForm(false);
        setHideAuctionContainer(false);
    };

    const indexOfLastAuction = currentPage * auctionsPerPage;
    const indexOfFirstAuction = indexOfLastAuction - auctionsPerPage;
    const currentAuction = auctions.slice(indexOfFirstAuction, indexOfLastAuction);

    const renderMiniPages = () => {
        if (!showNewAuctionForm && !showAddStrypeForm) {
            const pageNumbers = [];
            const totalPages = Math.ceil(auctions.length / auctionsPerPage);

            const maxPageButtons = 3;

            if (totalPages <= maxPageButtons) {
                for (let i = 1; i <= totalPages; i++) {
                    pageNumbers.push(i);
                }
            } else {
                let startPage;
                let endPage;

                if (currentPage <= Math.ceil(maxPageButtons / 2)) {
                    startPage = 1;
                    endPage = maxPageButtons;
                } else if (currentPage + Math.floor(maxPageButtons / 2) >= totalPages) {
                    startPage = totalPages - maxPageButtons + 1;
                    endPage = totalPages;
                } else {
                    startPage = currentPage - Math.floor(maxPageButtons / 2);
                    endPage = currentPage + Math.floor(maxPageButtons / 2);
                }

                if (startPage > 1) {
                    pageNumbers.push(1, '...');
                }

                for (let i = startPage; i <= endPage; i++) {
                    pageNumbers.push(i);
                }

                if (endPage < totalPages) {
                    pageNumbers.push('...', totalPages);
                }
            }

            return (
                <div className="pagination">
                    {pageNumbers.map((pageNumber, index) => (
                        <button
                            key={index}
                            className={pageNumber === currentPage ? 'active' : ''}
                            onClick={() => {
                                if (typeof pageNumber === 'number') {
                                    setCurrentPage(pageNumber);
                                }
                            }}
                        >
                            {pageNumber}
                        </button>
                    ))}
                </div>
            );
        } else {
            return null;
        }
    };
    
    return (
        <div>
            <Navbar showAuthButtons={false} />
            <div className="add-cause-container">
                {!showNewAuctionForm && (
                    <button className="add-cause-button" onClick={handleAddAuctionClick}>
                        Add Auction
                    </button>
                )}
            </div>
            {showNewAuctionForm && <AddAuctionForm onClose={handleCloseForm} />}
            {showAddStrypeForm && <AddStripeForm onClose={handleCloseForm} />}
            {!hideAuctionContainer && (
                <div className="cause-info-container">
                    {loading ? (
                        <p>Loading...</p>
                    ) : (
                        currentAuction.map((auction) => (
                            <div key={auction.auctionId} className="cause-info">
                                <h3 className='header-cause'>{auction.name}</h3>
                                <img src={auction.photo} alt={auction.name} />
                                <Link to={`/auctions/details/${auction.auctionId}`} className="details-button">
                                    Details
                                </Link>

                                {handleCheckUserIdForAuction(auction, user.userId) && (
                                    <React.Fragment key={auction.auctionId}>
                                        <button className='update-button' onClick={() =>
                                            handleUpdateAuctionClick(auction.auctionId)} >
                                            Update
                                        </button>
                                        {showUpdateAuctionForm && (
                                            <UpdateAuctionForm
                                                auctionId={selectedAuctionId || 0}
                                                initialAuctionData={initialAuctionFormData}
                                                onClose={handleCloseUpdateForm}
                                            />
                                        )}
                                    </React.Fragment>
                                )}

                                {handleCheckUserIdForAuction(auction, user.userId) && (
                                    <React.Fragment key={auction.auctionId}>
                                        <button className='delete-button' onClick={() =>
                                            handleDeleteAuction(auction.auctionId)} >
                                            Delete
                                        </button>
                                        {showDeleteAuctionForm && (
                                            <DeleteAuctionForm
                                                auctionId={selectedAuctionId || 0}
                                                initialAuctionData={initialAuctionFormData}
                                            />
                                        )}
                                    </React.Fragment>
                                )}
                            </div>
                        ))
                    )}
                </div>
            )}
            {renderMiniPages()}
        </div>
    );
};

export default AuctionsPage;