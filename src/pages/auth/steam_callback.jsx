import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from '@src/axiosInstance';
import useStore from '@store/zustore';
import { getProfilePhotoUrl } from '@src/utils';
import '@assets/css/account/callback.css';  // '@assets' 별칭을 사용하여 CSS 파일 import

const SteamCallback = () => {
  const [status, setStatus] = useState('로딩중입니다...');
  const navigate = useNavigate();
  const { login } = useStore();
  const isExecuted = useRef(false); // 중복 실행 방지용 ref

  useEffect(() => {
    if (isExecuted.current) return; // 이미 실행되었으면 종료
    isExecuted.current = true; // 첫 실행 이후 true로 설정
    const query = new URLSearchParams(window.location.search);
    const steamUrl = query.get("openid.claimed_id");
    const userId = query.get("user_id");
    const page = query.get("page");
    if(page == "mypage")setStatus("스팀 연동중입니다...");
    if(page == "signup")setStatus("스팀 회원가입 준비중입니다...");
    if(page == "signin")setStatus("스팀 로그인중입니다...");

    if (steamUrl) {
      const steamId = steamUrl.split("/").pop();

      // 백엔드로 Steam ID 전달
      try {
        axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/account/steam_callback/`, {
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ steamId, userId, page }),
        }).then((response) => {
          if (response.status === 200) {
            console.log(response)

            const data = response.data;
            if(data){
              const page = data.page;
              const id = data.user_id ?? 0;
              if(page == "mypage"){
                
                if(id){
                  window.location.href = `/profile/${id}`; // 성공 후 리다이렉트
                } else {
                  navigate(`/`); // 일단 리다이렉트
                }
              }
  
              const steam_id = data.steam_id ?? 0;
              if(page == "signup"){
                if(steam_id){
                  window.location.href = `/signup?steam_id=${steam_id}`; // 성공 후 리다이렉트
                } else {
                  navigate(`/`); // 일단 리다이렉트
                }
              }

              if(page == "signin"){
                const user = { ...data.user, photo: getProfilePhotoUrl(data.user?.photo) }
                login(user, data.access_token, data.refresh_token);
                navigate('/');
              }
              navigate('/');
            }
          }
        }).catch((error) => {
          if(error.response?.data?.error){
            setStatus(error.response?.data?.error)
          } else if(error.response?.data?.message){
            setStatus(error.response?.data?.message)
          }
          setTimeout(() => {
            navigate(`/`)
          }, 3000)
          console.error('Error fetching user info:', error);
        });

      } catch (error) {
        console.error("Error in callback processing:", error);
      }
    }

  }, [navigate]);

  return (
    <div className="callback_loading">
      <img src={"/images/search_loading.gif"} />
      <h2>{status}</h2>
    </div>
  )
};

export default SteamCallback;
