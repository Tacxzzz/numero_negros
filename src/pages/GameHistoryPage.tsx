import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import CountdownTimer from "./CountdownTimer";
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
import { checkCurrentBetsTotal, getBetsByUserAndDraw, getDrawsByID, getGameByID, getGames, getGameTypeByID, getGameTypesByID } from '@/lib/apiCalls';
import { formatPeso, getPhilippineDate, getTransCode } from '@/lib/utils';
import { useUser } from "./UserContext";
// import { popularGames } from './Dashboard';
import useBrowserCheck from '@/components/WebBrowserChecker';
import OpenInExternalBrowser from '@/components/OpenInExternalBrowser';

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
  const { setUserID,userID,deviceID } = useUser();
  console.log(userID);
  const navigate = useNavigate();
  const [gameData, setGameData] = useState<any>(null);
  const [draws, setDraws] = useState<any[]>([]);
  const [gameTypes, setGameTypes] = useState<any[]>([]);
  const [betsData, setBetsData] = useState<any[]>([]);
  const [filter, setFilter] = useState('all');
  const API_URL = import.meta.env.VITE_DATABASE_URL;
  const [selectedDate, setSelectedDate] = useState(getPhilippineDate());
  const [filteredDateDraws, setFilteredDateDraws] = useState<any[]>([]);
  const [totalBets, setTotalBets] = useState<{ [key: string]: number }>({});




  useEffect(() => {
    if (draws.length > 0 && selectedDate) {
      filterDrawsByDate(selectedDate);
    }
  }, [draws, selectedDate]);
  
  const filterDrawsByDate = (date: string) => {
    const filtered = draws.filter((draw) => {
      const drawDate = draw.date.split(' ')[0];
      return drawDate === formatDate(date);
    });
    setFilteredDateDraws(filtered);
  };
  
  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.value;
    setSelectedDate(selected);
    filterDrawsByDate(selected);
  };

// Format date to match draw.date format (mm/dd/yyyy)
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
};


useEffect(() => {
    const handleUpdate = async () => {
      if (filteredDateDraws && filteredDateDraws.length > 0) {
        filteredDateDraws.forEach(async (draw) => {
          const gameBetData = await checkCurrentBetsTotal(draw.id);
          console.log(draw.id);
          if(gameBetData.authenticated)
          {
            setTotalBets((prev) => ({
              ...prev,
              [draw.id]: gameBetData.totalBets || 0,
            }));
          }
        });
      }
    };
    handleUpdate();
}, [filteredDateDraws]);
  
  // Simulate fetching game data
  useEffect(() => {
    const handleUpdate = async () => {
      console.log('called');
      const gamesData = await getGameByID(gameId);
      setGameData(gamesData);
      const drawsData = await getDrawsByID(gameId);
      setDraws(drawsData);
      const gameTypeData = await getGameTypesByID(gameId);
      setGameTypes(gameTypeData);
      console.log(gameTypeData);

      const gameBetData = await getBetsByUserAndDraw(gameId,userID);
      setBetsData(gameBetData);

      

      };
      handleUpdate();
  }, [gameId]);
  
  
  
  const filteredDraws = filter === 'all' 
    ? betsData 
    : betsData.filter(draw => draw.status === filter);
  
    const handlePlayGame = (drawId, gameType ) => {
      navigate(`/game/${gameId}/${gameType}/${drawId}`);
    };



  if (!gameData) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-md">
          <h2 className="text-xl font-bold mb-4">Game loading..</h2>
          <Button             
            onClick={e => {
            e.preventDefault();
            window.location.href = "/dashboard";
            }}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }
  
  const isMessengerWebview = useBrowserCheck();
    
  if (isMessengerWebview) {
      return <div> <OpenInExternalBrowser/> </div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <button 
                        onClick={e => {
            e.preventDefault();
            window.location.href = "/dashboard";
            }}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back
          </button>
          
          <h1 className="text-xl font-bold text-center flex-1">{gameData[0].name}</h1>
          
          <div className="w-[60px]"></div> {/* Spacer for balance */}
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-6">
        {/* Game Info Card */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
          <div className="md:flex">
            <div className="md:w-1/3">
              <img 
                src={API_URL +"/img/"+gameData[0].picture} 
                alt={gameData[0].name} 
                className="w-full h-48 md:h-full object-cover"
              />
            </div>
            <div className="p-6 md:w-2/3">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold mb-1">{gameData[0].name}</h2>
                  <Badge className="bg-gray-800">{gameData[0].type}</Badge>
                </div>
              </div>
              
              
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium text-blue-800 mb-2">Game Rules</h3>
                <p className="text-sm text-gray-600">
                {gameData[0].description}
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="text-xl font-bold">Select Draw</h2>
            
          </div>
         
          <div className="overflow-x-auto">
            
          <div className="w-full max-w-lg mx-auto my-6 space-y-4">
  {/* Date Input for Draw Selection */}
      <input
        type="date"
        value={selectedDate}
        onChange={handleDateChange}
        className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
      />

  {/* Show Filtered Draws */}
        {filteredDateDraws && filteredDateDraws.length > 0 ? (
          filteredDateDraws.map((draw) => (
            <div
              key={draw.id}
              className="p-4 border border-gray-300 rounded-lg shadow-md bg-white mt-4"
            >
              {/* Draw Details */}
              <div className="flex flex-col items-center justify-center space-y-2 sm:space-y-3">
                <p className="font-medium text-lg sm:text-xl">
                  DRAW{getTransCode(draw.date + ' ' + draw.time)}{draw.id}
                </p>
                <p className="text-gray-500 text-sm sm:text-base">
                  {draw.date} {draw.time}
                </p>
                {/* Countdown Timer */}
                <p className="text-green-500 text-sm sm:text-base">
                  Time left:{' '}
                  <CountdownTimer
                    date={draw.date}
                    time={draw.time}
                    cutoffMinutes={draw.deadline}
                  />
                </p>

                <p className="text-blue-500 text-sm sm:text-base">
                Total Bets: {totalBets[draw.id] !== undefined ? totalBets[draw.id] : 'Loading...'}/{draw.ceiling}
              </p>
              </div>

              {/* Accordion Dropdown for Game Types */}
              <div className="mt-6 w-full max-w-lg mx-auto">
                <details className="bg-white border border-gray-300 rounded-lg shadow-md">
                  <summary className="text-gray-700 text-sm sm:text-base px-4 py-3 cursor-pointer bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-t-lg hover:from-pink-600 hover:to-orange-600">
                    Play Game
                  </summary>
                  <div className="p-4 bg-gray-50 space-y-2">
                  {gameTypes && gameTypes.length > 0 ? (
                      gameTypes.map((types) => (
                        <button
                          key={types.id}
                          onClick={() => handlePlayGame(draw.id, types.id)}
                          className={`w-full text-left bg-white border border-gray-200 px-4 py-2 rounded-md transition-all ${
                            types.status === "hidden" ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "text-gray-700 hover:bg-pink-100"
                          }`}
                          disabled={types.status === "hidden"}
                        >
                          {types.status === "hidden" ? (
                            <> {types.game_type} - Winnings: {formatPeso(types.jackpot)}</>
                          ) : (
                            <>🎮 {types.game_type} - Bet: {formatPeso(types.bet)} - Winnings: {formatPeso(types.jackpot)}</>
                          )}
                        </button>
                      ))
                    ) : (
                      <p className="text-gray-500">No games available</p>
                    )}
                  </div>
                </details>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 mt-4">No draws found for this date.</p>
        )}
      </div>

          </div>
          
          
        </div>




            </div>
          </div>
        </div>
        
        {/* Game History Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="text-xl font-bold">Recent Bets</h2>
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
              <TableCaption>A history of my recent bets</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Bet ID</TableHead>
                  <TableHead>Draw ID</TableHead>
                  <TableHead>Game</TableHead>
                  <TableHead >Bet Amount</TableHead>
                  <TableHead >Bet Combination</TableHead>
                  <TableHead >Prize</TableHead>
                  <TableHead >From Bet Client</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {
                filteredDraws && filteredDraws.length > 0 ? (
                filteredDraws.map((bet) => (
                  <TableRow key={bet.id}>
                    <TableCell className="font-medium">
                    <p>BET{getTransCode(bet.created_date+" "+bet.created_time)}{bet.id}</p>
                    <p className="text-xs text-gray-500">{bet.created_date} {bet.created_time}</p>
                    </TableCell>
                    <TableCell className="font-medium">
                    <p>DRAW{getTransCode(bet.draw_date+" "+bet.draw_time)}{bet.draw_id}</p>
                    <p className="text-xs text-gray-500">{bet.draw_date} {bet.draw_time}</p>
                      </TableCell>
                    <TableCell>{bet.game_name} {bet.game_type_name}</TableCell>
                    <TableCell>{formatPeso(bet.bet)}</TableCell>
                    <TableCell>{bet.bets}</TableCell>
                    <TableCell>{formatPeso(bet.jackpot)}</TableCell>
                    <TableCell>{bet.bakas_full_name === "N/A" ? "-" : bet.bakas_full_name}</TableCell>
                    <TableCell>
                      <Badge 
                        className={
                          bet.status === 'win' 
                            ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                            : bet.status === 'loss'
                            ? 'bg-red-100 text-red-800 hover:bg-red-200'
                            : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                        }
                      >
                        {bet.status === 'win' ? 'Win' : bet.status === 'loss' ? 'Loss' : 'Pending'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4 text-gray-500">
                    No bets found.
                  </TableCell>
                </TableRow>
              )}
              </TableBody>
            </Table>
          </div>
          
         
        </div>
      </main>
    </div>
  );
}