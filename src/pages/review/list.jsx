import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '@assets/css/review/list.css';  // '@assets' 별칭을 사용하여 CSS 파일 import
import axios from '@src/axiosInstance';
import useStore from '@store/zustore';
import { Rating } from '@mantine/core';
import { dateformat, dateformat2 } from '@src/utils';

export default function ReviewList() {
    const [message, setMessage] = useState('');
    const [reviews, setReviews] = useState([]);  // 채팅 기록 상태
    const { isLoggedIn, userInfo, setUserInfo, logout, accessToken, refreshToken, setAccessToken, setRefreshToken } = useStore();

    const navigate = useNavigate();
    useEffect(() => {
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/reviews/`).then((response) => {
            if (response.status === 200) {
                setReviews(response.data)
                console.log(response.data)
            }
        }).catch((error) => {
            console.error('Error fetching user info:', error);
        });
    }, []);

    return (
        <div className="ReviewlistContainer">
            <div className='titleWrap'>
                <h1>리뷰 목록</h1>
            </div>
            <div className='reviewList'>
                {reviews && reviews.map((review) => {
                    return (
                        <div className="game_row" key={review.id || review.game_name} onClick={() => navigate(`/game/${review.app_id}?review_id=${review.id}`)}>
                            <div className="game_title">
                                <div className="game_img">
                                    {review.header_image && <img src={review.header_image} alt={review.game_name} />}
                                </div>
                                <div className="game_info">
                                    <h4>{review.game_name}</h4>
                                    <div className="categories">
                                        {review.categories && review.categories.length > 0 && review.categories.map((category, cIndex) => {
                                            return (
                                                <span className="category" key={cIndex}>{category}</span>
                                            )
                                        })}
                                    </div>
                                    <span>{ dateformat2(review.created_at)}</span>
                                    <span>{review.nickname}</span>
                                </div>
                            </div>
                            <div className="game_rating">
                                <Rating value={review.score} fractions={2} readOnly />
                                <span>좋아요 수 {review.total_likes}</span>
                            </div>
                        </div>
                    )
                })}
            </div>
            <div className='reviewListAction'>
                {userInfo && <a href="/review/create">새 리뷰 작성</a>}
            </div>


        </div>
    )
}