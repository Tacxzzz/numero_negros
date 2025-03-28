import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';



type GameCardProps = {
  game: {
    id: number;
    name: string;
    status: string;
    picture: string;
    range_start: string;
    range_end: string;
    type: string;
  };
};

export function GameCard({ game }: GameCardProps) {

  const API_URL = import.meta.env.VITE_DATABASE_URL;

  
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
      <div className="relative">
        <img 
          src={API_URL +"/img/"+ game.picture} 
          alt={game.name} 
          className="w-full h-36 object-cover"
        />
        <Badge className="absolute top-2 right-2 bg-black/70 hover:bg-black/80">
          {game.type}
        </Badge>
      </div>
      
      <div className="p-4">
        <h3 className="font-bold text-lg mb-1">{game.name}</h3>
        
       {/*  <div className="flex justify-between items-center text-sm text-gray-500 mb-3">
          <span>Min: P {game.minBet}</span>
          <span>Max: P {game.maxBet}</span>
        </div> */}
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
            </svg>
            Save
          </Button>
          
          <Link to={`/game-history/${game.id}`} className="flex-1">
            <Button 
              size="sm" 
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
              </svg>
              Play
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}