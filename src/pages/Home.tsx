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
import { v4 as uuidv4 } from 'uuid';
/* import { API } from '../../env'; */

const Home = () => {
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
		"https://static.vecteezy.com/system/resources/previews/026/676/817/non_2x/gamer-mascot-logo-free-png.png",
		"https://vxesport.com/wp-content/uploads/2022/03/tundra-dota2.png",
		"https://gameshard.s3.eu-central-1.amazonaws.com/teams/logo/gha1nHXhPly0gZpx1kCRcmDgaOBTdw1UEDAFAcoC.png",
		"https://e-skill.es/storage/avatares/avatares-1612463722.png",
		"https://gamepedia.cursecdn.com/cod_esports_gamepedia_en/9/93/Echo_Foxlogo.png",
		"https://cdn.icon-icons.com/icons2/3158/PNG/512/character_grim_halloween_reaper_scythe_icon_193255.png",
		"https://cdn.kibrispdr.org/data/807/polosan-logo-esport-serigala-54.png",
	];

	const handleImageChange = (newImage: string) => {
		setSelectedImage(newImage);
		setIsOpen(false);
	};

	const handleContinue = async (event: React.FormEvent) => {
		event.preventDefault();
		if (typeof username === 'string' && username.trim() !== '') {
			setPlayer({ id: uuidv4(), playRoomId: null, score: 0, name: username, avatar: selectedImage, inTurn: false });
			navigate('/join');
		} else {
			await alertError('Por favor, introduce un nombre de usuario válido');
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
						<form onSubmit={handleContinue}>
							<input
								type="text"
								className="form-control"
								placeholder="Usuario"
								aria-label="Username"
								value={username}
								onChange={(e) => setUsername(e.target.value)}
							/>
							<button type="submit" className='btn-design'>UNIRSE</button>
						</form>
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
					<a href='https://www.twitch.tv/' target='_blank' rel='noopener noreferrer' className="icon">
						<FontAwesomeIcon icon={faTwitch} />
					</a>
					<a href='https://x.com/' target='_blank' rel='noopener noreferrer' className="icon">
						<FontAwesomeIcon icon={faTwitter} />
					</a>
					<a href='https://www.youtube.com/' target='_blank' rel='noopener noreferrer' className="icon">
						<FontAwesomeIcon icon={faYoutube} />
					</a>
					<a href='https://discord.com/' target='_blank' rel='noopener noreferrer' className="icon">
						<FontAwesomeIcon icon={faDiscord} />
					</a>
				</div>
			</div>
		</div>
	);
};

export default Home;
