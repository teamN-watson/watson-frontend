import React, { useState } from 'react';
import axios from '@src/axiosInstance';
import useStore from '@store/zustore';
import '@assets/css/account/signin.css';
import { useNavigate } from 'react-router';
export default function SteamChoose() {
  const navigate = useNavigate();

  const handleSteamLogin = async () => {
    try {
      // 백엔드 API 호출
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/account/steam_login`);
      const { auth_url } = await response.json();

      // 스팀 로그인 URL로 리다이렉트
      window.location.href = auth_url;
    } catch (error) {
      console.error("Failed to redirect to Steam login:", error);
    }
  };

  return (
    <div className="signupContainer">
      <h2>Steam 계정연동</h2>
      <button className='btn btn-steam-login' onClick={handleSteamLogin}>스팀 로그인</button>
      <button onClick={() => navigate("/signup")}>다음에 하기</button>
    </div>
  );
}
