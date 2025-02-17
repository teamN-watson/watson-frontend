import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '@src/axiosInstance';
import Slider from 'react-slick';
import useStore from '@store/zustore';
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
const formatPrice = (price) => !price ? '무료' : `$ ${price.toLocaleString()}`;

const getMetacriticClass = (score) => {
  if (score >= 75) return 'high';
  if (score >= 50) return 'medium';
  return 'low';
};

// 메타크리틱 아이콘 SVG 컴포넌트
const MetacriticIcon = () => (
  <svg 
    width="16" 
    height="16" 
    viewBox="0 0 16 16" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className="metacritic-icon"
  >
    <path 
      d="M8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0ZM8 14.5C4.41015 14.5 1.5 11.5899 1.5 8C1.5 4.41015 4.41015 1.5 8 1.5C11.5899 1.5 14.5 4.41015 14.5 8C14.5 11.5899 11.5899 14.5 8 14.5Z" 
      fill="currentColor"
    />
    <path 
      d="M8 3.5C5.51472 3.5 3.5 5.51472 3.5 8C3.5 10.4853 5.51472 12.5 8 12.5C10.4853 12.5 12.5 10.4853 12.5 8C12.5 5.51472 10.4853 3.5 8 3.5Z" 
      fill="currentColor"
    />
  </svg>
);

// 왕관 아이콘 SVG 컴포넌트 수정
const CrownIcon = () => (
  <svg 
    className="crown-icon"
    width="40" 
    height="40" 
    viewBox="0 0 24 24" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      fill="#FFD700"
      d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z"
    />
  </svg>
);

function MainIndex() {
  const [recommendedGames, setRecommendedGames] = useState({
    interest_based_games: [],
    playtime_based_games: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { isLoggedIn, userInfo, accessToken } = useStore();


  useEffect(() => {
    const fetchRecommendedGames = async () => {
      try {
        const cachedGames = sessionStorage.getItem('recommendedGames');
        const cachedTimestamp = sessionStorage.getItem('recommendedGamesTimestamp');
        
        if (cachedGames && cachedTimestamp) {
          const now = new Date().getTime();
          const cacheAge = now - parseInt(cachedTimestamp);
          
          if (cacheAge < 3600000) {
            setRecommendedGames(JSON.parse(cachedGames));
            setIsLoading(false);
            return;
          }
        }

        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/account/recommended_games/`);
        
        setRecommendedGames({
          interest_based_games: response.data.interest_based_games || [],
          playtime_based_games: response.data.playtime_based_games || []
        });
        sessionStorage.setItem('recommendedGames', JSON.stringify(response.data));
        sessionStorage.setItem('recommendedGamesTimestamp', new Date().getTime().toString());
      } catch (error) {
        console.error('게임 추천 데이터를 가져오는데 실패했습니다:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendedGames();
  }, [navigate]);

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
            <MetacriticIcon />
            {game.metacritic_score || '없음'}
          </div>
          <span className="price">{formatPrice(game.price)}</span>
        </div>
      </div>
    </div>
  );

  // 상위 3개 게임을 위한 컴포넌트
  const TopGameCard = ({ game, rank }) => (
    <div className={`top-game-card rank-${rank}`} onClick={() => navigate(`/game/${game.appID}`)}>
      {rank === 1 && <div className="crown-container"><CrownIcon /></div>}
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
            <MetacriticIcon />
            {game.metacritic_score || '없음'}
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

  return (
    <div className="main-container">
      <div className="header">
        <h1>Watson Game Recommendations</h1>
        <p>당신의 취향에 맞는 게임을 발견하세요</p>
      </div>

      {/* 관심사 기반 추천 섹션 */}
      <div className="top-games-section">
        <h2>관심사 기반 TOP 3 추천 게임</h2>
        <div className="top-games-container">
          {recommendedGames.interest_based_games.slice(0, 3).map((game, index) => (
            <TopGameCard key={game.appID} game={game} rank={index + 1} />
          ))}
        </div>
      </div>

      {/* 플레이타임 기반 추천 섹션 */}
      <div className="top-games-section">
        <h2>STEAM 플레이 게임 기반 TOP 3 추천 게임 - [BETA]</h2>
        <div className="top-games-container">
          {recommendedGames.playtime_based_games.slice(0, 3).map((game, index) => (
            <TopGameCard key={game.appID} game={game} rank={index + 1} />
          ))}
        </div>
      </div>
      
      {/* 나머지 추천 게임들 */}
      <div className="other-recommendations">
        <h2>하위 관심사 기반 추천 게임</h2>
        <div className="carousel-wrapper">
          <Slider {...carouselSettings}>
            {recommendedGames.interest_based_games.slice(3).map((game, index) => (
              <GameCard key={game.appID} game={game} index={index + 3} />
            ))}
          </Slider>
        </div>
      </div>

      <div className="other-recommendations">
        <h2>하위 STEAM 플레이 게임 기반 추천 게임 - [BETA]</h2>
        <div className="carousel-wrapper">
          <Slider {...carouselSettings}>
            {recommendedGames.playtime_based_games.slice(3).map((game, index) => (
              <GameCard key={game.appID} game={game} index={index + 3} />
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
}

export default MainIndex;
