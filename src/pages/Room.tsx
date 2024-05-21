import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usePlayer } from '../context/PlayerContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
/* import { faPencil } from '@fortawesome/free-solid-svg-icons'; */
import Navbar from '../components/bars/Navbar';

const Room = () => {
	/* const navigate = useNavigate(); */

	/* useEffect(() => {
	}, []); */

	return (
		<div className="room-container">
			<Navbar />
			<div className="room-content">
				<div className='players-section'></div>
				<div className='board-section'>
					<h2>Room</h2>
				</div>
				<div className='chat-section'></div>
			</div>
		</div>
	);
};

export default Room;
