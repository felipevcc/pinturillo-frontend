import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PlayerContextType } from '../models/player/player-context.interface';
import { usePlayer } from '../context/PlayerContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faTwitch,
	faTwitter,
	faYoutube,
	faDiscord
} from '@fortawesome/free-brands-svg-icons';
import { faPencil } from '@fortawesome/free-solid-svg-icons';
import { alertError } from '../helpers/alertTemplates';
/* import { API } from '../../env'; */

const Home = () => {
	localStorage.setItem('selectedView', 'home');
	const navigate = useNavigate();
	const { player, setPlayer } = usePlayer() as PlayerContextType;
	/* const [isLoading, setIsLoading] = useState(true); */
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef(null);

	const [username, setUsername] = useState(player ? player.name : '');
  const [selectedImage, setSelectedImage] = useState(player ? player.avatar : "https://i.postimg.cc/25HQ2f92/default.png");
  const imageOptions = [
		"https://upload.wikimedia.org/wikipedia/en/thumb/c/c3/Dignitas_logo.svg/800px-Dignitas_logo.svg.png",
		"https://files.tips.gg/static/image/teams/anonymo-esports-valorant.png",
		"https://cdn.thespike.gg/Teams%25205%2FArctic_1648889304458.png",
		"https://vxesport.com/wp-content/uploads/2022/03/tundra-dota2.png",
		"https://gameshard.s3.eu-central-1.amazonaws.com/teams/logo/gha1nHXhPly0gZpx1kCRcmDgaOBTdw1UEDAFAcoC.png",
		"https://e-skill.es/storage/avatares/avatares-1612463722.png",
		"https://am-a.akamaihd.net/image?resize=400:&f=http%3A%2F%2Fstatic.lolesports.com%2Fteams%2F1631819669150_fnc-2021-worlds.png",
		"https://cdn.icon-icons.com/icons2/3158/PNG/512/character_grim_halloween_reaper_scythe_icon_193255.png",
		"https://cdn.kibrispdr.org/data/807/polosan-logo-esport-serigala-54.png",
	];

	const handleImageChange = (newImage: string) => {
		setSelectedImage(newImage);
		setIsOpen(false);
	};

	const handleContinue = () => {
		if (typeof username === 'string' && username.trim() !== '') {
			setPlayer({ id: null, playRoomId: null, ws: null, score: null, name: username, avatar: selectedImage });
			navigate('/join');
		} else {
			alertError('Por favor, introduce un nombre de usuario válido');
		}
	};

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (dropdownRef.current && !(dropdownRef.current as HTMLElement).contains(event.target as Node)) {
				setIsOpen(false);
			}
		};
		document.addEventListener('mouseup', handleClickOutside);
		return () => {
			document.removeEventListener('mouseup', handleClickOutside);
		};
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
	}, [isOpen, dropdownRef]);

	return (
		<div className="home-container">
			<div className="home-title">
				<h1>PINTURILLO</h1>
			</div>
			<div className="home-content">
				<div className="profile-container">
					<div className="profile-container__avatar">
						<img className="profile-image" src={selectedImage} alt="Perfil" />

						<button className="edit-button btn-design" type="button" onMouseUp={(event) => { event.stopPropagation(); setIsOpen(!isOpen); }}>
							<FontAwesomeIcon icon={faPencil} />
						</button>
						{isOpen && (
							<div className="dropdown shadow-lg" ref={dropdownRef}>
								{imageOptions.map((image, index) => (
									<button type="button" key={index} className={image === selectedImage ? 'selected' : ''} onClick={() => handleImageChange(image)}>
										<img src={image} alt="Opción de imagen" />
									</button>
								))}
							</div>
						)}

					</div>
					<div className="profile-container__username">
						<input
							type="text"
							className="form-control"
							placeholder="Usuario"
							aria-label="Username"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
						/>
						<button type="button" className='btn-design' onClick={handleContinue}>UNIRSE</button>
					</div>
				</div>
				<div className="divider"></div>
				<div className="game-instructions">
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
					<a href='/' target='_blank' rel='noopener noreferrer' className="icon">
						<FontAwesomeIcon icon={faTwitch} />
					</a>
					<a href='/' target='_blank' rel='noopener noreferrer' className="icon">
						<FontAwesomeIcon icon={faTwitter} />
					</a>
					<a href='/' target='_blank' rel='noopener noreferrer' className="icon">
						<FontAwesomeIcon icon={faYoutube} />
					</a>
					<a href='/' target='_blank' rel='noopener noreferrer' className="icon">
						<FontAwesomeIcon icon={faDiscord} />
					</a>
				</div>
			</div>
		</div>
	);
};

export default Home;
