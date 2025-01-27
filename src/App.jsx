import React, { Suspense, lazy } from 'react';
import { Route, Routes, Navigate } from "react-router-dom";
import GlobalLayout from "./Components/Layout"; // 레이아웃 컴포넌트
const Index = lazy(() => import("./pages/index")); // 홈 페이지 컴포넌트
const Signin = lazy(() => import("./pages/auth/signin")); // 로그인 페이지 컴포넌트
const Signup = lazy(() => import("./pages/auth/signup")); // 회원가입 페이지 컴포넌트
const Talk = lazy(() => import("./pages/chatbot/talk")); // 챗봇 페이지 컴포넌트
const Profile = lazy(() => import("./pages/auth/profile")); // 프로필 페이지 컴포넌트
const ProfileEdit = lazy(() => import("./pages/auth/profile_edit")); // 프로필 수정 페이지 컴포넌트
const SteamCallback = lazy(() => import("./pages/auth/steam_callback")); // 스팀 콜백 페이지
const SteamChoose = lazy(() => import("./pages/auth/steam_choose")); // 스팀 선택 페이지
const ReviewList = lazy(() => import("./pages/review/list")); // 리뷰 목록 페이지
const ReviewCreate = lazy(() => import("./pages/review/create")); // 리뷰 작성 페이지
const GameList = lazy(() => import("./pages/game/list")); // 게임 목록 페이지
const GameDetail = lazy(() => import("./pages/game/detail")); // 게임 상세 페이지
import "@assets/css/App.css";

export default function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route element={<GlobalLayout />}>
          <Route path="/" element={<Index />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/steam/choose" element={<SteamChoose />} />
          <Route path="/chatbot" element={<Talk />} />
          <Route path="/review" element={<ReviewList />} />
          <Route path="/review/create" element={<ReviewCreate />} />
          <Route path="/game" element={<GameList />} />
          <Route path="/game/:id" element={<GameDetail />} />
          <Route path="/steam/callback" element={<SteamCallback />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/profile/:id/edit" element={<ProfileEdit />} />
          <Route path="/profile" element={<Navigate to="/" />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
