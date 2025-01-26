import React, { useEffect, useState, useRef } from 'react';
import '@assets/css/chatbot/talk.css';  // '@assets' 별칭을 사용하여 CSS 파일 import
import axios from '@src/axiosInstance';
import useStore from '@store/zustore';
import { notifications } from '@mantine/notifications';
import { useNavigate } from 'react-router-dom';

export default function IndexPage() {
    const [isStart, setIsStart] = useState(false);
    const [isSide, setIsSide] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMsg, setLoadingMsg] = useState("게임을 찾는 중입니다.");

    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([]);  // 채팅 기록 상태
    const [gameDescription, setGameDescription] = useState([]);  // 채팅 기록 상태
    const chatEndRef = useRef(null);  // 스크롤을 위한 ref 추가
    const chatInputRef = useRef(null);  // 스크롤을 위한 ref 추가
    const { isLoggedIn } = useStore();
    const navigate = useNavigate();

    // 스크롤 함수 추가
    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({
            block: "end",
            behavior: "smooth",
        });
        chatInputRef.current?.scrollIntoView({
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

    const message_setting = (data) => {
        let newChatHistory = []
        let lastGameContent = null; // game_data가 있는 마지막 값 저장

        data.forEach((chat, index) => {
            if (chat.is_user) {
                newChatHistory.push({content: { message: chat.content.message },is_user: chat.is_user,});
            } else {
                if (chat.content.game_data) {
                    let game_history = [];

                    chat.content.game_data.forEach((game, index) => {
                        game_history.push({title: `${index + 1}번 게임: ${game.title}`})
                    });

                    lastGameContent = chat.content.game_data;

                    
                    newChatHistory.push({content: { message: chat.content.message },game_history: game_history,is_user: false,game_data:chat.content.game_data},);
                } else {
                    newChatHistory.push({content: { message: chat.content.message },is_user: false,});
                    lastGameContent = null;
                }

            }

        });
        setGameDescription(lastGameContent)
        if(lastGameContent?.length > 0){
            setTimeout(() => {
                setIsSide(true)
            }, 500);
        }

        // 채팅 기록 상태 업데이트
        setChatHistory(newChatHistory);
        scrollToBottom();
    }
    const chatbot_init = async () => {
        if(isLoggedIn){
            await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/chatbot/record/`).then((response) => {
                if (response.status === 200) {
                    console.log(response.data)
                    message_setting(response.data);
                    setIsStart(true);
                } else if(response.status === 204){
    
                }
            }).catch((error) => {
                console.error('Error fetching user info:', error);
            });
        } else {
            notifications.show({
                title: '로그인 필요',
                message: '로그인이 필요합니다.',
                color:"red"
            });
        }

    }
    const chatbot_start = async () => {
        if(isLoggedIn){
            setIsLoading(true);
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/chatbot/record/`).then((response) => {
                if (response.status === 200) {
                    console.log(response.data);
                    message_setting(response.data);
                    setIsStart(true);
                }
            }).catch((error) => {
                console.error('Error fetching user info:', error);
            }).finally(() => {
                setIsLoading(false);
            });
        } else {
            notifications.show({
                title: '로그인 필요',
                message: '로그인이 필요합니다.',
                color:"red"
            });
        }
    }
    useEffect(() => {
        console.log(isLoggedIn)
        if (isLoggedIn !== null) {
            chatbot_init();
        }
    }, [isLoggedIn]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSide(false);
        setGameDescription([]);

        let newChatHistory = [...chatHistory,
            {content: { message: message },is_user: true,},
        ];

        setChatHistory(newChatHistory);  // 상태 업데이트

        try {
            setIsLoading(true);
            const loadingMessages = ["게임을 찾는 중입니다.", "게임을 찾는 중입니다..", "게임을 찾는 중입니다..."];
            let index = 0;

            const interval = setInterval(() => {
                setLoadingMsg(loadingMessages[index])
                index = (index + 1) % loadingMessages.length; // 0 -> 1 -> 2 -> 0 반복
            }, 500); // 500ms 간격으로 업데이트

            await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/chatbot/`,
                { message: message },
            ).then((response) => {
                const data = response.data;
                if (response.status === 200 || response.status === 201) {
                    console.log(response.data)

                    let newChatHistory = [...chatHistory,
                        {content: { message: data.user_message.message },is_user: true,},
                    ];

                    // 게임 데이터가 있을 경우, 게임별 메시지 추가
                    let game_history = [];
                    let game_data = data.bot_message?.game_data
                    if (game_data) {
                        game_data.forEach((game, index) => {
                            game_history.push({title: `${index + 1}번 게임: ${game.title}`})
                        });

                        setGameDescription(game_data)
                        if(game_data?.length > 0){
                            setTimeout(() => {
                                setIsSide(true)
                            }, 500);
                        }
                    
                    }
                    newChatHistory = [...newChatHistory,
                        {content: { message: data.bot_message.message },game_history: game_history,is_user: false,},
                    ];

                    if (data.bot_guide){
                        newChatHistory = [...newChatHistory,
                            {content: { message: data.bot_guide.message },is_user: false,},
                        ];
                    }                    

                    setChatHistory(newChatHistory);  // 상태 업데이트
                    setMessage("");  // 입력 필드 초기화
                }
            }).catch((error) => {
                console.error('Error chatbot record:', error);
            }).finally(() => {
                clearInterval(interval);
                setIsLoading(false);
            });
        } catch (error) {
            console.error('채팅 시작하는데 실패했습니다:', error);
        }
    };
    
    const handleReset = async (e) => {
        e.preventDefault();
        axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/chatbot/`).then((response) => {
            if (response.status === 200) {
                console.log(response.data)

                // 채팅 기록 상태 업데이트
                setChatHistory([]);
                setIsStart(false);
            }
        }).catch((error) => {
            console.error('Error fetching user info:', error);
        });
    }

    const gameDataClick = (index) => {
        console.log(chatHistory[index])
        if(chatHistory[index]["game_data"]){
            setGameDescription(chatHistory[index]["game_data"])
        }

    }

    return (
        <div className="chatbotContainer">
            <div className="chatbot_wrap" id="wrap1">
                <div className='chatbot_header'>
                    <h2>WATSON</h2>
                    <div className='popup_btn'>
                        <button onClick={handleReset}>초기화</button>
                    </div>
                </div>
                <div className="chatbot_record">
                    {chatHistory.length > 0 && chatHistory.map((chat, index) => (
                        <div key={index} className={`${chat.is_user ? "user" : "ai"} ${chat.game_history ? "history" : ""}`} onClick={() => gameDataClick(index)}>
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
                    <div ref={chatEndRef}/> {/* 스크롤 위치용 ref */}
                </div>
                <form onSubmit={handleSubmit}>
                    {isStart ?
                        <div className="chatbot_input" ref={chatInputRef} >
                            <input
                                onChange={(e) => setMessage(e.target.value)}
                                type="text"
                                name="message"
                                placeholder="메시지를 입력해주세요."
                                value={message}
                            />
                        </div>
                        :
                        <div className="chatbot_input">
                            <input
                                type="button"
                                name="start"
                                value="챗봇 시작하기" 
                                onClick={chatbot_start}
                            />
                        </div>
                    }
                </form>
            </div>
            { gameDescription?.length > 0 && 
            <div className={`description_wrap ${isSide ? "active" : ""}`}>
                <div className='descriptionHeader'>
                    <span>추천 게임</span>
                    <span>게임 소개</span>
                    <span>추천 이유</span>
                    <span>반대 이유</span>
                </div>
                <div className='descriptionRow'>
                    { gameDescription.map((game, game_index) => {
                        return (
                            <div className='gameWrap' key={game_index} onClick={()=> navigate(`/game/${game.steam_app_id}`)}>
                                <div className='imgWrap'>
                                    <img src={game.image} />
                                </div>
                                <div className='gameDetails'>
                                    <span>{game.description}</span>
                                </div>
                                <div className='gameDetails'>
                                    <span>{game.good_review}</span>
                                </div>
                                <div className='gameDetails'>
                                    <span>{game.bad_review}</span>                                    
                                </div>
                            </div>
                        )
                    }) }

                </div>
            </div>}
            <div className={`loadingWrap ${isLoading ? "loading" : ""}`}>
                <img src={"/images/search_loading.gif"} />
                <span>{ loadingMsg }</span>
            </div>
        </div>)
}