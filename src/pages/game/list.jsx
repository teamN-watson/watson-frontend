import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '@assets/css/game/list.css';  // '@assets' 별칭을 사용하여 CSS 파일 import
import axios from '@src/axiosInstance';
import useStore from '@store/zustore';

export default function GameList() {
    const [q, setQ] = useState("");
    const [games, setGames] = useState([]);
    const [page, setPage] = useState(1);
    const [hasNext, setHasNext] = useState(true);
    const [loading, setLoading] = useState(false);
    const [isEmpty, setIsEmpty] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {

    }, []);

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

    return (
        <div className="GamelistContainer">
            <div className='titleWrap'>
                <h1>게임 검색</h1>
            </div>
            <div className='listWrap'>
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

            </div>


        </div>
    )
}