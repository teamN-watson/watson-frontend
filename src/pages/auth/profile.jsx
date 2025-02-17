import React, { useEffect, useState } from 'react';
import axios from '@src/axiosInstance';
import useStore from '@store/zustore';
import { useNavigate, useParams } from 'react-router-dom';
import { getProfilePhotoUrl, dateformat2 } from '@src/utils';
import '@assets/css/account/profile.css';
import { Rating, Modal, Button, Text } from '@mantine/core';

function Profile() {
  const { id } = useParams(); // URL에서 id 파라미터 가져오기
  const { isLoggedIn, userInfo, setUserInfo, logout, accessToken, refreshToken, setAccessToken, setRefreshToken } = useStore();
  const [ownedGames, setOwnedGames] = useState([]);
  const [recentGames, setRecentGames] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [isMypage, setIsMypage] = useState(false);
  const [steamProfileModalOpened, setSteamProfileModalOpened] = useState(false);
  const [deleteModalOpened, setDeleteModalOpened] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    console.log(id)
    if (id) {
      axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/account/profile?id=${id}`).then((response) => {
        if (response.status === 200) {
          console.log(response.data)
          const data = response.data.data;

          setIsMypage(data.is_mypage)

          if (data.owned_games?.game_count) {
            setOwnedGames(data.owned_games.games)
          }
          if (data.recent_games?.total_count) {
            setRecentGames(data.recent_games.games)
          }
          if (data.reviews_data) {
            setReviews(data.reviews_data)
          }
        }
      });

    }
  }, [id]);

  const handleSteamLogin = async () => {
    try {
      // 백엔드 API 호출
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/account/steam_login?page=mypage&user_id=${userInfo.user_id}`);
      const { auth_url } = await response.json();

      // 스팀 로그인 URL로 리다이렉트
      window.location.href = auth_url;
    } catch (error) {
      console.error("Failed to redirect to Steam login:", error);
    }
  };
  const handleUserDelete = async () => {
    axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/account/mypage/`).then((response) => {
      if (response.status === 200) {
          console.log(response.data)
          logout(); // zustand 상태에서 로그아웃 처리
          sessionStorage.removeItem('access_token');
          sessionStorage.removeItem('refresh_token');
          window.location.href = '/'; // 로그아웃 후 리다이렉트
      }
    }).catch((error) => {
        console.error('Error user delete:', error);
    });
  };

  const steamProfileAction = () => {
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/account/steam_profile/`, {
    }).then((response) => {
      console.log(response)
      if (response.data?.data?.steam_photo) {
        const photo = getProfilePhotoUrl(response.data.data.steam_photo);
        setUserInfo({ ...userInfo, photo: photo });
        setSteamProfileModalOpened(false);
      }
    }).catch((error) => {
      console.error(error);
    });
  };

  return (
    <div className="profileContainer">
      <div className="profile_wrap">
        <div className="profile_sidebar">
          <div className="user_photo">
            <img src={userInfo?.photo ? userInfo?.photo : "/images/default_profile.png"} alt="Profile" />
          </div>

          <div className="user_info">
            {isMypage && <a href={`/profile/${id}/edit/`}><button>편집하기</button></a>}
            <p id="user_user_id">아이디 : {userInfo?.user_id}</p>
            <p id="user_email">이메일 : {userInfo?.email}</p>
            <p id="user_nickname">닉네임 : {userInfo?.nickname}</p>
            <p id="user_age">나이 : {userInfo?.age}</p>
            {userInfo?.steamId && <p id="user_steamId">스팀ID : {userInfo.steamId}</p>}

            {isMypage && (
              userInfo?.steamId ? (
                <input type="button" name="steam_profile" className="steam_profile" value="스팀 프로필 이미지 사용" onClick={() => setSteamProfileModalOpened(true)} />
              ) : (
                <button className='btn btn-steam-login' onClick={handleSteamLogin}>스팀 로그인</button>
              )
            )}
          </div>
          <div className="user_delete">
            <h3>회원탈퇴</h3>
            <button className='btn btn-steam-login' onClick={()=>setDeleteModalOpened(true)}>회원탈퇴</button>
          </div>
        </div>

        <div className="games_content">
          <div className="owned_game">
            <h1>보유 게임</h1>
            <div className="game_list">
              {ownedGames.length > 0 ? (
                ownedGames.map((game, index) => {
                  const date = new Date(game.rtime_last_played * 1000);
                  const formattedDate = `${date.getFullYear()}년 ${String(date.getMonth() + 1).padStart(2, '0')}월 ${String(date.getDate()).padStart(2, '0')}일`;

                  return (
                    <div key={index} className="game_item">
                      <img src={`https://avatars.fastly.steamstatic.com/${game.img_icon_url}.jpg`} alt={game.name} />
                      <div className="game_info">
                        <span className="game_name">{game.name}</span>
                        {game.playtime_forever && <span className="game_time">플레이타임 {(game.playtime_forever / 60).toFixed(1)}시간</span>}
                        {game.rtime_last_played && <span className="game_last_played">최근 플레이 {formattedDate}</span>}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div>보유한 게임이 없습니다.</div>
              )}
            </div>
          </div>

          <div className="recent_game">
            <h1>최근플레이 게임</h1>
            <div className="game_list">
              {recentGames.length > 0 ? (
                recentGames.map((game, index) => (
                  <div key={index} className="game_item">
                    <img src={`https://avatars.fastly.steamstatic.com/${game.img_icon_url}.jpg`} alt={game.name} />
                    <div className="game_info">
                      <span className="game_name">{game.name}</span>
                      <span className="game_total_time">총 플레이타임 {(game.playtime_forever / 60).toFixed(1)}시간</span>
                      <span className="game_recent_time">지난 2주간 {(game.playtime_2weeks / 60).toFixed(1)}시간</span>
                    </div>
                  </div>
                ))
              ) : (
                <div>최근 플레이한 게임이 없습니다.</div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className='reviewWrap'>
        <div>
          <h1>작성한 리뷰</h1>
        </div>
        <div className='review_list'>{ reviews?.length > 0 && reviews.map((review) => {
          return (
            <div className="game_row" key={review.id || review.game_name} onClick={() => navigate(`/game/${review.app_id}?review_id=${review.id}`)}>
              <div className="game_title">
                  <div className="game_img">
                      {review.header_image && <img src={review.header_image} alt={review.game_name} />}
                  </div>
                  <div className="game_info">
                      <h4>{review.content}</h4>
                      <span>{review.game_name}</span>
                      <div className="categories">
                          {review.categories && review.categories.length > 0 && review.categories.map((category, cIndex) => {
                              return (
                                  <span className="category" key={cIndex}>{category}</span>
                              )
                          })}
                      </div>
                  </div>
              </div>
              <div className="game_rating">
                  <span>{review.nickname}</span>
                  <Rating value={review.score} fractions={2} readOnly />
                  <span>좋아요 수 {review.total_likes}</span>
                  <span>{dateformat2(review.created_at)}</span>
              </div>
          </div>
          )})
        }
        </div>
      </div>
      <SteamProfileModal opened={steamProfileModalOpened} onClose={() => setSteamProfileModalOpened(false)} onFetch={steamProfileAction} />
      <UserDeleteModal opened={deleteModalOpened} onClose={() => setDeleteModalOpened(false)} onDelete={handleUserDelete} />
    </div>
  );
}

export default Profile;


const SteamProfileModal = ({ opened, onClose, onFetch }) => {
  return (
    <Modal className='profileModal steamProfileModal' opened={opened} onClose={onClose} title="" centered size={'md'}>
      <Text size="sm">
        스팀 프로필 이미지를 가져올 수 있습니다. <br/>계속 진행하시겠습니까?
      </Text>
      <div className='actoinWrap'>
        <Button color="blue" fullWidth onClick={onFetch}>
          가져오기
        </Button>
        <Button fullWidth onClick={onClose}>
          취소
        </Button>
      </div>
    </Modal>
  );
};

const UserDeleteModal = ({ opened, onClose, onDelete }) => {
  return (
    <Modal className='profileModal userDeleteModal' opened={opened} onClose={onClose} title="" centered size={'md'}>
      <Text size="sm">
        탈퇴 후에는 계정이 복구되지 않습니다.<br/> 정말로 탈퇴하시겠습니까?
      </Text>
      <div className='actoinWrap'> 
        <Button color="red" fullWidth onClick={onDelete}>
          탈퇴
        </Button>
        <Button fullWidth onClick={onClose}>
          취소
        </Button>
      </div>
    </Modal>
  );
};