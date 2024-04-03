import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar.tsx';
import { clearToken, getToken, isTokenExpired } from '../../utils/GoogleToken.ts';
import '../../Components/TokenExp/TokenExpContainer.css';
import './HeartPage.css';
import clickImage from '../../assets/3click.jpeg';


import ApiService from '../../Services/ApiService';
import AuctionService from '../../Services/AuctionService';

const apiService = new ApiService();
const auctionService = new AuctionService(apiService);

const HeartPage: React.FC = () => {
  const [biddedAuctions, setBiddedAuctions] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const auctionsPerPage = 6;
  const token = getToken();
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchBiddedAuctions = async () => {
      setLoading(true); 
      try {
        const response = await auctionService.getAuctionsBidded();
        setBiddedAuctions(response.data);
      } catch (error) {
        console.error('Error fetching bidded auctions:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBiddedAuctions();
  }, [currentPage]);

  useEffect(() => {
    const saveTokenOnUnload = () => {
      if (token) {
        localStorage.setItem('token', token);
      }
    };
    window.addEventListener('beforeunload', saveTokenOnUnload);
    return () => {
      window.removeEventListener('beforeunload', saveTokenOnUnload);
    };
  }, [token]);

  useEffect(() => {
    if (isTokenExpired()) {
      clearToken();
    }
  }, []);

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

  if (loading) {
    return (
      <div>
        <Navbar showAuthButtons={false} />
        <p className='loading'>Loading...</p>
      </div>
    );
  }

  const navigateToAuctions = () => {
        window.location.href = 'http://localhost:5173/auctions';
    };

  if (biddedAuctions.length === 0) {
    return (
      <div>
        <Navbar showAuthButtons={false} />
        <div className='no-auctions-message'>
           <img src={clickImage} alt="Hand clicking heart" className="click-image"/>
          <h2>No auctions found</h2>
          <p>You haven't bid on any auctions yet.</p>
           <button className="button" onClick={navigateToAuctions}>Browse Auctions</button>
        </div>
      </div>
    );
  }
  
  const indexOfLastAuction = currentPage * auctionsPerPage;
  const indexOfFirstAuction = indexOfLastAuction - auctionsPerPage;
  const currentAuctions = biddedAuctions.slice(indexOfFirstAuction, indexOfLastAuction);

  const renderMiniPages = () => {
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(biddedAuctions.length / auctionsPerPage); i++) {
      pageNumbers.push(i);
    }

    return (
      <div className='pagination'>
        {pageNumbers.map((number) => (
          <button
            key={number}
            className={number === currentPage ? 'active' : ''}
            onClick={() => setCurrentPage(number)}
          >
            {number}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div>
      <Navbar showAuthButtons={false} />
      <div className='title-container'>
        <p className='title'>ITEMS YOU BIDDED FOR: </p>
      </div>
      <div className='auctions-container'>
        {currentAuctions.map((auction) => (
          <Link key={auction.id} to={`/auctions/details/${auction.auctionId}`} className='auction-info'>
            <img src={auction.photo} alt={auction.name} className='auction-image' />
          </Link>
        ))}
      </div>
      {renderMiniPages()}
    </div>
  );
};

export default HeartPage;