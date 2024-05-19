import { Player } from './player.interface';

export interface PlayerContextType {
	player: Player | null;
	setPlayer: React.Dispatch<React.SetStateAction<Player | null>>;
}
