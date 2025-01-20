import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '@src/axiosInstance';
import useStore from '@store/zustore';
import '@assets/css/account/signin.css';

export default function SignIn() {
    const [formData, setFormData] = useState({
        user_id: '',
        password: '',
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useStore();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/account/signin/`, formData);
            if (response.status === 200) {
                login(response.data.access_token, response.data.refresh_token);
                navigate('/');
            }
        } catch (error) {
            setError('아이디 또는 비밀번호가 올바르지 않습니다.');
        }
    };

    return (
        <div className="signin-container">
            <form className="signin-form" onSubmit={handleSubmit}>
                <div className="signin-header">
                    <h2>로그인</h2>
                    <p>Watson에 오신 것을 환영합니다</p>
                </div>
                
                <div className="input-group">
                    <label htmlFor="user_id">아이디</label>
                    <input
                        type="text"
                        id="user_id"
                        value={formData.user_id}
                        onChange={(e) => setFormData({...formData, user_id: e.target.value})}
                        required
                    />
                </div>

                <div className="input-group">
                    <label htmlFor="password">비밀번호</label>
                    <input
                        type="password"
                        id="password"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        required
                    />
                </div>

                {error && <div className="error-message">{error}</div>}

                <button type="submit" className="signin-button">
                    로그인
                </button>

                <div className="signin-footer">
                    <Link to="/signup">아직 계정이 없으신가요? 회원가입</Link>
                </div>
            </form>
        </div>
    );
}
