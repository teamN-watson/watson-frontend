import React from 'react';
import InterestList from './InterestList';

export default function SignupStep3({ step, formData, errors, updateFormData, prevStep, handleSubmit, games, selectedGames, handleSelectGame }) {
  return (
    <div className={`signupStep3 ${step === 3 ? 'active' : ''}`}>
      <div className="user_interest">
        <div className="interest_txt">
          <h2>{formData.nickname || 'User'} 님, 좋아하는 게임을 선택해주세요</h2>
          <span>3개 이상의 게임을 선택하시면 취향에 맞는 게임을 추천해드립니다</span>
        </div>
        
        <InterestList 
          games={games} 
          selectedGames={selectedGames} 
          onGameSelect={handleSelectGame} 
        />
        
        {errors.games && <p className="error_msg">{errors.games}</p>}
        
        <div className="step_action">
          <button type="button" onClick={prevStep} className="prevButton">
            이전
          </button>
          <button type="button" onClick={handleSubmit} className="nextButton">
            회원가입 완료
          </button>
        </div>
      </div>
    </div>
  );
}
