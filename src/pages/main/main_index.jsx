import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '@src/axiosInstance';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import '@src/assets/css/main/main_index.css';

function MainIndex() {
  const [recommendedGames, setRecommendedGames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecommendedGames = async () => {
      try {
        // 세션스토리지에서 데이터 확인
        const cachedGames = sessionStorage.getItem('recommendedGames');
        const cachedTimestamp = sessionStorage.getItem('recommendedGamesTimestamp');
        
        // 캐시가 있고 1시간 이내의 데이터인 경우
        if (cachedGames && cachedTimestamp) {
          const now = new Date().getTime();
          const cacheAge = now - parseInt(cachedTimestamp);
          
          if (cacheAge < 3600000) { // 1시간 = 3600000 밀리초
            setRecommendedGames(JSON.parse(cachedGames));
            setIsLoading(false);
            return;
          }
        }

        // 캐시가 없거나 오래된 경우 API 호출
        const token = localStorage.getItem('accessToken');
        const response = await axios.get('http://localhost:8000/api/account/recommended_games/', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        // 새로운 데이터를 상태와 세션스토리지에 저장
        setRecommendedGames(response.data.games);
        sessionStorage.setItem('recommendedGames', JSON.stringify(response.data.games));
        sessionStorage.setItem('recommendedGamesTimestamp', new Date().getTime().toString());
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
      <div className="main-container">
        <div className="loading-spinner">게임 추천 목록을 불러오는 중...</div>
      </div>
    );
  }

  return (
    <div className="main-container">
      <div className="header">
        <h1>Watson Game Recommendations</h1>
        <p>당신의 취향에 맞는 게임을 발견하세요</p>
      </div>
      
      <div className="carousel-wrapper">
        <Slider {...carouselSettings}>
          {recommendedGames.map((game, index) => (
            <div className="featured-game-card" key={game.appID} onClick={() => handleGameClick(game.appID)}>
              <div className="image-container">
                <img 
                  src={game.header_image} 
                  alt={game.name}
                  onError={(e) => {
                    e.target.src = '/default-game-image.jpg';
                  }}
                />
                <div className="watson-score">
                  {Math.round(game.score)}점
                </div>
                <div className={`rank-overlay ${index < 3 ? `rank-${index + 1}` : ''}`}>
                  {index + 1}위
                </div>
              </div>
              <div className="game-info">
                <h3>{game.name}</h3>
                <div className="genres">
                  {game.genres_kr ? game.genres_kr.slice(0, 3).join(', ') : '장르 정보 없음'}
                </div>
                <div className="meta-info">
                  <span>평점: {game.metacritic_score || 'N/A'}</span>
                  <span className="price">{formatPrice(game.price)}</span>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
}

export default MainIndex;
