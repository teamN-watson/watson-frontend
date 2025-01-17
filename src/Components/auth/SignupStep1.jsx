import React, { useRef } from 'react';
import default_photo from '@assets/images/default_profile.png';

export default function SignupStep1({ step, formData, errors, updateFormData, handleSubmit, handleImageChange }) {
  const imgRef = useRef();


  return (
    <div className={`signupStep1 ${step === 1 ? 'active' : ''}`}>
      <div className="user_photo_wrap">
        <div className="user_photo">
          <img id="user_photo" src={formData.photo_result ? formData.photo_result : default_photo} alt="사용자 프로필" />
        </div>
        <label htmlFor="id_photo">📸 프로필 사진 올리기</label>
        <input type="file" name="photo" accept="image/*" id="id_photo" ref={imgRef} onChange={handleImageChange} />
      </div>
      <div className="user_input">
        <input
          type="text"
          placeholder="아이디를 입력해주세요"
          value={formData.user_id}
          onChange={(e) => updateFormData('user_id', e.target.value)}
        />
        {errors.user_id && <p className="error_msg">{errors.user_id}</p>}

        <input
          type="password"
          placeholder="비밀번호를 입력해주세요"
          value={formData.password}
          onChange={(e) => updateFormData('password', e.target.value)}
        />
        {errors.password && <p className="error_msg">{errors.password}</p>}

        <input
          type="password"
          placeholder="비밀번호를 다시 입력해주세요"
          value={formData.confirm_password}
          onChange={(e) => updateFormData('confirm_password', e.target.value)}
        />
        {errors.confirm_password && <p className="error_msg">{errors.confirm_password}</p>}
      </div>
      <div className="step_action">
        <button type="button" onClick={handleSubmit}>
          다음
        </button>
      </div>
    </div>
  );
}
