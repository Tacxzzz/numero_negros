import { useEffect, useState, lazy } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { GameCard } from '@/components/GameCard';
import { LiveStream } from '@/components/LiveStream';
import { VideoAdPlayer } from '@/components/VideoAdPlayer';
import { DashboardCarousel } from '@/components/DashboardCarousel';
import { YouTubeEmbed } from '@/components/YouTubeEmbed';
import { YouTubeEmbedCard } from '@/components/YouTubeEmbedCard';
import ImageAdCard from "../components/ImageAdCard";
import Prizes1 from '../files/Prizes-1.png';
import Prizes2 from '../files/Prizes-2.png';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FiCopy } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useUser } from "./UserContext";
import { addBetClients, cashIn, cashInCashko, cashOutCashko, cashOutCashkoCommission, convertCommissionsToBalance, convertWinsToBalance, fetchUserData, getBetClientData, getCommissions, getGames, getGamesToday, getMyBetClientsCount, getReferrals, updatePassword, checkMaintainingBalance } from '@/lib/apiCalls';
import { formatPeso } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

import { useClient } from "./ClientContext";
import PisoPlayLogo from "@/files/LogoIconOnly.svg";
import AdvertisementModal from '@/components/AdvertisementModal';
import AdvertisementImage from "@/files/advertisement.svg";

const AnnouncementsMarquee = lazy(() => import("@/components/AnnouncementsMarque"));
const AutoScrollWinnersCarousel = lazy(() => import("@/components/AutoScrollWinnersCarousel"));
const AutoScrollResultsToday = lazy(() => import("@/components/AutoScrollResultsToday"));
import { setTawkWidgetVisible } from '@/lib/tawkWidgetUtils';
import DailyCheckInCard from '@/components/DailyCheckInCard';

import useBrowserCheck from '@/components/WebBrowserChecker';
import OpenInExternalBrowser from '@/components/OpenInExternalBrowser';

import ScatterViewCard from "@/components/ScatterViewCard";
import ScatterCover from '../files/bet88_cover.jpg';
import PisoGameViewCard from '@/components/PisoGameViewCard';

// Tawk.to configuration
const TAWK_SRC = "https://embed.tawk.to/67f4c61c846b7b190fd1ea14/1ioa2bnq9";

function setTawkWidgetLeftMarginAndZIndex(pixels: number, zIndex: number) {
  const applyStyles = () => {
    const iframe = document.querySelector('iframe[title="chat widget"]') as HTMLIFrameElement | null;
    if (iframe) {
      iframe.style.left = pixels + "px";
      iframe.style.zIndex = String(zIndex);
    }
  };
  
  // Apply styles immediately
  applyStyles();

  // Create observer to watch for DOM changes and reapply styles
  const observer = new MutationObserver(() => {
    applyStyles();
  });

  // Start observing the document body for changes
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  // Return cleanup function to disconnect observer
  return () => observer.disconnect();
}


// Add TypeScript declaration for Tawk_API global
declare global {
  interface Window {
    Tawk_API?: any;
  }
}

interface SidebarProps {
  onLogout?: () => void;
}
export function Dashboard({ onLogout }: SidebarProps) {

  const navigate = useNavigate();
  const { setUserID,userID,deviceID  } = useUser();
  const { clientId, setClientId } = useClient();
  const [clientFullName, setClientFullName] = useState("");
  //console.log(userID);
  //console.log("playing as : "+clientId);
  const [balance, setBalance] = useState(0);
  const [winnings, setWinnings] = useState(0);
  const [winningsConvert, setWinningsConvert] = useState(0);
  const [quota, setQuota] = useState(0);
  const [quotaTime, setQuotaTime] = useState("");
  const [quotaAllow, setQuotaAllow] = useState("");
  const [refLevel, setRefLevel] = useState("");
  const [underEmployer, setUnderEmployer] = useState("");
  const [commissions, setCommissions] = useState(0);
  const [level1Percent, setLevel1Percent] = useState(0);
  const [level2Percent, setLevel2Percent] = useState(0);
  const [noLimitPercent, setNoLimitPercent] = useState(0);
  const [commissionsConvert, setCommissionsConvert] = useState(0);
  const [unclaimedCommissions, setUnclaimedCommissions] = useState(0);
  const [mobile, setMobile] = useState("");
  const [referral, setReferral] = useState("");
  const [status,setStatus] = useState("");
  const [agent,setAgent] = useState("");
  const [clients,setClients] = useState(0);
  const [showAccountModal, setShowAccountModal] = useState(false);
  // const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showCashInDialog, setShowCashInDialog] = useState(false);
  const [showCashOutDialog, setShowCashOutDialog] = useState(false);
  const [showCashOutComDialog, setShowCashOutComDialog] = useState(false);
  const [showWinConvertDialog, setShowWinConvertDialog] = useState(false);
  const [showComConvertDialog, setShowComConvertDialog] = useState(false);

  const [transLimit, setTransLimit] = useState(5000);
  const [commissionsCashout, setCommissionsCashout] = useState(0);
  const [cashInAmount, setCashInAmount] = useState(0);
  const [creditAmount, setCreditAmount] = useState(0);
  const [todayGames, setTodayGames] = useState<any[]>([]);
  const [popularGames, setPopularGames] = useState<any[]>([]);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showAdModal, setShowAdModal] = useState(false);
  const [newClient, setNewClient] = useState({
    full_name: "",
    bank: "",
    account: "",
  });

  const [channel, setChannel] = useState("GCASH_NATIVE");

  const API_URL = import.meta.env.VITE_DATABASE_URL;

  const [level1,setLevel1] = useState(0);
  const [level2,setLevel2] = useState(0);
  const [noLimit,setNoLimit] = useState(0);

  useEffect(() => {
    // Load Tawk.to widget
    if (!document.getElementById("tawk-to-script")) {
      const script = document.createElement("script");
      script.id = "tawk-to-script";
      script.async = true;
      script.src = TAWK_SRC;
      script.charset = "UTF-8";
      script.setAttribute("crossorigin", "*");
      
      document.body.appendChild(script);
      
      // Store cleanup function reference
      let observerCleanup: (() => void) | null = null;


      script.onload = () => {
        // Apply styles and keep them enforced with MutationObserver
        observerCleanup = setTawkWidgetLeftMarginAndZIndex(12, 50);
      };
    }
    
    // Cleanup function to remove Tawk.to widget when component unmounts
    return () => {
      const script = document.getElementById("tawk-to-script");
      if (script) script.remove();
      
      const iframe = document.querySelector('iframe[title="chat widget"]');
      if (iframe && iframe.parentNode) {
        iframe.parentNode.removeChild(iframe);
      }
      
      // Remove Tawk_API global if needed
      if (window.Tawk_API) {
        delete window.Tawk_API;
      }
    };
  }, []);

  useEffect(() => {
    setShowAdModal(true);
    if (userID && deviceID) {
      const handleUpdate = async () => {

        const commData = await getCommissions(userID);
        if(commData.authenticated)
        {
          setUnclaimedCommissions(commData.total_amount);
        }

        const dataRef = await getReferrals(userID);
        setLevel1(dataRef.level1);
        setLevel2(dataRef.level2);
        setNoLimit(dataRef.nolimit);

        const data = await fetchUserData(userID,deviceID);
        console.log(data);
        setBalance(data.balance);
        setWinnings(data.wins);
        setCommissions(data.commissions);
        setQuota(data.quota);
        setQuotaTime(data.quota_time);
        setQuotaAllow(data.quota_allow);
        setMobile(data.mobile);
        setReferral(data.referral);
        setStatus(data.status);
        setAgent(data.agent);
        setRefLevel(data.level);
        setUnderEmployer(data.under_employer);
        setLevel1Percent(data.level_one_percent);
        setLevel2Percent(data.level_two_percent);
        setNoLimitPercent(data.nolimit_percent);
        setLoading(false);

        
        


        if(clientId)
        {
          const clientData = await getBetClientData(clientId);
          setClientFullName(clientData.full_name);
        }

        if (clientId==="null") {
          setClientId(null);
        }
        
        

        const dataClients = await getMyBetClientsCount(userID);
        setClients(dataClients.countClients);

        const gamesData = await getGames();
        setPopularGames(gamesData);

        const gamesDataToday = await getGamesToday();
        setTodayGames(gamesDataToday);

      };
      handleUpdate();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userID,deviceID ]);

  // const handleCashInClick = () => {
  //   setShowSuccessModal(true);
  // };

  // const handleCloseModal = () => {
  //   setShowSuccessModal(false);
  // };

  const handleCloseAdModal = () => {
    setShowAdModal(false);
    // setTawkWidgetVisible(true);
  };

  

  const handleCashIn = () => {
    setShowCashInDialog(false);
  };

  const handleChangeClient = (e) => {
    setNewClient({ ...newClient, [e.target.name]: e.target.value });
  };



  const handleCloseModal = async () => {

    const commData = await getCommissions(userID);
    if(commData.authenticated)
    {
      setUnclaimedCommissions(commData.total_amount);
    }

    const dataRef = await getReferrals(userID);
    setLevel1(dataRef.level1);
    setLevel2(dataRef.level2);

    const data = await fetchUserData(userID,deviceID);
    setBalance(data.balance);
    setWinnings(data.wins);
    setCommissions(data.commissions);
    setQuota(data.quota);
    setQuotaTime(data.quota_time);
    setQuotaAllow(data.quota_allow);
    setMobile(data.mobile);
    setReferral(data.referral);
    setStatus(data.status);
    setAgent(data.agent);
    setRefLevel(data.level);
    setUnderEmployer(data.under_employer);
    setLevel1Percent(data.level_one_percent);
    setLevel2Percent(data.level_two_percent);
    setNoLimitPercent(data.nolimit_percent);
    setShowAccountModal(false);
  };

  const cashInSubmit =  async () => {
  
    console.log(userID);
    const dataRemit = await cashInCashko(cashInAmount.toString(),creditAmount.toString(),userID,channel);
    if(dataRemit.error)
    {
        alert("Payment method is currently down. Please try again later.");
    }
    setCashInAmount(0);
    setCreditAmount(0);

    const commData = await getCommissions(userID);
    if(commData.authenticated)
    {
      setUnclaimedCommissions(commData.total_amount);
    }

    const dataRef = await getReferrals(userID);
    setLevel1(dataRef.level1);
    setLevel2(dataRef.level2);

    const data = await fetchUserData(userID,deviceID);
    setBalance(data.balance);
    setWinnings(data.wins);
    setCommissions(data.commissions);
    setQuota(data.quota);
    setQuotaTime(data.quota_time);
    setQuotaAllow(data.quota_allow);
    setMobile(data.mobile);
    setReferral(data.referral);
    setStatus(data.status);
    setAgent(data.agent);
    setRefLevel(data.level);
    setUnderEmployer(data.under_employer);
    setLevel1Percent(data.level_one_percent);
        setLevel2Percent(data.level_two_percent);
        setNoLimitPercent(data.nolimit_percent);
    setLoading(false);

    
};

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  let value = parseFloat(e.target.value); // Convert to number

  // Set minimum value (e.g., 0 or any desired minimum value)
  const minValue = 50; // You can change this to your desired minimum value
  const maxValue = transLimit; // The maximum value from your existing logic

  // Ensure the value is within the min and max range
  //if (value < minValue) value = minValue; 
  if (value > maxValue) value = maxValue;

  setCashInAmount(value);
  setCreditAmount(value);
  
};


const handleChangeWinConvert = (e: React.ChangeEvent<HTMLInputElement>) => {
  let value = parseFloat(e.target.value); // Convert to number

  const maxValue = winnings; // The maximum value from your existing logic

  if (value > maxValue) value = maxValue;

  setWinningsConvert(value);
  
};

const handleChangeComConvert = (e: React.ChangeEvent<HTMLInputElement>) => {
  let value = parseFloat(e.target.value); // Convert to number

  const maxValue = commissions; // The maximum value from your existing logic

  if (value > maxValue) value = maxValue;

  setCommissionsConvert(value);
  
};

const handleChangeCom = (e: React.ChangeEvent<HTMLInputElement>) => {
  let value = parseFloat(e.target.value); // Convert to number

  const maxValue = commissions; // The maximum value from your existing logic

  if (value > maxValue) value = maxValue;

  setCommissionsCashout(value);
  
};


const removePlayer = () => {
  setClientId(null);
  
};


const handleSubmit = async (e) => {
    e.preventDefault();
    setShowCashOutDialog(false);
    setLoading(true);
    const data = await cashOutCashko(userID,winnings.toString(),newClient.full_name,newClient.bank,newClient.account);
    if(data.error){
      alert(data.message);
    }
    else
    {
      alert("Payout request created successfully.");
      setNewClient({ full_name: "", bank: "", account: "" });
      
      const commData = await getCommissions(userID);
      if(commData.authenticated)
      {
        setUnclaimedCommissions(commData.total_amount);
      }

      const dataRef = await getReferrals(userID);
      setLevel1(dataRef.level1);
      setLevel2(dataRef.level2);

      const data = await fetchUserData(userID,deviceID);
      setBalance(data.balance);
      setWinnings(data.wins);
      setCommissions(data.commissions);
      setQuota(data.quota);
      setQuotaTime(data.quota_time);
      setQuotaAllow(data.quota_allow);
      setMobile(data.mobile);
      setReferral(data.referral);
      setStatus(data.status);
      setAgent(data.agent);
      setRefLevel(data.level);
      setUnderEmployer(data.under_employer);
      setLevel1Percent(data.level_one_percent);
        setLevel2Percent(data.level_two_percent);
        setNoLimitPercent(data.nolimit_percent);

      if(clientId)
      {
        const clientData = await getBetClientData(clientId);
        setClientFullName(clientData.full_name);
      }

      if (clientId==="null") {
        setClientId(null);
      }


      
      
    }
    setLoading(false);
  };



  const handleSubmitWinConvert = async (e) => {
    e.preventDefault();
    setShowWinConvertDialog(false);
    setLoading(true);
    const data = await convertWinsToBalance(userID,winningsConvert.toString());
    if(data.error){
      alert(data.message);
    }
    else
    {
      alert("Winnings converted successfully.");
      setWinningsConvert(0);

      const commData = await getCommissions(userID);
      if(commData.authenticated)
      {
        setUnclaimedCommissions(commData.total_amount);
      }

      const dataRef = await getReferrals(userID);
      setLevel1(dataRef.level1);
      setLevel2(dataRef.level2);

      const data = await fetchUserData(userID,deviceID);
      setBalance(data.balance);
      setWinnings(data.wins);
      setCommissions(data.commissions);
      setQuota(data.quota);
      setQuotaTime(data.quota_time);
      setQuotaAllow(data.quota_allow);
      setMobile(data.mobile);
      setReferral(data.referral);
      setStatus(data.status);
      setAgent(data.agent);
      setRefLevel(data.level);
      setUnderEmployer(data.under_employer);
      setLevel1Percent(data.level_one_percent);
        setLevel2Percent(data.level_two_percent);
        setNoLimitPercent(data.nolimit_percent);

      if(clientId)
      {
        const clientData = await getBetClientData(clientId);
        setClientFullName(clientData.full_name);
      }

      if (clientId==="null") {
        setClientId(null);
      }

      
    }
    setLoading(false);
  };



  const handleSubmitComConvert = async (e) => {
    e.preventDefault();
    setShowComConvertDialog(false);
    setLoading(true);
    const data = await convertCommissionsToBalance(userID,commissionsConvert.toString());
    if(data.error){
      alert(data.message);
    }
    else
    {
      alert("Commissions converted successfully.");
      setCommissionsConvert(0);

      const commData = await getCommissions(userID);
      if(commData.authenticated)
      {
        setUnclaimedCommissions(commData.total_amount);
      }

      const dataRef = await getReferrals(userID);
      setLevel1(dataRef.level1);
      setLevel2(dataRef.level2);

      const data = await fetchUserData(userID,deviceID);
      setBalance(data.balance);
      setWinnings(data.wins);
      setCommissions(data.commissions);
      setQuota(data.quota);
      setQuotaTime(data.quota_time);
      setQuotaAllow(data.quota_allow);
      setMobile(data.mobile);
      setReferral(data.referral);
      setStatus(data.status);
      setAgent(data.agent);
      setRefLevel(data.level);
      setUnderEmployer(data.under_employer);
      setLevel1Percent(data.level_one_percent);
        setLevel2Percent(data.level_two_percent);
        setNoLimitPercent(data.nolimit_percent);

      if(clientId)
      {
        const clientData = await getBetClientData(clientId);
        setClientFullName(clientData.full_name);
      }

      if (clientId==="null") {
        setClientId(null);
      }

      
    }
    setLoading(false);
  };


  const handleSubmitComm = async (e) => {
    e.preventDefault();
    setShowCashOutComDialog(false);
    setLoading(true);
    const data = await cashOutCashkoCommission(userID,commissionsCashout.toString(),newClient.full_name,newClient.bank,newClient.account);
    if(data.error){
      alert(data.message);
    }
    else
    {
      alert("Payout request created successfully.");
      setNewClient({ full_name: "", bank: "", account: "" });
      setCommissionsCashout(0);

      const commData = await getCommissions(userID);
      if(commData.authenticated)
      {
        setUnclaimedCommissions(commData.total_amount);
      }

      const dataRef = await getReferrals(userID);
      setLevel1(dataRef.level1);
      setLevel2(dataRef.level2);

      const data = await fetchUserData(userID,deviceID);
      setBalance(data.balance);
      setWinnings(data.wins);
      setCommissions(data.commissions);
      setQuota(data.quota);
      setQuotaTime(data.quota_time);
      setQuotaAllow(data.quota_allow);
      setMobile(data.mobile);
      setReferral(data.referral);
      setStatus(data.status);
      setAgent(data.agent);
      setRefLevel(data.level);
      setUnderEmployer(data.under_employer);
      setLevel1Percent(data.level_one_percent);
        setLevel2Percent(data.level_two_percent);
        setNoLimitPercent(data.nolimit_percent);

      if(clientId)
      {
        const clientData = await getBetClientData(clientId);
        setClientFullName(clientData.full_name);
      }

      if (clientId==="null") {
        setClientId(null);
      }


      
      
    }
    setLoading(false);
  };

  const handleMaintaingBalance = async (e, sourceType: 'winnings' | 'commission') =>{
    e.preventDefault();

    const data = await checkMaintainingBalance(userID);

    if (!data.authenticated || !data.proceed)
    {
      alert(data.message);
      return;
    }

    if (sourceType == "winnings"){ 
      setShowCashOutDialog(true);
    } else {
      setShowCashOutComDialog(true);
    }
  }

  const isMessengerWebview = useBrowserCheck();
    
  if (isMessengerWebview) {
      return <div> <OpenInExternalBrowser/> </div>;
  }

  if (loading ) {
    return <div>...</div>;
  }

  const liveStreams = [
    { id: 1, title: "Game Mechanics",live: true, viewers: 1243, streamer: "[Live] PCSO Lotto Draw", image: "https://www.youtube.com/embed/pO0BDYTq7zw?si=22s1k5ePuyKvgsy5" },
   /*  { id: 2, title: "PCSO 2:00 PM Lotto Draw - September 17, 2024",live:false, viewers: 876, streamer: "PCSO Lotto Draw - September 17, 2024", image: "https://www.youtube.com/embed/-V27j5M_GNM?si=gZY1bCopPs6xKCMa" }, */
  ];
  
  // Prepare carousel slides
  const carouselSlides = [
    //...liveStreams.map((stream) => ({ type: "live" as const, stream })),
    { type: "ad" as const }, // Standard ad slide
    // { 
    //   type: "ad" as const, // Use 'ad' type to fit CarouselSlide
    //   adContent: (
    //     <YouTubeEmbedCard
    //       videoId="4ai4e66qF24"
    //       title="PCSO Lotto Draw Live"
    //     />
    //   )
    // },
    { 
      type: "ad" as const, // Use 'ad' type to fit CarouselSlide
      adContent: (
        <YouTubeEmbedCard
          videoId="4ai4e66qF24"
          title="Piso Play Game Play"
        />
      )
    },
    {
      type: "ad" as const,
      adContent: <ImageAdCard image={Prizes1} alt="Prizes 1" />,
    },
    {
      type: "ad" as const,
      adContent: <ImageAdCard image={Prizes2} alt="Prizes 2" />,
    },
  ];
  
  return (
  <>
      <AdvertisementModal
        isOpen={showAdModal}
        onClose={handleCloseAdModal}
        title="Magandang Balita!"
        // description="Sa Isang Pindot, Isang Bente ₱20. Isang Libo kada Kita Araw-Araw!"
        description={
          <>
            Paano kumita ang Referral System sa PisoPlay panoorin ang videong eto <a href="https://www.youtube.com/shorts/lTGTs5M4geE?feature=share" className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">PisoPlay Referral System</a>
          </>
        }
        imageUrl={AdvertisementImage}// Replace with your ad image URL
        youtubeUrl="https://www.youtube.com/shorts/lTGTs5M4geE"
      />
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="mx-auto flex items-center space-x-2 w-max ml-28 md:ml-18">
            {/* <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="3" y1="12" x2="21" y2="12"></line>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <line x1="3" y1="18" x2="21" y2="18"></line>
                  </svg>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[250px] sm:w-[300px]">
                <nav className="flex flex-col gap-4 mt-8">
                  <Link 
                    to="/dashboard" 
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 text-blue-600"
                    onClick={e => {
                      e.preventDefault();
                      window.location.href = "/dashboard";
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                      <polyline points="9 22 9 12 15 12 15 22"></polyline>
                    </svg>
                    Home1
                  </Link>
                  <Link to="/transactions" className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <ellipse cx="12" cy="5" rx="8" ry="3"></ellipse>
                      <path d="M4 5v6a8 3 0 0 0 16 0V5"></path>
                      <path d="M4 11v6a8 3 0 0 0 16 0v-6"></path>
                    </svg>My Transactions
                  </Link>
                  <Link to="/my-bets" className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <ellipse cx="12" cy="5" rx="8" ry="3"></ellipse>
                      <path d="M4 5v6a8 3 0 0 0 16 0V5"></path>
                      <path d="M4 11v6a8 3 0 0 0 16 0v-6"></path>
                    </svg>My Bets
                  </Link>
                  <Link to="/drawhistory" className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
                      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
                      <path d="M4 22h16"></path>
                      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
                      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
                      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
                    </svg>
                    Draws
                  </Link>
                  <Link to="/support" className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="8" x2="12" y2="12"></line>
                      <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    Help & Support
                  </Link>
                  <Link to="/pisoplaysguide" className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="8" x2="12" y2="12"></line>
                      <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    Help Manual
                  </Link> */}
                  {/* <a
                    href="https://tawk.to/chat/67ec009ce808511907a28002/1inou4plh"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="8" x2="12" y2="12"></line>
                      <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    Support
                  </a> */}
                  {/* <Button onClick={onLogout}  className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 text-red-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                      <polyline points="16 17 21 12 16 7"></polyline>
                      <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                    Logout
                  </Button>
                </nav>
              </SheetContent>
            </Sheet> */}
            
            {/* <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-yellow-300 to-yellow-500 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="white" stroke="none">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                </svg>
              </div>
              <span className="ml-2 font-bold text-gray-800 hidden sm:inline">PisoPlay</span>
            </div> */}
        <div className="flex flex-col items-center justify-center mb-auto sm:flex-row">
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center shadow-lg">
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center shadow-lg">
            <img src={PisoPlayLogo} alt="PisoPlay Logo" width="44" height="44" />
          </div>
          </div>
        </div>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              to="/dashboard" 
              className="text-blue-600 font-medium"
              onClick={e => {
                e.preventDefault();
                window.location.href = "/dashboard";
              }}
            >Home</Link>
            <Link to="/transactions" className="text-gray-600 hover:text-gray-900">My Transactions</Link>
            <Link to="/my-bets" className="text-gray-600 hover:text-gray-900">My Bets</Link>
            <Link to="/drawhistory" className="text-gray-600 hover:text-gray-900">Draws</Link>
            <Link to="/support" className="text-gray-600 hover:text-gray-900">Support</Link>
            <Link to="/pisoplaysguide" className="text-gray-600 hover:text-gray-900">Help Guide</Link>
                      {/* <a
            href="https://tawk.to/chat/67ec009ce808511907a28002/1inou4plh"
            className="text-gray-600 hover:text-gray-900"
            target="_blank"
            rel="noopener noreferrer"
          >
            Support
          </a> */}
            <Link onClick={onLogout} className="text-gray-600 hover:text-gray-900" to={''}>Logout</Link>
          </nav>
          
          <div className="flex items-center space-x-4">
            <div className="bg-green-100 px-3 py-1 rounded-full text-green-700 font-medium hidden sm:block">
              {formatPeso(balance)}
            </div>
            
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                <button className="focus:outline-none">
                  <Avatar className="cursor-pointer hover:ring-2 hover:ring-blue-400 transition-all">
                    <AvatarImage src="https://merlinmentors.org/wp-content/uploads/2022/02/generic-headshot-avatar.jpg" />
                    <AvatarFallback></AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center p-2">
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarImage src="https://merlinmentors.org/wp-content/uploads/2022/02/generic-headshot-avatar.jpg" />
                    <AvatarFallback></AvatarFallback>
                  </Avatar>
                  <div>
                  <p className="text-sm font-medium">
                    {mobile}
                  </p>

                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer" onClick={() => setShowAccountModal(true)}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  <span>My Account</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/transactions')}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                  <ellipse cx="12" cy="5" rx="8" ry="3"></ellipse>
                      <path d="M4 5v6a8 3 0 0 0 16 0V5"></path>
                      <path d="M4 11v6a8 3 0 0 0 16 0v-6"></path>
                  </svg>
                  <span>My Transactions</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/my-bets')}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                  <ellipse cx="12" cy="5" rx="8" ry="3"></ellipse>
                  <path d="M4 5v6a8 3 0 0 0 16 0V5"></path>
                  <path d="M4 11v6a8 3 0 0 0 16 0v-6"></path>
                  </svg>
                  <span>My Bets</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/drawhistory')}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
                    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
                    <path d="M4 22h16"></path>
                    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
                    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
                    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
                  </svg>
                  <span>Draws</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {/* <DropdownMenuItem className="cursor-pointer" onClick={() => window.open('https://tawk.to/chat/67ec009ce808511907a28002/1inou4plh', '_blank', 'noopener,noreferrer')}> */}
                <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/support')}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M12 17h.01"></path>
                  <path d="M12 13a3 3 0 1 0-3-3"></path>
                  </svg>
                  <span>Support</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/pisoplaysguide')}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M12 17h.01"></path>
                  <path d="M12 13a3 3 0 1 0-3-3"></path>
                  </svg>
                  <span>Help Guide</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer text-red-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                  <Link onClick={onLogout} to={''}>Logout</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <AnnouncementsMarquee />
      {/* Account Management Modal */}
        {showAccountModal && (
        <AccountManagementModal onClose={handleCloseModal} />
      )}
      
      <main className="container mx-auto px-4 py-6">
        {/* Balance Card (Mobile) */}
        <div >
        <Tabs defaultValue="todayDraws" className='m-0'>
          <div className="flex justify-end items-center">
            <TabsList>
              <TabsTrigger
                value="todayDraws"
                className="p-2 mr-2 bg-gray-200 text-gray-800 hover:bg-gray-300 md:max-w-full md:mr-2"
              >
                Today Draws
              </TabsTrigger>
              <TabsTrigger
                value="winners"
                className="p-2 bg-gray-200 text-gray-800 hover:bg-gray-300 md:max-w-full"
              >
                Winners
              </TabsTrigger>
            </TabsList>

          </div>
          <TabsContent value="todayDraws" className="mt-0">
            <AutoScrollResultsToday />
          </TabsContent>
          <TabsContent value="winners" className="mt-0">
            <AutoScrollWinnersCarousel />
          </TabsContent>
        </Tabs>
        <DailyCheckInCard className=" mb-4"/>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl shadow p-4 flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm">Your Balance</p>
              <p className="text-2xl font-bold text-gray-800">{formatPeso(balance)}</p>
            </div>
            <Button className="bg-green-500 hover:bg-green-600" onClick={() => setShowCashInDialog(true)}>Cash In</Button>
          </div>

          <div className="bg-white rounded-xl shadow p-4 flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm">Your Winnings</p>
              <p className="text-2xl font-bold text-gray-800">{formatPeso(winnings)}</p>
            </div>
            <div className="flex flex-col gap-2">
              <Button className="bg-green-500 hover:bg-green-600" 
              disabled={!winnings || winnings < 50} 
              onClick={() => {
                setShowWinConvertDialog(true);
                setWinningsConvert(winnings); // Add your second function here
              }}
              >Convert</Button>
              <Button className="bg-green-500 hover:bg-green-600" 
              disabled={!winnings || winnings < 108} 
              onClick={(e) => handleMaintaingBalance(e, "winnings")}>Cash Out</Button>
            </div>
            
          </div>
        </div>
          <br/>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  {/* Box 1 */}
  {quotaAllow==="no" && (
  <div className="bg-white rounded-xl shadow p-4 flex flex-col justify-between">
    <div>
          <p
        className={`text-sm ${
          unclaimedCommissions >= quota ? 'text-gray-500' : 'text-red-500'
        }`}
      >
        {unclaimedCommissions >= quota
          ? `Commissions will now be in your withdrawable balance (${quotaTime})`
          : `Below Bet Quota (${quotaTime})`}
      </p>

      <p
        className={`text-2xl font-bold ${
          unclaimedCommissions >= quota ? 'text-green-600' : 'text-red-600'
        }`}
      >
        {formatPeso(unclaimedCommissions)} / {formatPeso(quota)}
      </p>

    </div>
  </div>)
}
  {/* Box 2 */}
  <div className="bg-white rounded-xl shadow p-4 flex justify-between items-center">
    <div>
      <p className="text-gray-500 text-sm">Withdrawable Commissions</p>
      <p className="text-2xl font-bold text-gray-800">{formatPeso(commissions)}</p>
    </div>
    <div className="flex flex-col gap-2">
    <Button className="bg-green-500 hover:bg-green-600" 
    disabled={!commissions || commissions < 50} 
    onClick={() => {
      setShowComConvertDialog(true);
      setCommissionsConvert(commissions); // Add your second function here
    }}
    >Convert</Button>
     <Button className="bg-green-500 hover:bg-green-600" 
     disabled={!commissions || commissions < 108} 
      onClick={(e) => {
        handleMaintaingBalance(e, "commission");
        setCommissionsCashout(commissions); // Add your second function here
      }}
    >
      Cash Out
    </Button>
  </div>


   
  </div>
</div>
                <br/>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-xl shadow p-4 flex justify-between items-center">
                  <div>
                    
                      <p className="text-gray-500 text-sm">Referrals</p>
                      <p className="text-2xl font-bold text-gray-800">{(refLevel === 'level2' ? level1+level2 : noLimit)}</p>
                    
                  </div>
                  <div className="flex flex-col gap-2">
                    {referral && underEmployer !== 'yes' && (
                      <Button
                        onClick={() => {
                          navigate('/allowReferrer');
                        }} 
                        className="bg-blue-500 hover:bg-blue-600"
                      >
                        Set Referrer Access
                      </Button>
                    )}
                    
                    <Button
                      onClick={() => {
                        navigate('/manageTeam', { state: { userID: userID } });
                      }} 
                      className="bg-blue-500 hover:bg-blue-600"
                    >
                      Dashboard
                    </Button>
                  </div>

                </div>
              <div className="bg-white rounded-xl shadow p-4 flex justify-between items-center">
                <div>
                  <p className="text-gray-500 text-sm">Betting Clients</p>
                  <p className="text-2xl font-bold text-gray-800">{clients}</p>
                  
                </div>
                <Button
                onClick={() => {
                  navigate('/betclients');
                }} 
                className="bg-green-500 hover:bg-green-600"  >Manage</Button>
              </div>
              </div>
              {clientId && (
                <>
                <br/>
                <div className="bg-white rounded-xl shadow p-4 flex justify-between items-center">
                  <div>
                    
                      <p className="text-gray-500 text-sm">Currently Playing as : </p>
                      <p className="text-2xl font-bold text-gray-800">{clientFullName}</p>
                    
                  </div>
                  <Button
                  onClick={() => {
                    removePlayer();
                  }} 
                  className="bg-red-500 hover:bg-red-600"  >REMOVE</Button>
                </div>
                </>
              )}
            
        </div>

        
        {/* Live Streams */}
        <section className="mb-8"><br/>
          {/* <h2 className="text-xl font-bold mb-4 text-gray-800">Live Now</h2> */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left column: Carousel */}
            <div>
              <DashboardCarousel slides={carouselSlides} />
            </div>
              <PisoGameViewCard
                title="Piso Game"
                url="https://pisogame.com/R/VI6KxuLZb"
                height="300px"
              />
              <ScatterViewCard 
              url='https://bet88.ph?ref=394386129b81'
              img={ScatterCover}
              title="BET88" 
              height="200px"            />
              {/* <DailyCheckInCard /> */}
          </div>
        </section>
        
        {/* Games Tabs */}
        <Tabs defaultValue="today" className="mb-20">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Games</h2>
            <TabsList>
            <TabsTrigger value="today">Today</TabsTrigger>
              <TabsTrigger value="popular">All Games</TabsTrigger>
             {/*  <TabsTrigger value="new">New</TabsTrigger> */}
              <TabsTrigger value="favorites">Favorites</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="today" className="mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {todayGames.map(game => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="popular" className="mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {popularGames.map(game => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          </TabsContent>
          
          {/* <TabsContent value="new" className="mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {newGames.map(game => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          </TabsContent> */}
          
          <TabsContent value="favorites" className="mt-0">
            <div className="text-center py-8">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-gray-400 mb-4">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-700 mb-2">No favorites yet</h3>
              <p className="text-gray-500 mb-4">Add games to your favorites to see them here</p>
              <Button variant="outline">Browse Games</Button>
            </div>
          </TabsContent>
        </Tabs>

              {/* Cash In Dialog */}
              <Dialog open={showCashInDialog} onOpenChange={setShowCashInDialog}>
                  <DialogContent className="bg-gray-200 border-[#34495e] max-h-[100vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="text-xl text-blue-600">Cash In</DialogTitle>
                      <DialogDescription className="text-black-300">
                        Add more coins to your balance to continue playing.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <h4 className="font-medium mb-2">Add Funds</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between bg-white p-2 rounded border">
                          <div className="flex items-center">
                            <div>
                              <input
                                value={creditAmount} 
                                onChange={handleChange}
                                type="number" 
                                className="border rounded p-1 text-sm w-full" 
                                placeholder="Enter amount" 
                                style={{ appearance: 'textfield' }}
                              />
                              <style>{`
                                input[type=number]::-webkit-outer-spin-button,
                                input[type=number]::-webkit-inner-spin-button {
                                  -webkit-appearance: none;
                                  margin: 0;
                                }
                                input[type=number] {
                                  -moz-appearance: textfield;
                                }
                              `}</style>
                              <br/><br/>
                              <div className="flex flex-wrap gap-2">
                                  {[
                                    channel === "GCASH_NATIVE" ? 100 : 50,
                                    100, 200, 300, 500, 1000, 2000, 3000, 5000,
                                  ]
                                    .filter((v, i, arr) => arr.indexOf(v) === i) // remove duplicates
                                    .map((value) => (
                                      <button
                                        key={value}
                                        onClick={() =>
                                          handleChange({
                                            target: { value: value.toString() },
                                          } as React.ChangeEvent<HTMLInputElement>)
                                        }
                                        className={`border rounded p-2 text-sm w-20 text-center ${
                                          creditAmount.toString() === value.toString()
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-100 hover:bg-gray-200'
                                        }`}
                                      >
                                        {value}
                                      </button>
                                    ))}
                                </div>


                            <br/><br/>
                            <label htmlFor="bank" className="block mb-1 font-medium">
                            Payment Method
                          </label>
                              <select
                                name="bank"
                                value={channel}
                                onChange={(e) => setChannel(e.target.value)}
                                className="w-full p-2 border rounded"
                                required
                              >
                                <option value="" disabled>
                                  Select Payment Method
                                </option>
                                <option value="GCASH_NATIVE">GCASH</option>
                                <option value="QRPH_SCAN">QRPH</option>
                                <option value="MAYA_NATIVE">MAYA</option>
                                {/* Add more options as needed */}
                              </select>
                            </div>
                          </div>
                        </div>
                        <div>
                          <Button 
                              disabled={
                                !cashInAmount || 
                                !termsAccepted || 
                                (channel === "GCASH_NATIVE" ? cashInAmount < 100 : cashInAmount < 50)
                              } 
                              type="button"
                              variant="outline" 
                              size="sm"
                              onClick={cashInSubmit}  
                              className="w-full text-blue-500 bg-blue-100 hover:text-blue-700 hover:bg-green-50 rounded px-4 py-2"
                            >
                              <label>Cash In</label>
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 mt-4">
                      <input 
                        type="checkbox" 
                        id="terms" 
                        checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                        className="h-4 w-4 text-pink-500 focus:ring-0"
                        required
                      />
                      <span className="text-sm text-gray-700">
                        I agree to the 
                        <a href={API_URL +"/img/terms.pdf"} target='_blank' className="text-pink-500"> Terms and Conditions</a>
                      </span>
                    </div>
                    
                    <DialogFooter className="flex flex-col gap-2 sm:flex-row">
                      <Button 
                        variant="outline" 
                        onClick={() => setShowCashInDialog(false)}
                        className="w-full sm:w-auto border-blue-500 text-blue-600 hover:bg-blue-900/20"
                      >
                        Cancel
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                


                <Dialog open={showCashOutDialog} onOpenChange={setShowCashOutDialog}>
                  <DialogContent className="bg-gray-200 border-[#34495e]">
                    <DialogHeader>
                      <DialogTitle className="text-xl text-blue-600">Cash Out</DialogTitle>
                      <DialogDescription className="text-red-600">
                      Please enter payout details carefully. PisoPlay is not responsible for misdirected funds due to incorrect information.
            
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <h4 className="font-medium mb-2">Withdraw Funds</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between bg-white p-2 rounded border">
                        <form onSubmit={handleSubmit} className="space-y-3">
                          <div className="flex items-center">
                            <div>
                              <input
                                value={winnings} 
                                readOnly
                                type="number" 
                                className="border rounded p-1 text-sm w-full" 
                                placeholder="Enter amount" 
                                style={{ appearance: 'textfield' }}
                              />
                              <style>{`
                                input[type=number]::-webkit-outer-spin-button,
                                input[type=number]::-webkit-inner-spin-button {
                                  -webkit-appearance: none;
                                  margin: 0;
                                }
                                input[type=number] {
                                  -moz-appearance: textfield;
                                }
                              `}</style>
                                <small className="text-xs text-gray-500">Min: 108 | Max: ₱5000</small>
                            <br/><br/>
                            <input
                                type="text"
                                name="full_name"
                                placeholder="Full Name"
                                value={newClient.full_name}
                                onChange={handleChangeClient}
                                className="w-full p-2 border rounded"
                                required
                              />
                              <br/><br/>
                              <select
                                name="bank"
                                value={newClient.bank}
                                onChange={handleChangeClient}
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

                              <br/><br/>
                              <input
                                  type="text"
                                  name="account"
                                  placeholder="Account Number"
                                  value={newClient.account}
                                  onChange={(e) => {
                                    const onlyDigits = e.target.value.replace(/\D/g, "");
                                    handleChangeClient({ target: { name: "account", value: onlyDigits } });
                                  }}
                                  inputMode="numeric"
                                  pattern="[0-9]*"
                                  className="w-full p-2 border rounded"
                                  required
                                />

                            </div>


                          </div>
                          <Button 
                            disabled={!winnings || winnings < 108 || !termsAccepted} 
                            type="submit"
                            variant="outline" 
                            size="sm" 
                            className="text-blue-500 bg-blue-100 hover:text-blue-700 hover:bg-green-50 rounded px-4 py-2"
                          >
                            <label>Cash Out</label>
                          </Button>
                          </form>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 mt-4">
                      <input 
                        type="checkbox" 
                        id="terms" 
                        checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                        className="h-4 w-4 text-pink-500 focus:ring-0"
                        required
                      />
                      <span className="text-sm text-gray-700">
                        I agree to the 
                        <a href={API_URL +"/img/terms.pdf"} target='_blank' className="text-pink-500"> Terms and Conditions</a>
                      </span>
                    </div>
                    
                    <DialogFooter className="flex flex-col gap-2 sm:flex-row">
                      <Button 
                        variant="outline" 
                        onClick={() => setShowCashOutDialog(false)}
                        className="w-full sm:w-auto border-blue-500 text-blue-600 hover:bg-blue-900/20"
                      >
                        Cancel
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

              
                <Dialog open={showWinConvertDialog} onOpenChange={setShowWinConvertDialog}>
                  <DialogContent className="bg-gray-200 border-[#34495e]">
                    <DialogHeader>
                      <DialogTitle className="text-xl text-blue-600">Add to Balance</DialogTitle>
                      <DialogDescription className="text-red-600">
                      Note: Please be advised that commissions or winnings converted to bet credits are not eligible for cash-out.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <h4 className="font-medium mb-2">Add to Balance</h4>
                      <div className="space-y-2">

                        <div className="flex items-center justify-between bg-white p-2 rounded border">
                        <form onSubmit={handleSubmitWinConvert} className="space-y-3">
                          <div className="flex items-center">
                            <div>
                              <input
                                value={winningsConvert}
                                onChange={handleChangeWinConvert}
                                type="number" 
                                className="border rounded p-1 text-sm w-full" 
                                placeholder="Enter amount" 
                                style={{ appearance: 'textfield' }}
                              />
                              <style>{`
                                input[type=number]::-webkit-outer-spin-button,
                                input[type=number]::-webkit-inner-spin-button {
                                  -webkit-appearance: none;
                                  margin: 0;
                                }
                                input[type=number] {
                                  -moz-appearance: textfield;
                                }
                              `}</style>

                            <small className="text-xs text-gray-500">Min: ₱50 | Max: ₱5000</small>
                            </div>


                          </div>
                          <Button 
                            disabled={!winningsConvert || winningsConvert < 50 || !termsAccepted} 
                            type="submit"
                            variant="outline" 
                            size="sm" 
                            className="text-blue-500 bg-blue-100 hover:text-blue-700 hover:bg-green-50 rounded px-4 py-2"
                          >
                            <label>Add to Balance</label>
                          </Button>
                          </form>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 mt-4">
                      <input 
                        type="checkbox" 
                        id="terms" 
                        checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                        className="h-4 w-4 text-pink-500 focus:ring-0"
                        required
                      />
                      <span className="text-sm text-gray-700">
                        I agree to the 
                        <a href={API_URL +"/img/terms.pdf"} target='_blank' className="text-pink-500"> Terms and Conditions</a>
                      </span>
                    </div>
                    
                    <DialogFooter className="flex flex-col gap-2 sm:flex-row">
                      <Button 
                        variant="outline" 
                        onClick={() => setShowWinConvertDialog(false)}
                        className="w-full sm:w-auto border-blue-500 text-blue-600 hover:bg-blue-900/20"
                      >
                        Cancel
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                              


                <Dialog open={showCashOutComDialog} onOpenChange={setShowCashOutComDialog}>
                  <DialogContent className="bg-gray-200 border-[#34495e]">
                    <DialogHeader>
                      <DialogTitle className="text-xl text-blue-600">Cash Out Commission</DialogTitle>
                      <DialogDescription className="text-red-600">
                      Please enter payout details carefully. PisoPlay is not responsible for misdirected funds due to incorrect information.
            
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <h4 className="font-medium mb-2">Withdraw Funds</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between bg-white p-2 rounded border">
                        <form onSubmit={handleSubmitComm} className="space-y-3">
                          <div className="flex items-center">
                            <div>
                              <input
                                value={commissionsCashout} 
                                onChange={handleChangeCom}
                                type="number" 
                                className="border rounded p-1 text-sm w-full" 
                                placeholder="Enter amount" 
                                style={{ appearance: 'textfield' }}
                              />
                              <style>{`
                                input[type=number]::-webkit-outer-spin-button,
                                input[type=number]::-webkit-inner-spin-button {
                                  -webkit-appearance: none;
                                  margin: 0;
                                }
                                input[type=number] {
                                  -moz-appearance: textfield;
                                }
                              `}</style>
                                <small className="text-xs text-gray-500">Min: 108 | Max: ₱5000</small>
                            <br/><br/>
                            <input
                                type="text"
                                name="full_name"
                                placeholder="Full Name"
                                value={newClient.full_name}
                                onChange={handleChangeClient}
                                className="w-full p-2 border rounded"
                                required
                              />
                              <br/><br/>
                              <select
                                name="bank"
                                value={newClient.bank}
                                onChange={handleChangeClient}
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

                              <br/><br/>
                              <input
                                  type="text"
                                  name="account"
                                  placeholder="Account Number"
                                  value={newClient.account}
                                  onChange={(e) => {
                                    const onlyDigits = e.target.value.replace(/\D/g, "");
                                    handleChangeClient({ target: { name: "account", value: onlyDigits } });
                                  }}
                                  inputMode="numeric"
                                  pattern="[0-9]*"
                                  className="w-full p-2 border rounded"
                                  required
                                />

                            </div>


                          </div>
                          <Button 
                            disabled={!commissionsCashout || commissionsCashout < 108 || !termsAccepted} 
                            type="submit"
                            variant="outline" 
                            size="sm" 
                            className="text-blue-500 bg-blue-100 hover:text-blue-700 hover:bg-green-50 rounded px-4 py-2"
                          >
                            <label>Cash Out</label>
                          </Button>
                          </form>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 mt-4">
                      <input 
                        type="checkbox" 
                        id="terms" 
                        checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                        className="h-4 w-4 text-pink-500 focus:ring-0"
                        required
                      />
                      <span className="text-sm text-gray-700">
                        I agree to the 
                        <a href={API_URL +"/img/terms.pdf"} target='_blank' className="text-pink-500"> Terms and Conditions</a>
                      </span>
                    </div>
                    
                    <DialogFooter className="flex flex-col gap-2 sm:flex-row">
                      <Button 
                        variant="outline" 
                        onClick={() => setShowCashOutComDialog(false)}
                        className="w-full sm:w-auto border-blue-500 text-blue-600 hover:bg-blue-900/20"
                      >
                        Cancel
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>


                <Dialog open={showComConvertDialog} onOpenChange={setShowComConvertDialog}>
                  <DialogContent className="bg-gray-200 border-[#34495e]">
                    <DialogHeader>
                      <DialogTitle className="text-xl text-blue-600">Add to Balance</DialogTitle>
                      <DialogDescription className="text-red-600">
                      Note: Please be advised that commissions or winnings converted to bet credits are not eligible for cash-out.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <h4 className="font-medium mb-2">Add to Balance</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between bg-white p-2 rounded border">
                        <form onSubmit={handleSubmitComConvert} className="space-y-3">
                          <div className="flex items-center">
                            <div>
                              <input
                                value={commissionsConvert}
                                onChange={handleChangeComConvert}
                                type="number" 
                                className="border rounded p-1 text-sm w-full" 
                                placeholder="Enter amount" 
                                style={{ appearance: 'textfield' }}
                              />
                              <style>{`
                                input[type=number]::-webkit-outer-spin-button,
                                input[type=number]::-webkit-inner-spin-button {
                                  -webkit-appearance: none;
                                  margin: 0;
                                }
                                input[type=number] {
                                  -moz-appearance: textfield;
                                }
                              `}</style>
                              <small className="text-xs text-gray-500">Min: ₱50 | Max: ₱5000</small>
                            
                            </div>


                          </div>
                          <Button 
                            disabled={!commissionsConvert || commissionsConvert < 50 || !termsAccepted} 
                            type="submit"
                            variant="outline" 
                            size="sm" 
                            className="text-blue-500 bg-blue-100 hover:text-blue-700 hover:bg-green-50 rounded px-4 py-2"
                          >
                            <label>Add to Balance</label>
                          </Button>
                          </form>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 mt-4">
                      <input 
                        type="checkbox" 
                        id="terms" 
                        checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                        className="h-4 w-4 text-pink-500 focus:ring-0"
                        required
                      />
                      <span className="text-sm text-gray-700">
                        I agree to the 
                        <a href={API_URL +"/img/terms.pdf"} target='_blank' className="text-pink-500"> Terms and Conditions</a>
                      </span>
                    </div>
                    
                    <DialogFooter className="flex flex-col gap-2 sm:flex-row">
                      <Button 
                        variant="outline" 
                        onClick={() => setShowComConvertDialog(false)}
                        className="w-full sm:w-auto border-blue-500 text-blue-600 hover:bg-blue-900/20"
                      >
                        Cancel
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

        
        {/* Quick Access */}
        {/* <section>
          <h2 className="text-xl font-bold mb-4 text-gray-800">Quick Access</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Button variant="outline" className="h-auto py-6 flex flex-col items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 6v6l4 2"></path>
              </svg>
              <span>History</span>
            </Button>
            <Button variant="outline" className="h-auto py-6 flex flex-col items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <span>Game Results</span>
            </Button>
            <Button variant="outline" className="h-auto py-6 flex flex-col items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <span>Friends</span>
            </Button>
            <Button variant="outline" className="h-auto py-6 flex flex-col items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
              </svg>
              <span>Favorites</span>
            </Button>
          </div>
        </section> */}



      </main>
      
      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10">
          <div className="flex justify-around items-center py-2">
            <Link 
              to="/dashboard" 
              className="flex flex-col items-center p-2 text-blue-600"
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
            {/* <Link to="#" className="flex flex-col items-center p-2 text-gray-500" onClick={() => window.open('https://tawk.to/chat/67ec009ce808511907a28002/1inou4plh', '_blank', 'noopener,noreferrer')}> */}
            <Link to="/support" className="flex flex-col items-center p-2 text-gray-500" onClick={() => navigate('/support')}>
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
        </div>

      
      {/* Success Modal */}
      {/* <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-green-600 flex items-center gap-2">
              <CheckCircleIcon className="h-5 w-5" />
              Cash In Successfully
            </DialogTitle>
            <DialogDescription>
              Your Cash In has been processed successfully.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-gray-500">Amount:</div>
                <div className="font-medium">${balance}</div>
                <div className="text-gray-500">Transaction ID:</div>
                <div className="font-medium">{Math.random().toString(36).substring(2, 10).toUpperCase()}</div>
                <div className="text-gray-500">Date:</div>
                <div className="font-medium">{new Date().toLocaleString()}</div>
                <div className="text-gray-500">Status:</div>
                <div className="font-medium text-green-600">Processing</div>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Your Cash In request is being processed.
            </p>
          </div>
          <DialogFooter>
            <Button type="button" onClick={handleCloseModal}>
              Back to Dashboard
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}

      
    </div>
    </>
  );
}

// Account Management Modal Component
function AccountManagementModal({ onClose }: { onClose: () => void }) {
  const [activeTab, setActiveTab] = useState('profile');
  const { setUserID,userID,deviceID } = useUser();
  const [mobile, setMobile] = useState("");
  const [referral, setReferral] = useState("");
  const [status,setStatus] = useState("");
  const [level1, setLevel1] = useState(0);
  const [level2, setLevel2] = useState(0);
  const [nolimit, setNoLimit] = useState(0);
  const [refLevel, setRefLevel] = useState("");
  const [employer, setEmployer] = useState("");
  const [level1Percent, setLevel1Percent] = useState(0);
  const [level2Percent, setLevel2Percent] = useState(0);
  const [noLimitPercent, setNoLimitPercent] = useState(0);
  const [transLimit, setTransLimit] = useState(5000);
  const [cashInAmount, setCashInAmount] = useState(0);

  const currentURL = window.location.origin; // Gets the base URL
  const randomKey = Math.random().toString(36).substring(2, 23); // 21-character random key
  const encodedParams = btoa(`ref=${userID}&key=${randomKey}`); // Encode full params
  const employerEncodedParams = btoa(`ref=${userID}&fromEmployer=yes&mobile=${mobile}&key=${randomKey}`);

  const referralLink = `${currentURL}/create-account?data=${encodedParams}`;
  const employerReferralLink = `${currentURL}/create-account?data=${employerEncodedParams}`;


  const [passFormData, setPassFormData] = useState({
    password: "",
    newPassword: "",
    conPassword: ""
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChangePass = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassFormData({
      ...passFormData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const { password, newPassword, conPassword } = passFormData;

    if (!password || !newPassword || !conPassword) {
      setError("All fields are required.");
      return;
    }

    if (newPassword !== conPassword) {
      setError("New passwords do not match.");
      return;
    }

    try 
    {
      // Replace this with your actual API call
      const res = await updatePassword(userID,password,newPassword);


      if (res.authenticated) {
        setSuccess("Password updated successfully.");
        setPassFormData({ password: "", newPassword: "", conPassword: "" });
      } 
      else 
      {
        setError("Something went wrong. Try again");
      }
    } 
    catch (err) 
    {
      setError("Failed to update password.");
    }
  };
  useEffect(() => {
    if (userID) {
      const handleUpdate = async () => {
        const data = await fetchUserData(userID,deviceID);
        setMobile(data.mobile);
        setReferral(data.referral);
        setStatus(data.status);
        setRefLevel(data.level);
        setLevel1Percent(data.level_one_percent);
        setLevel2Percent(data.level_two_percent);
        setNoLimitPercent(data.nolimit_percent);
        setEmployer(data.employer);

        const dataRef = await getReferrals(userID);
        setLevel1(dataRef.level1);
        setLevel2(dataRef.level2);
        setNoLimit(dataRef.nolimit);
      };
      handleUpdate();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    toast.success("Link copied to clipboard!", { autoClose: 1500 });
  };

  const handleEmployeeCopy = () => {
    navigator.clipboard.writeText(employerReferralLink);
    toast.success("Link copied to clipboard!", { autoClose: 1500 });
  };

  const cashInSubmit =  async () => {
  
    console.log(userID);
    const formData = new FormData();
    formData.append("amount", cashInAmount.toString());
    formData.append('userID', userID);
    const dataRemit = await cashIn(formData);
    console.log(dataRemit.transID);
    setCashInAmount(0);
    alert("Cash In successfully! Transaction ID: " + dataRemit.transID);
};

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  let value = parseFloat(e.target.value); // Convert to number, fallback to 0
  if (value > transLimit) value = transLimit; // Restrict maximum value
  setCashInAmount(value);
  
};


  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold">Account Management</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        <div className="flex border-b">
          <button 
            className={`flex-1 py-3 font-medium text-sm ${activeTab === 'profile' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('profile')}
          >
            Profile
          </button>
          <button 
            className={`flex-1 py-3 font-medium text-sm ${activeTab === 'security' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('security')}
          >
            Security
          </button>
          {/* <button 
            className={`flex-1 py-3 font-medium text-sm ${activeTab === 'payment' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('payment')}
          >
            Payment
          </button> */}
        </div>
        
        <div className="p-4">
          {activeTab === 'profile' && (
            <div className="space-y-4">
              <div className="flex flex-col items-center">
                <div className="relative">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src="https://merlinmentors.org/wp-content/uploads/2022/02/generic-headshot-avatar.jpg" />
                    <AvatarFallback></AvatarFallback>
                  </Avatar>
                  <button className="absolute bottom-0 right-0 bg-blue-500 text-white p-1 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="17 8 12 3 7 8"></polyline>
                      <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                  </button>
                </div>
                <h3 className="font-bold mt-2">{mobile}</h3>
              </div>
              
              <div className="space-y-3">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Referral Link</label>
                    <div className="flex items-center">
                      <Input defaultValue={referralLink} disabled className="mr-2" />
                      <button 
                        onClick={handleCopy} 
                        className="p-2 hover:bg-gray-200"
                      >
                        <FiCopy />
                      </button>
                    </div>
                </div>
                {employer === 'yes' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Employee Referral Link</label>
                    <div className="flex items-center">
                      <Input defaultValue={employerReferralLink} disabled className="mr-2" />
                      <button 
                        onClick={handleEmployeeCopy} 
                        className="p-2 hover:bg-gray-200"
                      >
                        <FiCopy />
                      </button>
                    </div>
                  </div>
                )}
                
                {refLevel === 'level2' ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">No. of Referred Lvl 1 ({level1Percent}% Rewards)</label>
                      <div className="flex items-center">
                        <Input readOnly value={level1} disabled className="mr-2" />
                        
                      </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">No. of Referred Lvl 2 ({level2Percent}% Rewards)</label>
                        <div className="flex items-center">
                          <Input readOnly value={level2} disabled className="mr-2" />
                          
                        </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">No. of Referred (No Limit) ({noLimitPercent}% Rewards)</label>
                      <div className="flex items-center">
                        <Input readOnly value={nolimit} disabled className="mr-2" />
                        
                      </div>
                    </div>
                  </>
                )}
                
                {/* <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">No. of Referred Lvl 3 (2% Rewards)</label>
                    <div className="flex items-center">
                      <Input readOnly value={level3} disabled className="mr-2" />
                      
                    </div>
                </div> */}
              </div>
              <ToastContainer />
              {/* <Button className="w-full">Save Changes</Button> */}
            </div>
          )}
          
          {activeTab === 'security' && (
            <>
            <form onSubmit={handlePasswordUpdate}>
                <div className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                      <Input
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        value={passFormData.password}
                        onChange={handleChangePass}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                      <Input
                        name="newPassword"
                        type="password"
                        placeholder="••••••••"
                        value={passFormData.newPassword}
                        onChange={handleChangePass}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                      <Input
                        name="conPassword"
                        type="password"
                        placeholder="••••••••"
                        value={passFormData.conPassword}
                        onChange={handleChangePass}
                      />
                    </div>
                  </div>

                  {error && <p className="text-sm text-red-500">{error}</p>}
                  {success && <p className="text-sm text-green-500">{success}</p>}

                  <Button type="submit" className="w-full">
                    Update Security Settings
                  </Button>
                </div>
              </form>
            </>
          )}
          
        </div>
      </div>
      
    </div>
  );
};
