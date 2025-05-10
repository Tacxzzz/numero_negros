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
import { getGameByID, getMyBets, countBetsEarnedTeam, getRateChartDataTeam, totalBalancePlayersTeam, totalCashinTeam, totalCashOutTeam, totalClientsTeam, totalCommissionsTeam, totalPlayersTeam, totalWinsTeam, fetchUserData, fetchUserDataDyna} from '@/lib/apiCalls';
import { formatPeso, getTransCode } from '@/lib/utils';



import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HandIcon , HandMetalIcon, ShoppingCart, Users, Boxes, Wallet, CoinsIcon, Wallet2, BookAIcon, BookCheck, BookHeart, Banknote } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useLocation } from 'react-router-dom';



export function ManageReferrals() {
  const location = useLocation();
  const navigate = useNavigate();
  const userID = location.state?.userID;
  console.log(userID);
  const [loading, setLoading] = useState(true);
  const [totalRemitAmount, setTotalRemitAmount] = useState(0);
  const [totalRedeemAmount, setTotalRedeemAmount] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);
  const [totalComm, setTotalComm] = useState(0);
  const [totalPlayersAmount, setTotalPlayersAmount] = useState(0);
  const [totalNonRegisteredPlayers, setTotalNonRegisteredPlayers] = useState(0);
  const [totalCashins, setTotalCashins] = useState(0);
  const [totalCashouts, setTotalCashouts] = useState(0);
  const [rateChartData, setRateChartData] = useState<any[]>([]);
  const [mobile, setMobile] = useState('');

  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  useEffect(() => {
      const handleUpdate = async () => {
          try {
            const data = await getRateChartDataTeam(userID,startDate, endDate); // Call the function to fetch data
            setRateChartData(data); 

            const betsEarnedData= await countBetsEarnedTeam(userID,startDate,endDate);
            setTotalRemitAmount(betsEarnedData.count);
            
            const data2= await totalWinsTeam(userID,startDate,endDate);
            setTotalRedeemAmount(data2.count);

            const data3= await totalBalancePlayersTeam(userID,startDate,endDate);
            setTotalBalance(data3.count);

            const data4= await totalCommissionsTeam(userID,startDate,endDate);
            setTotalComm(data4.count);

            const data5= await totalPlayersTeam(userID,startDate,endDate);
            setTotalPlayersAmount(data5.count);

            const data6= await totalClientsTeam(userID,startDate,endDate);
            setTotalNonRegisteredPlayers(data6.count);

            const data7= await totalCashinTeam(userID,startDate,endDate);
            setTotalCashins(data7.count);

            const data8= await totalCashOutTeam(userID,startDate,endDate);
            setTotalCashouts(data8.count);
            
          } catch (error) {
            console.error('Error fetching rate chart data:', error);
          }
        };
        handleUpdate();
    }, [startDate, endDate]);
  
    

    useEffect(() => {
      if (userID) {
        const handleUpdate = async () => {
          
            const dataUSer = await fetchUserDataDyna(userID);
            setMobile(dataUSer[0].mobile);

            const initialStartDate = new Date();
            initialStartDate.setDate(initialStartDate.getDate() - 20); // Subtract 20 days from the current date
  
            const startDate = new Intl.DateTimeFormat('en-GB', {
              timeZone: 'Asia/Manila',
              year: 'numeric',
              month: '2-digit',
              day: '2-digit'
            }).format(initialStartDate).split('/').reverse().join('-'); // Format the date as YYYY-MM-DD
            
            const endDate = new Intl.DateTimeFormat('en-GB', {
              timeZone: 'Asia/Manila',
              year: 'numeric',
              month: '2-digit',
              day: '2-digit'
            }).format(new Date()).split('/').reverse().join('-');
  
            setStartDate(startDate);
            setEndDate(endDate);
  
            console.log('Start:', startDate);
            console.log('End:', endDate);
  
            const data = await getRateChartDataTeam(userID,startDate,endDate);
            setRateChartData(data);
            console.log(data);
  
            const betsEarnedData= await countBetsEarnedTeam(userID,startDate,endDate);
            setTotalRemitAmount(betsEarnedData.count);
  
            const data2= await totalWinsTeam(userID,startDate,endDate);
            setTotalRedeemAmount(data2.count);
  
            const data3= await totalBalancePlayersTeam(userID,startDate,endDate);
            setTotalBalance(data3.count);
  
            const data4= await totalCommissionsTeam(userID,startDate,endDate);
            setTotalComm(data4.count);
            
            const data5= await totalPlayersTeam(userID,startDate,endDate);
            setTotalPlayersAmount(data5.count);
  
            const data6= await totalClientsTeam(userID,startDate,endDate);
            setTotalNonRegisteredPlayers(data6.count);
  
            const data7= await totalCashinTeam(userID,startDate,endDate);
            setTotalCashins(data7.count);
  
            const data8= await totalCashOutTeam(userID,startDate,endDate);
            setTotalCashouts(data8.count);
            setLoading(false);
          
        };
        handleUpdate();
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userID]);
  
    if (loading ) {
      return <div>...</div>;
    }


    
  const stats = [
    {
      nav: "/teambets",
      title: "Total Bets Wagered",
      value: formatPeso(totalRemitAmount),
      icon: CoinsIcon,
    },
    {
      nav: "/teamwins",
      title: "Total Wins",
      value: formatPeso(totalRedeemAmount),
      icon: CoinsIcon,
    },
    {
      nav: "/teambalances",
      title: "Total Balance From Players",
      value: formatPeso(totalBalance),
      icon: BookCheck,
    },
    {
      nav: "/teamcommissions",
      title: "Total Commision",
      value: formatPeso(totalComm),
      icon: BookHeart,
    },
    {
      nav: "/team",
      title: "Referrals",
      value: totalPlayersAmount,
      icon: Users,
    },
    {
      nav: "",
      title: "Betting Clients",
      value: totalNonRegisteredPlayers,
      icon: Users,
    },
    {
      nav: "/teamcashins",
      title: "Cash In",
      value: formatPeso(totalCashins),
      icon: Banknote,
    },
    {
      nav: "/teamcashouts",
      title: "Cash Out",
      value: formatPeso(totalCashouts),
      icon: Banknote,
    },
  ];

  

  const resetDateFilters = () => {
    setStartDate("");
    setEndDate("");
  };
  
  return (
   <>


<div className="min-h-screen bg-gray-100">
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
          
          <h1 className="text-xl font-bold text-center flex-1">Manage Team</h1>
          
          <div className="w-[60px]"></div> {/* Spacer for balance */}
        </div>
      </header>


<main className="container mx-auto px-4 py-6">
<div className="p-4 md:p-6 space-y-6">
<div className="lg:mb-4 flex flex-wrap justify-between items-center gap-4">
  <h2 className="text-2xl md:text-3xl font-bold text-left">(+63){mobile} <br/>Referrals Dashboard </h2>
  <div className="flex flex-wrap justify-end items-center gap-4">
    <div className="w-full sm:w-auto">
      <label htmlFor="startDate" className="block text-sm font-medium">
        Start Date
      </label>
      <input
        type="date"
        id="startDate"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        className="w-full sm:w-auto border rounded px-2 py-1"
      />
    </div>
    <div className="w-full sm:w-auto">
      <label htmlFor="endDate" className="block text-sm font-medium">
        End Date
      </label>
      <input
        type="date"
        id="endDate"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        className="w-full sm:w-auto border rounded px-2 py-1"
      />
    </div>
    <div className="w-full sm:w-auto">
      <Button
        onClick={resetDateFilters}
        className="w-full sm:w-auto mt-4 px-4 py-2 bg-gray-500 text-white rounded"
      >
        Reset
      </Button>
    </div>
  </div>
</div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader onClick={() => navigate(`${stat.nav}`, { state: { userID: userID } })} style={{ cursor: "pointer" }} className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              {/* <p className="text-xs text-muted-foreground">
                {stat.change} from last month
              </p> */}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Revenue Recognition</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={rateChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="Cash_In" stroke="#8884d8" name="Cash In" />
                <Line type="monotone" dataKey="Cash_Out" stroke="#ff7300" name="Cash Out" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      
    </div>
    </main>
    </div>
   </>
  );
}

