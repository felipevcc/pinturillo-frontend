import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlayerContextType } from '../models/player/player-context.interface';
import { usePlayer } from '../context/PlayerContext';
import Navbar from '../components/bars/Navbar';
import { getCategories } from '../services/categories';
import { createPlayRoom, getPlayRoom } from '../services/play-rooms';
import { Category } from "../models/category/category.interface";
import { NewPlayRoom } from '../models/play-room/new-play-room.interface';
import { JoinPlayRoom } from '../models/play-room/join-play-room.interface';
import { alertError } from '../helpers/alertTemplates';

const Join: React.FC = () => {
	const navigate = useNavigate();
	const { player, setPlayer } = usePlayer() as PlayerContextType;
	const [categories, setCategories] = useState([]);
	const [newPlayRoom, setNewPlayRoom] = useState<NewPlayRoom>({
		name: null,
		state: 'waiting',
		categoryId: null
	});
	const [joinPlayRoom, setJoinPlayRoom] = useState<JoinPlayRoom>({
		state: 'active',
		categoryId: null
	});

	useEffect(() => {
		if (!player) {
			navigate('/');
		}
		getCategories().then((data) => {
				setCategories(data);
		}).catch(async (error) => {
			console.error('Error al obtener las categorías:', error);
			await alertError('Error: servicio caído');
		});
	}, [player]);

	const createRoom = async (event: React.FormEvent) => {
		event.preventDefault();
		if (!newPlayRoom.name ||
			newPlayRoom.name.trim() === '' ||
			!newPlayRoom.state ||
			!newPlayRoom.categoryId) {
			await alertError('Todos los campos son obligatorios');
			return;
		  }
		createPlayRoom(newPlayRoom).then((data) => {
			join(data.id);
		}).catch(async (error) => {
			console.error('Error al crear la sala:', error);
			await alertError(error.message, 'Error al crear la sala');
		});
	}

	const joinRoom = async (event: React.FormEvent) => {
		event.preventDefault();
		if (!joinPlayRoom.categoryId) {
			await alertError('Selecciona una categoría para unirte a una sala');
			return;
		}
		getPlayRoom(joinPlayRoom).then((data) => {
			if (data.length === 0) {
				alertError('No hay salas disponibles en esta categoría');
				return;
			}
			// Select a random room
			const randomIndex = Math.floor(Math.random() * data.length);
			join(data[randomIndex].id);
		}).catch(async (error) => {
			console.error('Error al unirse a la sala:', error);
			await alertError(error.message, 'Error al unirse a la sala');
		});
	}

	const join = (roomId: number | null) => {
		if (!roomId || !player) return;
		setPlayer({ ...player, playRoomId: roomId });
		navigate('/room');
	}

	return (
		<div className="join-container">
			<Navbar />
			<div className="join-content">
				<div className='create-room shadow'>
					<h2>Crear una mesa</h2>
					<form onSubmit={createRoom}>
						<input
							type="text"
							className="form-control"
							placeholder="Nombre de mesa"
							aria-label="Name"
							value={newPlayRoom.name || ''}
							onChange={(e) => setNewPlayRoom({ ...newPlayRoom, name: e.target.value })}
						/>
						<select className="form-select"
								aria-label="Selección de categoría de sala"
								value={newPlayRoom.categoryId || ''}
								onChange={(e) => setNewPlayRoom({ ...newPlayRoom, categoryId: parseInt(e.target.value) })}
						>
							<option disabled value=''>Seleccionar categoría</option>
							{categories.map((category: Category) => (
								<option key={category.id} value={category.id}>
									{category.name}
								</option>
							))}
						</select>
						<button type="submit" className='btn-design'>CREAR</button>
					</form>
				</div>
				<div className='join-room shadow'>
					<h2>Unirse a una mesa</h2>
					<form onSubmit={joinRoom}>
						<select className="form-select"
								aria-label="Selección de categoría de sala"
								value={joinPlayRoom.categoryId || ''}
								onChange={(e) => setJoinPlayRoom({ ...joinPlayRoom, categoryId: parseInt(e.target.value) })}
						>
							<option disabled value=''>Seleccionar categoría</option>
							{categories.map((category: Category) => (
								<option key={category.id} value={category.id}>
									{category.name}
								</option>
							))}
						</select>
						<button type="submit" className='btn-design'>UNIRSE</button>
					</form>
				</div>
			</div>
		</div>
	);
};

export default Join;
