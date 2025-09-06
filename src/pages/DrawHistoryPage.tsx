import { useEffect, useState } from 'react';
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
import { addLog, getDrawsResults } from '@/lib/apiCalls';
import { getTransCode } from '@/lib/utils';
import useBrowserCheck from '@/components/WebBrowserChecker';
import OpenInExternalBrowser from '@/components/OpenInExternalBrowser';
import { useUser } from './UserContext';


export function DrawHistoryPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const { setUserID,userID,deviceID } = useUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState('all');
  const [transactionsHistory, setTransactionsHistory] = useState<any[]>([]);
  
   useEffect(() => {
    const handleUpdate = async () => {

      const gameBetData = await getDrawsResults();
      setTransactionsHistory(gameBetData);

      const addViewLog = await addLog(userID, "visited Draws History");
      console.log(addViewLog.authenticated);
      };
      handleUpdate();
  }, []);
  
  // Filter bets based on status
  const filterBetsByStatus = (bets: any[]) => {
    if (filter === 'all') return bets;
    return bets.filter(bet => bet.status === filter);
  };
  
  // Filter bets based on search query
  

  const filterBetsBySearch = (bets: any[]) => {
    // Check if bets is an array and not empty
    if (!Array.isArray(bets) || bets.length === 0) {
      return [];
    }
  
    // Return all bets if search query is empty or just spaces
    if (!searchQuery?.trim()) {
      return bets;
    }
  
    const query = searchQuery.toLowerCase();
  
    // Filter based on id or trans_type
    return bets.filter(
      (bet) =>
        bet?.id?.toString().toLowerCase().includes(query) ||
        bet?.game_name?.toString().toLowerCase().includes(query)
    );
  };
  
  // Filter bets based on date range
  const filterBetsByDate = (bets: any[]) => {
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
            Back to Dashboard
          </button>
          
          <h1 className="text-xl font-bold text-center flex-1">Draw History</h1>
          
          <div className="w-[60px]"></div> {/* Spacer for balance */}
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-6">
        
        
         <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                Search
              </label>
              <Input
                id="search"
                type="text"
                placeholder="Search by draw..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {/* <div className="w-full md:w-48">
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
            </div> */}
            
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
                      <Link 
                        to="/dashboard" 
                        className="flex flex-col items-center p-2 text-gray-500"
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
                      <Link to="/my-bets" className="flex flex-col items-center p-2 text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <ellipse cx="12" cy="5" rx="8" ry="3"></ellipse>
                        <path d="M4 5v6a8 3 0 0 0 16 0V5"></path>
                        <path d="M4 11v6a8 3 0 0 0 16 0v-6"></path>
                        </svg>
                        <span className="text-xs mt-1">My Bets</span>
                      </Link>
                      <Link to="/drawhistory" className="flex flex-col items-center p-2 text-blue-600">
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
                      <Link to="/support" className="flex flex-col items-center p-2 text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="M12 17h.01"></path>
                        <path d="M12 13a3 3 0 1 0-3-3"></path>
                        </svg>
                        <span className="text-xs mt-1">Support</span>
                      </Link>
                      {/* <Link to="/pisoplaysguide" className="flex flex-col items-center p-2 text-gray-500" onClick={() => navigate('/pisoplaysguide')}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-book-heart-icon lucide-book-heart">
                      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"/>
                      <path d="M12 17h.01"></path>
                      <path d="M10 8a2 2 0 1 1 2 2c0 1-2 1.5-0 3"></path>
                      </svg>
                        <span className="text-xs mt-1">Help Guide</span>
                      </Link> */}
                    </div>
                  </div>
          
          <TabsContent value="all" className="p-0">
            <BetsTable bets={filteredBets} navigate={navigate} />
          </TabsContent>
          
          
        </Tabs>
      </main>
    </div>
  );
}

// Separate component for the bets table
function BetsTable({ bets, navigate }: { bets: any[], navigate: (path: string) => void }) {
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
          <TableHead className="text-center">Draw Date Result</TableHead>
            <TableHead className="text-center">Game Draw Results</TableHead>
            <TableHead className="text-center">Winners</TableHead>
            
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
              <TableCell className="text-center">
                <div>
                  <p>{new Date(bet.date).toLocaleDateString()}</p>
                  <p className="text-xs text-gray-500 text-center">{bet.time}</p>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col items-center">
                  {/* Game Name */}
                  <p className="font-bold text-orange-500 uppercase text-lg">
                    {bet?.game_name || "N/A"}
                  </p>
                  <p className="text-red-400 text-sm">
                      DRAW{getTransCode(bet.date+" "+bet.time)}{bet.id}
                    </p>
                  

                  {/* Display Results or Fallback */}
                  <div className="flex space-x-2 mt-2">
                    {bet?.results ? (
                      bet.results
                        .split('-')
                        .map((num, index) => (
                          <div
                            key={index}
                            className="bg-yellow-400 text-black font-bold rounded-full w-10 h-10 flex items-center justify-center shadow-md"
                          >
                            {num}
                          </div>
                        ))
                    ) : (
                      <p className="text-gray-500">No results available</p>
                    )}
                  </div>
                  
                </div>
              </TableCell>

              

              
              <TableCell className="text-center">
              {bet.total_winners}

              </TableCell>
              
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}