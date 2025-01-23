import React, { useEffect } from 'react';
import axios from '@src/axiosInstance';
import useStore from '@store/zustore';
import '@assets/css/navbar.css';
import { getProfilePhotoUrl } from '@src/utils';

export default function Header() {
    const { isLoggedIn, setIsLoggedIn, userInfo, setUserInfo, logout, accessToken, refreshToken, setAccessToken, setRefreshToken } = useStore();

    useEffect(() => {
        const accessToken = sessionStorage.getItem('access_token');
        const refreshToken = sessionStorage.getItem('refresh_token');
        if (accessToken) {
            setAccessToken(accessToken);
            // 로그인 상태일 때 유저 정보 불러오기
            axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/account/token/`, {
                headers: { 'Authorization': `Bearer ${accessToken}` }
            }).then((response) => {
                if (response.status === 200) {
                    const data = response.data;
                    console.log(data)

                    setUserInfo({ ...response.data, photo: getProfilePhotoUrl(data.photo) });
                }
            }).catch((error) => {
                console.error('Error fetching user info:', error);
            });
        } else {
            setIsLoggedIn(false);
        }
        if (refreshToken) {
            setRefreshToken(refreshToken);
        }
    }, []);

    const handleLogout = () => {
        if (refreshToken && accessToken) {
            axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/account/logout/`, {
                refresh_token: refreshToken, // body 데이터
            }, {
                headers: { 'Authorization': `Bearer ${accessToken}` }, // 헤더 설정
            }
            ).then((response) => {
                if (response.status === 200) {
                    logout(); // zustand 상태에서 로그아웃 처리
                    sessionStorage.removeItem('access_token');
                    sessionStorage.removeItem('refresh_token');
                    window.location.href = '/'; // 로그아웃 후 리다이렉트
                }
            }).catch((error) => {
                console.error('Error fetching user info:', error);
            });

        }
    };

    return (
        <header>
            <nav className="navbar">
                <div className="container">
                    <div className='logo_wrap'>
                        <a href="/" className="logo">
                            <img src={"/images/watson/watson_logo.gif"} alt="Watson" />
                        </a>
                    </div>
                    <div>
                        <ul className="menu">
                            <li><a href="/review/">리뷰</a></li>
                            <li><a href="/game">게임</a></li>
                            <li><a href="/chatbot">챗봇</a></li>
                        </ul>
                    </div>
                    <div>
                        <div className="nav_auth">
                            {isLoggedIn ? (
                                <>
                                    <div className="user_photo">
                                        <img src={userInfo?.photo ? userInfo.photo : "/images/default_profile.png"} alt="User Photo" />
                                    </div>
                                    <h3>{userInfo?.nickname}님</h3>
                                    <a href={`/profile/${userInfo?.id}`}>마이페이지</a>
                                    <button onClick={handleLogout}>로그아웃</button>
                                </>
                            ) : (
                                <>
                                    <a href="/signin">로그인</a>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
}
