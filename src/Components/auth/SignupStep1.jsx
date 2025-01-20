import React, { useRef } from 'react';
import default_photo from '@assets/images/default_profile.png';

export default function SignupStep1({ step, formData, errors, handleImageChange, updateFormData, handleSubmit }) {
  const imgRef = useRef();

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className={`signupStep1 ${step === 1 ? 'active' : ''}`}>
      <div className="user_photo_wrap">
        <label className="user_photo" htmlFor="photo_upload">
          {formData.photo_result && (
            <img src={formData.photo_result} alt="프로필 사진" />
          )}
          <div className="user_photo_overlay">
            <span className="user_photo_icon">📷</span>
          </div>
          <input
            type="file"
            id="photo_upload"
            name="photo"
            accept="image/*"
            onChange={handleImageChange}
          />
        </label>
      </div>
      <div className="user_input">
        <label htmlFor="user_id">아이디</label>
        <input
          id="user_id"
          type="text"
          placeholder="아이디를 입력해주세요"
          value={formData.user_id}
          onChange={(e) => updateFormData('user_id', e.target.value)}
          onKeyPress={handleKeyPress}
        />
        {errors.user_id && <p className="error_msg">{errors.user_id}</p>}

        <label htmlFor="password">비밀번호</label>
        <input
          id="password"
          type="password"
          placeholder="비밀번호를 입력해주세요"
          value={formData.password}
          onChange={(e) => updateFormData('password', e.target.value)}
          onKeyPress={handleKeyPress}
        />
        {errors.password && <p className="error_msg">{errors.password}</p>}

        <label htmlFor="confirm_password">비밀번호 확인</label>
        <input
          id="confirm_password"
          type="password"
          placeholder="비밀번호를 다시 입력해주세요"
          value={formData.confirm_password}
          onChange={(e) => updateFormData('confirm_password', e.target.value)}
          onKeyPress={handleKeyPress}
        />
        {errors.confirm_password && <p className="error_msg">{errors.confirm_password}</p>}
      </div>
      <div className="step_action">
        <button type="button" onClick={handleSubmit} className="nextButton">
          다음
        </button>
      </div>
    </div>
  );
}
