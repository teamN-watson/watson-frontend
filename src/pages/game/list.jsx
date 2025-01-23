import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '@assets/css/game/list.css';  // '@assets' 별칭을 사용하여 CSS 파일 import
import axios from '@src/axiosInstance';
import useStore from '@store/zustore';
import { useSearchParams } from 'react-router-dom';

export default function GameList() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [q, setQ] = useState(searchParams.get('query') || '');
    const [games, setGames] = useState([]);
    const [page, setPage] = useState(1);
    const [hasNext, setHasNext] = useState(true);
    const [loading, setLoading] = useState(false);
    const [isEmpty, setIsEmpty] = useState(false);


    const [query, setQuery] = useState(searchParams.get('query') || ''); // 초기값을 URL에서 가져옴

    const navigate = useNavigate();
    const scrollRef = useRef(null);
    const isFirstRender = useRef(true); // 첫 렌더링 여부를 추적

    const pagingInit = () => {
        setGames([]);
        setPage(1)
        setHasNext(true);
        setIsEmpty(false);
    }

    // 검색 요청을 수행하는 함수
    const fetchResults = async (q) => {
        if (!q) {
            setGames([]); // 검색어가 없으면 빈 배열 반환
            return;
        }
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

    // 페이지 로드 시 URL에 있는 쿼리로 검색 실행
    useEffect(() => {
        console.log(games)
        if (isFirstRender.current) {
            isFirstRender.current = false; // 첫 렌더링 이후 false로 설정
            if (query) fetchResults(query); // 쿼리가 있을 때만 요청
        }
    }, []); // 첫 렌더링 시 한 번 실행

    const handleSearch = async (e) => {
        e.preventDefault(); // 기본 제출 동작 방지
        pagingInit();
        if (loading) return;
        setLoading(true);
        fetchResults(q)
    };

    const onChange = (e) => {
        const searchQuery = e.target.value;
        setQ(searchQuery)
        setSearchParams({ query: searchQuery })
    }

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
            <div className='GameWrap'>
                <div className='search'>
                    <form>
                        <div className="search-bar">
                            <input type="text" name="q" placeholder="검색어를 입력해주세요" id="id_q" value={q} onChange={onChange} className="search-input" onKeyDown={handleKeyPress} />
                            <input type="submit" value="검색" onClick={handleSearch} className='search-button' />
                        </div>
                    </form>
                </div>
                <div className='game_list'>
                    {games && games.map((game) => {
                        return (
                            <div key={game.appID} onClick={() => navigate(`/game/${game.appID}`)} className='game_info'>
                                <div className='game_info1'>
                                    <img src={game.header_image} />

                                </div>
                                <div className='game_info2'>
                                    <h3>{game.name}</h3>
                                    <div className='game_genres'>
                                        {game.genres && game.genres.map((genre, genre_index) => {
                                            return (
                                                <span key={genre_index}>{genre}</span>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                    {isEmpty && <div className='empty_list'><h3>검색 결과가 없습니다.</h3></div>}
                    {games?.length > 0 && hasNext && <button className='more-button' onClick={fetchMoreItems}>더불러오기</button>}
                </div>

            </div>


        </div>
    )
}