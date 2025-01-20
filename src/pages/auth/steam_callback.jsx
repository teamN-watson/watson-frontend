import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from '@src/axiosInstance';
import loading from '@assets/images/search_loading.gif';
import '@assets/css/account/callback.css';  // '@assets' 별칭을 사용하여 CSS 파일 import

const SteamCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const steamUrl = query.get("openid.claimed_id");
    const userId = query.get("user_id");

    if (steamUrl) {
      const steamId = steamUrl.split("/").pop();

      // 백엔드로 Steam ID 전달
      try {
        axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/account/steam_callback/`, {
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ steamId, userId }),
        }).then((response) => {
          if (response.status === 200) {
            console.log(response)
            const id = response.data?.data?.user_id ?? 0;
            if (id) {
              window.location.href = `/profile/${id}`; // 성공 후 리다이렉트
            } else {
              window.location.href = `/`; // 성공 후 리다이렉트
            }

          }
        }).catch((error) => {
          console.error('Error fetching user info:', error);
        });

      } catch (error) {
        console.error("Error in callback processing:", error);
      }
    }

  }, [navigate]);

  return (
    <div className="callback_loading">
      <img src={loading} />
      <h2>로딩 중입니다...</h2>
    </div>
  )
};

export default SteamCallback;
