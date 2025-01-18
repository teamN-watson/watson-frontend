import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useStore from '@store/zustore';
import logo from '@assets/images/logo.png';
import default_profile from '@assets/images/default_profile.png';
import '@assets/css/common/header.css';

export default function Header() {
  const navigate = useNavigate();
  const isLoggedIn = useStore((state) => state.isLoggedIn);
  const user = useStore((state) => state.user);
  const logout = useStore((state) => state.logout);

  const handleProfileClick = () => {
    navigate('/mypage');
  };

  return (
    <header className="header">
      <div className="header_left">
        <Link to="/" className="logo">
          <img src={logo} alt="로고" />
        </Link>
      </div>
      <div className="header_right">
        {isLoggedIn ? (
          <>
            <div className="profile_wrap" onClick={handleProfileClick}>
              <img 
                src={user?.photo || default_profile} 
                alt="프로필" 
                className="profile_img"
                title="마이페이지"
              />
            </div>
            <button onClick={logout} className="logout_btn">로그아웃</button>
          </>
        ) : (
          <Link to="/login" className="login_btn">로그인</Link>
        )}
      </div>
    </header>
  );
} 