import React, { useEffect, useState, useRef } from 'react';
import '@assets/css/chatbot/talk.css';  // '@assets' 별칭을 사용하여 CSS 파일 import
import axios from '@src/axiosInstance';

export default function IndexPage() {
    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([]);  // 채팅 기록 상태
    const chatEndRef = useRef(null);  // 스크롤을 위한 ref 추가

    // 스크롤 함수 추가
    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({
            block: "end",
            behavior: "smooth",
        });
    };

    // 채팅 기록이 업데이트될 때마다 스크롤
    useEffect(() => {
        if (chatHistory) {
            scrollToBottom();
        }
    }, [chatHistory]);

    useEffect(() => {
        axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/chatbot/record/`).then((response) => {
            if (response.status === 200) {
                console.log(response.data)
                const data = response.data;
                let newChatHistory = []

                data.forEach((chat, index) => {
                    if (chat.is_user) {
                        newChatHistory.push({
                            content: { message: chat.content.message },
                            is_user: chat.is_user,
                        });
                    } else {
                        if (chat.content.game_data) {
                            let game_history = [];
                            chat.content.game_data.forEach((game, index) => {
                                game_history.push(
                                    {
                                        title: `${index + 1}번 게임: ${game.title}`,
                                        content: game.description,
                                    }
                                )

                            });
                            newChatHistory.push({
                                content: { message: chat.content.message },
                                game_history: game_history,
                                is_user: false,
                            });
                        } else {
                            newChatHistory.push({
                                content: { message: chat.content.message },
                                is_user: false,
                            });
                        }

                    }

                });

                // 채팅 기록 상태 업데이트
                setChatHistory(newChatHistory);
            }
        }).catch((error) => {
            console.error('Error fetching user info:', error);
        });
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/chatbot/`,
                { message: message },
            ).then((response) => {
                const data = response.data;
                if (response.status === 200 || response.status === 201) {
                    console.log(response.data)

                    let newChatHistory = [
                        ...chatHistory,
                        {
                            content: { message: data.user_message.message },
                            is_user: true,
                        },
                    ];

                    // 게임 데이터가 있을 경우, 게임별 메시지 추가
                    let game_history = [];
                    if (data.bot_message.game_data) {
                        data.bot_message.game_data.forEach((game, index) => {
                            game_history.push(
                                {
                                    title: `${index + 1}번 게임: ${game.title}`,
                                    content: game.description,
                                }
                            )
                        });
                    }
                    newChatHistory = [
                        ...newChatHistory,
                        {
                            content: { message: data.bot_message.message },
                            game_history: game_history,
                            is_user: false,
                        },
                    ];

                    setChatHistory(newChatHistory);  // 상태 업데이트
                    setMessage("");  // 입력 필드 초기화
                }
            }).catch((error) => {
                console.error('Error chatbot record:', error);
            });
        } catch (error) {
            console.error('채팅 시작하는데 실패했습니다:', error);
        }

    };

    return (
        <div className="chatbotContainer">
            <div className="chatbot_wrap" id="wrap1">
                <div className="chatbot_record">
                    {chatHistory.length > 0 && chatHistory.map((chat, index) => (
                        <div key={index} className={chat.is_user ? "user" : "ai"}>
                            <div>
                                <p>{chat.content.message}</p>
                                {chat.game_history && chat.game_history.length > 0 && chat.game_history.map((game, index) => (
                                    <div key={index}>
                                        <p>{game.title}</p>
                                        <p>{game.content}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                    <div /> {/* 스크롤 위치용 ref */}
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="chatbot_input" ref={chatEndRef}>
                        <input
                            onChange={(e) => setMessage(e.target.value)}
                            type="text"
                            name="message"
                            placeholder="메시지를 입력해주세요."
                            value={message}
                        />
                    </div>
                </form>
            </div>
        </div>)
}