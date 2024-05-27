export interface Player {
	id: string;
	playRoomId: number | null;
  name: string;
	avatar: string;
	ws: any;
	score: number | null;
}
