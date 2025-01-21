import React, { useEffect, useState } from 'react';
import '@assets/css/review/detail.css';  // '@assets' 별칭을 사용하여 CSS 파일 import
import axios from '@src/axiosInstance';
import { useNavigate, useParams } from 'react-router-dom';
import ReviewComment from '../../Components/review/Comment';

export default function ReviewDetail() {
    const { id } = useParams(); // URL에서 id 파라미터 가져오기
    const [review, setReview] = useState({});
    const [comments, setComments] = useState([]);
    const [content, setContent] = useState("");
    useEffect(() => {
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/reviews/${id}`).then((response) => {
            if (response.status === 200) {
                const data = response.data;
                let created_at = "";
                if (data && data.created_at) {
                    const date = new Date(data.created_at);
                    const year = date.getFullYear();
                    const month = date.getMonth() + 1; // 0부터 시작하므로 +1
                    const day = date.getDate();
                    created_at = `${year}년 ${month}월 ${day}일`;
                }
                setReview({ ...response.data, created_at: created_at })
                console.log(response.data)
                if (data.comments) {
                    setComments(data.comments)
                }
            }
        }).catch((error) => {
            console.error('Error fetching user info:', error);
        });
    }, []);

    const contentChange = (e) => {
        setContent(e.target.value)
    }

    const new_comment = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/reviews/${id}/comments/`,
                { content: content },
            );

            if (response.status == 201) {
                setComments([...comments, response.data])
                setContent("")
            }

            console.log(response)
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="ReviewdetailContainer">
            <h1>게임 상세</h1>
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
                        <span>{review.created_at}</span>
                        <span>{review.nickname}</span>
                    </div>
                </div>
                <div className="game_rating">
                    <span>{'⭐'.repeat(review.score)}</span>
                    <span>좋아요 수 {review.total_likes}</span>
                </div>
            </div>
            }
            <ReviewComment comments={comments} new_comment={new_comment} content={content} contentChange={contentChange} />

        </div>
    )
}