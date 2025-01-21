import React, { useState, useEffect } from 'react';
import '@assets/css/main/main_index.css';

// 게임 데이터 (예시)
const gameData = [
  {
    id: 1,
    title: 'RimWorld',
    price: 37500,
    image: 'https://example.com/rimworld.jpg',
    description: '재미있는 게임입니다.',
  },
  // ... 다른 게임 데이터
];

function MainIndex() {
  const [games, setGames] = useState(gameData);

  // 데이터를 불러오는 함수 (필요한 경우)
  useEffect(() => {
    // API 호출 등을 통해 데이터를 가져와 setGames로 업데이트
  }, []);

  return (
    <div className="Maincontainer">
      <h2>좋아하는 게임을 찾아보세요!</h2>
      <div className="game-list">
        {games.map((game) => (
          <div className="game-item" key={game.id}>
            <img src={game.image} alt={game.title} />
            <h3>{game.title}</h3>
            <p>{game.price}원</p>
            <p>{game.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MainIndex;