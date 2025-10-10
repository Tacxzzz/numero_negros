import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
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
import { useUser } from "./UserContext";
import { addLog, getGameByID, getMyBets } from '@/lib/apiCalls';
import { formatPeso, getTransCode } from '@/lib/utils';
import useBrowserCheck from '@/components/WebBrowserChecker';
import OpenInExternalBrowser from '@/components/OpenInExternalBrowser';
import { LogOut } from 'lucide-react';

interface SidebarProps {
  onLogout?: () => void;
}

export function MyBetsPage({onLogout}:SidebarProps) {
  const navigate = useNavigate();
  const { setUserID,userID,deviceID } = useUser();
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState('all');
  const [betsHistory, setBetsHistory] = useState<any[]>([]);
  

  useEffect(() => {
      const handleUpdate = async () => {
  
        const gameBetData = await getMyBets(userID);
        if (gameBetData===null) {
          alert("Unauthorized, Please Login again");
          if (onLogout) {
            onLogout();
          } else {
            navigate('/');
          }
          return;
        }
        setBetsHistory(gameBetData);

        const addViewLog = await addLog(userID, "visited My Bets");
        console.log(addViewLog.authenticated);
        };
        handleUpdate();
    }, [userID]);
  
  // Filter bets based on status
  const filterBetsByStatus = (bets: any[]) => {
    if (!Array.isArray(bets)) return [];
    if (filter === 'all') return bets;
    return bets.filter(bet => bet.status === filter);
  };
  
  // Filter bets based on search query
  const filterBetsBySearch = (bets: any[]) => {
    if (!Array.isArray(bets)) return [];
    if (!searchQuery.trim()) return bets;
    const query = searchQuery.toLowerCase();
    return bets.filter(
      bet =>
        bet.game_name?.toLowerCase().includes(query) ||
        bet.id?.toLowerCase().includes(query) ||
        bet.game_type_name?.toLowerCase().includes(query)
    );
  };
  
  // Filter bets based on date range
  const filterBetsByDate = (bets: any[]) => {
    if (!Array.isArray(bets)) return [];
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
      const betDate = new Date(bet.created_date);
      return betDate >= startDate && betDate <= today;
    });
  };
  
  // Combine all filters
  const getFilteredBets = (bets: any[]) => {
    let filteredBets = filterBetsByStatus(bets);
    filteredBets = filterBetsBySearch(filteredBets);
    filteredBets = filterBetsByDate(filteredBets);
    return filteredBets;
  };
  
  
  // Apply all filters
  const filteredBets = filterBetsByDate(filterBetsBySearch(filterBetsByStatus(betsHistory)));
  
  // Calculate statistics
  // Check if betsHistory is valid and an array
const totalBets = Array.isArray(betsHistory) ? betsHistory.length : 0;

const totalWagered = Array.isArray(betsHistory)
  ? betsHistory.reduce((sum, bet) => sum + parseFloat(bet.bet || 0), 0)
  : 0;

const totalWon = Array.isArray(betsHistory)
  ? betsHistory
      .filter(bet => bet.status === 'win')
      .reduce((sum, bet) => sum + parseFloat(bet.jackpot || 0), 0)
  : 0;

const winRate = Array.isArray(betsHistory) && betsHistory.length > 0
  ? Math.round(
      (betsHistory.filter(bet => bet.status === 'win').length /
        (betsHistory.filter(bet => bet.status !== 'pending').length || 1)) * 100
    )
  : 0;

  const isMessengerWebview = useBrowserCheck();
    
  if (isMessengerWebview) {
      return <div> <OpenInExternalBrowser/> </div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#C0382C] to-[#C0382C] shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <button 
            onClick={e => {
            e.preventDefault();
            window.location.href = "/dashboard";
            }}
            className="flex items-center gap-2 text-[#FFFFFF] hover:text-[#FFD701]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back to Dashboard
          </button>
          
          <h1 className="text-xl font-bold text-[#FFD701] text-center flex-1">My Bets</h1>
          
          <div className="w-[60px]"></div> {/* Spacer for balance */}
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
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
        </div>
        
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
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
        </div>
        
        {/* Bets History Tabs */}
        <Tabs defaultValue="all" className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-4 border-b">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All Bets</TabsTrigger>
              <TabsTrigger value="active">Active Bets</TabsTrigger>
              <TabsTrigger value="settled">Settled Bets</TabsTrigger>
            </TabsList>
          </div>

          {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#214269] border-t border-gray-200 z-10">
          <div className="flex justify-around items-center py-2">
            <Link 
              to="/dashboard" 
              className="flex flex-col items-center p-2 text-[#C0382C] opacity-70"
              onClick={e => {
                e.preventDefault();
                window.location.href = "/dashboard";
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
              <span className="text-xs mt-1">Home</span>
            </Link>
            <Link to="/my-bets" className="flex flex-col items-center p-2 text-[#DBB941] opacity-100">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <ellipse cx="12" cy="5" rx="8" ry="3"></ellipse>
                <path d="M4 5v6a8 3 0 0 0 16 0V5"></path>
                <path d="M4 11v6a8 3 0 0 0 16 0v-6"></path>
              </svg>
              <span className="text-xs mt-1">My Bets</span>
            </Link>
            <Link to="/drawhistory" className="flex flex-col items-center p-2 text-[#C0382C] opacity-70">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
                <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
                <path d="M4 22h16"></path>
                <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
                <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
                <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
              </svg>
              <span className="text-xs mt-1">Draws</span>
            </Link>
            {/* <Link to="#" className="flex flex-col items-center p-2 text-gray-500" onClick={() => window.open('https://tawk.to/chat/67ec009ce808511907a28002/1inou4plh', '_blank', 'noopener,noreferrer')}> */}
            <Link to="/support" className="flex flex-col items-center p-2 text-[#C0382C] opacity-70" onClick={() => navigate('/support')}>
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
  <BetsTable 
    bets={Array.isArray(filteredBets) ? filteredBets : []} 
  />
</TabsContent>

<TabsContent value="active" className="p-0">
  <BetsTable 
    bets={
      Array.isArray(filteredBets)
        ? filteredBets.filter(bet => bet.status === 'pending')
        : []
    }
  />
</TabsContent>

<TabsContent value="settled" className="p-0">
  <BetsTable 
    bets={
      Array.isArray(filteredBets)
        ? filteredBets.filter(bet => bet.status !== 'pending')
        : []
    }
  />
</TabsContent>

        </Tabs>
      </main>
    </div>
  );
}

// Separate component for the bets table
function BetsTable({ bets}: { bets: any[]}) {
  const navigate = useNavigate();
  if (!bets || bets.length === 0) {
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
        <Button             
            onClick={e => {
            e.preventDefault();
            window.location.href = "/dashboard";
            }}>Browse Games</Button>
      </div>
    );
  }
  
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableCaption>A history of your bets</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Bet ID</TableHead>
            <TableHead>Draw ID</TableHead>
            <TableHead>Game</TableHead>
            <TableHead>Bet Combination</TableHead>
            <TableHead className="text-right">Bet Amount</TableHead>
            <TableHead className="text-right">Prize</TableHead>
            <TableHead>From Bet Client</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className='text-center'>Receipt</TableHead>
            
          </TableRow>
        </TableHeader>
        <TableBody>
          {bets.map((bet) => (
            <TableRow key={bet.id}>
              <TableCell className="font-medium">
                
                <p>BET{getTransCode(bet.created_date+" "+bet.created_time)}{bet.id}</p>
                <p className="text-xs text-gray-500">{bet.created_date} {bet.created_time}</p>
                </TableCell>
                <TableCell className="font-medium">
                
                <p>DRAW{getTransCode(bet.draw_date+" "+bet.draw_time)}{bet.draw_id}</p>
                <p className="text-xs text-gray-500">{bet.draw_date} {bet.draw_time}</p>
                </TableCell>
              <TableCell>
                <div>
                  <p className="font-medium">{bet.game_name}</p>
                  <p className="text-xs text-gray-500">{bet.game_type_name}</p>
                </div>
              </TableCell>
              <TableCell >{bet.bets}</TableCell>
              <TableCell className="text-right">{formatPeso(bet.bet)}</TableCell>
              <TableCell className="text-right">{formatPeso(bet.jackpot)}</TableCell>
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


                <TableCell className="text-center">
                 <Button
                    className="w-full sm:w-auto bg-blue-500 border-blue-500 text-white hover:bg-blue-500/20 hover:text-blue-700"
                    onClick={() => navigate('/ticketreceipt', { state: { receiptID: bet.receipt_id, from: 'My Bets', isSavedBet: false } })}
                  >
                    Receipt
                  </Button>
                </TableCell>

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
      <br/>
    </div>
  );
}