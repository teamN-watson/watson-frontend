import React, { useEffect, useState } from 'react';
import '@assets/css/game/detail.css';  // '@assets' 별칭을 사용하여 CSS 파일 import
import axios from '@src/axiosInstance';
import { useNavigate, useParams } from 'react-router-dom';

export default function GameDetail() {
    const { id } = useParams(); // URL에서 id 파라미터 가져오기
    const [review, setReview] = useState({});
    const [comments, setComments] = useState([]);
    const [content, setContent] = useState("");
    useEffect(() => {

    }, []);



    return (
        <div className="GamedetailContainer">

        </div>
    )
}