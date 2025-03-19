import { useState } from 'react';
import { cn } from '@/lib/utils';

type GameTile = {
  id: number;
  value: number;
  type: 'normal' | 'star' | 'sun' | 'flower';
  color: string;
};

interface GameBoardProps {
  onTileClick: (value: number) => void;
}

export function GameBoard({ onTileClick }: GameBoardProps) {
  // Generate game tiles with different types and colors
  const generateTiles = (): GameTile[] => {
    const tiles: GameTile[] = [];
    const colors = [
      'bg-green-400 hover:bg-green-500',
      'bg-blue-400 hover:bg-blue-500',
      'bg-yellow-400 hover:bg-yellow-500',
      'bg-red-400 hover:bg-red-500',
      'bg-pink-400 hover:bg-pink-500',
      'bg-purple-400 hover:bg-purple-500',
      'bg-orange-400 hover:bg-orange-500',
    ];
    
    const types = ['normal', 'normal', 'normal', 'normal', 'star', 'sun', 'flower'];
    
    for (let i = 0; i < 35; i++) {
      const randomValue = Math.floor(Math.random() * 20) + 1;
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      const randomType = types[Math.floor(Math.random() * types.length)];
      
      tiles.push({
        id: i,
        value: randomValue,
        type: randomType as any,
        color: randomColor,
      });
    }
    
    return tiles;
  };

  const [tiles, setTiles] = useState<GameTile[]>(generateTiles());
  const handleTileClick = (tile: GameTile) => {
    onTileClick(tile.value);
  };
  return (
    <div className="grid grid-cols-5 gap-2 md:gap-3">
      {tiles.map((tile) => (
        <button
        key={tile.id}
        className={cn(
          "w-full aspect-square rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md transition-transform hover:scale-105 active:scale-95",
          tile.color
        )}
        onClick={() => handleTileClick(tile)}
      >
          {tile.type === 'normal' && <span>{tile.value}</span>}
          {tile.type === 'star' && (
            <div className="text-yellow-300">
              <StarIcon />
            </div>
          )}
          {tile.type === 'sun' && (
            <div className="text-yellow-300">
              <SunIcon />
            </div>
          )}
          {tile.type === 'flower' && (
            <div className="text-pink-300">
              <FlowerIcon />
            </div>
          )}
        </button>
      ))}
    </div>
  );
}

function StarIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <circle cx="12" cy="12" r="5" />
      <path d="M12 1V3M12 21V23M4.22 4.22L5.64 5.64M18.36 18.36L19.78 19.78M1 12H3M21 12H23M4.22 19.78L5.64 18.36M18.36 5.64L19.78 4.22" />
    </svg>
  );
}

function FlowerIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <circle cx="12" cy="12" r="3" />
      <circle cx="12" cy="6.5" r="2.5" />
      <circle cx="17.5" cy="12" r="2.5" />
      <circle cx="12" cy="17.5" r="2.5" />
      <circle cx="6.5" cy="12" r="2.5" />
    </svg>
  );
}