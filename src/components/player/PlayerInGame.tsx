import React from 'react';
import { Player } from '../../models/player/player.interface';
import { PlayerContextType } from '../../models/player/player-context.interface';
import { usePlayer } from '../../context/PlayerContext';

const PlayerInGame: React.FC<{ roomPlayer: Player }> = ({ roomPlayer }) => {
	const { player } = usePlayer() as PlayerContextType;

	const formatScore = (score: number | null) => {
		return score
			? score.toLocaleString('es-CO')
			: '0';
	}

	const isSameUser = () => {
		return player && player.id === roomPlayer.id;
	}

    return (
		<div className={`player-game-card ${roomPlayer.inTurn ? 'in-turn' : ''} ${isSameUser() ? 'logged-player' : ''}`}>
            <div className='player-game-card__avatar'>
                <img src={roomPlayer.avatar} alt='Player avatar' />
            </div>
            <div className='player-game-card__info'>
				<h5>{roomPlayer.name}{isSameUser() ? ' (Tú)': ''}</h5>
                <span>{formatScore(roomPlayer.score)} pts.</span>
            </div>
        </div>
    );
};

export default PlayerInGame;
