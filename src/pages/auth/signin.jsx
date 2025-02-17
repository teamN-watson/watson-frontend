import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '@src/axiosInstance';
import useStore from '@store/zustore';
import '@assets/css/input.css';
import '@assets/css/account/signin.css';
import { getProfilePhotoUrl } from '@src/utils';

export default function SignIn() {
  const [formData, setFormData] = useState({
    user_id: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/account/signin/`, formData);
      if (response.status === 200) {
        const data = response.data;
        const user = { ...data.user, photo: getProfilePhotoUrl(data.user?.photo) }
        login(user, data.access_token, data.refresh_token);
        navigate('/');
      }
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.message || '로그인에 실패했습니다.');
    }
  };

  const handleSteamLogin = async () => {
    try {
      // 백엔드 API 호출
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/account/steam_login?page=signin`);
      const { auth_url } = await response.json();

      // 스팀 로그인 URL로 리다이렉트
      window.location.href = auth_url;
    } catch (error) {
      console.error("Failed to redirect to Steam login:", error);
    }
  };

  return (
    <div className="signin-container">
      <form className="signin-form" onSubmit={handleSubmit}>
        <div className="signin-header">
          <h2>로그인</h2>
          <p>Watson에 오신 것을 환영합니다</p>
        </div>

        <div className="input-group">
          <label htmlFor="user_id">아이디</label>
          <input
            type="text"
            id="user_id"
            value={formData.user_id}
            onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="password">비밀번호</label>
          <input
            type="password"
            id="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
        </div>

        {error && <div className="error-message">{error}</div>}

        <button type="submit" className="action-button">
          로그인
        </button>

        <div className='steamloginBtn'>
          <img src={"/images/steam_sign.png"} onClick={handleSteamLogin} />
        </div>

        <div className="signin-footer">
          <Link to="/steam/choose">아직 계정이 없으신가요? 회원가입</Link>
        </div>
      </form>
    </div>
  );
}
