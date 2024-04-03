import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { clearToken, getToken, isTokenExpired } from '../../utils/GoogleToken.ts';
import CauseService from '../../Services/CauseService';
import ApiService from '../../Services/ApiService';
import CauseDTO from '../../Interfaces/DTOs/CauseDTO';
import './CauseDetailsPage.css';
import DonationForm from '../../Components/DonationForm/DonationForm.tsx';
import Navbar from '../../components/Navbar/Navbar.tsx';
import PaymentCauseForm from '../../Components/PaymentCauseForm/PaymentCauseForm.tsx';
import UserDTO from '../../Interfaces/DTOs/UserDTO.ts';
import UserService from '../../Services/UserService.ts';
import ApiResponseDTO from '../../Interfaces/DTOs/ApiResponseDTO.ts';

declare const navigate: (to: string) => void;

const CauseDetailsPage: React.FC = () => {
  const { causeId } = useParams<{ causeId: string | undefined }>();
  const [cause, setCause] = useState<CauseDTO | null>(null);
  const [isCreator, setIsCreator] = useState(false);
  const [showDonationForm, setShowDonationForm] = useState(false);
  const [showPaymentsForm, setShowPaymentsForm] = useState(false);
  const [fetchedCause, setFetchedCause] = useState<CauseDTO | null>(null);
  const id = Number(causeId);
  const apiService = new ApiService();
  const causeService = new CauseService(apiService);
  const userService = new UserService(apiService);
  const token = getToken();
  const [user, setUser] = useState<UserDTO>({
    firstName: '',
    lastName: '',
    email: '',
    userId: 0,
  });

  const fetchUserProfile = async () => {
    try {
      if (token) {
        const response: ApiResponseDTO = await userService.fetchUser();
        const userData = response.data;
        if (response.succeed) {
          setUser(userData);
          user.userId = userData.userId
        }
      }
    } catch (error) {
      console.error('Error during user profile fetch:', error);
    }
  };

  const fetchData = async () => {
    try {
      const causeResponse = await causeService.getCauseById(id);
      const fetchedCause: CauseDTO = causeResponse.data;
      setCause(fetchedCause);
      setFetchedCause(fetchedCause);
      if (fetchedCause.userId == user.userId) {
        setIsCreator(true);
      }
    } catch (error) {
      console.error('Error fetching cause details:', error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchUserProfile();
      fetchData();
    }
    if (isTokenExpired()) {
      clearToken();
    }
  }, [causeId, token]);

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

  if (!cause) {
    return <p>Loading...</p>;
  }

  function getLineColor(amountCurrent: number, amountNeeded: number): string {
    const progressRatio = amountCurrent / amountNeeded;

    if (progressRatio <= 0.5) {
      return 'short-line red-line';
    } else if (progressRatio <= 0.8) {
      return 'half-line yellow-line';
    } else {
      return 'full-line green-line';
    }
  }

  const handleDonateClick = () => {
     if (fetchedCause && fetchedCause.isCompleted) {
        setShowDonationForm(false); 
        return; 
      }
    setShowDonationForm(true);
  };

  const handlePaymentClick = () => {
    setShowDonationForm(false);
    setShowPaymentsForm(true);
  };

  const handleDonationFormClose = () => {
    setShowDonationForm(false);
    setShowPaymentsForm(false);
  };

  const handlePaymentFormClose = () => {
    setShowPaymentsForm(false);
    setShowDonationForm(false);
  }

  return (
    <>
      <Navbar showAuthButtons={false} />
      {!showDonationForm && !showPaymentsForm && (
        <div className="cause-details-container">
          <>
            <h2 className='head'>{cause.name}</h2>
            <p className='description-cause'>{cause.description}</p>
            <img src={cause.photo} alt={cause.name} className="cause-details-image" />
            <div className="amount-details">
              <div className="amount-line">
                <div className="line full-line"></div>
                <span className="money-amount">BGN {cause.amountNeeded}</span>
              </div>
              <div className="amount-line">
                <div className={`line ${getLineColor(cause.amountCurrent, cause.amountNeeded)}`}></div>
                <span className="money-amount">BGN {cause.amountCurrent}</span>
              </div>
            </div>
            <div className='buttons-cause-details'>
              {!fetchedCause?.isCompleted && (
                <button className="donate-button" onClick={handleDonateClick}>Donate</button>
              )}

              <Link to={`/causes`} className="back-causes-button">
                Back to Causes
              </Link>
              {isCreator && <button className="payments-button" onClick={handlePaymentClick}>Payments</button>}
            </div>
          </>
        </div>
      )}
      {showDonationForm && <DonationForm causeId={id} onClose={handleDonationFormClose} />}
      {showPaymentsForm && <PaymentCauseForm causeId={id} onClose={handlePaymentFormClose} />}
    </>
  );
};

export default CauseDetailsPage;
