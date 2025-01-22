import React, { useEffect, useState, useRef } from 'react';
import '@assets/css/game/detail.css';  // '@assets' 별칭을 사용하여 CSS 파일 import
import axios from '@src/axiosInstance';
import { useNavigate, useParams } from 'react-router-dom';
import { dateformat, dateformat2 } from '@src/utils';
import YouTubePlayer from '../../Components/game/YoutubePlayer';
import { Rating } from '@mantine/core';

export default function GameDetail() {
    const { id } = useParams(); // URL에서 id 파라미터 가져오기
    const [game, setGame] = useState({});
    const [video, setVideo] = useState({});
    const [reviews, setReviews] = useState([]);
    const [my_review, setMyReview] = useState({});
    const [clicked_review, setClickedReview] = useState(null);

    const [gameData, setGameData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const isFirstRender = useRef(true); // 첫 렌더링 여부를 추적

    const query = new URLSearchParams(window.location.search);
    const review_id = query.get("review_id") || 0;

    useEffect(() => {
        const fetchGame = async () => {
            axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/reviews/game?game_id=${id}&review_id=${review_id}`).then((response) => {
                if (response.status === 200) {
                    const data = response.data;
                    console.log(data)
    
                    setGame(data.game)
                    if(data.video){
                        setVideo(data.video)
                    }
                    setMyReview(data.my_review)
                    setReviews(data.reviews)
                    setClickedReview(data.clicked_review)
                    if(data.steam_data?.name){
                        setGameData(data.steam_data); // 해당 AppID에 맞는 게임 데이터
                    }
                }
            }).catch((error) => {
                console.error('Error fetching user info:', error);
            });
        }
        if (isFirstRender.current && id) {
            isFirstRender.current = false; // 첫 렌더링 이후 false로 설정
            fetchGame();
        }
    }, [id]);
    
    return (
        <div className="GamedetailContainer">
            <div className='game_header'>
                <div className='bg_game_img'>
                    {gameData.screenshots && <img src={gameData.screenshots[0].path_full} alt={game.game_name} />}

                </div>
                <div className='bg_game_info'>
                    <div className='game_title'>
                        <h1>{game.name}</h1>
                    </div>
                    <div className='game_subtitle'>
                        <span>{gameData.developers && gameData.developers[0]}</span>
                        <span>{gameData?.coming_soon ? "출시전" : gameData?.release_date?.date + " 출시"}</span>
                    </div>

                </div>
            </div>
            <div className="game_row">
                <div className='main_section'>
                    <div className='section_wrap'>
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
                        <div className='section game_video'>
                            <h1>게임 관련 영상</h1>
                            {video && 
                            <YouTubePlayer videoId={video?.id} className="youtube_embed" />
                            }

                        </div>

                    </div>

                    <div className='section_wrap review'>
                        { my_review && <div className='section my_review'>
                            <h1>내 리뷰</h1>
                            <div className='review_wrap'>
                                <span>{my_review.nickname}</span>
                                <span>{my_review.content}</span>
                                <Rating value={my_review.score} fractions={2} readOnly />
                                <span>{dateformat2(my_review.created_at)}</span>
                            </div>
                        </div>

                        }
                        <div className='section reviews'>
                            <h1>리뷰</h1>
                            {   clicked_review && 
                            <div className='review_wrap click_review' key={clicked_review.id}>
                                <span>{clicked_review.nickname}</span>
                                <span>{clicked_review.content}</span>
                                <Rating value={clicked_review.score} fractions={2} readOnly />
                                <span>{dateformat2(clicked_review.created_at)}</span>
                            </div>
                            }{  reviews?.length > 0 && reviews.map((review) => {
                                    return (
                                        <div className='review_wrap' key={review.id}>
                                            <span>{review.nickname}</span>
                                            <span>{review.content}</span>
                                            <Rating value={review.score} fractions={2} readOnly />
                                            <span>{dateformat2(review.created_at)}</span>
                                        </div>
                                    )
                                })
                            }
                            {
                                clicked_review == null && reviews?.length == 0 && <div className='review_wrap'>
                                    <h2>등록된 리뷰가 없습니다.</h2>
                                </div>
                            }
                        </div>
                    </div>
                    
                </div>
                <div className='side_section'>
                    <div className='section'>
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
                    <div className='section rating'>
                        <h2>Watson 유저 평가</h2>
                        <div>
                            <Rating value={my_review.score} fractions={2} readOnly />
                            <span>{'1.0 (5)'}</span>
                        </div>
                    </div>
                    { gameData?.metacritic && <div className='section metacritic'>
                        <h2>메타크리틱 평가</h2>
                        <div>
                            <span>{gameData.metacritic?.score}점</span>
                        </div>
                    </div> }
                </div>
            </div>

        </div>
    )
}