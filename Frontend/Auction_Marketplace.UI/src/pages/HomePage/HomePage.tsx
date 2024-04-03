import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { clearToken, getToken, isTokenExpired } from '../../utils/GoogleToken.ts';
import '../../Components/TokenExp/TokenExpContainer.css';
import './HomePage.css'
import firstPhoto from '/src/assets/Kids in need.png';
import secondPhoto from '/src/assets/Animals.jpeg';
import thirdPhoto from '/src/assets/Ukrainee.jpeg';
import forthPhoto from '/src/assets/done.jpeg';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import Navbar from '../../components/Navbar/Navbar.tsx';
import Footer from '../../Components/Footer/Footer.tsx';
import ApiResponseDTO from '../../Interfaces/DTOs/ApiResponseDTO.ts';
import ApiService from '../../Services/ApiService.ts';
import AuctionService from '../../Services/AuctionService.ts';
import AuctionDTO from '../../Interfaces/DTOs/AuctionDTO.ts';

const HomePage: React.FC = () => {
  const [auctions, setAuctions] = useState([]);
  const token = getToken();
  const apiService = new ApiService();
  const auctionService = new AuctionService(apiService);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const auctionsResponse: ApiResponseDTO = await auctionService.fetchAuctions();
        let sortedAuctions = auctionsResponse.data.sort((a: AuctionDTO, b: AuctionDTO) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 3);
        if (sortedAuctions.length < 2) {
          sortedAuctions = [
            {
              id: 1,
              name: 'Painting from Picasso',
              description: 'Guernica shows the tragedies of war and the suffering it inflicts upon individuals, particularly innocent civilians. This work has gained a monumental status, becoming a perpetual reminder of the tragedies of war, an anti-war symbol, and an embodiment of peace.',
              photo: 'https://artstreet.in/cdn/shop/products/71S_lfuAyYL_700x700.jpg?v=1680764254'
            },
            {
              id: 2,
              name: 'Truck Toy',
              description: 'It’s time to take out the trash with DRIVEN by Battat’s Dump Truck! This toy truck is part of the Standard Series and it is packed with cool features to keep you entertained for hours! There are working sounds so you can honk the horn and rev the engine. You can also switch on the multiple lights to see the path ahead and let others know you’re on the road! Fill your truck up and tilt the garbage out using the movable dumper.',
              photo: 'https://tincknellcountrystore.co.uk/images/cats/1737.jpg'
            },
            {
              id: 3,
              name: 'Game Dining Table',
              description: 'The Dresden Board Game Dining Table makes the most of leisure time while offering a multi-use, space-saving option for both recreation and dining. Whether you want to play popular tabletop games or card games, socialize, or share a meal, Dresden’s modern design and different features have everything you need for a relaxing and memorable experience.',
              photo: 'https://bandpassdesign.com/cdn/shop/products/standard_dresden_gaming_set_straight_copy_1.jpg?v=1631024763'
            }
          ];
        } else {
          sortedAuctions = sortedAuctions.slice(0, 3);
        }
        setAuctions(sortedAuctions);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

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
      navigate('/home');
    }
  }, []);

  useEffect(() => {
    if (isTokenExpired()) {
      clearToken();
    }
  }, []);

  const images = [
    firstPhoto,
    secondPhoto,
    thirdPhoto,
    forthPhoto
  ];

  const carouselSettings = {
    showThumbs: false,
    interval: 7000,
    infiniteLoop: true,
    autoPlay: true,
    transitionTime: 500,
    stopOnHover: false,
    dynamicHeight: false,
  };

  const defaultAuctions = [
    {
      id: 1,
      name: 'Painting from Picasso',
      description: 'Guernica shows the tragedies of war and the suffering it inflicts upon individuals, particularly innocent civilians. This work has gained a monumental status, becoming a perpetual reminder of the tragedies of war, an anti-war symbol, and an embodiment of peace.',
      photo: 'https://artstreet.in/cdn/shop/products/71S_lfuAyYL_700x700.jpg?v=1680764254'
    },
    {
      id: 2,
      name: 'Truck Toy',
      description: 'It’s time to take out the trash with DRIVEN by Battat’s Dump Truck! This toy truck is part of the Standard Series and it is packed with cool features to keep you entertained for hours! There are working sounds so you can honk the horn and rev the engine. You can also switch on the multiple lights to see the path ahead and let others know you’re on the road! Fill your truck up and tilt the garbage out using the movable dumper.',
      photo: 'https://tincknellcountrystore.co.uk/images/cats/1737.jpg'
    },
    {
      id: 3,
      name: 'Game Dining Table',
      description: 'The Dresden Board Game Dining Table makes the most of leisure time while offering a multi-use, space-saving option for both recreation and dining. Whether you want to play popular tabletop games or card games, socialize, or share a meal, Dresden’s modern design and different features have everything you need for a relaxing and memorable experience.',
      photo: 'https://bandpassdesign.com/cdn/shop/products/standard_dresden_gaming_set_straight_copy_1.jpg?v=1631024763'
    }
  ];

  return (
    <div>
      <Navbar showAuthButtons={!token} />
      <div className="header-menu">
        <div className="top-bar">
          <div className="logo"></div>
          <div className="user-menu">
            <div className="profile-icon"></div>
          </div>
        </div>
        <Carousel {...carouselSettings}>
          {images.map((imageUrl, index) => (
            <div key={index}>
              <img src={imageUrl} alt={`Photo ${index + 1}`} />
            </div>
          ))}
        </Carousel>
        <div className="product-section">
          <h2>Auction Products</h2>
          <div className="product-list">
            {token ? (
              auctions.map((auction, index) => (
                <div key={index} className="product">
                  <img src={auction.photo} alt={`Auction ${index + 1}`} />
                  <h3>{auction.name}</h3>
                  <p>{auction.description}</p>
                </div>
              ))
            ) : (
              defaultAuctions.map((auction, index) => (
                <div key={index} className="product">
                  <img src={auction.photo} alt={`Auction ${index + 1}`} />
                  <h3>{auction.name}</h3>
                  <p>{auction.description}</p>
                </div>
              ))
            )}
          </div>
          <Link to="/auctions" className="view-all-button">View All Auctions</Link>
        </div>
      </div>
      <Footer />
    </div>
  );
};
export default HomePage;