import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlayerContextType } from '../models/player/player-context.interface';
import { usePlayer } from '../context/PlayerContext';
import Navbar from '../components/bars/Navbar';
import { GameEventType } from '../enums/game-event.enum';

const Room: React.FC = () => {
	const navigate = useNavigate();
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const messagesRef = useRef<HTMLUListElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const [socket, setSocket] = useState<WebSocket | null>(null);
	const [isPainting, setIsPainting] = useState(false);
	const [playerInTurn, setPlayerInTurn] = useState({
		userId: '',
		userName: '',
		userAvatar: ''
	});
	const [canDraw, setCanDraw] = useState(false);
	const { player, setPlayer } = usePlayer() as PlayerContextType;

	useEffect(() => {
		if (!player) {
			navigate('/');
			return;
		}
		const canvas = canvasRef.current;
		const ctx = canvas?.getContext('2d');
		const chat = document.getElementById('chat');

		if (!canvas || !ctx || !chat) return;

		const canvasOffsetX = canvas.offsetLeft;
		const canvasOffsetY = canvas.offsetTop;
		canvas.width = window.innerWidth - chat.offsetWidth;
		canvas.height = window.innerHeight - canvasOffsetY;

		const ws = new WebSocket(
			`ws://localhost:3000/ws/room/1?userId=${player.id}&name=${player.name}&avatar=${player.avatar}`
		);
		setSocket(ws);
		ws.onopen = () => {
			console.log('WebSocket connection open.');
			sendMessage({}, GameEventType.JOIN_GAME);
		};

		ws.onerror = error => {
			console.error('WebSocket error:', error);
		};

		ws.onclose = () => {
			console.log('WebSocket connection closed.');
		};

		ws.onmessage = event => {
			console.log(event.data);
			handleEventType(JSON.parse(event.data));
		};

		const handleEventType = (communicationInterface: any) => {
			console.log(communicationInterface);
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
					handleGameOver();
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

		const handleRoundNotification = (payload: any) => {
			setPlayerInTurn(payload.roundInfo);
			setCanDraw(isPlayerInTurn());
			alert(payload.message);
		};

		const handleChatMessage = (chatMessagePayload: any) => {
			const senderName = getSenderName(chatMessagePayload);
			const item = document.createElement('li');
			item.textContent = `${senderName}: ${chatMessagePayload.message}`;
			messagesRef.current?.appendChild(item);
		};

		const handlePlayerDrawing = (e: MouseEvent) => {
			if (!canDraw || !isPainting) return;
			draw(e);
			const gameEventType = GameEventType.USER_DRAW;
			const x = e.clientX - canvasOffsetX;
			const y = e.clientY;
			const drawPayload = { x, y };
			ws.send(JSON.stringify({ gameEventType, drawPayload }));
		};

		const handleSentDraw = (userDrawPayload: any) => {
			if (isPlayerInTurn()) return;
			const { x, y } = userDrawPayload;
			ctx.lineTo(x, y);
			ctx.stroke();
		};

		const handleSentMouseUp = () => {
			if (isPlayerInTurn()) return;
			handleMouseUp();
		};

		const handleGameOver = () => {
			removeChatMessages();
			ws.close();
			alert('Game has finished');
		};

		const draw = (e: MouseEvent) => {
			if (!isPainting) return;
			ctx.lineWidth = 5;
			ctx.lineCap = 'round';
			ctx.lineTo(e.clientX - canvasOffsetX, e.clientY);
			ctx.stroke();
		};

		const handleMouseUp = () => {
			setIsPainting(false);
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

		const isPlayerInTurn = () => {
			return playerInTurn.userId === player.id;
		};

		const sendMessage = (payload: any, gameEventType: string) => {
			ws.send(JSON.stringify({ gameEventType, payload }));
		};

		canvas.addEventListener('mousedown', e => {
			setIsPainting(true);
		});

		canvas.addEventListener('mousemove', handlePlayerDrawing);

		canvas.addEventListener('mouseup', e => {
			handleMouseUp();
			ws.send(JSON.stringify({ gameEventType: GameEventType.MOUSE_UP }));
		});

		const sendButton = document.getElementsByTagName('button')[0];
		sendButton.addEventListener('click', e => {
			e.preventDefault();
			const message = inputRef.current?.value;
			const chatMessagePayload = {
				message,
				senderId: player.id,
				senderName: player.name
			};
			console.log(chatMessagePayload);
			ws.send(
				JSON.stringify({
					gameEventType: GameEventType.CHAT_MESSAGE,
					chatMessagePayload
				})
			);
			if (inputRef.current) inputRef.current.value = '';
		});

		return () => {
			ws.close();
		};
	}, []);

	return (
		<div className="room-container">
			<Navbar />
			<div className="room-content">
				<div id="chat">
					<ul id="messages" ref={messagesRef}></ul>
					<form id="form" action="">
						<input id="input" ref={inputRef} autoComplete="off" />
						<button type='submit'>Enviar</button>
					</form>
				</div>
				<div className="drawing-board">
					<canvas id="drawing-board" ref={canvasRef}></canvas>
				</div>
			</div>
		</div>
	);
};

export default Room;
