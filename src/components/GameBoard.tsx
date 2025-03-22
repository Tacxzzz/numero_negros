import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

type GameTile = {
  id: number;
  value: string;
  type: "normal" | "star" | "sun" | "flower";
  color: string;
};

interface GameBoardProps {
  onTileClick: (value: string) => void;
  lengthChoice?: number;
  scores: string[];
}

export function GameBoard({ onTileClick, lengthChoice = 25, scores }: GameBoardProps) {
  // Generate game tiles with default properties
  const generateTiles = (): GameTile[] => {
    const tiles: GameTile[] = [];
    for (let i = 1; i <= lengthChoice; i++) {
      tiles.push({
        id: i,
        value: i.toString(),
        type: "normal",
        color: "bg-gray-400 hover:bg-blue-500",
      });
    }
    return tiles;
  };

  const [tiles, setTiles] = useState<GameTile[]>(generateTiles());
  const [disabledTiles, setDisabledTiles] = useState<number[]>([]); // Track disabled tile IDs

  // Handle tile click
  const handleTileClick = (tile: GameTile) => {
    if (!disabledTiles.includes(tile.id)) {
      onTileClick(tile.value);
      setDisabledTiles([...disabledTiles, tile.id]);
    }
  };

  // Reset disabled tiles when tiles reset
  useEffect(() => {
    const updatedDisabledTiles = scores.filter((score) => score !== "").map(Number);
    setDisabledTiles(updatedDisabledTiles);
  }, [scores]);

  return (
    <div className="grid grid-cols-5 gap-2 md:gap-3">
      {tiles.map((tile) => (
        <button
          key={tile.id}
          className={cn(
            "w-full aspect-square rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md transition-transform hover:scale-105 active:scale-95",
            tile.color,
            disabledTiles.includes(tile.id) && "opacity-50 cursor-not-allowed bg-blue-400" // Disable styling
          )}
          onClick={() => handleTileClick(tile)}
          disabled={disabledTiles.includes(tile.id)} // Disable tile if already clicked
        >
          {tile.type === "normal" && <span>{tile.value}</span>}
        </button>
      ))}
    </div>
  );
}

function StarIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" stroke="none">
      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" stroke="none">
      <circle cx="12" cy="12" r="5" />
      <path d="M12 1V3M12 21V23M4.22 4.22L5.64 5.64M18.36 18.36L19.78 19.78M1 12H3M21 12H23M4.22 19.78L5.64 18.36M18.36 5.64L19.78 4.22" />
    </svg>
  );
}

function FlowerIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" stroke="none">
      <circle cx="12" cy="12" r="3" />
      <circle cx="12" cy="6.5" r="2.5" />
      <circle cx="17.5" cy="12" r="2.5" />
      <circle cx="12" cy="17.5" r="2.5" />
      <circle cx="6.5" cy="12" r="2.5" />
    </svg>
  );
}
