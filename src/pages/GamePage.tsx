import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { GameBoard } from '@/components/GameBoard';
import { ScoreDisplay } from '@/components/ScoreDisplay';
import { ActionButtons } from '@/components/ActionButtons';

export function GamePage() {
  const navigate = useNavigate();
  const [betAmount, setBetAmount] = useState(10);

  const [lengthChoice, setLengthChoice] = useState(31);
  const [dynamicLength, setDynamicLength] = useState(2); 
  const [scores, setScores] = useState<string[]>(Array.from({ length: dynamicLength }, () => ""));
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleTileClick = (newScore: string) => {
    const updatedScores = [...scores];
    updatedScores[currentIndex] = newScore;
    setScores(updatedScores);

    setCurrentIndex((prevIndex) => (prevIndex + 1) % scores.length);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-400 to-sky-300 flex flex-col items-center justify-center p-4 overflow-hidden relative">
      {/* Back button */}
      <button 
        onClick={() => navigate('/dashboard')}
        className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-md z-20"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
      </button>
      
      {/* Background decorations */}
      <div className="absolute left-0 bottom-0 w-24 h-32">
        <div className="absolute bottom-4 left-4 w-8 h-12 bg-pink-400 rounded-t-full"></div>
        <div className="absolute bottom-8 left-12 w-6 h-16 bg-green-400 rounded-t-full"></div>
      </div>
      <div className="absolute right-0 bottom-0 w-24 h-32">
        <div className="absolute bottom-4 right-4 w-8 h-12 bg-yellow-400 rounded-t-full"></div>
        <div className="absolute bottom-8 right-12 w-6 h-16 bg-purple-400 rounded-t-full"></div>
      </div>

      {/* Game container */}
      <div className="w-full h-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden relative">
        {/* Rainbow background */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-yellow-200 to-pink-200 opacity-50"></div>
        
        {/* Rainbow arc */}
        <div className="absolute top-0 left-0 right-0 h-32 overflow-hidden">
          <div className="w-[150%] h-[300px] mx-auto bg-gradient-to-r from-purple-500 via-pink-500 via-red-500 via-yellow-500 via-green-500 to-blue-500 rounded-[100%] relative -top-[200px]"></div>
        </div>
        
        {/* Clouds */}
        <div className="absolute top-4 left-6">
          <div className="bg-white w-10 h-5 rounded-full opacity-80"></div>
          <div className="bg-white w-6 h-4 rounded-full opacity-80 absolute -top-2 -left-2"></div>
          <div className="bg-white w-6 h-4 rounded-full opacity-80 absolute -top-1 left-6"></div>
        </div>
        <div className="absolute top-8 right-8">
          <div className="bg-white w-12 h-6 rounded-full opacity-80"></div>
          <div className="bg-white w-8 h-5 rounded-full opacity-80 absolute -top-2 -left-2"></div>
          <div className="bg-white w-8 h-5 rounded-full opacity-80 absolute -top-1 left-8"></div>
        </div>

        {/* Score display */}
        <ScoreDisplay scores={scores} />
        <br/><br/><br/>
        {/* Game board */}
        <div className="relative z-10 p-4 pt-16">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-4 shadow-inner">
            <GameBoard onTileClick={handleTileClick} lengthChoice={lengthChoice} scores={scores} />
          </div>
        </div>
        
        {/* Action buttons */}
        <ActionButtons />
      </div>
    </div>
  );
}