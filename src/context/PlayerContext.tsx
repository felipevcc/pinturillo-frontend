import React, { createContext, useContext, useState } from 'react';
import { Player } from '../models/player/player.interface';
import { PlayerContextType } from '../models/player/player-context.interface';

// Player context
const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

// Provider component for player context
export function PlayerProvider({ children }: { children: React.ReactNode }) {
	const [player, setPlayer] = useState<Player | null>(null);

	return (
		<PlayerContext.Provider value={{ player, setPlayer }}>
			{children}
		</PlayerContext.Provider>
	);
}

// Custom hook to use player context
export function usePlayer() {
	const context = useContext(PlayerContext);
	if (context === undefined) {
		throw new Error('usePlayer must be used within a PlayerProvider');
	}
	return context;
}
