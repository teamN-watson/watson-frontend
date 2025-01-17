import React from 'react';
import InterestList from './InterestList';

export default function SignupStep3({ step, formData, errors, updateFormData, prevStep, handleSubmit, games, selectedGames, handleSelectGame }) {
  // const handleGameSelect = (gameId) => {
  //   const selected = selectedGames.includes(gameId)
  //     ? selectedGames.filter((id) => id !== gameId)
  //     : [...selectedGames, gameId];
  //   updateFormData('selectedGames', selected);
  // };

  return (
    <div className={`signupStep3 ${step === 3 ? 'active' : ''}`}>
      <div className="user_interest">
        <div className="interst_txt">
          <h2>assad 님, 좋아하는 게임을 3개 이상 선택해주세요</h2>
          <span>취향에 꼭 맞는 게임을 찾아드리는 데 도움이 됩니다. 마음에 드는 콘텐츠를 선택하세요.</span>
        </div>
        <InterestList games={games} selectedGames={selectedGames} onGameSelect={handleSelectGame} />
      </div>
      {errors.games && <p className="error_msg">{errors.games}</p>}
      <div className="step_action">
        <button type="button" onClick={prevStep}>
          이전
        </button>
        <button type="button" onClick={handleSubmit}>
          회원 가입
        </button>
      </div>
    </div>
  );
}
