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
import { addBetClients, addLog, getDrawsResults, getMyBetClients, updateBetClient } from '@/lib/apiCalls';
import { getTransCode } from '@/lib/utils';
import { useUser } from "./UserContext";
import { useClient } from "./ClientContext";
import useBrowserCheck from '@/components/WebBrowserChecker';
import OpenInExternalBrowser from '@/components/OpenInExternalBrowser';


export function BetClientsPage() {
  const navigate = useNavigate();
  const { setUserID,userID,deviceID } = useUser();
  
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState('all');
  const [clients, setClients] = useState<any[]>([]);
  
   useEffect(() => {
    const handleUpdate = async () => {

      const gameBetData = await getMyBetClients(userID);
      setClients(gameBetData);

      const addViewLog = await addLog(userID, "visited Bet Clients");
      console.log(addViewLog.authenticated);
      };
      handleUpdate();
  }, [userID]);
  
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
        bet?.full_name?.toString().toLowerCase().includes(query)
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
  const filteredBets = filterBetsByDate(filterBetsBySearch(filterBetsByStatus(clients)));
  
  // Calculate statistics
  const [showForm, setShowForm] = useState(false);
  const [newClient, setNewClient] = useState({
    full_name: "",
    bank: "",
    account: "",
  });

  const handleChange = (e) => {
    setNewClient({ ...newClient, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowForm(false);
    const formData = new FormData();
    formData.append("userID", userID);
    formData.append('full_name', newClient.full_name);
    formData.append('bank', newClient.bank);
    formData.append('account', newClient.account);
    const data = await addBetClients(formData);
    if(!data.authenticated){
      alert("An error occurred. Please try again.");
    }
    else
    {
      alert("Client added successfully.");
      const gameBetData = await getMyBetClients(userID);
      setClients(gameBetData);
      setNewClient({ full_name: "", bank: "", account: "" });

      
    }
    
  };


  const updatedClientUP = async () => {
      const gameBetData = await getMyBetClients(userID);
      setClients(gameBetData);
      setNewClient({ full_name: "", bank: "", account: "" });
    
  };

  const isMessengerWebview = useBrowserCheck();
    
  if (isMessengerWebview) {
      return <div> <OpenInExternalBrowser/> </div>;
  }
  
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-[#C0382C] shadow-sm sticky top-0 z-10">
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
          
          <h1 className="text-xl font-bold text-[#FFD701] text-center flex-1">Bet Clients as Agent</h1>
          
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
                placeholder="Search by client..."
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
                  {/* <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10">
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
                      <Link to="/my-bets" className="flex flex-col items-center p-2 text-blue-600">
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
                      <Link to="/pisoplaysguide" className="flex flex-col items-center p-2 text-gray-500" onClick={() => navigate('/pisoplaysguide')}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-book-heart-icon lucide-book-heart">
                      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"/>
                      <path d="M12 17h.01"></path>
                      <path d="M10 8a2 2 0 1 1 2 2c0 1-2 1.5-0 3"></path>
                      </svg>
                        <span className="text-xs mt-1">Help Guide</span>
                      </Link>
                    </div>
                  </div> */}
                  <div className="flex justify-between items-center mb-4">
              <button
                onClick={() => setShowForm(!showForm)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600"
              >
                + Add Client
              </button>
            </div>
          <TabsContent value="all" className="p-0">
          

      
            <BetsTable bets={filteredBets} updatedClientUP={updatedClientUP} navigate={navigate} />
          </TabsContent>
          {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4">Add New Client</h2>
            <p style={{color: 'red'}}>Please enter client payout details carefully. BetMoto is not responsible for misdirected funds due to incorrect information.</p>
            <br/>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                name="full_name"
                placeholder="Full Name"
                value={newClient.full_name}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
              <select
                name="bank"
                value={newClient.bank}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              >
                <option value="" disabled>
                  Select Payment Method
                </option>
                <option value="GCASH">GCASH</option>
                <option value="BDO">BDO Unibank, Inc.</option>
                <option value="BPI">Bank of the Philippine Islands</option>
                <option value="UBP">Union Bank of the Philippines</option>
                <option value="MYW">Maya Philippines, Inc./Maya Wallet</option>
                <option value="PNB">Philippine National Bank</option>
                <option value="EWR">East West Rural Bank / Komo</option>
                <option value="DBP">Development Bank of the Philippines</option>
                {/* Add more options as needed */}
              </select>
              <input
                type="text"
                name="account"
                placeholder="Account Number"
                value={newClient.account}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
              

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 bg-gray-400 text-white rounded-lg"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded-lg">
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
          
        </Tabs>
      </main>
    </div>
  );
}

// Separate component for the bets table
function BetsTable({ bets,updatedClientUP, navigate }: { bets: any[],updatedClientUP: () => void, navigate: (path: string) => void }) {
  if (!bets || bets.length === 0) {
    return (
      <div className="text-center py-12">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-gray-400 mb-4">
          <rect x="2" y="6" width="20" height="12" rx="2" />
          <path d="M12 12h.01" />
          <path d="M17 12h.01" />
          <path d="M7 12h.01" />
        </svg>
        <h3 className="text-lg font-medium text-gray-700 mb-2">No clients found</h3>
        <p className="text-gray-500 mb-4">Try adjusting your filters or place some bets!</p>
        <Button             
            onClick={e => {
            e.preventDefault();
            window.location.href = "/dashboard";
            }}>Browse Games</Button>
      </div>
    );
  }


  const [editingClient, setEditingClient] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const { clientId, setClientId } = useClient();
  console.log(clientId);

  const handleEditClient = (client) => {
    setEditingClient(client);
    setShowEditModal(true);
  };

  const handleUpdateClient = async () => {
    setShowEditModal(false);
    const updatedClients = bets.map((bet) =>
      bet.id === editingClient.id ? editingClient : bet
    );
    

    const formData = new FormData();
    formData.append("userID", editingClient.id);
    formData.append('full_name', editingClient.full_name);
    formData.append('bank', editingClient.bank);
    formData.append('account', editingClient.account);
    const data = await updateBetClient(formData);
    if(!data.authenticated){
      alert("An error occurred. Please try again.");
    }
    else
    {
      alert("Client updated successfully.");
      updatedClientUP();

      
    }
  };

  const setClientIDFunc =  (id: string) => {
    setClientId(id);
};
  
  return (
    <div className="overflow-x-auto p-4">
      

      <table className="min-w-full border">
        <caption className="p-2 text-gray-600">A table of my bet clients</caption>
        <thead>
          <tr className="bg-gray-200">
            <th className="text-center p-2">Date Added</th>
            <th className="text-center p-2">Full Name</th>
            <th className="text-center p-2">Payment</th>
            <th className="text-center p-2">Account</th>
            <th className="text-center p-2">No. of Bets</th>
            <th className="text-center p-2">Wins</th>
            <th className="text-center p-2">Manage</th>
          </tr>
        </thead>
        <tbody>
          {bets.map((bet, index) => (
            <tr key={index} className="border-t">
              <td className="text-center p-2">{bet.date} {bet.time}</td>
              <td className="text-center p-2">{bet.full_name || "N/A"}</td>
              <td className="text-center p-2">{bet.bank || "N/A"}</td>
              <td className="text-center p-2">{bet.account || "N/A"}</td>
              <td className="text-center p-2">{bet.bet_count || 0}</td>
              <td className="text-center p-2">{bet.win_count || 0}</td>
              <td className="text-center p-2">

              <button
                onClick={() => handleEditClient(bet)}
                className="px-3 py-1 bg-yellow-500 text-white rounded shadow-md hover:bg-yellow-600"
              >
                ✏️
              </button>

              <button
              onClick={() => setClientIDFunc(bet.id)}
                className="px-3 py-1 bg-green-500 text-white rounded shadow-md hover:bg-green-600"
              >
                🎮 
              </button>
              {clientId===bet.id &&
              (<p>Currently playing as..</p>)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
          


      {showEditModal && (
  <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
      <h2 className="text-xl font-bold mb-4">Edit Client</h2>
      
      <input
        type="text"
        placeholder="Full Name"
        value={editingClient?.full_name || ""}
        onChange={(e) =>
          setEditingClient({ ...editingClient, full_name: e.target.value })
        }
        className="w-full p-2 border rounded mb-2"
      />

        <select
          value={editingClient?.bank || ""}
          onChange={(e) =>
            setEditingClient({ ...editingClient, bank: e.target.value })
          }
          className="w-full p-2 border rounded mb-2"
          required
        >
          <option value="" disabled>
            Select Bank / Payment Method
          </option>
          <option value="GCASH">GCASH</option>
          <option value="BDO">BDO Unibank, Inc.</option>
          <option value="BPI">Bank of the Philippine Islands</option>
          <option value="UBP">Union Bank of the Philippines</option>
          <option value="MYW">Maya Philippines, Inc./Maya Wallet</option>
          <option value="PNB">Philippine National Bank</option>
          <option value="EWR">East West Rural Bank / Komo</option>
          <option value="DBP">Development Bank of the Philippines</option>
          {/* Add more as needed */}
        </select>


      <input
        type="text"
        placeholder="Account"
        value={editingClient?.account || ""}
        onChange={(e) =>
          setEditingClient({ ...editingClient, account: e.target.value })
        }
        className="w-full p-2 border rounded mb-2"
      />

      <button
        onClick={handleUpdateClient}
        className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600"
      >
        Save Changes
      </button>

      <button
        onClick={() => setShowEditModal(false)}
        className="w-full mt-2 px-4 py-2 bg-gray-500 text-white rounded-lg shadow-md hover:bg-gray-600"
      >
        Cancel
      </button>
    </div>
  </div>
)}

    </div>
  );
}