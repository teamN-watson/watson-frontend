import React from 'react';
// import banner from '../assets/images/loading.gif';
import '@assets/css/index.css';  // '@assets' 별칭을 사용하여 CSS 파일 import
import { useNavigate } from 'react-router';
export default function SignIndex() {
    const navigate = useNavigate();

    return (<main>
        <div className="container">
            <h2>WATSON</h2>
            <span>WATSON은 단순한 도구를 넘어,
                사용자가 원하는 게임을 더 쉽고
                정확히 찾을 수 있도록 돕는 조수입니다.
                셜록과 왓슨의 관계처럼,
                스팀과 사용자를 연결하여
                적합한 게임을 찾는 경험을 제공합니다.
            </span>
            <button onClick={() => navigate("/steam/choose")}>시작하기</button>
        </div>
    </main>)
}