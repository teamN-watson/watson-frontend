import React, { useState } from 'react';
import axios from '@src/axiosInstance';
import useStore from '@store/zustore';
import '@assets/css/account/signchoose.css';
import { useNavigate } from 'react-router';
import steam_sign from '@assets/images/steam_sign.png';  // .png에서 .gif로 변경

export default function SteamChoose() {
  const navigate = useNavigate();

  const handleSteamLogin = async () => {
    try {
      // 백엔드 API 호출
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/account/steam_login?page=signup`);
      const { auth_url } = await response.json();

      // 스팀 로그인 URL로 리다이렉트
      window.location.href = auth_url;
    } catch (error) {
      console.error("Failed to redirect to Steam login:", error);
    }
  };

  return (
    <div className="signChooseContainer">
      <h2>Steam 계정연동</h2>
      <div className='chooseWrap'>
        <img src={steam_sign} onClick={handleSteamLogin} />
        {/* <button className='btn btn-steam-login' onClick={handleSteamLogin}>스팀 로그인</button> */}
        <a href='/signup'>다음에 하기</a>

      </div>
    </div>
  );
}
