// src/sockets.ts

/* let socket: WebSocket; */

export const createSocket = (userId: string, userName: string, userAvatar: string): WebSocket => {
	const socketUrl = `ws://localhost:3000/ws/room/1?userId=${userId}&name=${userName}&avatar=${userAvatar}`;
	let socket: WebSocket = new WebSocket(socketUrl);
	return socket;
};

/* export const getSocket = (): WebSocket => {
	if (!socket) {
		throw new Error('Socket is not initialized. Call createSocket first.');
	}
	return socket;
}; */

export const sendMessage = (socket: any, payload: any, gameEventType: string) => {
	socket.send(
		JSON.stringify({
			gameEventType,
			payload
		})
	);
};
