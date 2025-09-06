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
import { addLog, adjustEmployeeCommission, getDownlinesTable, getTransactions } from '@/lib/apiCalls';
import { useLocation } from 'react-router-dom';
import useBrowserCheck from '@/components/WebBrowserChecker';
import OpenInExternalBrowser from '@/components/OpenInExternalBrowser';
import { Dialog, DialogTitle } from '@radix-ui/react-dialog';
import { DialogContent, DialogFooter, DialogHeader } from '@/components/ui/dialog';

export function Players() {
  const location = useLocation();
  const navigate = useNavigate();
  const userID = location.state?.userID;
  const [updating, setUpdating] = useState(false);
  console.log(userID);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState('all');
  const [transactionsHistory, setTransactionsHistory] = useState<any[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isAdjustCommissionModalOpen, setIsAdjustCommissionModalOpen] = useState(false);
  
  // Mock data for bets history
  useEffect(() => {
      if (userID) {
        fetchTransactionsHistory();
        handleAddViewLog();
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
  
  const handleEditComissionClick = (employee) => {
    setSelectedEmployee(employee);
    setIsAdjustCommissionModalOpen(true);
  };

  const handleAddViewLog = async () => {
    const addViewLog = await addLog(userID, "visited Referrals");
  }

  const fetchTransactionsHistory = async () => {
    if (!userID) return;
    const data = await getDownlinesTable(userID, 'players');
    setTransactionsHistory(data);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedEmployee((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdjustCommission = async (e: React.FormEvent) => { 
  e.preventDefault();
    setUpdating(true);

    const adjustCommission = await adjustEmployeeCommission(selectedEmployee.id, selectedEmployee.amount);
    const isAuthenticated = adjustCommission.authenticated;

    setUpdating(false);
    setIsAdjustCommissionModalOpen(false);

    if (!isAuthenticated) {
      alert(adjustCommission.error);
      return;
    }

    alert("Adjusted Commission successfully.");

    fetchTransactionsHistory();
 };

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
        bet?.status?.toString().toLowerCase().includes(query) ||
        bet?.mobile?.toString().toLowerCase().includes(query) ||
        bet?.created?.toString().toLowerCase().includes(query)
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
      const betDate = new Date(bet.created);
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
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <button 
            onClick={() => navigate('/manageTeam', { state: { userID } })}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back to Dashboard
          </button>
          
          <h1 className="text-xl font-bold text-center flex-1">Referrals</h1>
          
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
                placeholder="Search players..."
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
                  <SelectItem value="blocked">Blocked</SelectItem>
                  <SelectItem value="pending">Active</SelectItem>
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
                      <Link to="/my-bets" className="flex flex-col items-center p-2 text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <ellipse cx="12" cy="5" rx="8" ry="3"></ellipse>
                        <path d="M4 5v6a8 3 0 0 0 16 0V5"></path>
                        <path d="M4 11v6a8 3 0 0 0 16 0v-6"></path>
                        </svg>
                        <span className="text-xs mt-1">My Bets</span>
                      </Link>
                      <Link to="/drawhistory" className="flex flex-col items-center p-2 text-gray-500">
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
                    </div>
                  </div>
          
          <TabsContent value="all" className="p-0">
          <div className="overflow-x-auto">
              <Table>
                <TableCaption>A history of your Transactions</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-center">Mobile</TableHead>
                    <TableHead className="text-center">Joined</TableHead>
                    <TableHead className="text-center">Allowed Access to cashins</TableHead>
                    <TableHead className="text-center">Allowed Access to cashout</TableHead>
                    <TableHead className="text-center">Allowed Access to wins</TableHead>
                    <TableHead className="text-center">Allowed Access to commissions</TableHead>
                    <TableHead className="text-center">Allowed Access to balance</TableHead>
                    <TableHead className="text-center">Allowed Access to total bets</TableHead>
                    <TableHead className="text-center">Allowed Access to bets</TableHead>
                    <TableHead className="text-center">Allowed Access to Dashboard (allowed all)</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-center">See Commission (If Usher)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBets.map((bet) => (
                    <TableRow key={bet.id}>
                      <TableCell className="text-center">{bet.mobile}</TableCell>
                      <TableCell className="text-center">{bet.created}</TableCell>
                      
                      
                      <TableCell className="text-center">
                      {bet.allow_cashin=== 'yes' ? 
                      (<>
                      <Button 
                          className="bg-blue-500 hover:bg-blue-600"
                          onClick={() => navigate('/teamcashins', { state: { userID: bet.id } })}
                        >
                          View
                        </Button>
                      </>) : 'Denied'}</TableCell>
                      <TableCell className="text-center">

                      {bet.allow_cashout=== 'yes' ? 
                      (<>
                      <Button 
                          className="bg-blue-500 hover:bg-blue-600"
                          onClick={() => navigate('/teamcashouts', { state: { userID: bet.id } })}
                        >
                          View
                        </Button>
                      </>) : 'Denied'}
                      </TableCell>
                      <TableCell className="text-center">

                      {bet.allow_wins=== 'yes' ? 
                      (<>
                      <Button 
                          className="bg-blue-500 hover:bg-blue-600"
                          onClick={() => navigate('/teamwins', { state: { userID: bet.id } })}
                        >
                          View
                        </Button>
                      </>) : 'Denied'}
                      </TableCell>
                      <TableCell className="text-center">

                      {bet.allow_commissions=== 'yes' ? 
                      (<>
                      <Button 
                          className="bg-blue-500 hover:bg-blue-600"
                          onClick={() => navigate('/teamcommissions', { state: { userID: bet.id } })}
                        >
                          View
                        </Button>
                      </>) : 'Denied'}
                      </TableCell>
                      <TableCell className="text-center">

                      {bet.allow_balance=== 'yes' ? 
                      (<>
                      <Button 
                          className="bg-blue-500 hover:bg-blue-600"
                          onClick={() => navigate('/teambalances', { state: { userID: bet.id } })}
                        >
                          View
                        </Button>
                      </>) : 'Denied'}
                      </TableCell>
                      <TableCell className="text-center">

                      {bet.allow_total_bets=== 'yes' ? 
                      (<>
                      <Button 
                          className="bg-blue-500 hover:bg-blue-600"
                          onClick={() => navigate('/teambets', { state: { userID: bet.id } })}
                        >
                          View
                        </Button>
                      </>) : 'Denied'}
                      </TableCell>
                      <TableCell className="text-center">

                      {bet.allow_bets=== 'yes' ? 
                      (<>
                      <Button 
                          className="bg-blue-500 hover:bg-blue-600"
                          onClick={() => navigate('/teambets', { state: { userID: bet.id } })}
                        >
                          View
                        </Button>
                      </>) : 'Denied'}
                      </TableCell>
                      <TableCell className="text-center">
                      {bet.allow_cashin=== 'yes' && bet.allow_cashout=== 'yes' && bet.allow_wins=== 'yes' && bet.allow_commissions=== 'yes' && bet.allow_balance=== 'yes' && bet.allow_total_bets=== 'yes' && bet.allow_bets=== 'yes' ? 
                      (<>
                      <Button 
                          className="bg-blue-500 hover:bg-blue-600"
                          onClick={() => navigate('/manageTeam', { state: { userID: bet.id } })}
                        >
                          View
                        </Button>
                      </>) : 'Denied'}</TableCell>
                      <TableCell className="text-center">
                        <Badge 
                          className= {
                            bet.status === 'pending' 
                              ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                              : bet.status === 'blocked'
                              ? 'bg-red-100 text-red-800 hover:bg-red-200'
                              : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                          }
                        >
                          {bet.status === 'pending' ? 'Active' : bet.status === 'blocked' ? 'Blocked' : 'Pending'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        {bet.under_employer === 'yes' ? 
                          (<>
                          <Button 
                              className="bg-blue-500 hover:bg-blue-600"
                              onClick={() => handleEditComissionClick(bet)}
                            >
                              See Commission
                            </Button>
                          </>) : 'Not Usher'}
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
          </TabsContent>
          
          
        </Tabs>
      </main>

      {/* Adjust Commission Dialog */}
        {isAdjustCommissionModalOpen && (
          <Dialog open={isAdjustCommissionModalOpen} onOpenChange={setIsAdjustCommissionModalOpen}>
            <DialogContent className="bg-gray-50 border-[#34495e] max-h-[90vh] w-96 overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl text-blue-600">{selectedEmployee.mobile} Commission</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <form onSubmit={handleAdjustCommission}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Bet Commission: {selectedEmployee.bet_commission_percent}% <br></br>
                Current Bet Commission: {selectedEmployee.bet_commission_percent - selectedEmployee.employer_commission_share}% <br></br>
                Your Shared Commission: {selectedEmployee.employer_commission_share === '' ? 0 : selectedEmployee.employer_commission_share}% <br></br>
                {/* <Input
                  type="number"
                  name="amount"
                  value={selectedEmployee?.amount || ""}
                  onChange={handleChange}
                  required
                  min="0"
                  max={selectedEmployee.bet_commission_percent}
                  className="border p-1 mt-2 w-full"
                  placeholder="Enter commission percentage"
                  style={{ appearance: 'textfield' }}
                /> */}
                  <style>{`
                            input[type=number]::-webkit-outer-spin-button,
                            input[type=number]::-webkit-inner-spin-button {
                            -webkit-appearance: none;
                            margin: 0;
                            }
                            input[type=number] {
                            -moz-appearance: textfield;
                            }
                            `}
                  </style> 
              </label>
                  {/* <DialogFooter className="flex flex-col gap-2 sm:flex-row">
                    {!updating ? (
                      <Button
                        variant="outline"
                        className="w-full sm:w-auto bg-blue-500 border-blue-500 text-black-600 hover:bg-blue-500/20 hover:text-blue-700"
                        type="submit"
                      >
                        Adjust Commission
                      </Button>
                    ) : (
                      <>Updating....</>
                    )}
                    <Button
                      variant="outline"
                      className="w-full sm:w-auto border-red-500 text-red-600 hover:bg-red-900/20"
                      onClick={() => setIsAdjustCommissionModalOpen(false)}
                      type="button"
                    >
                      Cancel
                    </Button>
                  </DialogFooter> */}
                </form>
              </div>
            </DialogContent>
          </Dialog>
        )}

    </div>
  );
}

