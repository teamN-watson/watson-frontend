import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '@assets/css/review/create.css';  // '@assets' 별칭을 사용하여 CSS 파일 import
import '@assets/css/input.css';
import axios from '@src/axiosInstance';
import { useDisclosure } from '@mantine/hooks';
import { Modal, Button } from '@mantine/core';
import search_loading from '@assets/images/search_loading.gif';  // .gif에서 .png로 변경

export default function ReviewCreate() {
    const [content, setContent] = useState("");
    const [app_id, setAppId] = useState("");
    const [selectGame, setSelectGame] = useState({});
    const [score, setScore] = useState(0);

    const [opened, { open, close }] = useDisclosure(false);
    const [q, setQ] = useState("");

    const [games, setGames] = useState([]);
    const [page, setPage] = useState(1);
    const [hasNext, setHasNext] = useState(true);
    const [loading, setLoading] = useState(false);
    const [isEmpty, setIsEmpty] = useState(false);

    const navigate = useNavigate();
    const scrollRef = useRef(null);

    useEffect(() => {

    }, []);

    const pagingInit = () => {
        setGames([]);
        setPage(1)
        setHasNext(true);
        setIsEmpty(false);
    }

    const handleSubmit = async (e) => {
        e.preventDefault(); // 기본 제출 동작 방지
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/reviews/`,
                { content: content, app_id: app_id, score: score },
            );

            console.log(response)
            if (response.status == 201) {
                // navigate(`/game/${app_id}`)
            }

        } catch (error) {
            console.error(error);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault(); // 기본 제출 동작 방지
        pagingInit();
        if (loading) return;
        setLoading(true);
        if (q) {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/api/reviews/games/search?q=${q}`,
                );

                console.log(response.data)
                const data = response.data;
                if (response.status) {
                    setGames((prevGames) => [...prevGames, ...data.games]); // 기존 데이터에 추가
                    setHasNext(data.has_next); // 다음 페이지 여부 갱신
                    setPage((prevPage) => prevPage + 1); // 페이지 증가
                }
            } catch (error) {
                console.error(error);
                if (error.response?.data?.detail == "검색 결과가 없습니다.") {
                    setIsEmpty(true);
                }
            } finally {
                setLoading(false);
            }
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSearch(e);
        }
    };
    const fetchMoreItems = async () => {
        if (!hasNext || loading) return;
        setLoading(true);
        if (q) {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/api/reviews/games/search?q=${q}&page=${page}`,
                );

                console.log(response.data)
                const data = response.data;
                if (response.status == 200) {
                    setGames((prevGames) => [...prevGames, ...data.games]); // 기존 데이터에 추가
                    setHasNext(data.has_next); // 다음 페이지 여부 갱신
                    setPage((prevPage) => prevPage + 1); // 페이지 증가
                }

            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
    };
    const onClose = () => {
        pagingInit();
        setQ("")
        close();
    }

    const onIntersection = (entries) => {
        const firstEntry = entries[0];

        // 첫 번째 entry가 화면에 나타나고 더 많은 데이터를 불러올 수 있는 상태(hasNext)인 경우 fetchMoreItems 함수를 호출.
        if (firstEntry.isIntersecting && hasNext) {
            console.log("more")
            fetchMoreItems();
        }
    };

    // 컴포넌트 렌더링 이후에 실행되며 Intersection Observer를 설정
    useEffect(() => {
        const observer = new IntersectionObserver(onIntersection);

        //scrollRef가 현재 존재하면 observer로 해당 요소를 관찰.
        if (scrollRef.current) {
            observer.observe(scrollRef.current);
        }

        // 컴포넌트가 언마운트되거나 더 이상 관찰할 필요가 없을 때(observer를 해제할 때)반환.
        return () => {
            if (scrollRef.current) {
                observer.unobserve(scrollRef.current);
            }
        };
    }, [scrollRef.current, hasNext, loading]);

    const search_click = (game) => {
        setSelectGame(game)
        setAppId(game.appID)
        onClose();

    }
    return (
        <div className="ReviewContainer">
            <h2>리뷰 등록</h2>
            <form>
                <div className="reviewForm">
                    <div className="input-group">
                        <label htmlFor="id_age">내용</label>
                        <input type="text" name="content" placeholder="내용을 입력해주세요" id="id_content" value={content} onChange={(e) => setContent(e.target.value)} />
                    </div>
                    <p className="error-message content"></p>
                    <div className="input-group">
                        <label onClick={open}>게임</label>
                        {
                            selectGame &&
                            <div className='game_info'>
                                <img src={selectGame.header_image} />
                                <span>{selectGame.name}</span>
                            </div>
                        }
                        <Button variant="default" onClick={open}>
                            게임 선택
                        </Button>
                        <input type="hidden" name="app_id" placeholder="app id를 입력해주세요" id="id_app_id" value={app_id} onChange={(e) => setAppId(e.target.value)} />
                    </div>
                    <p className="error-message app_id"></p>
                    <div className="input-group">
                        <label htmlFor="id_age">점수</label>
                        <input type="text" name="score" placeholder="score를 입력해주세요" id="id_score" value={score} onChange={(e) => setScore(e.target.value)} />
                    </div>
                    <p className="error-message score"></p>
                    <span className="error-message"></span>

                    <input type="submit" value="리뷰 등록" onClick={handleSubmit} className='action-button' />
                </div>
            </form>

            <Modal opened={opened} onClose={onClose} title="게임 검색" className='gameModal'>
                <form>
                    <div className="search-bar">
                        <input type="text" name="q" placeholder="검색어를 입력해주세요" id="id_q" value={q} onChange={(e) => setQ(e.target.value)} className="search-input" onKeyDown={handleKeyPress} />
                        <input type="submit" value="검색" onClick={handleSearch} className='search-button' />
                    </div>
                </form>
                <div className='game_list'>
                    {games && games.map((game, index) => {
                        return (
                            <div key={index} onClick={() => search_click(game)}>
                                <img src={game.header_image} />
                                <span>{game.name}</span>
                            </div>
                        )
                    })}
                    {isEmpty && <div className='empty_list'><h3>검색 결과가 없습니다.</h3></div>}
                    {games && games.length && hasNext && (
                        <div className='load_more' ref={scrollRef} style={{ textAlign: 'center' }}>
                            <img src={search_loading} />
                        </div>
                    )}
                </div>
            </Modal>
        </div >
    )
}