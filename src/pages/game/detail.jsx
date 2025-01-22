import React, { useEffect, useState } from 'react';
import '@assets/css/game/detail.css';  // '@assets' 별칭을 사용하여 CSS 파일 import
import axios from '@src/axiosInstance';
import { useNavigate, useParams } from 'react-router-dom';
import { dateformat } from '@src/utils';

export default function GameDetail() {
    const { id } = useParams(); // URL에서 id 파라미터 가져오기
    const [game, setGame] = useState({});

    const [gameData, setGameData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/reviews/game?game_id=${id}`).then((response) => {
            if (response.status === 200) {
                const data = response.data;
                console.log(data.game)

                setGame(data.game)

            }
        }).catch((error) => {
            console.error('Error fetching user info:', error);
        });
    }, []);

    useEffect(() => {
        if (id) {
            const fetchGameDetails = async () => {
                axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/reviews/game/${id}`).then((response) => {
                    if (response.status === 200) {
                        const data = response.data;
                        console.log(data[id].data)

                        setGameData(data[id].data); // 해당 AppID에 맞는 데이터        
                    }
                }).catch((error) => {
                    console.error('Error fetching user info:', error);
                }).finally(() => {
                    setLoading(false);
                });
            };

            fetchGameDetails();

        }
    }, [id]);

    return (
        <div className="GamedetailContainer">
            <div className='game_header'>
                <div className='bg_game_img'>
                    {game.header_image && <img src={game.header_image} alt={game.game_name} />}

                </div>
                <div className='bg_game_info'>
                    <div className='game_title'>
                        <h1>{game.name}</h1>
                    </div>
                    <div className='game_subtitle'>
                        <span>{'⭐ 1.0'}</span>
                        <span>{gameData.developers && gameData.developers[0]}</span>
                        <span>{gameData?.coming_soon ? "출시전" : gameData?.release_date?.date}</span>
                    </div>

                </div>
            </div>
            <div className="game_row">
                <div className='main_section'>
                    <div className='section '>
                        <h1>게임 소개</h1>
                        {game && 
                        <div className="game_intro">
                            <div className="game_img">
                                {game.header_image && <img src={game.header_image} alt={game.game_name} />}
                            </div>
                            <div className='game_description'>
                                {gameData.short_description}
                            </div>
                        </div>
                        }

                    </div>
                    <div className='section '>
                        <h1>게임 리뷰 영상</h1>
                        {game && 
                        <div className="game_intro">
                            <div className="game_img">
                                {game.header_image && <img src={game.header_image} alt={game.game_name} />}
                            </div>
                            <div className='game_description'>
                                {gameData.short_description}
                            </div>
                        </div>
                        }

                    </div>
                </div>
                <div className='side_section'>
                    <div className='game_genres'>
                        <h2>장르</h2>
                        <div className='genres_container'>
                        {gameData?.genres && gameData?.genres.map((genre, genre_index) => {
                            return (
                                <div className='genre_wrap' key={genre_index}>
                                    <span>{genre.description}</span>
                                </div>
                            )
                        })}
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}