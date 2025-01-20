import React from 'react';
import '@assets/css/account/signup.css';
export default function InterestList({ games, selectedGames, onGameSelect }) {
    return (
        <div className="interest_list">
            {games && games.map((game, index) => (
                <div className="interest_info" onClick={() => onGameSelect(game.id)} key={index}>
                    <div className={`interest_img ${selectedGames.includes(game.id) && "selected"}`}>
                        <img src={`/src/assets/images/games/${game.id}.jpg`} />
                    </div>
                    <div className="interest_hover"></div>
                </div>
            ))}
        </div>
    );
}