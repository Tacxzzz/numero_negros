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
  lengthStart?: number;
  lengthChoice?: number;
  scores: string[];
  gameId: string;
  gameType: string;
}

export function GameBoard({ onTileClick, lengthChoice = 25,lengthStart = 0, scores, gameId, gameType }: GameBoardProps) {
  // Generate game tiles with default properties
  const generateTiles = (): GameTile[] => {
    const tiles: GameTile[] = [];
    for (let i = lengthStart; i <= lengthChoice; i++) {
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
  const getScoreCount = (value: string) => {
    return scores.filter((score) => score === value).length;
  };
  // Handle tile click
  const handleTileClick = (tile: GameTile) => {
    
      onTileClick(tile.value);
      
  };
  const distinctScores = Array.from(new Set(scores));

  return (
    <div className="grid grid-cols-5 gap-2 md:gap-3">
      {tiles.map((tile) => {
        let isDisabled = false;

        // ✅ For gameType 5 and 8 -> Check distinct scores
        if (
          (gameId === "2" || gameId === "3") &&
          (gameType === "5" || gameType === "8")
        ) {
          isDisabled = distinctScores.includes(tile.value);
        }
        // ✅ For gameType 4 and 7 -> Check if 2 or more occurrences
        else if (
          (gameId === "2" || gameId === "3") &&
          (gameType === "4" || gameType === "7")
        ) {
          const scoreCount = getScoreCount(tile.value);
          if (scoreCount >= 2) {
            isDisabled = true;
          }
        }
        // ✅ Default disabling condition
        else if (
          scores.includes(tile.value) &&
          gameId !== "1" &&
          gameId !== "2" &&
          gameId !== "3" &&
          gameId !== "4"
        ) {
          isDisabled = true;
        }

        return (
          <button
            key={tile.id}
            className={cn(
              "w-full aspect-square rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md transition-transform",
              isDisabled
                ? "bg-gray-300 text-gray-500 cursor-not-allowed opacity-70"
                : "hover:scale-105 active:scale-95",
              tile.color
            )}
            onClick={() => handleTileClick(tile)}
            disabled={isDisabled}
          >
            {tile.type === "normal" && (
              <span>{isDisabled ? "✓" : tile.value}</span>
            )}
          </button>
        );
      })}
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
