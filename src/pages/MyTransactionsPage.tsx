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
import { useUser } from "./UserContext";
import { addLog, getTransactions } from '@/lib/apiCalls';
import { formatPeso, getTransCode } from '@/lib/utils';
import useBrowserCheck from '@/components/WebBrowserChecker';
import OpenInExternalBrowser from '@/components/OpenInExternalBrowser';

interface SidebarProps {
  onLogout?: () => void;
}
export function MyTransactionsPage({onLogout}:SidebarProps) {
  const navigate = useNavigate();
  const { setUserID,userID,deviceID } = useUser();
  console.log(userID);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState('all');
  const [transactionsHistory, setTransactionsHistory] = useState<any[]>([]);
  
  // Mock data for bets history
  useEffect(() => {
      if (userID) {
        const handleUpdate = async () => {
          const data = await getTransactions(userID);
          if (data === null) {
            alert("Unauthorize, Please Login again");
            onLogout();
            return;
          }
          setTransactionsHistory(data);

          const addViewLog = await addLog(userID, "visited My Transactions");
          console.log(addViewLog.authenticated);
        };
        handleUpdate();
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
  
  // Filter bets based on status
  const filterBetsByStatus = (bets: any[]) => {
    if (!Array.isArray(bets) || bets.length === 0) {
      return [];
    }

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
        bet?.trans_type?.toString().toLowerCase().includes(query)
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
          
          <h1 className="text-xl font-bold text-[#FFD701] text-center flex-1">My Transactions</h1>
          
          <div className="w-[60px]"></div> {/* Spacer for balance */}
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-6">
       
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
                placeholder="Search transactions..."
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
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
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
          {/* <div className="p-4 border-b">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All Bets</TabsTrigger>
              <TabsTrigger value="active">Active Bets</TabsTrigger>
              <TabsTrigger value="settled">Settled Bets</TabsTrigger>
            </TabsList>
          </div> */}

          
          
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
        <h3 className="text-lg font-medium text-gray-700 mb-2">No transactions found</h3>
        <p className="text-gray-500 mb-4">Try adjusting your filters</p>
      </div>
    );
  }
  
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableCaption>A history of your Transactions</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">Transaction ID</TableHead>
            <TableHead className="text-center">Date & Time</TableHead>
            <TableHead className="text-center">Type</TableHead>
            <TableHead className="text-center">Amount Paid</TableHead>
            <TableHead className="text-center">Credit</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bets.map((bet) => (
            <TableRow key={bet.id}>
              <TableCell className="font-medium text-center">{getTransCode(bet.date)}{bet.id}</TableCell>
              
              <TableCell className="text-center">{bet.date}</TableCell>
              <TableCell className="text-center">{bet.trans_type}</TableCell>
              
              <TableCell className="text-center">{formatPeso(bet.amount)}</TableCell>
              <TableCell className="text-center">{formatPeso(bet.credit)}</TableCell>
              <TableCell className="text-center">
                <Badge 
                  className= {
                    bet.status === 'success' 
                      ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                      : bet.status === 'failed'
                      ? 'bg-red-100 text-red-800 hover:bg-red-200'
                      : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                  }
                >
                  {bet.status === 'success' ? 'Success' : bet.status === 'failed' ? 'Failed' : 'Pending'}
                </Badge>
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
    </div>
  );
}