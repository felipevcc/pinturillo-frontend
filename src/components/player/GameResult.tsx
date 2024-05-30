import React from 'react';
import { PlayerResult } from '../../models/player/player-result.interface';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrophy, faMedal } from '@fortawesome/free-solid-svg-icons';

const GameResult: React.FC<{ playerResult: PlayerResult, topPosition: number, numResults: number }> = ({ playerResult, topPosition, numResults }) => {

	const formatScore = (score: number | null) => {
		return score
			? score.toLocaleString('es-CO')
			: '0';
	}

    return (
        <div className='result-game-card'>
            <FontAwesomeIcon icon={faTrophy} className="trophy-icon" />
            <h3>{playerResult.name}</h3>
            <span>{formatScore(playerResult.score)} puntos</span>
            <div className='medals'>
                {Array.from({ length: numResults - topPosition + 1 }).map((_, index) => (
                    <FontAwesomeIcon key={index} icon={faMedal} className="medal-icon" />
                ))}
            </div>
        </div>
    );
};

export default GameResult;
