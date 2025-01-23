import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '@src/axiosInstance';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import '@src/assets/css/main/main_index.css';

// 캐러셀 설정
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
      settings: { slidesToShow: 2 }
    },
    {
      breakpoint: 600,
      settings: { slidesToShow: 1 }
    }
  ]
};

// 유틸리티 함수
const formatPrice = (price) => !price ? '무료' : `₩ ${price.toLocaleString()}`;

const getMetacriticClass = (score) => {
  if (score >= 75) return 'high';
  if (score >= 50) return 'medium';
  return 'low';
};

function MainIndex() {
  const [recommendedGames, setRecommendedGames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecommendedGames = async () => {
      try {
        const cachedGames = sessionStorage.getItem('recommendedGames');
        const cachedTimestamp = sessionStorage.getItem('recommendedGamesTimestamp');
        
        // 캐시 유효성 검사
        if (cachedGames && cachedTimestamp) {
          const now = new Date().getTime();
          const cacheAge = now - parseInt(cachedTimestamp);
          
          if (cacheAge < 3600000) {
            setRecommendedGames(JSON.parse(cachedGames));
            setIsLoading(false);
            return;
          }
        }

        // API 호출
        const token = localStorage.getItem('accessToken');
        const response = await axios.get('http://localhost:8000/api/account/recommended_games/', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // 데이터 저장
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

  // 게임 카드 컴포넌트
  const GameCard = ({ game, index }) => (
    <div className="featured-game-card" onClick={() => navigate(`/game/${game.appID}`)}>
      <div className="image-container">
        <img 
          src={game.header_image} 
          alt={game.name}
          onError={(e) => { e.target.src = '/default-game-image.jpg'; }}
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
          <div className={`metacritic ${getMetacriticClass(game.metacritic_score)}`}>
            <img src="/metacritic-icon.svg" alt="Metacritic" className="metacritic-icon" />
            {game.metacritic_score || 'N/A'}
          </div>
          <span className="price">{formatPrice(game.price)}</span>
        </div>
      </div>
    </div>
  );

  // 상위 3개 게임을 위한 컴포넌트
  const TopGameCard = ({ game, rank }) => (
    <div className={`top-game-card rank-${rank}`} onClick={() => navigate(`/game/${game.appID}`)}>
      <div className="image-container">
        <img 
          src={game.header_image} 
          alt={game.name}
          onError={(e) => { e.target.src = '/default-game-image.jpg'; }}
        />
        <div className="watson-score">
          {Math.round(game.score)}점
        </div>
        <div className={`top-rank-badge rank-${rank}`}>
          {rank}위
        </div>
      </div>
      <div className="game-info">
        <h3>{game.name}</h3>
        <div className="genres">
          {game.genres_kr ? game.genres_kr.slice(0, 3).join(', ') : '장르 정보 없음'}
        </div>
        <div className="meta-info">
          <div className={`metacritic ${getMetacriticClass(game.metacritic_score)}`}>
            <img src="/metacritic-icon.svg" alt="Metacritic" className="metacritic-icon" />
            {game.metacritic_score || 'N/A'}
          </div>
          <span className="price">{formatPrice(game.price)}</span>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="main-container">
        <div className="loading-spinner">게임 추천 목록을 불러오는 중...</div>
      </div>
    );
  }

  const topThreeGames = recommendedGames.slice(0, 3);
  const remainingGames = recommendedGames.slice(3);

  return (
    <div className="main-container">
      <div className="header">
        <h1>Watson Game Recommendations</h1>
        <p>당신의 취향에 맞는 게임을 발견하세요</p>
      </div>

      <div className="top-games-section">
        <h2>TOP 3 추천 게임</h2>
        <div className="top-games-container">
          {topThreeGames.map((game, index) => (
            <TopGameCard key={game.appID} game={game} rank={index + 1} />
          ))}
        </div>
      </div>
      
      <div className="other-recommendations">
        <h2>다른 추천 게임</h2>
        <div className="carousel-wrapper">
          <Slider {...carouselSettings}>
            {remainingGames.map((game, index) => (
              <GameCard key={game.appID} game={game} index={index + 3} />
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
}

export default MainIndex;
