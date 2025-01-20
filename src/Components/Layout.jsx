import React from "react";
import Header from "./Header";  // 헤더 컴포넌트
import Footer from "./Footer";  // 푸터 컴포넌트
import "@assets/css/layout.css";
import { Outlet } from 'react-router-dom'

export default function GlobalLayout() {
    return (
        <div className="layout">
            <Header />
            <main className="layout-content">
                <div className="container">
                    <Outlet />
                </div>
            </main>
            <Footer />
        </div>
    );
}