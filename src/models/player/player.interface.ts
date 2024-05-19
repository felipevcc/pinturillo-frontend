export interface Player {
	id: string | null;
	playRoomId: number | null;
  name: string;
	avatar: string;
	ws: any;
	score: number | null;
}
