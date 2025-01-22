import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '@src/axiosInstance';
import useStore from '@store/zustore';
import '@assets/css/input.css';
import '@assets/css/account/edit.css';
import default_photo from '@assets/images/default_profile.png';
function ProfileEdit() {
  const { id } = useParams(); // URL에서 id 파라미터 가져오기
  const { isLoggedIn, userInfo, setUserInfo, logout, accessToken, refreshToken, setAccessToken, setRefreshToken } = useStore();
  const [photo, setPhoto] = useState("");
  const [photoFile, setPhotoFile] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});
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
    const MAX_FILE_SIZE = 2.5 * 1024 * 1024; // 5MB (백엔드 제한 크기에 맞춤)
    const file = event.target.files[0];
    setError("")
    if (file.size > MAX_FILE_SIZE) {
      setError("파일 크기가 너무 큽니다. 2.5MB 이하의 파일을 업로드해주세요.");
      return;
    }
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoFile(file);
        setPhoto(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // 기본 제출 동작 방지
    const formData = new FormData();

    if (photo) {
      formData.append('photo', photoFile);
    }
    formData.append('email', email);
    formData.append('age', age);
    formData.append('nickname', nickname);

    try {
      const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/account/mypage/`, formData);
      if (response.status == 201) {
        setUserInfo({ ...userInfo, email: email, age: age, nickname: nickname, photo: photo ? photo : "" })
        navigate(-1);
      }

      console.log(response.data)
    } catch (error) {
      console.error(error);
      setErrors(error.response?.data || {});
      setError(error.message || {});
    }
  };

  return (
    <div className="editContainer">
      <h2>회원 수정</h2>
      <form method="PUT" encType="multipart/form-data">
        <div className="editForm">
          <div className="user_photo_wrap">
            <label className="user_photo" htmlFor="photo_upload">
              <img src={photo !== '' ? photo : default_photo} alt="프로필 사진" />
              <div className="user_photo_overlay">
                <span className="user_photo_icon">📷</span>
              </div>
              <input
                type="file"
                id="photo_upload"
                name="photo"
                accept="image/*"
                onChange={handleImageChange} ref={fileRef}
              />
            </label>
          </div>
          <div>
            <div className="input-group">
              <label htmlFor="id_age">나이</label>
              <input type="text" id="id_age" placeholder="나이를 입력해주세요" value={age} onChange={(e) => setAge(e.target.value)} required />
            </div>
            {errors.age && <p className="error-message">{errors.age}</p>}
            <div className="input-group">
              <label htmlFor="id_age">나이</label>
              <input type="text" name="nickname" placeholder="닉네임을 입력해주세요" id="id_nickname" value={nickname} onChange={(e) => setNickname(e.target.value)} />
            </div>
            {errors.nickname && <p className="error-message">{errors.nickname}</p>}

            <div className="input-group">
              <label htmlFor="id_age">이메일</label>
              <input type="email" name="email" placeholder="이메일을 입력해주세요" id="id_email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
          </div>
          {errors.email && <p className="error-message">{errors.email}</p>}

          <input type="submit" className='action-button' value="회원 수정" onClick={handleSubmit} />
        </div>
      </form>
    </div>
  );
}

export default ProfileEdit;
