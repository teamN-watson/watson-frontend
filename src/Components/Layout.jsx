import React, { Component } from "react";
import Header from "./Header"; // 헤더 컴포넌트
import Footer from "./Footer"; // 푸터 컴포넌트
import { Outlet } from "react-router-dom";

import "@assets/css/layout.css";
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';

class GlobalLayout extends Component {

    render() {
        return (
            <MantineProvider>
                <div className="layout">
                    <Header />
                    <main className="layout-content">
                        <div className="container">
                            <Outlet />
                        </div>
                    </main>
                    <Footer />
                </div>
            </MantineProvider>
        );
    }
}

export default GlobalLayout;
