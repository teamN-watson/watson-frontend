import React, { useEffect, useState } from 'react';
import '@assets/css/review/list.css';  // '@assets' 별칭을 사용하여 CSS 파일 import
import axios from '@src/axiosInstance';
import { useNavigate, useParams } from 'react-router-dom';

export default function ReviewDetail() {
    const { id } = useParams(); // URL에서 id 파라미터 가져오기
    const [review, setReview] = useState({});

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/reviews/${id}`).then((response) => {
            if (response.status === 200) {
                setReview(response.data)
                console.log(response.data)
            }
        }).catch((error) => {
            console.error('Error fetching user info:', error);
        });
    }, []);

    return (
        <div className="listContainer">
            <h1>리뷰 상세</h1>
            {review && <div className="game_row">
                <div className="game_title">
                    <div className="game_img">
                        {review.header_image && <img src={review.header_image} alt={review.game_name} />}
                    </div>
                    <div className="game_info">
                        <h4>{review.game_name}</h4>
                        <div className="categories">
                            {review.categories && review.categories.length && review.categories.map((category, cIndex) => {
                                return (
                                    <span className="category" key={cIndex}>{category}</span>
                                )
                            })}
                        </div>
                        {/* <span>{`${year}년 ${month + 1}월 ${day}일`}</span> */}
                        <span>{review.nickname}</span>
                    </div>
                </div>
                <div className="game_rating">
                    <span>{'⭐'.repeat(review.score)}</span>
                    <span>좋아요 수 {review.total_likes}</span>
                </div>
            </div>
            }

        </div>
    )
}