import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '@assets/css/review/list.css';  // '@assets' 별칭을 사용하여 CSS 파일 import
import axios from '@src/axiosInstance';
import useStore from '@store/zustore';
import { Rating } from '@mantine/core';
import { dateformat, dateformat2 } from '@src/utils';

export default function ReviewList() {
    const [reviews, setReviews] = useState([]);  // 채팅 기록 상태
    const [page, setPage] = useState(1);
    const [hasNext, setHasNext] = useState(true);
    const [loading, setLoading] = useState(false);

    const { isLoggedIn, userInfo, setUserInfo, logout, accessToken, refreshToken, setAccessToken, setRefreshToken } = useStore();

    const navigate = useNavigate();
    useEffect(() => {
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/reviews/`).then((response) => {
            if (response.status === 200) {
                const data = response.data;
                setReviews(data.reviews)
                setHasNext(data.has_next)
                console.log(response.data)
            }
        }).catch((error) => {
            console.error('Error fetching user info:', error);
        });
    }, []);

    const fetchMoreItems = async () => {
        if (!hasNext || loading) return;
        setLoading(true);
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/reviews?page=${page+1}`,
            );

            console.log(response.data)
            const data = response.data;
            if (response.status == 200) {
                setReviews((prevGames) => [...prevGames, ...data.reviews]); // 기존 데이터에 추가
                setHasNext(data.has_next); // 다음 페이지 여부 갱신
                setPage((prevPage) => prevPage + 1); // 페이지 증가
            }

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="ReviewlistContainer">
            <div className='titleWrap'>
                <h1>리뷰 목록</h1>
                {userInfo && <button className="create-button" onClick={() => navigate("/review/create")}>새 리뷰 작성</button>}
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
                                    <h4>{review.content}</h4>
                                    <span>{review.game_name}</span>
                                    <div className="categories">
                                        {review.categories && review.categories.length > 0 && review.categories.map((category, cIndex) => {
                                            return (
                                                <span className="category" key={cIndex}>{category}</span>
                                            )
                                        })}
                                    </div>
                                    
                                </div>
                            </div>
                            <div className="game_rating">
                                <span>{review.nickname}</span>
                                <Rating value={review.score} fractions={2} readOnly />
                                <span>좋아요 수 {review.total_likes}</span>
                                <span>{ dateformat2(review.created_at)}</span>
                            </div>
                        </div>
                    )
                })}
                {reviews?.length == 0 && <div className='empty_list'><h3>등록된 리뷰가 없습니다.</h3></div>}
                {hasNext && <button className='more-button' onClick={fetchMoreItems}>더불러오기</button>}
            </div>
        </div>
    )
}