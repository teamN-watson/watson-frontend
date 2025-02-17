import React from 'react';

export default function SignupStep2({ step, formData, errors, updateFormData, handleSubmit, prevStep }) {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className={`signupStep2 ${step === 2 ? 'active' : ''}`}>
      <div className="input-group">
        <label htmlFor="age">나이</label>
        <input
          type="text"
          placeholder="나이를 입력해주세요"
          value={formData.age}
          onChange={(e) => updateFormData('age', e.target.value)}
          onKeyPress={handleKeyPress}
        />
        {errors.age && <p className="error-message">{errors.age}</p>}
        <label htmlFor="nickname">닉네임</label>
        <input
          type="text"
          placeholder="닉네임을 입력해주세요"
          value={formData.nickname}
          onChange={(e) => updateFormData('nickname', e.target.value)}
          onKeyPress={handleKeyPress}
        />
        {errors.nickname && <p className="error-message">{errors.nickname}</p>}
        <label htmlFor="email">이메일</label>
        <input
          type="email"
          placeholder="이메일을 입력해주세요"
          value={formData.email}
          onChange={(e) => updateFormData('email', e.target.value)}
          onKeyPress={handleKeyPress}
        />
        {errors.email && <p className="error-message">{errors.email}</p>}
      </div>
      <div className="step_action">
        <button type="button" onClick={prevStep} className="prevButton">
          이전
        </button>
        <button type="button" onClick={handleSubmit} className="nextButton">
          다음
        </button>
      </div>
    </div>
  );
}
