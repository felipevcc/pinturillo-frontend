import { environment } from '../environments/environment';
import { NewPlayRoom } from '../models/play-room/new-play-room.interface';
import { JoinPlayRoom } from '../models/play-room/join-play-room.interface';

const API = environment.apiUrl;

export const createPlayRoom = async (playRoomData: NewPlayRoom) => {
	const url = new URL(`${API}/api/v1/play-rooms`);
	const response = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ ...playRoomData, id: 0 })
	});
	if (!response.ok) {
		const errorData = await response.json();
		throw new Error(errorData.message ? errorData.message : undefined);
	}
	return response.json();
};

export const getPlayRoom = async (playRoomData: JoinPlayRoom) => {
	const url = new URL(`${API}/api/v1/play-rooms`);
	if (playRoomData.state) url.searchParams.append('state', playRoomData.state);
	if (playRoomData.categoryId)
		url.searchParams.append('categoryId', playRoomData.categoryId.toString());
	const response = await fetch(url);
	if (!response.ok) {
		const errorData = await response.json();
		throw new Error(errorData.message ? errorData.message : undefined);
	}
	return response.json();
};
