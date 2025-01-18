import React from "react";
import Header from "./Header";  // 헤더 컴포넌트
import Footer from "./Footer";  // 푸터 컴포넌트
import { Outlet } from 'react-router-dom'

export default function GlobalLayout() {
    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            background: '#121212'
        }}>
            <Header />
            <main id="main" style={{
                flex: 1,
                padding: '2rem 0'
            }}>
                <div className="container">
                    <Outlet />
                </div>
            </main>
            <Footer />
        </div>
    );
}