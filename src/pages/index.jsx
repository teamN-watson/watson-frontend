import React from 'react';
// import banner from '../assets/images/loading.gif';
import '@assets/css/index.css';  // '@assets' 별칭을 사용하여 CSS 파일 import
import useStore from '@store/zustore';
import MainIndex from './main/main_index';
import SignIndex from './main/sign_index';

export default function IndexPage() {
    const { isLoggedIn, userInfo, setUserInfo, logout, accessToken, refreshToken, setAccessToken, setRefreshToken } = useStore();
    return (<main>

        {accessToken ? <MainIndex /> : <SignIndex />}

    </main>)
}