import React, { useEffect, useState } from 'react';
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
//import { faEye, faEyeSlash, faLock, faUser } from '@fortawesome/free-solid-svg-icons';
/* import './home.scss'; */
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faTwitch,
	faTwitter,
	faYoutube,
	faDiscord,
} from '@fortawesome/free-brands-svg-icons';
import { faPencil } from '@fortawesome/free-solid-svg-icons';
/* import { API } from '../../env'; */

const Home = () => {
	localStorage.setItem('selectedView', 'home');
	/* const navigate = useNavigate(); */

	/* const [isLoading, setIsLoading] = useState(true); */

	useEffect(() => {
		// Query data
		/* (async () => {
			const url = new URL(`${API}/api/v1/data/summary`);
			await fetch(url)
				.then(response => response.json())
				.then(data => {
					setDataSummary(data);
					setIsLoading(false);
				})
				.catch(error => console.log(error))
		})(); */
	}, []);

	return (
		<div className="home-container">
			<div className="home-title">
				<h1>PINTURILLO</h1>
			</div>
			<div className="home-content">
				<div className="profile-container">
					<div className='profile-container__avatar'>
						<img
							className="profile-image"
							src="https://i.postimg.cc/25HQ2f92/default.png"
							alt="Perfil"
						/>
						<button className="edit-button">
							<FontAwesomeIcon icon={faPencil} />
						</button>
					</div>
					<div className='profile-container__username'>
						<input
							type="text"
							className="form-control"
							placeholder="Usuario"
							aria-label="Username"
						/>
						<button type="submit">
							UNIRSE
						</button>
					</div>
				</div>
				<div className="divider"></div>
				<div className='game-instructions'>
					<h2>¿Cómo jugar?</h2>
					<ol>
						<li>
							El jugador designado para dibujar recibirá una palabra aleatoria.
						</li>
						<li>
							Con sus mejores dotes artisticos, deberá dibujar la palabra
							planteada en la parte superior.
						</li>
						<li>
							Los otros participantes en el chat deberán decifrar la palabra por
							medio del dibujo.
						</li>
						<li>Gana el participante que logre adivinar la palabra.</li>
					</ol>
				</div>
			</div>
			<div className="home-footer">
				<div className="networks">
					<a href="" className="icon">
						<FontAwesomeIcon icon={faTwitch} />
					</a>
					<a href="" className="icon">
						<FontAwesomeIcon icon={faTwitter} />
					</a>
					<a href="" className="icon">
						<FontAwesomeIcon icon={faYoutube} />
					</a>
					<a href="" className="icon">
						<FontAwesomeIcon icon={faDiscord} />
					</a>
				</div>
			</div>
		</div>
	);
};

export default Home;
