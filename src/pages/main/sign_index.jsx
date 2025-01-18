import React from 'react';
import { useNavigate } from 'react-router-dom';
import './sign_index.css'; // CSS 파일 import
import backgroundVideo from "@assets/videos/background.mp4";

function SignInButton({ onClick }) {
  return (
    <button className="auth-button" onClick={onClick}>
      로그인
    </button>
  );
}

function SignUpButton({ onClick }) {
  return (
    <button className="auth-button" onClick={onClick}>
      회원가입
    </button>
  );
}

export default function SignIndex() {
  const navigate = useNavigate();

  return (
    <main className="sign-index">
      {/* 배경 영상 */}
      <video autoPlay loop muted playsInline className="background-video">
        <source src={backgroundVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="content">
        <h1 className="logo">WATSON</h1>
        <p className="subtitle">
          AI 기반 게임 추천 시스템으로 당신만의 완벽한 게임을 발견하세요. 
          개인화된 분석을 통해 취향에 꼭 맞는 게임을 찾아드립니다.
        </p>
        <div className="button-group">
          <SignUpButton onClick={() => navigate('/signup')} />
          <SignInButton onClick={() => navigate('/signin')} />
        </div>
      </div>
    </main>
  );
}