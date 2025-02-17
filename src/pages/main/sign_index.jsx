import React from 'react';
import { useNavigate } from 'react-router-dom';
import '@assets/css/main/sign_index.css'; // CSS 파일 import

function SignInButton({ onClick }) {
  return (
    <button className="auth-button login" onClick={onClick}>
      로그인
    </button>
  );
}

function SignUpButton({ onClick }) {
  return (
    <button className="auth-button signup" onClick={onClick}>
      회원가입
    </button>
  );
}

export default function SignIndex() {
  const navigate = useNavigate();

  return (
    <div className="sign-index">
      <div className="content">
        <img src={"/images/watson/watson_banner.gif"} alt="WATSON" className="logo" />
        <p className="subtitle">
          AI 기반 게임 추천 시스템으로 당신만의 완벽한 게임을 발견하세요.
          개인화된 분석을 통해 취향에 꼭 맞는 게임을 찾아드립니다.
        </p>
        <div className="button-group">
          <SignUpButton onClick={() => navigate('/steam/choose')} />
          <SignInButton onClick={() => navigate('/signin')} />
        </div>
      </div>
    </div>
  );
}

