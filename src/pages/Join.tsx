import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PlayerContextType } from '../models/player/player-context.interface';
import { usePlayer } from '../context/PlayerContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
/* import { faPencil } from '@fortawesome/free-solid-svg-icons'; */
import Navbar from '../components/bars/Navbar';

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
			<Navbar />
			<div className="join-content">
				<div className='create-room shadow'>
					<h2>Crear una mesa</h2>
					<input
						type="text"
						className="form-control"
						placeholder="Nombre de mesa"
						aria-label="Name"
						/* value={username}
						onChange={(e) => setUsername(e.target.value)} */
					/>
					<button type="button" className='btn-design'>CREAR</button>
				</div>
				<div className='join-room shadow'>
					<h2>Unirse a una mesa</h2>
					<button type="button" className='btn-design'>UNIRSE</button>
				</div>
			</div>
		</div>
	);
};

export default Join;
