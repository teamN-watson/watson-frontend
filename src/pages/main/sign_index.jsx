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
          AI를 활용해 사용자가 원하는 게임을 쉽고 정확하게 찾을 수 있도록 도와줍니다.
        </p>
        <div className="button-group">
          <SignUpButton onClick={() => navigate('/signup')} />
          <SignInButton onClick={() => navigate('/signin')} />
        </div>
      </div>
    </main>
  );
}