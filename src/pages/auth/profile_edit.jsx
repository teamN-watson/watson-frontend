import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '@src/axiosInstance';
import useStore from '@store/zustore';
import '@assets/css/account/edit.css';
import default_photo from '@assets/images/default_profile.png';
function ProfileEdit() {
  const { id } = useParams(); // URL에서 id 파라미터 가져오기
  const { isLoggedIn, userInfo, setUserInfo, logout, accessToken, refreshToken, setAccessToken, setRefreshToken } = useStore();
  const [photo, setPhoto] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const fileRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (userInfo && userInfo.id) {
      setPhoto(userInfo.photo)
      setAge(userInfo.age)
      setEmail(userInfo.email)
      setNickname(userInfo.nickname)
      console.log(userInfo)
    }


  }, [userInfo]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhoto(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const imgClick = () => {
    fileRef.current.click();
  }

  const handleSubmit = async (e) => {
    e.preventDefault(); // 기본 제출 동작 방지
    const formData = new FormData();

    if (photo) {
      formData.append('photo', photo);
    }
    formData.append('email', email);
    formData.append('age', age);
    formData.append('nickname', nickname);

    try {
      const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/account/mypage/`, formData);
      if (response.status == 200) {
        setUserInfo({ ...userInfo, email: email, age: age, nickname: nickname, photo: photo ? photo : "" })
        navigate(-1);
      }

      console.log(response.data)
    } catch (error) {
      console.error(error);
      // setErrors(error.response?.data || {});
    }
  };

  return (
    <div className="editContainer">
      <h2>회원 수정</h2>
      <form method="PUT" encType="multipart/form-data">
        <div className="editForm">
          <div className="user_photo_wrap">
            <div className="user_photo">
              <img id="user_photo" src={photo ? photo : default_photo} alt="사용자 프로필" onClick={imgClick} />
            </div>
            <label htmlFor="id_photo">📸 프로필 사진 올리기</label>
            <input ref={fileRef} type="file" name="photo" accept="image/*" id="id_photo" onChange={handleImageChange} readOnly />
          </div>
          <div>
            <span>나이</span>
            <input type="text" name="age" placeholder="나이를 입력해주세요" id="id_age" value={age} onChange={(e) => setAge(e.target.value)} />
            <p className="error_msg age"></p>
            <span>닉네임</span>
            <input type="text" name="nickname" placeholder="닉네임을 입력해주세요" id="id_nickname" value={nickname} onChange={(e) => setNickname(e.target.value)} />
            <p className="error_msg nickname"></p>
            <span>이메일</span>
            <input type="email" name="email" placeholder="이메일을 입력해주세요" id="id_email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <p className="error_msg email"></p>
          </div>
          <span className="error_msg"></span>
          <input type="submit" value="회원 수정" onClick={handleSubmit} />
        </div>
      </form>
    </div>
  );
}

export default ProfileEdit;
