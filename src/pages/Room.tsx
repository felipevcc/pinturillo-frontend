import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlayerContextType } from '../models/player/player-context.interface';
import { usePlayer } from '../context/PlayerContext';
import Navbar from '../components/bars/Navbar';
import { GameEventType } from '../enums/game-event.enum';
import { environment } from '../environments/environment';
import { Player } from '../models/player/player.interface';
import PlayerInGame from '../components/player/PlayerInGame';
import { alertPlayRoom } from '../helpers/alertTemplates';

const Room: React.FC = () => {
	const navigate = useNavigate();
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const messagesRef = useRef<HTMLUListElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const [socket, setSocket] = useState<WebSocket | null>(null);
	const playerInTurn = useRef({
		id: '',
		name: '',
		avatar: '',
		playRoomId: 0,
		score: 0,
		inTurn: false
	});
	const { player } = usePlayer() as PlayerContextType;
	const [players, setPlayers] = useState<Player[]>([]);
	const isPainting = useRef(false);
	const [word, setWord] = useState('');
	const [visibleWord, setVisibleWord] = useState(false);

	useEffect(() => {
		if (!player) {
			navigate('/');
			return;
		}
		setPlayers([player]);

		const ws = new WebSocket(
			`${environment.socketUrl}/ws/room/${player.playRoomId}?userId=${player.id}&name=${player.name}&avatar=${player.avatar}`
		);
		setSocket(ws);
		return () => {
			if (socket) socket.close();
		};
	}, []);

	useEffect(() => {
		if (!player || !socket) return;
		const sendButton = document.getElementsByTagName('button')[0];
		sendButton.addEventListener('click', e => {
			e.preventDefault();
			const message = inputRef.current?.value;
			const chatMessagePayload = {
				message,
				senderId: player.id,
				senderName: player.name
			};
			socket.send(
				JSON.stringify({
					gameEventType: GameEventType.CHAT_MESSAGE,
					chatMessagePayload
				})
			);
			if (inputRef.current) inputRef.current.value = '';
		});
	}, [socket]);

	const isPlayerInTurn = () => {
		if (!playerInTurn.current || !player) return false;
		return playerInTurn.current.id == player.id;
	};

	useEffect(() => {
		if (!socket || !player) return;
		socket.onclose = () => {
			console.log('WebSocket connection closed.');
		};
		socket.onopen = () => {
			console.log('WebSocket connection open.');
			sendMessage({}, GameEventType.JOIN_GAME);
		};

		socket.onerror = error => {
			console.error('WebSocket error:', error);
		};

		socket.onclose = () => {
			console.log('WebSocket connection closed.');
		};

		socket.onmessage = event => {
			// console.log(event.data);
			handleEventType(JSON.parse(event.data));
		};

		const canvas = canvasRef.current;
		const ctx = canvas?.getContext('2d');
		const chat = document.getElementById('chat');

		if (!canvas || !ctx || !chat) return;

		canvas.width = canvas.offsetWidth;
		canvas.height = canvas.offsetHeight;

		const handleEventType = (communicationInterface: any) => {
			switch (communicationInterface.gameEventType) {
				case GameEventType.ROUND_NOTIFICATION:
					handleRoundNotification(
						communicationInterface.roundNotificationPayload
					);
					break;
				case GameEventType.CHAT_MESSAGE:
					handleChatMessage(communicationInterface.chatMessagePayload);
					break;
				case GameEventType.GAME_OVER:
					handleGameOver(communicationInterface.resultsPayload);
					break;
				case GameEventType.USER_DRAW:
					handleSentDraw(communicationInterface.drawPayload);
					break;
				case GameEventType.MOUSE_UP:
					handleSentMouseUp();
					break;
				default:
					console.error('Invalid game event type', communicationInterface);
			}
		};

		const handleRoundNotification = async (payload: any) => {
			if (payload.roundInfo) {
				playerInTurn.current = payload.roundInfo.playerInTurn;
				setPlayers([
					...payload.roundInfo.guessers.map((player: any) => ({ ...player, inTurn: false })),
					{ ...payload.roundInfo.playerInTurn, inTurn: true }
				]);
			}
			setVisibleWord(true);
			clearCanvas();
			await alertPlayRoom(payload.message);
			setVisibleWord(false);
			setWord(payload.roundInfo.word);
		};

		const handleChatMessage = (chatMessagePayload: any) => {
			const senderName = getSenderName(chatMessagePayload);
			const item = document.createElement('li');
			item.textContent = `${senderName}: ${chatMessagePayload.message}`;
			messagesRef.current?.appendChild(item);
			item.scrollIntoView({ behavior: 'smooth' });
		};

		const handlePlayerDrawing = (e: MouseEvent) => {
			if (!isPlayerInTurn() || !isPainting.current) return;
			const rect = canvas.getBoundingClientRect();
			const x = e.clientX - rect.left;
			const y = e.clientY - rect.top;
			draw(x, y);
			const gameEventType = GameEventType.USER_DRAW;
			const lineWidth = ctx.lineWidth;
			const drawPayload = { x, y, lineWidth };
			socket.send(JSON.stringify({ gameEventType, drawPayload }));
		};

		const handleSentDraw = (userDrawPayload: any) => {
			if (isPlayerInTurn()) return;
			const { x, y, lineWidth } = userDrawPayload;
			ctx.lineWidth = lineWidth;
			ctx.lineTo(x, y);
			ctx.stroke();
		};

		const handleSentMouseUp = () => {
			if (isPlayerInTurn()) return;
			handleMouseUp();
		};

		const handleGameOver = async (payload: any) => {
			removeChatMessages();
			clearCanvas();
			socket.close();
			console.log("WebSocket connection closed.");
			await alertPlayRoom('Game has finished');
			navigate('/results', { state: { results: payload } });
		};

		const clearCanvas = () => {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
		};

		const draw = (x: number, y: number) => {
			if (!isPlayerInTurn() || !isPainting.current) return;
			ctx.lineWidth = 5;
			ctx.lineCap = 'round';
			ctx.lineTo(x, y);
			ctx.stroke();
		};

		const handleMouseUp = () => {
			isPainting.current = false;
			ctx.stroke();
			ctx.beginPath();
		};

		const removeChatMessages = () => {
			const messages = messagesRef.current;
			while (messages?.firstChild) {
				messages.removeChild(messages.firstChild);
			}
		};

		const getSenderName = (chatMessagePayload: any) => {
			return player.id === chatMessagePayload.senderId
				? 'Tú'
				: chatMessagePayload.senderName;
		};

		const sendMessage = (payload: any, gameEventType: string) => {
			socket.send(JSON.stringify({ gameEventType, payload }));
		};

		canvas.addEventListener('mousedown', e => {
			isPainting.current = true;
			if (!isPlayerInTurn() || !isPainting.current) return;
			handlePlayerDrawing(e);
		});

		canvas.addEventListener('mousemove', e => {
			if (!isPlayerInTurn() || !isPainting.current) return;
			handlePlayerDrawing(e);
		});

		canvas.addEventListener('mouseup', e => {
			if (!isPlayerInTurn()) return;
			handleMouseUp();
			socket.send(JSON.stringify({ gameEventType: GameEventType.MOUSE_UP }));
		});

		canvas.addEventListener('mouseout', e => {
			if (!isPlayerInTurn()) return;
			handleMouseUp();
			socket.send(JSON.stringify({ gameEventType: GameEventType.MOUSE_UP }));
		});

		/* canvas.addEventListener('mouseenter', e => {
			handleMouseUp();
        }); */
	}, [socket, playerInTurn, player, isPainting]);

	return (
		<div className="room-container">
			<Navbar />
			<div className="room-content">
				<div className="players-list">
					<div className="players scroll-bar">
						{[...players].sort((a, b) => (b?.score || 0) - (a?.score || 0)).map((player, index) => (
							<PlayerInGame key={index} roomPlayer={player} />
						))}
					</div>
				</div>
				<div className="drawing-board">
					<div className='drawing-board__header'>
						<div className='board-header-top'>
							<h5>MESA N° {player?.playRoomId}</h5>
						</div>
						<div className='board-header-low'>
							<div className='round-word'>
								{word && word.length > 0 &&
									<h2>{isPlayerInTurn() || visibleWord ? (word.toUpperCase() || '') : '_ '.repeat(word?.length ?? 0)}</h2>
								}
							</div>
						</div>
					</div>
					<canvas id="drawing-board" className={isPlayerInTurn() ? 'pencil-cursor' : ''} ref={canvasRef}></canvas>
				</div>
				<div id="chat">
					<div className='messages-container scroll-bar'>
						<ul id="messages" ref={messagesRef}></ul>
					</div>
					<form id="form" action="">
						<input id="input" ref={inputRef} autoComplete="off" placeholder="Adivina la palabra" />
						<button type='submit'>Enviar</button>
					</form>
				</div>
			</div>
		</div>
	);
};

export default Room;
