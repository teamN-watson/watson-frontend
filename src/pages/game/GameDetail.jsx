import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from '@src/axiosInstance';
import '@assets/css/game/game_detail.css';

export default function GameDetail() {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGameDetails = async () => {
      try {
        // 실제 API 연동 시 이 부분을 수정하세요
        const dummyGame = {
          id: id,
          title: "Cyberpunk 2077",
          description: "Cyberpunk 2077는 나이트 시티를 배경으로 하는 오픈월드 액션 어드벤처 RPG입니다. 여러분은 사이버펑크 용병 V가 되어 불멸의 힘을 지닌 유일한 임플란트를 찾아 모험을 떠납니다.",
          releaseDate: "2020-12-10",
          developer: "CD PROJEKT RED",
          publisher: "CD PROJEKT RED",
          genres: ["RPG", "액션", "오픈월드"],
          rating: 4.5,
          price: "₩64,800",
          mainImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/header.jpg",
          screenshots: [
            {
              id: 1,
              url: "https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/ss_b529b0abc43f55fc23fe8058eddb6e37c9629a6a.jpg",
              title: "Night City"
            }
          ],
          systemRequirements: {
            minimum: {
              os: "Windows 10",
              processor: "Intel Core i5-3570K or AMD FX-8310",
              memory: "8 GB RAM",
              graphics: "NVIDIA GeForce GTX 970 or AMD Radeon RX 470"
            },
            recommended: {
              os: "Windows 10",
              processor: "Intel Core i7-4790 or AMD Ryzen 3 3200G",
              memory: "12 GB RAM",
              graphics: "NVIDIA GeForce GTX 1060 6GB or AMD Radeon RX 590"
            }
          },
          reviews: [
            {
              id: 1,
              user: "User1",
              rating: 5,
              comment: "놀라운 게임입니다. 그래픽과 스토리가 매우 인상적입니다."
            },
            {
              id: 2,
              user: "User2",
              rating: 4,
              comment: "버그가 있지만 전반적으로 재미있는 게임입니다."
            },
            {
              id: 3,
              user: "User3",
              rating: 5,
              comment: "오픈월드의 새로운 기준을 제시한 게임입니다."
            }
          ],
          videoReview: {
            title: "사이버펑크 2077 유저 리뷰",
            youtubeId: "MOGSMlBzb3w",
            creator: "게임 리뷰어"
          }
        };

        setGame(dummyGame);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching game details:', error);
        setLoading(false);
      }
    };

    fetchGameDetails();
  }, [id]);

  if (loading) {
    return <div className="loading">로딩 중...</div>;
  }

  if (!game) {
    return <div className="error">게임을 찾을 수 없습니다.</div>;
  }

  return (
    <div className="game-detail">
      <div className="game-header">
        <img 
          src={game.screenshots[0].url} 
          alt={game.screenshots[0].title} 
          className="game-banner" 
        />
        <div className="game-header-content">
          <h1>{game.title}</h1>
          <div className="game-meta">
            <span className="rating">⭐ {game.rating}</span>
            <span className="developer">{game.developer}</span>
            <span className="release-date">{game.releaseDate}</span>
          </div>
        </div>
      </div>

      <div className="game-content">
        <div className="game-main">
          <section className="game-description">
            <div className="description-container">
              <img 
                src={game.mainImage} 
                alt={game.title} 
                className="game-thumbnail" 
              />
              <div className="description-text">
                <h2>게임 소개</h2>
                <p>{game.description}</p>
              </div>
            </div>
          </section>

          <section className="game-video-review">
            <h2>게임 리뷰 영상</h2>
            <div className="video-container">
              <iframe
                src={`https://www.youtube.com/embed/${game.videoReview.youtubeId}`}
                title={game.videoReview.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <div className="video-info">
              <p className="video-title">{game.videoReview.title}</p>
              <p className="video-creator">제작: {game.videoReview.creator}</p>
            </div>
          </section>

          <section className="game-screenshots">
            <h2>스크린샷</h2>
            <div className="screenshot-grid">
              {game.screenshots.map((screenshot) => (
                <div key={screenshot.id} className="screenshot-item">
                  <img 
                    src={screenshot.url} 
                    alt={screenshot.title} 
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </section>

          <section className="game-reviews">
            <h2>리뷰</h2>
            <div className="reviews-list">
              {game.reviews.map((review) => (
                <div key={review.id} className="review-card">
                  <div className="review-header">
                    <span className="review-user">{review.user}</span>
                    <span className="review-rating">⭐ {review.rating}</span>
                  </div>
                  <p className="review-comment">{review.comment}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="game-sidebar">
          <div className="game-info-card">
            <div className="price-section">
              <h3>가격</h3>
              <p className="price">{game.price}</p>
            </div>

            <div className="genres-section">
              <h3>장르</h3>
              <div className="genre-tags">
                {game.genres.map((genre, index) => (
                  <span key={index} className="genre-tag">{genre}</span>
                ))}
              </div>
            </div>

            <div className="system-requirements">
              <h3>시스템 요구사항</h3>
              <div className="requirements-tabs">
                <h4>최소 사양</h4>
                <ul>
                  <li><strong>OS:</strong> {game.systemRequirements.minimum.os}</li>
                  <li><strong>프로세서:</strong> {game.systemRequirements.minimum.processor}</li>
                  <li><strong>메모리:</strong> {game.systemRequirements.minimum.memory}</li>
                  <li><strong>그래픽:</strong> {game.systemRequirements.minimum.graphics}</li>
                </ul>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
} 