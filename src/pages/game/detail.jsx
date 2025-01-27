import React, { useEffect, useState, useRef } from 'react';
import '@assets/css/game/detail.css';  // '@assets' 별칭을 사용하여 CSS 파일 import
import '@assets/css/game/detail_modal.css';  // '@assets' 별칭을 사용하여 CSS 파일 import
import axios from '@src/axiosInstance';
import { useNavigate, useParams } from 'react-router-dom';
import { dateformat, dateformat2 } from '@src/utils';
import YouTubePlayer from '../../Components/game/YoutubePlayer';
import { Modal, Rating } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import Review from '../../Components/review/Review';
import useStore from '@store/zustore';
import ReviewCommentContainer from '../../Components/review/Comment';

export default function GameDetail() {
    const { isLoggedIn } = useStore();
    const { id } = useParams(); // URL에서 id 파라미터 가져오기
    const [rand, setRand] = useState(null);
    const [game, setGame] = useState({});
    const [video, setVideo] = useState({});
    const [reviews, setReviews] = useState([]);
    const [my_review, setMyReview] = useState(null);
    const [clicked_review, setClickedReview] = useState(null);
    const [select_review, setSelectReview] = useState(null);
    
    const [content, setContent] = useState(""); // 댓글 값
    
    const [gameData, setGameData] = useState({});
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false); // 로딩 상태 추가
    
    const [opened, { open, close }] = useDisclosure(false); // 모달 상태

    const isFirstRender = useRef(true); // 첫 렌더링 여부를 추적
    const navigate = useNavigate();

    const query = new URLSearchParams(window.location.search);
    const review_id = query.get("review_id") || 0;

    useEffect(() => {
        const fetchGame = async () => {
            setIsLoading(true)
            axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/reviews/game?game_id=${id}&review_id=${review_id}`).then((response) => {
                if (response.status === 200) {
                    const data = response.data;
                    console.log(data)
                    const game = data.game

                    // 평균 점수
                    if(data.average_score)  game.average_score = Math.ceil(data.average_score);     
                    // 총 리뷰 수
                    if(data.total_reviews)  game.total_reviews = data.total_reviews;                

                    setGame(game)

                    if(data.video){
                        setVideo(data.video)
                    }
                    setMyReview(data.my_review)
                    setReviews(data.reviews)
                    setClickedReview(data.clicked_review)
                    if(data.steam_data?.name){
                        setGameData(data.steam_data); // 해당 AppID에 맞는 게임 데이터
                    }
                }
            }).catch((error) => {
                console.error('Error fetching user info:', error);
            }).finally(()=>{
                setIsLoading(false);
            });
        }
        if (isFirstRender.current && id) {
            setRand(Math.floor(Math.random() * 5));
            isFirstRender.current = false; // 첫 렌더링 이후 false로 설정
            fetchGame();
        }
    }, [id]);

    const reviewClick = (review) => {
        console.log(review)
        setContent("");
        setSelectReview(review);
        open();
    }

    const new_comment = async (e) => {
        console.log(select_review.id);
        e.preventDefault();

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/reviews/${select_review.id}/comments/`,
                { content: content },
            );

            if (response.status == 201) {
                const newComment = response.data;
                setSelectReview((prev) => ({
                    ...prev,
                    comments: [newComment, ...prev.comments],
                }));

                setContent("")
                
            }

            console.log(response)
        } catch (error) {
            console.error(error);
        }
    };

    const onClose = () => {
        close();
    }

    const decodeHtml = (html) => {
        const txt = document.createElement("textarea");
        txt.innerHTML = html;
        return txt.value;
      };
    
    return (
        <div className="GamedetailContainer">
            <div className='game_header'>
                <div className='bg_game_img'>
                    {gameData.screenshots && <img src={gameData.screenshots[0].path_full} alt={game.game_name} />}

                </div>
                <div className='bg_game_info'>
                    <div className='game_title'>
                        <h1>{game.name}</h1>
                    </div>
                    <div className='game_subtitle'>
                        <span>{gameData.developers && gameData.developers[0]}</span>
                        <span>{gameData?.coming_soon ? "출시전" : (gameData?.release_date?.date ? gameData?.release_date?.date + " 출시" : "")}</span>
                    </div>

                </div>
            </div>
            <div className="game_row">
                <div className='main_section'>
                    <div className='section_wrap'>
                        <div className='section '>
                            <h1>게임 소개</h1>
                            {game && 
                            <div className="game_intro">
                                {gameData && gameData.short_description &&
                                <div className="game_img">
                                    {game.header_image && <img src={game.header_image} alt={game.game_name} />}
                                </div>}
                                <div className='game_description'>
                                    {gameData && gameData.short_description ? decodeHtml(gameData.short_description) : "게임 정보가 없습니다."}  
                                </div>
                            </div>
                            }
                        </div>
                        <div className='section game_video'>
                            <h1>게임 관련 영상</h1>
                            {(video && video.length > 0 && rand) 
                            ? <YouTubePlayer videoId={video[rand]?.id} className="youtube_embed" />
                            : <div className='emptyVideo'>
                                <h2>표시할 영상이 없습니다</h2>                                
                            </div> }

                        </div>

                    </div>

                    <div className='section_wrap review'>
                        { my_review && <div className='section my_review'>
                            <h1>내 리뷰</h1>
                            <Review navigate={navigate} review={my_review} key={my_review.id} click={() => reviewClick(my_review) } />
                        </div>

                        }
                        <div className='section reviews'>
                            <h1>리뷰</h1>
                            { clicked_review && <Review navigate={navigate}  review={clicked_review} isActive={true} click={() => reviewClick(clicked_review) } />}
                            { reviews?.length > 0 && reviews.map((review) => {
                                return (
                                    <Review navigate={navigate} review={review} key={review.id} click={() => reviewClick(review)} />
                                )
                            })
                            }{ clicked_review == null && reviews?.length == 0 && 
                                <div className='review_wrap empty_list'>
                                    <h2>등록된 리뷰가 없습니다.</h2>
                                </div>
                            }
                        </div>
                    </div>
                    
                </div>
                <div className='side_section'>
                    <div className='section'>
                        <div className='game_genres'>
                            <h2>장르</h2>
                            <div className='genres_container'>
                            {gameData?.genres && gameData?.genres.map((genre, genre_index) => {
                                return (
                                    <div className='genre_wrap' key={genre_index}>
                                        <span>{genre.description}</span>
                                    </div>
                                )
                            })}
                            </div>
                        </div>
                    </div>
                    <div className='section rating'>
                        <h2>Watson 유저 평가</h2>
                        <div>
                            <Rating value={game?.average_score} fractions={2} readOnly />
                            <span>{Object.keys(game).length > 0 && `${game.average_score ? game.average_score : 0} (${game.total_reviews ? game.total_reviews : 0})`}</span>
                        </div>
                    </div>
                    { gameData?.metacritic && <div className='section metacritic'>
                        <h2>메타크리틱 평가</h2>
                        <div>
                            <span>{gameData.metacritic?.score}점</span>
                        </div>
                    </div> }
                </div>
            </div>

            <div className={`loadingWrap ${isLoading ? "loading" : ""}`}>
                <img src={"/images/search_loading.gif"} />
            </div>

            <Modal opened={opened} onClose={onClose} title="댓글 쓰기" className='review_modal' centered size={'lg'}>
                {  select_review && <div>
                    <div className={`review_wrap`}>
                        <div className='review_img'>
                            <img src={select_review?.photo ? select_review.photo : "/images/default_profile.png"} alt="User Photo" />
                        </div>
                        <div className='review_detail'>
                            <div className='review_profile'>
                                <span className='review_nickname'>@{select_review.nickname}</span>
                            </div>
                            <div className='review_content'>
                                <div className='review_info'>
                                    <Rating value={select_review.score} fractions={2} readOnly />
                                    <span className='review_date'>{dateformat2(select_review.created_at)}</span>
                                </div>
                            </div>
                            <div className='review_text'>
                                <span>{select_review.content}</span>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h1>댓글 {select_review.comments?.length} 개</h1>
                        <div>
                            { isLoggedIn ? <div className='commentInput'>
                                <form>
                                    <input type="text" value={content} placeholder='댓글 쓰기' onChange={(e) => setContent(e.target.value)} />
                                    <input type='submit' value={"등록"} onClick={new_comment} />
                                </form>
                            </div> : <div><h1>로그인이 필요합니다.</h1></div>}
                            
                        </div>
                    </div>
                    <ReviewCommentContainer review={select_review} />
                </div> }
            </Modal>

        </div>
    )
}