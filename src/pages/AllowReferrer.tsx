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
import { allowAccessReferrer, fetchUserData, getGameByID, getMyBets, removeAccessReferrer } from '@/lib/apiCalls';
import { formatPeso, getTransCode } from '@/lib/utils';



export function AllowReferrer() {
  const navigate = useNavigate();
  const { setUserID,userID } = useUser();
  console.log(userID);
  
  const [allowCashin, setAllowCashin] = useState('');
  const [allowCashout, setAllowCashout] = useState('');
  const [allowWins, setAllowWins] = useState('');
  const [allowCommissions, setAllowCommissions] = useState('');
  const [allowBalance, setAllowBalance] = useState('');
  const [allowTotalBets, setAllowTotalBets] = useState('');
  const [allowBets, setAllowBets] = useState('');

  useEffect(() => {
      const handleUpdate = async () => {
  
              const data = await fetchUserData(userID);
              setAllowCashin(data[0].allow_cashin);
              setAllowCashout(data[0].allow_cashout);
              setAllowWins(data[0].allow_wins);
              setAllowCommissions(data[0].allow_commissions);
              setAllowBalance(data[0].allow_balance);
              setAllowTotalBets(data[0].allow_total_bets);
              setAllowBets(data[0].allow_bets);
              
        
        };
        handleUpdate();
    }, [userID,allowCashin,allowCashout,allowWins,allowCommissions,allowBalance,allowTotalBets,allowBets]);
  
    const allowAccessClicked = async (allow: string) => {
        await allowAccessReferrer(userID,allow);

        const data = await fetchUserData(userID);
        setAllowCashin(data[0].allow_cashin);
        setAllowCashout(data[0].allow_cashout);
        setAllowWins(data[0].allow_wins);
        setAllowCommissions(data[0].allow_commissions);
        setAllowBalance(data[0].allow_balance);
        setAllowTotalBets(data[0].allow_total_bets);
        setAllowBets(data[0].allow_bets);
    };

    const removeAccessClicked = async (allow: string) => {
      await removeAccessReferrer(userID,allow);

      const data = await fetchUserData(userID);
      setAllowCashin(data[0].allow_cashin);
      setAllowCashout(data[0].allow_cashout);
      setAllowWins(data[0].allow_wins);
      setAllowCommissions(data[0].allow_commissions);
      setAllowBalance(data[0].allow_balance);
      setAllowTotalBets(data[0].allow_total_bets);
      setAllowBets(data[0].allow_bets);
  };

  
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
          
          <h1 className="text-xl font-bold text-center flex-1">My Referrer Access</h1>
          
          <div className="w-[60px]"></div> {/* Spacer for balance */}
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-6">
        {/* Statistics Cards */}
        
        <div className="overflow-x-auto">
      <Table>
        <TableCaption>Allowed access for the referrer</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Access</TableHead>
            <TableHead></TableHead>
            
          </TableRow>
        </TableHeader>
        <TableBody>
            <TableRow >
                <TableCell className="font-medium">
                Allow Cashin Info Access
                </TableCell>
                <TableCell className="font-medium">
                {allowCashin === '' ? 
                (
                  <Button
                    onClick={() => {
                      allowAccessClicked('allow_cashin');
                    }} 
                    className="bg-blue-500 hover:bg-blue-600"  >Allow</Button>):
                (
                    <Button
                    onClick={() => {
                      removeAccessClicked('allow_cashin');
                    }} 
                    className="bg-red-500 hover:bg-red-600"  >Deny</Button>
                )
                
                }
                </TableCell>
            </TableRow>
            <TableRow >
                <TableCell className="font-medium">
                Allow Cashout Info Access
                </TableCell>
                <TableCell className="font-medium">
                {allowCashout === '' ? 
                (
                  <Button
                    onClick={() => {
                      allowAccessClicked('allow_cashout');
                    }} 
                    className="bg-blue-500 hover:bg-blue-600"  >Allow</Button>):
                (
                    <Button
                    onClick={() => {
                      removeAccessClicked('allow_cashout');
                    }} 
                    className="bg-red-500 hover:bg-red-600"  >Deny</Button>
                )
                
                }
                </TableCell>
            </TableRow>
            <TableRow >
                <TableCell className="font-medium">
                Allow Wins Info Access
                </TableCell>
                <TableCell className="font-medium">
                {allowWins === '' ? 
                (
                  <Button
                    onClick={() => {
                      allowAccessClicked('allow_wins');
                    }} 
                    className="bg-blue-500 hover:bg-blue-600"  >Allow</Button>):
                (
                    <Button
                    onClick={() => {
                      removeAccessClicked('allow_wins');
                    }} 
                    className="bg-red-500 hover:bg-red-600"  >Deny</Button>
                )
                
                }
                </TableCell>
            </TableRow>
            <TableRow >
                <TableCell className="font-medium">
                Allow Commissions Info Access
                </TableCell>
                <TableCell className="font-medium">
                {allowCommissions === '' ? 
                (
                  <Button
                    onClick={() => {
                      allowAccessClicked('allow_commissions');
                    }} 
                    className="bg-blue-500 hover:bg-blue-600"  >Allow</Button>):
                (
                    <Button
                    onClick={() => {
                      removeAccessClicked('allow_commissions');
                    }} 
                    className="bg-red-500 hover:bg-red-600"  >Deny</Button>
                )
                
                }
                </TableCell>
            </TableRow>
            <TableRow >
                <TableCell className="font-medium">
                Allow Balance Info Access
                </TableCell>
                <TableCell className="font-medium">
                {allowBalance === '' ? 
                (
                  <Button
                    onClick={() => {
                      allowAccessClicked('allow_balance');
                    }} 
                    className="bg-blue-500 hover:bg-blue-600"  >Allow</Button>):
                (
                    <Button
                    onClick={() => {
                      removeAccessClicked('allow_balance');
                    }} 
                    className="bg-red-500 hover:bg-red-600"  >Deny</Button>
                )
                
                }
                </TableCell>
            </TableRow>
            <TableRow >
                <TableCell className="font-medium">
                Allow Total Bets Info Access
                </TableCell>
                <TableCell className="font-medium">
                {allowTotalBets === '' ? 
                (
                  <Button
                    onClick={() => {
                      allowAccessClicked('allow_total_bets');
                    }} 
                    className="bg-blue-500 hover:bg-blue-600"  >Allow</Button>):
                (
                    <Button
                    onClick={() => {
                      removeAccessClicked('allow_total_bets');
                    }} 
                    className="bg-red-500 hover:bg-red-600"  >Deny</Button>
                )
                
                }
                </TableCell>
            </TableRow>

            <TableRow >
                <TableCell className="font-medium">
                Allow My Actual Bets Info Access
                </TableCell>
                <TableCell className="font-medium">
                {allowBets === '' ? 
                (
                  <Button
                    onClick={() => {
                      allowAccessClicked('allow_bets');
                    }} 
                    className="bg-blue-500 hover:bg-blue-600"  >Allow</Button>):
                (
                    <Button
                    onClick={() => {
                      removeAccessClicked('allow_bets');
                    }} 
                    className="bg-red-500 hover:bg-red-600"  >Deny</Button>
                )
                
                }
                </TableCell>
            </TableRow>
        </TableBody>
      </Table>
    </div>
      </main>
    </div>
  );
}
