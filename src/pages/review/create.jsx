import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '@assets/css/review/list.css';  // '@assets' 별칭을 사용하여 CSS 파일 import
import axios from '@src/axiosInstance';

export default function ReviewCreate() {
    const [content, setContent] = useState("");
    const [app_id, setAppId] = useState("");
    const [score, setScore] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {

    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault(); // 기본 제출 동작 방지
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/reviews/`,
                { content: content, app_id: app_id, score: score },
            );

            console.log(response)

        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="ReviewContainer">
            <h2>리뷰 등록</h2>
            <form>
                <div className="reviewForm">
                    <div>
                        <span>내용</span>
                        <input type="text" name="content" placeholder="내용을 입력해주세요" id="id_content" value={content} onChange={(e) => setContent(e.target.value)} />
                        <p className="error_msg content"></p>
                        <span>app id</span>
                        <input type="text" name="app_id" placeholder="app id를 입력해주세요" id="id_app_id" value={app_id} onChange={(e) => setAppId(e.target.value)} />
                        <p className="error_msg app_id"></p>
                        <span>score</span>
                        <input type="text" name="score" placeholder="score를 입력해주세요" id="id_score" value={score} onChange={(e) => setScore(e.target.value)} />
                        <p className="error_msg score"></p>
                    </div>
                    <span className="error_msg"></span>
                    <input type="submit" value="리뷰 등록" onClick={handleSubmit} />
                </div>
            </form>
        </div>
    )
}