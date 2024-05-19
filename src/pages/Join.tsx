import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PlayerContextType } from '../models/player/player-context.interface';
import { usePlayer } from '../context/PlayerContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
/* import { faPencil } from '@fortawesome/free-solid-svg-icons'; */

const Join = () => {
	localStorage.setItem('selectedView', 'join');
	const navigate = useNavigate();
	const { player } = usePlayer() as PlayerContextType;

	useEffect(() => {
		if (!player) {
			navigate('/');
		}
	}, [player]);

	return (
		<div className="join-container">
			<div className="join-title">
				<h1>PINTURILLO</h1>
			</div>
			<div className="join-content">
			</div>
		</div>
	);
};

export default Join;
