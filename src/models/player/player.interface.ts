export interface Player {
	id: string;
	playRoomId: number | null;
	name: string;
	avatar: string;
	score: number | null;
	inTurn: boolean;
}
