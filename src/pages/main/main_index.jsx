import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '@src/axiosInstance';
import styled from 'styled-components';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const MainContainer = styled.div`
  padding: 2rem;
  min-height: 100vh;
  background: linear-gradient(to bottom, #1b2838, #2a475e);
  color: #c7d5e0;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
  
  h1 {
    font-size: 2.5rem;
    color: #66c0f4;
    margin-bottom: 1rem;
  }
  
  p {
    font-size: 1.2rem;
    color: #acb2b8;
  }
`;

const GameGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  padding: 0 2rem;
`;

const GameCard = styled.div`
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  }

  img {
    width: 100%;
    height: 150px;
    object-fit: cover;
  }
`;

const GameInfo = styled.div`
  padding: 1rem;

  h3 {
    color: #ffffff;
    margin: 0 0 0.5rem 0;
    font-size: 1.1rem;
  }

  .genres {
    color: #66c0f4;
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
  }

  .meta-info {
    display: flex;
    justify-content: space-between;
    color: #8f98a0;
    font-size: 0.9rem;

    .price {
      color: #a4d007;
    }
  }
`;

const LoadingSpinner = styled.div`
  text-align: center;
  padding: 2rem;
  color: #66c0f4;
  font-size: 1.2rem;
`;

const CarouselContainer = styled.div`
  margin-bottom: 3rem;
  padding: 0 2rem;
  
  .slick-slide {
    padding: 0 10px;
  }
  
  .slick-prev, .slick-next {
    z-index: 1;
    &:before {
      color: #66c0f4;
      font-size: 30px;
    }
  }
  
  .slick-prev {
    left: -5px;
  }
  
  .slick-next {
    right: -5px;
  }
`;

const FeaturedGameCard = styled(GameCard)`
  img {
    height: 300px;
  }
`;

function MainIndex() {
  const [recommendedGames, setRecommendedGames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecommendedGames = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get('http://localhost:8000/api/account/recommended_games/', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setRecommendedGames(response.data.games);
      } catch (error) {
        console.error('게임 추천 데이터를 가져오는데 실패했습니다:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendedGames();
  }, []);

  const handleGameClick = (appID) => {
    navigate(`/game/${appID}`);
  };

  const formatPrice = (price) => {
    if (!price) return '무료';
    return `₩ ${price.toLocaleString()}`;
  };

  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
        }
      }
    ]
  };

  if (isLoading) {
    return (
      <MainContainer>
        <LoadingSpinner>게임 추천 목록을 불러오는 중...</LoadingSpinner>
      </MainContainer>
    );
  }

  return (
    <MainContainer>
      <Header>
        <h1>Watson Game Recommendations</h1>
        <p>당신의 취향에 맞는 게임을 발견하세요</p>
      </Header>
      
      <CarouselContainer>
        <Slider {...carouselSettings}>
          {recommendedGames.slice(0, 6).map((game) => (
            <FeaturedGameCard key={game.appID} onClick={() => handleGameClick(game.appID)}>
              <img 
                src={game.header_image} 
                alt={game.name}
                onError={(e) => {
                  e.target.src = '/default-game-image.jpg';
                }}
              />
              <GameInfo>
                <h3>{game.name}</h3>
                <div className="genres">
                  {game.genres_kr ? game.genres_kr.slice(0, 3).join(', ') : '장르 정보 없음'}
                </div>
                <div className="meta-info">
                  <span>평점: {game.metacritic_score || 'N/A'}</span>
                  <span className="price">{formatPrice(game.price)}</span>
                </div>
              </GameInfo>
            </FeaturedGameCard>
          ))}
        </Slider>
      </CarouselContainer>

      <GameGrid>
        {recommendedGames.map((game) => (
          <GameCard key={game.appID} onClick={() => handleGameClick(game.appID)}>
            <img 
              src={game.header_image} 
              alt={game.name}
              onError={(e) => {
                e.target.src = '/default-game-image.jpg';
              }}
            />
            <GameInfo>
              <h3>{game.name}</h3>
              <div className="genres">
                {game.genres_kr ? game.genres_kr.slice(0, 3).join(', ') : '장르 정보 없음'}
              </div>
              <div className="meta-info">
                <span>평점: {game.metacritic_score || 'N/A'}</span>
                <span className="price">{formatPrice(game.price)}</span>
              </div>
            </GameInfo>
          </GameCard>
        ))}
      </GameGrid>
    </MainContainer>
  );
}

export default MainIndex;
