import React from 'react';
import '@assets/css/index.css';  // '@assets' 별칭을 사용하여 CSS 파일 import
import useStore from '@store/zustore';
import MainIndex from './main/main_index';
import SignIndex from './main/sign_index';

export default function IndexPage() {
    const { isLoggedIn, userInfo, setUserInfo, logout, accessToken, refreshToken, setAccessToken, setRefreshToken } = useStore();
    return accessToken ? <MainIndex /> : <SignIndex />
}