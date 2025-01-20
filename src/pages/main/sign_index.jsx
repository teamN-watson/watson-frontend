import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '@assets/css/main/sign_index.css'; // CSS 파일 import
import logo from '@assets/images/watson/watson_banner.gif';  // .png에서 .gif로 변경
import useStore from '@store/zustore';
import axios from '@src/axiosInstance';  // axios 추가

function SignInButton({ onClick }) {
  return (
    <button className="auth-button login" onClick={onClick}>
      로그인
    </button>
  );
}

function SignUpButton({ onClick }) {
  return (
    <button className="auth-button signup" onClick={onClick}>
      회원가입
    </button>
  );
}

function GameSection({ games }) {
  // games가 배열인지 확인하고, 아니라면 빈 배열을 사용
  const gamesList = Array.isArray(games) ? games : [];
  
  // 디버깅을 위한 콘솔 로그 추가
  console.log('games 데이터:', games);

  return (
    <div className="game-section">
      {gamesList.map((game) => (
        <div key={game.id} className="game-item">
          {/* 게임 아이템 내용 */}
        </div>
      ))}
    </div>
  );
}

export default function SignIndex() {
  const navigate = useNavigate();
  const { isLoggedIn, userInfo, setUserInfo, login } = useStore();
  const [games, setGames] = useState({
    featured: [],
    popular: [],
    recent: [],
    recommended: []
  });

  useEffect(() => {
    const accessToken = sessionStorage.getItem('access_token');
    const refreshToken = sessionStorage.getItem('refresh_token');

    if (accessToken && refreshToken && !isLoggedIn) {
      login(accessToken, refreshToken);
      loadUserInfo(accessToken);
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      loadGames();
    }
  }, [isLoggedIn]);

  const loadUserInfo = async (token) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/account/token/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.status === 200) {
        setUserInfo(response.data);
      }
    } catch (error) {
      console.error('Error loading user info:', error);
    }
  };

  const loadGames = async () => {
    try {
      const dummyGames = {
        featured: [
          { 
            id: 1, 
            title: "Cyberpunk 2077", 
            image: "https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/header.jpg", 
            rating: 4.5 
          },
          { 
            id: 2, 
            title: "Red Dead Redemption 2", 
            image: "https://cdn.cloudflare.steamstatic.com/steam/apps/1174180/header.jpg", 
            rating: 4.8 
          },
          { 
            id: 3, 
            title: "Elden Ring", 
            image: "https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/header.jpg", 
            rating: 4.9 
          },
          { 
            id: 4, 
            title: "Baldur's Gate 3", 
            image: "https://cdn.cloudflare.steamstatic.com/steam/apps/1086940/header.jpg", 
            rating: 4.9 
          },
          { 
            id: 5, 
            title: "Starfield", 
            image: "https://cdn.cloudflare.steamstatic.com/steam/apps/1716740/header.jpg", 
            rating: 4.3 
          }
        ],
        popular: [
          { 
            id: 6, 
            title: "The Witcher 3", 
            image: "https://cdn.cloudflare.steamstatic.com/steam/apps/292030/header.jpg", 
            rating: 4.9 
          },
          { 
            id: 7, 
            title: "GTA V", 
            image: "https://cdn.cloudflare.steamstatic.com/steam/apps/271590/header.jpg", 
            rating: 4.7 
          },
          { 
            id: 8, 
            title: "Lies of P", 
            image: "https://cdn.cloudflare.steamstatic.com/steam/apps/1627720/header.jpg", 
            rating: 4.6 
          },
          { 
            id: 9, 
            title: "Mortal Kombat 1", 
            image: "https://cdn.cloudflare.steamstatic.com/steam/apps/1971870/header.jpg", 
            rating: 4.4 
          },
          { 
            id: 10, 
            title: "Hogwarts Legacy", 
            image: "https://cdn.cloudflare.steamstatic.com/steam/apps/990080/header.jpg", 
            rating: 4.7 
          },
          { 
            id: 11, 
            title: "Resident Evil 4", 
            image: "https://cdn.cloudflare.steamstatic.com/steam/apps/2050650/header.jpg", 
            rating: 4.8 
          },
          { 
            id: 12, 
            title: "Street Fighter 6", 
            image: "https://cdn.cloudflare.steamstatic.com/steam/apps/1364780/header.jpg", 
            rating: 4.5 
          },
          { 
            id: 14, 
            title: "Monster Hunter Rise", 
            image: "https://cdn.cloudflare.steamstatic.com/steam/apps/1446780/header.jpg", 
            rating: 4.7 
          },
          { 
            id: 15, 
            title: "Diablo IV", 
            image: "https://cdn.cloudflare.steamstatic.com/steam/apps/2344520/header.jpg", 
            rating: 4.5 
          }
        ],
        recent: [
          // ... 10개 이상의 최신 게임 데이터 추가
        ],
        recommended: [
          // ... 10개 이상의 추천 게임 데이터 추가
        ]
      };

      setGames(dummyGames);
    } catch (error) {
      console.error('Error loading games:', error);
    }
  };

  const GameRow = ({ title, games, size = "normal" }) => (
    <div className={`game-row ${size}`}>
      <h2 className="row-title">{title}</h2>
      <div className="game-slider">
        {games?.map((game) => (
          <div key={game.id} className="game-card" onClick={() => navigate(`/game/${game.id}`)}>
            <img src={game.image} alt={game.title} className="game-image" />
            <div className="game-info">
              <h3>{game.title}</h3>
              <div className="game-rating">⭐ {game.rating}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <main className="sign-index">
      {!isLoggedIn ? (
        <div className="content">
          <img src={logo} alt="WATSON" className="logo" />
          <p className="subtitle">
            AI 기반 게임 추천 시스템으로 당신만의 완벽한 게임을 발견하세요. 
            개인화된 분석을 통해 취향에 꼭 맞는 게임을 찾아드립니다.
          </p>
          <div className="button-group">
            <button className="auth-button signup" onClick={() => navigate('/signup')}>회원가입</button>
            <button className="auth-button login" onClick={() => navigate('/signin')}>로그인</button>
          </div>
        </div>
      ) : (
        <div className="home-content">
          <div className="featured-section">
            <GameRow title="추천 게임" games={games.featured} size="large" />
          </div>
          
          <div className="game-rows">
            <GameRow title="인기 게임" games={games.popular} />
            <GameRow title="최근 출시작" games={games.recent} />
            <GameRow title="맞춤 추천" games={games.recommended} />
          </div>

          <div className="quick-nav">
            <button className="nav-button" onClick={() => navigate('/chatbot')}>
              <span className="nav-icon">🤖</span>
              AI 챗봇
            </button>
            <button className="nav-button" onClick={() => navigate('/search')}>
              <span className="nav-icon">🔍</span>
              게임 검색
            </button>
            <button className="nav-button" onClick={() => navigate('/reviews')}>
              <span className="nav-icon">📝</span>
              리뷰
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

