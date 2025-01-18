import React, { useEffect, useState } from 'react';
import '@assets/css/review/list.css';  // '@assets' 별칭을 사용하여 CSS 파일 import
import axios from '@src/axiosInstance';

export default function ReviewList() {
    const [message, setMessage] = useState('');
    const [reviews, setReviews] = useState([]);  // 채팅 기록 상태

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
        <div className="listContainer">
            <h1>리뷰 목록</h1>
            {reviews && reviews.map((review) => {
                const objectDate = new Date(review.created_at);

                const day = objectDate.getDate();
                const month = objectDate.getMonth(); // 0부터 시작하므로 +1 필요
                const year = objectDate.getFullYear();

                return (
                    <div className="game_row" key={review.id || review.game_name}>
                        <div className="game_title">
                            <div className="game_img">
                                {review.header_image && <img src={review.header_image} alt={review.game_name} />}
                            </div>
                            <div className="game_info">
                                <h4>{review.game_name}</h4>
                                <div className="categories"></div>
                                <span>{`${year}년 ${month + 1}월 ${day}일`}</span>
                                <span>{review.nickname}</span>
                            </div>
                        </div>
                        <div className="game_rating">
                            <span>{'⭐'.repeat(review.score)}</span>
                            <span>좋아요 수 {review.total_likes}</span>
                        </div>
                    </div>
                )
            })}
            <div>
                <a href="{% url 'front:review_create' %}">새 리뷰 작성</a>
            </div>
        </div>
    )
}