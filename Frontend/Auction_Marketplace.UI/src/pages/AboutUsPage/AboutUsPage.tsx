import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar.tsx';
import { clearToken, getToken, isTokenExpired } from '../../utils/GoogleToken.ts';
import '../../Components/TokenExp/TokenExpContainer.css';
import './AboutUsPage.css';

const AboutUsPage: React.FC = () => {
  const token = getToken();
  const navigate = useNavigate();

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
      navigate('/aboutUs');
    }
  }, []);

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

  return (
    <div>
      <Navbar showAuthButtons={false} />
      <div className="about-us-container">
        <div className="about-us-section">
          <h2>About Us</h2>
          <p>
            Welcome to Auction Marketplace, where we merge the power of auctions and donations to create a platform that drives positive change and supports meaningful causes. Our mission is to foster a community where individuals, businesses, and organizations come together to make a difference through both commerce and philanthropy.
          </p>
        </div>
        <div className="about-us-section">
          <h3>Vision</h3>
          <p>
            At Auction Marketplace, we envision a world where every action, whether buying or giving, contributes to the betterment of society. We strive to build a platform that not only facilitates transactions but also cultivates empathy, generosity, and social responsibility.
          </p>
        </div>
        <div className="about-us-section">
          <h3>Get Involved</h3>
          <p>
            Join us in our mission to create a world where commerce and compassion intersect. Whether you're a buyer, seller, donor, or simply an advocate for positive change, there's a place for you in the Auction Marketplace community. Thank you for being a part of our journey.
          </p>
        </div>
      </div>

      <h3 className='aboutUs-h3'>These People Started Everything:</h3>
      <div className="founders-container">
        <div className="founder">
          <img src='https://ca.slack-edge.com/T55M7NDST-U066GLJT9C7-6afd0d815660-512' alt="Founder 1" />
          <h4>Teoslava Yordanova</h4>
          <p>Teoslava is a Highly experienced Fullstack Developer</p>
        </div>
        <div className="founder">
          <img src='https://ca.slack-edge.com/T55M7NDST-U066ZL2A9M2-913bb3537e80-512' alt="Founder 2" />
          <h4>Luben Kulishev</h4>
          <p>Luben is a Highly experienced Fullstack Developer</p>
        </div>
        <div className="founder">
          <img src='https://ca.slack-edge.com/T55M7NDST-U067L6EH6TS-b8293e458c8a-512' alt="Founder 3" />
          <h4>Savina Valchanova</h4>
          <p>Savina is a Highly experienced Fullstack Developer </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUsPage;