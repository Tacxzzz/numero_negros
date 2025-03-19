import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type GameDraw = {
  id: string;
  date: string;
  time: string;
  result: string;
  prize: number;
  winners: number;
  status: 'win' | 'loss' | 'pending';
};

export function GameHistoryPage() {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const [gameData, setGameData] = useState<any>(null);
  const [gameDraws, setGameDraws] = useState<GameDraw[]>([]);
  const [filter, setFilter] = useState('all');
  
  // Simulate fetching game data
  useEffect(() => {
    // In a real app, this would be an API call
    const games = [
      { id: 1, name: "Color Match", type: "Puzzle", minBet: 5, maxBet: 500, image: "https://picsum.photos/id/237/300/200" },
      { id: 2, name: "Lucky Spin", type: "Casino", minBet: 10, maxBet: 1000, image: "https://picsum.photos/id/239/300/200" },
      { id: 3, name: "Number Crush", type: "Puzzle", minBet: 5, maxBet: 200, image: "https://picsum.photos/id/240/300/200" },
      { id: 4, name: "Star Collector", type: "Arcade", minBet: 2, maxBet: 100, image: "https://picsum.photos/id/241/300/200" },
      { id: 5, name: "Gem Blast", type: "Puzzle", minBet: 5, maxBet: 300, image: "https://picsum.photos/id/242/300/200" },
      { id: 6, name: "Fortune Wheel", type: "Casino", minBet: 20, maxBet: 2000, image: "https://picsum.photos/id/243/300/200" },
      { id: 7, name: "Bubble Pop", type: "Arcade", minBet: 3, maxBet: 150, image: "https://picsum.photos/id/244/300/200" },
    ];
    
    const foundGame = games.find(game => game.id === parseInt(gameId || '0'));
    setGameData(foundGame);
    
    // Generate mock game draw history
    const mockDraws: GameDraw[] = [];
    const statuses: ('win' | 'loss' | 'pending')[] = ['win', 'loss', 'pending'];
    
    for (let i = 0; i < 10; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      mockDraws.push({
        id: `DRAW${100000 + i}`,
        date: date.toLocaleDateString(),
        time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        result: generateRandomResult(foundGame?.type || 'Puzzle'),
        prize: Math.floor(Math.random() * 1000) + 50,
        winners: Math.floor(Math.random() * 100),
        status: statuses[Math.floor(Math.random() * statuses.length)]
      });
    }
    
    setGameDraws(mockDraws);
  }, [gameId]);
  
  const generateRandomResult = (gameType: string): string => {
    if (gameType === 'Puzzle') {
      return `Match ${Math.floor(Math.random() * 5) + 3}`;
    } else if (gameType === 'Casino') {
      return `${Math.floor(Math.random() * 36)} ${['Red', 'Black'][Math.floor(Math.random() * 2)]}`;
    } else {
      return `Score ${Math.floor(Math.random() * 1000) + 100}`;
    }
  };
  
  const filteredDraws = filter === 'all' 
    ? gameDraws 
    : gameDraws.filter(draw => draw.status === filter);
  
  const handlePlayGame = () => {
    navigate('/game');
  };
  
  if (!gameData) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-md">
          <h2 className="text-xl font-bold mb-4">Game not found</h2>
          <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back
          </button>
          
          <h1 className="text-xl font-bold text-center flex-1">{gameData.name}</h1>
          
          <div className="w-[60px]"></div> {/* Spacer for balance */}
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-6">
        {/* Game Info Card */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
          <div className="md:flex">
            <div className="md:w-1/3">
              <img 
                src={gameData.image} 
                alt={gameData.name} 
                className="w-full h-48 md:h-full object-cover"
              />
            </div>
            <div className="p-6 md:w-2/3">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold mb-1">{gameData.name}</h2>
                  <Badge className="bg-gray-800">{gameData.type}</Badge>
                </div>
                <Button 
                  onClick={handlePlayGame}
                  className="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white"
                >
                  Play Now
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-500">Minimum Bet</p>
                  <p className="text-lg font-bold">${gameData.minBet}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-500">Maximum Bet</p>
                  <p className="text-lg font-bold">${gameData.maxBet}</p>
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium text-blue-800 mb-2">Game Rules</h3>
                <p className="text-sm text-gray-600">
                  Match colors and patterns to win prizes. The more matches you make, the higher your score.
                  Special combinations can trigger bonus rounds and multipliers.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Game History Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="text-xl font-bold">Recent Draws</h2>
            <div className="flex items-center">
              <span className="text-sm text-gray-500 mr-2">Filter:</span>
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Results</SelectItem>
                  <SelectItem value="win">Wins</SelectItem>
                  <SelectItem value="loss">Losses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <Table>
              <TableCaption>A history of recent game draws</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Draw ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Result</TableHead>
                  <TableHead className="text-right">Prize</TableHead>
                  <TableHead>Winners</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDraws.map((draw) => (
                  <TableRow key={draw.id}>
                    <TableCell className="font-medium">{draw.id}</TableCell>
                    <TableCell>{draw.date}</TableCell>
                    <TableCell>{draw.time}</TableCell>
                    <TableCell>{draw.result}</TableCell>
                    <TableCell className="text-right">${draw.prize.toFixed(2)}</TableCell>
                    <TableCell>{draw.winners}</TableCell>
                    <TableCell>
                      <Badge 
                        className={
                          draw.status === 'win' 
                            ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                            : draw.status === 'loss'
                            ? 'bg-red-100 text-red-800 hover:bg-red-200'
                            : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                        }
                      >
                        {draw.status === 'win' ? 'Win' : draw.status === 'loss' ? 'Loss' : 'Pending'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          <div className="p-4 border-t flex justify-center">
            <Button 
              onClick={handlePlayGame}
              className="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white px-8"
            >
              Play Now
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}