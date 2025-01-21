import React, { useEffect, useState } from 'react';
import '@assets/css/game/detail.css';  // '@assets' 별칭을 사용하여 CSS 파일 import
import axios from '@src/axiosInstance';
import { useNavigate, useParams } from 'react-router-dom';

export default function GameDetail() {
    const { id } = useParams(); // URL에서 id 파라미터 가져오기
    const [game, setGame] = useState({});

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/reviews/game?game_id=${id}`).then((response) => {
            if (response.status === 200) {
                const data = response.data;

                setGame(data.game)

            }
        }).catch((error) => {
            console.error('Error fetching user info:', error);
        });
    }, []);

    const contentChange = (e) => {
        setContent(e.target.value)
    }

    return (
        <div className="GamedetailContainer">
            <h1>게임 상세</h1>
            {game && <div className="game_row">
                <div className="game_title">
                    <div className="game_img">
                        {game.header_image && <img src={game.header_image} alt={game.game_name} />}
                    </div>
                    <div className="game_info">
                        <h4>{game.game_name}</h4>
                        <div className="categories">
                            {game.categories && game.categories.length && game.categories.map((category, cIndex) => {
                                return (
                                    <span className="category" key={cIndex}>{category}</span>
                                )
                            })}
                        </div>
                        <span>{game.created_at}</span>
                        <span>{game.nickname}</span>
                    </div>
                </div>
                <div className="game_rating">
                    <span>{'⭐'.repeat(game.score)}</span>
                    <span>좋아요 수 {game.total_likes}</span>
                </div>
            </div>
            }

        </div>
    )
}