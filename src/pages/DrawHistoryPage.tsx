import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

type Bet = {
  id: string;
  gameId: number;
  gameName: string;
  gameType: string;
  prize: number;
  potentialWin: number;
  date: string;
  time: string;
  status: 'win' | 'loss' | 'pending';
  result?: string;
  numbers?: number[]; // Add numbers property
  winners: number;
};

export function DrawHistoryPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState('all');
  
  // Mock data for bets history
  const transactionsHistory: Bet[] = [
    {
      id: 'BET123456',
      gameId: 1,
      gameName: 'Color Match',
      gameType: 'Puzzle',
      prize: 10225,
      potentialWin: 75,
      date: '2023-05-15',
      time: '14:30',
      status: 'win',
      result: 'Match 5',
      winners: 5
    },
    {
      id: 'BET123457',
      gameId: 2,
      gameName: 'Lucky Spin',
      gameType: 'Casino',
      prize: 5000,
      potentialWin: 150,
      date: '2023-05-14',
      time: '16:45',
      status: 'loss',
      result: '7 Red',
      winners: 2
    },
    {
      id: 'BET123458',
      gameId: 3,
      gameName: 'Number Crush',
      gameType: 'Puzzle',
      prize: 10000,
      potentialWin: 30,
      date: '2023-05-14',
      time: '10:15',
      status: 'win',
      result: 'Match 4',
      winners: 1
    },
    {
      id: 'BET123459',
      gameId: 4,
      gameName: 'Star Collector',
      gameType: 'Arcade',
      prize: 15,
      potentialWin: 45,
      date: '2023-05-13',
      time: '19:20',
      status: 'pending',
      winners: 5
    },
    {
      id: 'BET123460',
      gameId: 5,
      gameName: 'Gem Blast',
      gameType: 'Puzzle',
      prize: 20,
      potentialWin: 60,
      date: '2023-05-12',
      time: '11:30',
      status: 'win',
      result: 'Score 850',
      winners: 5
    },
    {
      id: 'BET123461',
      gameId: 6,
      gameName: 'Fortune Wheel',
      gameType: 'Casino',
      prize: 100,
      potentialWin: 300,
      date: '2023-05-11',
      time: '20:45',
      status: 'loss',
      result: '13 Black',
      winners: 5
    },
    {
      id: 'BET123462',
      gameId: 7,
      gameName: 'Bubble Pop',
      gameType: 'Arcade',
      prize: 5,
      potentialWin: 15,
      date: '2023-05-10',
      time: '15:10',
      status: 'win',
      result: 'Score 720',
      winners: 5
    },
  ];

  // const bet = {
  //   numbers: [1, 2, 3, 4, 5], // Example numbers
  //   gameName: "Sample Game",
  //   prize: 1000,
  //   winners: 1,
  //   date: "2023-01-01",
  // };
  
  // Filter bets based on status
  const filterBetsByStatus = (bets: Bet[]) => {
    if (filter === 'all') return bets;
    return bets.filter(bet => bet.status === filter);
  };
  
  // Filter bets based on search query
  const filterBetsBySearch = (bets: Bet[]) => {
    if (!searchQuery.trim()) return bets;
    const query = searchQuery.toLowerCase();
    return bets.filter(
      bet => 
        bet.gameName.toLowerCase().includes(query) ||
        bet.id.toLowerCase().includes(query) ||
        bet.gameType.toLowerCase().includes(query)
    );
  };
  
  // Filter bets based on date range
  const filterBetsByDate = (bets: Bet[]) => {
    if (dateRange === 'all') return bets;
    
    const today = new Date();
    const startDate = new Date();
    
    switch (dateRange) {
      case 'today':
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'week':
        startDate.setDate(today.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(today.getMonth() - 1);
        break;
      default:
        return bets;
    }
    
    return bets.filter(bet => {
      const betDate = new Date(bet.date);
      return betDate >= startDate && betDate <= today;
    });
  };
  
  // Apply all filters
  const filteredBets = filterBetsByDate(filterBetsBySearch(filterBetsByStatus(transactionsHistory)));
  
  // Calculate statistics
  const totalBets = transactionsHistory.length;
  const totalWagered = transactionsHistory.reduce((sum, bet) => sum + bet.prize, 0);
  const totalWon = transactionsHistory
    .filter(bet => bet.status === 'win')
    .reduce((sum, bet) => sum + bet.potentialWin, 0);
  const winRate = Math.round(
    (transactionsHistory.filter(bet => bet.status === 'win').length / 
    transactionsHistory.filter(bet => bet.status !== 'pending').length) * 100
  );
  
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
            Back to Dashboard
          </button>
          
          <h1 className="text-xl font-bold text-center flex-1">Draw History</h1>
          
          <div className="w-[60px]"></div> {/* Spacer for balance */}
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-6">
        {/* Statistics Cards */}
        {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-md p-4">
            <h3 className="text-sm text-gray-500 mb-1">Total Bets</h3>
            <p className="text-2xl font-bold">{totalBets}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4">
            <h3 className="text-sm text-gray-500 mb-1">Total Wagered</h3>
            <p className="text-2xl font-bold text-blue-600">₱{totalWagered}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4">
            <h3 className="text-sm text-gray-500 mb-1">Total Won</h3>
            <p className="text-2xl font-bold text-green-600">₱{totalWon}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4">
            <h3 className="text-sm text-gray-500 mb-1">Win Rate</h3>
            <p className="text-2xl font-bold text-purple-600">{winRate}%</p>
          </div>
        </div> */}
        
        {/* Filters */}
        {/* <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                Search
              </label>
              <Input
                id="search"
                type="text"
                placeholder="Search by game name or bet ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="w-full md:w-48">
              <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger id="status-filter">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Bets</SelectItem>
                  <SelectItem value="win">Wins</SelectItem>
                  <SelectItem value="loss">Losses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="w-full md:w-48">
              <label htmlFor="date-filter" className="block text-sm font-medium text-gray-700 mb-1">
                Date Range
              </label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger id="date-filter">
                  <SelectValue placeholder="Filter by date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">Last 7 Days</SelectItem>
                  <SelectItem value="month">Last 30 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div> */}
        
        {/* Bets History Tabs */}
        <Tabs defaultValue="all" className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* <div className="p-4 border-b">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All Bets</TabsTrigger>
              <TabsTrigger value="active">Active Bets</TabsTrigger>
              <TabsTrigger value="settled">Settled Bets</TabsTrigger>
            </TabsList>
          </div> */}

          {/* Mobile Navigation */}
                  <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10">
                    <div className="flex justify-around items-center py-2">
                      <Link to="/dashboard" className="flex flex-col items-center p-2 text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                          <polyline points="9 22 9 12 15 12 15 22"></polyline>
                        </svg>
                        <span className="text-xs mt-1">Home</span>
                      </Link>
                      <Link to="/my-bets" className="flex flex-col items-center p-2 text-blue-600">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <ellipse cx="12" cy="5" rx="8" ry="3"></ellipse>
                        <path d="M4 5v6a8 3 0 0 0 16 0V5"></path>
                        <path d="M4 11v6a8 3 0 0 0 16 0v-6"></path>
                        </svg>
                        <span className="text-xs mt-1">My Bets</span>
                      </Link>
                      <Link to="/tournaments" className="flex flex-col items-center p-2 text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
                          <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
                          <path d="M4 22h16"></path>
                          <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
                          <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
                          <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
                        </svg>
                        <span className="text-xs mt-1">Tournaments</span>
                      </Link>
                      <Link to="/support" className="flex flex-col items-center p-2 text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="M12 17h.01"></path>
                        <path d="M12 13a3 3 0 1 0-3-3"></path>
                        </svg>
                        <span className="text-xs mt-1">Support</span>
                      </Link>
                    </div>
                  </div>
          
          <TabsContent value="all" className="p-0">
            <BetsTable bets={filteredBets} navigate={navigate} />
          </TabsContent>
          
          <TabsContent value="active" className="p-0">
            <BetsTable 
              bets={filteredBets.filter(bet => bet.status === 'pending')} 
              navigate={navigate} 
            />
          </TabsContent>
          
          <TabsContent value="settled" className="p-0">
            <BetsTable 
              bets={filteredBets.filter(bet => bet.status !== 'pending')} 
              navigate={navigate} 
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

// Separate component for the bets table
function BetsTable({ bets, navigate }: { bets: Bet[], navigate: (path: string) => void }) {
  if (bets.length === 0) {
    return (
      <div className="text-center py-12">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-gray-400 mb-4">
          <rect x="2" y="6" width="20" height="12" rx="2" />
          <path d="M12 12h.01" />
          <path d="M17 12h.01" />
          <path d="M7 12h.01" />
        </svg>
        <h3 className="text-lg font-medium text-gray-700 mb-2">No bets found</h3>
        <p className="text-gray-500 mb-4">Try adjusting your filters or place some bets!</p>
        <Button onClick={() => navigate('/dashboard')}>Browse Games</Button>
      </div>
    );
  }
  
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableCaption>A history of Winning Result</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">Game Draw Results</TableHead>
            <TableHead className="text-center">Prize</TableHead>
            <TableHead className="text-center">Draw Date Result</TableHead>
            <TableHead className="text-center">Jackpot Winners</TableHead>
            
            {/* <TableHead className="text-center">Date & Time</TableHead> */}
            {/* <TableHead className="text-center">Amount</TableHead> */}
            {/* <TableHead className="text-center">Potential Win</TableHead> */}
            
            {/* <TableHead className="text-center">Status</TableHead> */}
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bets.map((bet) => (
            <TableRow key={bet.id}>
              <TableCell>
                <div className="flex flex-col items-center">
                  <p className="font-bold text-orange-500 uppercase text-lg">{bet?.gameName || "N/A"}</p>
                    <div className="flex space-x-2 mt-2">
                      {(bet?.numbers || (() => {
                        const gameNumbersResultMap: { [key: string]: number[] } = {
                          "Color Match": [1, 2, 3, 4, 5, 6],
                          "Lucky Spin": [7, 8, 9, 10, 11, 12],
                          "Number Crush": [13, 14, 15, 16, 17, 18],
                        };
                        return gameNumbersResultMap[bet?.gameName] || [];
                      })()).map((num, index) => (
                        <div
                          key={index}
                          className="bg-yellow-400 text-black font-bold rounded-full w-10 h-10 flex items-center justify-center shadow-md"
                        >
                          {num}
                        </div>
                      ))}
                    </div>
                    <p className="text-red-600 font-bold text-lg">
                      ₱{bet?.prize?.toLocaleString() || "0.00"}.00
                    </p>
                    <p className="text-xs text-gray-500">
                      {bet?.winners || 0} Jackpot Winner/s
                    </p>
                  <p className="text-green-500 text-xs">{bet?.date || "N/A"}</p>
                </div>
              </TableCell>
              <TableCell className="text-center">₱{bet.prize.toFixed(2)}</TableCell>
              {/* <TableCell className="font-medium text-center">{bet.id}</TableCell> */}
              {/* <TableCell>
                <div>
                  <p className="font-medium text-center">{bet.gameName}</p>
                  <p className="text-xs text-gray-500 text-center">{bet.gameType}</p>
                </div>
              </TableCell> */}
              {/* <TableCell className="text-center">{bet.result || '-'}</TableCell> */}

              <TableCell className="text-center">
                <div>
                  <p>{new Date(bet.date).toLocaleDateString()}</p>
                  <p className="text-xs text-gray-500 text-center">{bet.time}</p>
                </div>
              </TableCell>
              <TableCell className="text-center">{bet.winners.toFixed(0)}</TableCell>
              {/* <TableCell className="text-center">₱{bet.potentialWin.toFixed(2)}</TableCell> */}
              
              {/* <TableCell className="text-center">
                <Badge 
                  className= {
                    bet.status === 'win' 
                      ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                      : bet.status === 'loss'
                      ? 'bg-red-100 text-red-800 hover:bg-red-200'
                      : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                  }
                >
                  {bet.status === 'win' ? 'Win' : bet.status === 'loss' ? 'Loss' : 'Pending'}
                </Badge>
              </TableCell> */}
              {/* <TableCell>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate(`/game-history/${bet.gameId}`)}
                >
                  Details
                </Button>
              </TableCell> */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}