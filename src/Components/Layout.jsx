import React, { Component } from "react";
import Header from "./Header"; // 헤더 컴포넌트
import Footer from "./Footer"; // 푸터 컴포넌트
import { Outlet, useLocation } from "react-router-dom";

import "@assets/css/layout.css";
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';

class GlobalLayout extends Component {

    render() {
        return (
            <MantineProvider>
                <Notifications />
                <div className="layout">
                    <Header />
                    <main className="layout-content">
                        <DynamicContainer>
                            <Outlet />
                        </DynamicContainer>
                    </main>
                    <Footer />
                </div>
            </MantineProvider>
        );
    }
}

const DynamicContainer = ({ children }) => {
    const location = useLocation();
    // 동적으로 컨테이너 클래스를 변경
    const getContainerClass = () => {
        if (location.pathname.startsWith("/game/")) return "detail-container container";
        if (location.pathname.startsWith("/chatbot")) return "chatbot container";
        return "container";
    };

    return <div className={getContainerClass()}>{children}</div>;
};

export default GlobalLayout;