import React from 'react';

export default function SignupStep2({ step, formData, errors, updateFormData, handleSubmit, prevStep }) {
  return (
    <div className={`signupStep2 ${step === 2 ? 'active' : ''}`}>
      <div className="user_input">
        <input
          type="text"
          placeholder="나이를 입력해주세요"
          value={formData.age}
          onChange={(e) => updateFormData('age', e.target.value)}
        />
        {errors.age && <p className="error_msg">{errors.age}</p>}

        <input
          type="text"
          placeholder="닉네임을 입력해주세요"
          value={formData.nickname}
          onChange={(e) => updateFormData('nickname', e.target.value)}
        />
        {errors.nickname && <p className="error_msg">{errors.nickname}</p>}

        <input
          type="email"
          placeholder="이메일을 입력해주세요"
          value={formData.email}
          onChange={(e) => updateFormData('email', e.target.value)}
        />
        {errors.email && <p className="error_msg">{errors.email}</p>}
      </div>
      <div className="step_action">
        <button type="button" onClick={prevStep}>
          이전
        </button>
        <button type="button" onClick={handleSubmit}>
          다음
        </button>
      </div>
    </div>
  );
}
