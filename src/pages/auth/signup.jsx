import React, { useState, useEffect } from 'react';
import SignupStep1 from '@Components/auth/SignupStep1';
import SignupStep2 from '@Components/auth/SignupStep2';
import SignupStep3 from '@Components/auth/SignupStep3';
import useStore from '@store/zustore';
import axios from '@src/axiosInstance';
import '@assets/css/account/signup.css';
import { useLocation } from "react-router-dom";

export default function SignupPage() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const claimedId = params.get("openid.claimed_id");
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    user_id: '',
    password: '',
    confirm_password: '',
    age: '',
    nickname: '',
    email: '',
    photo: '',
    photo_result: '',
  });
  const [games, setGames] = useState([]); // 전체 게임 데이터
  const [selectedGames, setSelectedGames] = useState([]); // 선택된 게임


  const [errors, setErrors] = useState({});
  const login = useStore((state) => state.login);

  // 스텝 이동
  const nextStep = () => setStep((prev) => Math.min(prev + 1, 3));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));


  useEffect(() => {
    // 게임 데이터를 가져오는 API
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/account/interest/`).then((response) => {
      setGames(response.data)
      console.log(response.data)
    }).catch((error) => {
      console.error("Failed to fetch games:", error)
    });
  }, []);

  // 선택한 게임 업데이트
  const handleSelectGame = (id) => {
    if (selectedGames.includes(id)) {
      setSelectedGames(selectedGames.filter((game_id) => game_id !== id)); // 선택 해제
    } else {
      setSelectedGames([...selectedGames, id]); // 선택 추가
    }
  };
  // 입력 데이터 업데이트
  const updateFormData = (field, value) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // 기본 제출 동작 방지
    const formData = new FormData();
    const currentStep = step;

    // Step 1: 아이디, 비밀번호, 확인 비밀번호
    formData.append('step', currentStep);
    if (currentStep === 1 || currentStep == 3) {
      formData.append('photo', data["photo"] || "");
      formData.append('user_id', data["user_id"] || "");
      formData.append('password', data["password"] || "");
      formData.append('confirm_password', data['confirm_password'] || "");
    }

    // Step 2: 나이, 닉네임, 이메일
    if (currentStep === 2 || currentStep == 3) {
      formData.append('age', data['age'] || "");
      formData.append('nickname', data['nickname'] || "");
      formData.append('email', data['email'] || "");
    }

    // Step 3: 선택한 게임 목록 (if needed)
    if (currentStep === 3) {
      if (selectedGames.length < 3) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          games: "3개 이상의 게임을 선택해주세요",
        }));
        return;
      } else {
        formData.append('select_id', Array.from(selectedGames).join(','));
        if (claimedId) {
          const steam_id = claimedId.split("/")[claimedId.split("/").length - 1]
          formData.append('steamId', steam_id);

        }
      }
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/account/signup/`, formData);
      if (response.data.user && response.data.access_token && response.data.refresh_token) {
        console.log("회원가입 성공")
        login(response.data.user, response.data.access_token, response.data.refresh_token);
        window.location.href = '/';
      } else {
        nextStep();
      }
    } catch (error) {
      console.error(error);
      setErrors(error.response?.data || {});
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setData({ ...data, ["photo_result"]: e.target.result, ["photo"]: file });
      };
      reader.readAsDataURL(file);
    }
  };


  return (
    <div className="signContainer">
      <h2>회원 가입</h2>
      <form>
        <div className="signupStepForm">
          {step === 1 && (
            <SignupStep1
              step={step}
              formData={data}
              errors={errors}
              handleImageChange={handleImageChange}
              updateFormData={updateFormData}
              handleSubmit={handleSubmit}
            />
          )}
          {step === 2 && (
            <SignupStep2
              step={step}
              formData={data}
              errors={errors}
              updateFormData={updateFormData}
              handleSubmit={handleSubmit}
              prevStep={prevStep}
            />
          )}
          {step === 3 && (
            <SignupStep3
              step={step}
              formData={data}
              errors={errors}
              updateFormData={updateFormData}
              prevStep={prevStep}
              handleSubmit={handleSubmit}
              games={games}
              selectedGames={selectedGames}
              handleSelectGame={handleSelectGame}
            />
          )}
        </div>
      </form>
    </div>
  );
}
