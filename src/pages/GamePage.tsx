import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { GameBoard } from '@/components/GameBoard';
import { ScoreDisplay } from '@/components/ScoreDisplay';
import { ActionButtons } from '@/components/ActionButtons';
import { useParams } from "react-router-dom";
import { useUser } from "./UserContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { addLog, confirmBet, confirmDoubleBet, fetchUserData, getBetClientData, getDrawByID, getDrawsByID, getGameByID, getGameTypeByID, getGameTypes, readMyFavorite, saveBet, saveDoubleBet, saveFavorite } from '@/lib/apiCalls';
import CountdownTimer from './CountdownTimer';
import { checkBettingTime, formatPeso } from '@/lib/utils';
import { useClient } from "./ClientContext";
import useBrowserCheck from '@/components/WebBrowserChecker';
import OpenInExternalBrowser from '@/components/OpenInExternalBrowser';
import { LogOut } from 'lucide-react';

interface SidebarProps {
  onLogout?: () => void;
}

export function GamePage({onLogout}:SidebarProps) {
  const navigate = useNavigate();
  const { setUserID,userID,deviceID,userType } = useUser();
  const { clientId, setClientId } = useClient();
  const [clientFullName, setClientFullName] = useState("");
  console.log(userID);
  const { gameId, gameType, drawId } = useParams();
  const [balance, setBalance] = useState(10);
  const [freeCredits, setFreeCredits] = useState(10);
  const [selectedSource, setSelectedSource] = useState("");

  const [lengthStart, setLengthStart] = useState(0);
  const [lengthChoice, setLengthChoice] = useState(0); 
  const [digits, setDigits] = useState(0); 
  const [scores, setScores] = useState<string[]>([]);
  const [scoresInverse, setInverseScores] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentReverseIndex, setCurrentReverseIndex] = useState(0);

  const [starModalOpen, setStarModalOpen] = useState(false);
  const [playModalOpen, setPlayModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [gameData, setGameData] = useState<any[]>([]);
  const [gameTypeData, setGameTypeData] = useState<any[]>([]);
  const [gameDrawData, setGameDrawData] = useState<any[]>([]);
  const [gameTypesData, setGameTypesData] = useState<any[]>([]);
  const [gameDrawsData, setGameDrawsData] = useState<any[]>([]);
  const [multiplier, setMultiplier] = useState(1);
  const [inverseMultiplier, setInverseMultiplier] = useState(1);
  const [activeDisplay, setActiveDisplay] = useState<"left" | "right">("left");

  const [agent, setAgent] = useState("");

  const [betAllow, setBetAllow] = useState(true);

  const handleMultiplierChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setMultiplier(value);
    
    const hasValidInverse = !isNaN(inverseMultiplier) && inverseMultiplier >= 1;
    const hasValidMultiplier = !isNaN(value) && value >= 1;

    if (hasValidInverse || hasValidMultiplier) {
      setBetAllow(true);
    } else {
      setBetAllow(false);
    }
  };

  const handleInverseMultiplierChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    setInverseMultiplier(value);

    const hasValidInverse = !isNaN(value) && value >= 1;
    const hasValidMultiplier = !isNaN(multiplier) && multiplier >= 1;

    if (hasValidInverse || hasValidMultiplier) {
      setBetAllow(true);
    } else {
      setBetAllow(false);
    }
  };
  
  const adjustedBet = gameTypeData[0]?.bet * multiplier;
  const adjustedWinnings = gameTypeData[0]?.jackpot * multiplier;

  const adjustedInverseBet = gameTypeData[0]?.bet * inverseMultiplier;
  const adjustedInverseWinnings = gameTypeData[0]?.jackpot * inverseMultiplier;

  const [loading, setLoading] = useState(true);

  const [selectedGameType, setSelectedGameType] = useState("");
  const [selectedDraw, setSelectedDraw] = useState("");

  const gameTypeOptions = gameTypesData.map((type) => ({
    id: type.id,
    name: type.game_type,
  }));

  const gameDrawOptions = gameDrawsData.map((type) => ({
    id: type.id,
    date: type.date,
    time: type.time,
  }));
  

  const handleTileClick = (newScore: string) => {
    const updatedScores = [...scores];
    updatedScores[currentIndex] = newScore;
    setScores(updatedScores);

    setCurrentIndex((prevIndex) => (prevIndex + 1) % scores.length);
  };

  const handleInverseTileClick = (newScore: string) => {
    const updatedScores = [...scoresInverse];
    updatedScores[currentReverseIndex] = newScore;
    setInverseScores(updatedScores);

    setCurrentReverseIndex((prevIndex) => (prevIndex + 1) % scoresInverse.length);
  };

  // const isMessengerWebview = useBrowserCheck();
    
  // if (isMessengerWebview) {
  //     return <div> <OpenInExternalBrowser/> </div>;
  // }

  useEffect(() => {
    if (gameId && selectedDraw && selectedGameType) {
      const handleUpdate = async () => {
        
        const dataType = await getGameTypeByID(selectedGameType, userType);
        if (dataType===null){
          alert("Unauthorized, Please Login again");
          onLogout();
          return;
        }
        setGameTypeData(dataType);
        const dataDraw = await getDrawByID(selectedDraw);
        setGameDrawData(dataDraw);
        setSelectedGameType(dataType[0].id);
        setSelectedDraw(dataDraw[0].id);
        const withinBettingTime = checkBettingTime(dataDraw[0].date, dataDraw[0].time, dataDraw[0].deadline);

        if (!withinBettingTime) {
          alert("Betting time is over! Please wait for the next draw.");
          navigate(`/game-history/${gameId}`);
          return;
        }
        setCurrentIndex(0);
        setCurrentReverseIndex(0);
        setScores(Array.from({ length: digits }, () => ""));
        setInverseScores(Array.from({ length: digits }, () => ""));
        navigate(`/game/${gameId}/${selectedGameType}/${selectedDraw}`, { replace: true });
        setLoading(false);
      }

      handleUpdate();
    }
  }, [selectedDraw, selectedGameType, navigate, gameId]);

  useEffect(() => {
      if (userID) {
        const handleUpdate = async () => {
          const userData = await fetchUserData(userID,deviceID);
          if (userData===null) {
            alert("Unauthorized, Please Login again");
            onLogout();
            return;
          }
          setBalance(userData.balance);
          setFreeCredits(userData.free_credits);
          setAgent(userData.agent)

          setSelectedSource("balance");

          const dataFave = await readMyFavorite(userID,gameId);
          if(dataFave.authenticated)
          {
            setFavorites(dataFave.bet.split("-"));
          }

          if(clientId)
          {
            const clientData = await getBetClientData(clientId);
            setClientFullName(clientData.full_name);
          }
          if (clientId==="null") {
            setClientId(null);
          }


          const data = await getGameByID(gameId);
          setGameData(data);
          setLengthStart(data[0].range_start);
          setLengthChoice(data[0].range_end);
          setDigits(data[0].num_digits);
          setScores(Array.from({ length: data[0].num_digits }, () => ""));
          setInverseScores(Array.from({ length: data[0].num_digits }, () => ""));
          const dataTypes = await getGameTypes(gameId, userType);
          setGameTypesData(dataTypes);
          const dataDraws = await getDrawsByID(gameId);
          setGameDrawsData(dataDraws);
          const dataType = await getGameTypeByID(gameType, userType);
          setGameTypeData(dataType);
          const dataDraw = await getDrawByID(drawId);
          setGameDrawData(dataDraw);
          setSelectedGameType(dataType[0].id);
          setSelectedDraw(dataDraw[0].id);
          const withinBettingTime = checkBettingTime(dataDraw[0].date, dataDraw[0].time, dataDraw[0].deadline);

          if (!withinBettingTime) {
            alert("Betting time is over! Please wait for the next draw.");
            navigate(`/game-history/${gameId}`);
            return;
          }

          const addViewLog = await addLog(userID, "is currently playing " + data[0].name);
          console.log(addViewLog.authenticated);

          setLoading(false);
          
        };
        handleUpdate();
      }

      
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userID]);


    const handleLuckyPick = () => {
      const min = Number(lengthStart);
      const max = Number(lengthChoice);
      console.log("Min:", min, "Max:", max);
  
      let randomScores: string[];
      if (gameId === "2" || gameId === "3" ) {
        if(gameType === "4" || gameType === "7")
        {
            // 3D Rambol: 2 identical numbers, 1 distinct
            const num1 = (Math.floor(Math.random() * (max - min + 1)) + min).toString();
            const num2 = (Math.floor(Math.random() * (max - min + 1)) + min).toString();
            let num3 = num1; // Start with a duplicate

            // Ensure num3 is distinct from num1 and num2
            while (num3 === num1) {
              num3 = (Math.floor(Math.random() * (max - min + 1)) + min).toString();
            }

            randomScores = [num1, num1, num3]; // Two identical, one distinct
        }
        else if(gameType === "5" || gameType === "8")
        {
            const uniqueNumbers = new Set<string>();

            while (uniqueNumbers.size < 3) {
              uniqueNumbers.add((Math.floor(Math.random() * (max - min + 1)) + min).toString());
            }

            randomScores = Array.from(uniqueNumbers);
        }
        else {
          // Default: Random numbers as usual
          randomScores = Array.from({ length: scores.length }, () =>
            (Math.floor(Math.random() * (max - min + 1)) + min).toString()
          );
      }
      }
      else if(Number(gameId)>4 && Number(gameId)<10) {
        const uniqueNumbers = new Set<string>();

            while (uniqueNumbers.size < 3) {
              uniqueNumbers.add((Math.floor(Math.random() * (max - min + 1)) + min).toString());
            }

            randomScores = Array.from(uniqueNumbers);
    }
    else if(Number(gameId)>9 && Number(gameId)<25) {
      const uniqueNumbers = new Set<string>();

          while (uniqueNumbers.size < 2) {
            uniqueNumbers.add((Math.floor(Math.random() * (max - min + 1)) + min).toString());
          }

          randomScores = Array.from(uniqueNumbers);
  }

        else {
            // Default: Random numbers as usual
            randomScores = Array.from({ length: scores.length }, () =>
              (Math.floor(Math.random() * (max - min + 1)) + min).toString()
            );
        }

          console.log("Generated Scores:", randomScores);
          setScores(randomScores);
    };


    const saveFavoriteClicked = async () => {
      const scoreString = scores.filter((score) => score !== "").join("-");
      const data = await saveFavorite(userID,gameId,scoreString);
      
      if(data.authenticated)
      {
        const dataFave = await readMyFavorite(userID,gameId);
        if(dataFave.authenticated)
        {
          setFavorites(dataFave.bet.split("-"));
          alert("Combination saved");
        }
        
      }
    };

    const handleSaveCombination = async () => {
      setScores(favorites);
    };
    const handleDoubleBetConfirm = async () => {
      setPlayModalOpen(false);
      setLoading(true);

      const hasValidInverse = !isNaN(inverseMultiplier) && inverseMultiplier >= 1;
      const hasValidMultiplier = !isNaN(multiplier) && multiplier >= 1;

      const formData = new FormData();
      formData.append("draw_id", drawId);
      formData.append("multiplier", multiplier.toString());
      formData.append('userID', userID);
      formData.append('clientID', clientId || "");  
      formData.append('game_type', gameType);
      formData.append('bets', scores.filter((score) => score !== "").join("-"));
      formData.append('jackpot', gameTypeData[0].jackpot);
      formData.append("multiplier_inverse", inverseMultiplier.toString());
      formData.append('bets_inverse', scoresInverse.filter((score) => score !== "").join("-"));

      if (selectedSource == 'freeCredits') {
        formData.append('free_credit', 'yes')
      } else {
        formData.append('free_credit', 'no')
      }

      try {
        let data;

        if (hasValidInverse && hasValidMultiplier) {
          data = await confirmDoubleBet(formData);
        } else {
          // Single bet mode
          const singleFormData = new FormData();
          for (const [key, value] of formData.entries()) {
            singleFormData.append(key, value as string | Blob);
          }

          if (!hasValidMultiplier && hasValidInverse) {
            // If only inverse is valid, use its scores
            singleFormData.set("bets", scoresInverse.filter(score => score !== "").join("-"));
            singleFormData.set("multiplier", inverseMultiplier.toString());
          }

          data = await confirmBet(singleFormData);
        }

        // 🔹 Handle success/failure uniformly
        alert(data.message);

        if (data.authenticated) {
          resetScores();
          navigate("/ticketreceipt", {
            state: { receiptID: data.receipt_id, from: "Game", isSavedBet: false },
          });
        } else {
          if (data.back) navigate(`/game-history/${gameId}`);
          resetScores();
        }
      } catch (err) {
        console.error("Error saving bet:", err);
        alert("An unexpected error occurred. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    const handleDoubleBetSave = async () => {
      setPlayModalOpen(false);
      setLoading(true);

      const hasValidInverse = !isNaN(inverseMultiplier) && inverseMultiplier >= 1;
      const hasValidMultiplier = !isNaN(multiplier) && multiplier >= 1;

      const formData = new FormData();
      formData.append("draw_id", drawId);
      formData.append("multiplier", multiplier.toString());
      formData.append("multiplier_inverse", inverseMultiplier.toString());
      formData.append("userID", userID);
      formData.append("clientID", clientId || "");
      formData.append("game_type", gameType);
      formData.append("jackpot", gameTypeData[0].jackpot);
      formData.append("bets", scores.filter(score => score !== "").join("-"));
      formData.append("bets_inverse", scoresInverse.filter(score => score !== "").join("-"));

      try {
        let data;

        if (hasValidInverse && hasValidMultiplier) {
          data = await saveDoubleBet(formData);
        } else {
          // Single bet mode
          const singleFormData = new FormData();
          for (const [key, value] of formData.entries()) {
            singleFormData.append(key, value as string | Blob);
          }

          if (!hasValidMultiplier && hasValidInverse) {
            // If only inverse is valid, use its scores
            singleFormData.set("bets", scoresInverse.filter(score => score !== "").join("-"));
            singleFormData.set("multiplier", inverseMultiplier.toString());
          }

          data = await saveBet(singleFormData);
        }

        // 🔹 Handle success/failure uniformly
        alert(data.message);

        if (data.authenticated) {
          resetScores();
          navigate("/ticketreceipt", {
            state: { receiptID: data.receipt_id, from: "Game", isSavedBet: true },
          });
        } else {
          if (data.back) navigate(`/game-history/${gameId}`);
          resetScores();
        }
      } catch (err) {
        console.error("Error saving bet:", err);
        alert("An unexpected error occurred. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    // Helper for resetting scores
    const resetScores = () => {
      setScores(Array.from({ length: digits }, () => ""));
      setInverseScores(Array.from({ length: digits }, () => ""));
    };


    const handleBetConfirm = async () => {
      setPlayModalOpen(false);
      setLoading(true);
      const formData = new FormData();
      formData.append("draw_id", drawId);
      formData.append("multiplier", multiplier.toString());
      formData.append('userID', userID);
      formData.append('clientID', clientId || "");  
      formData.append('game_type', gameType);
      formData.append('bets', scores.filter((score) => score !== "").join("-"));
      formData.append('jackpot', gameTypeData[0].jackpot);

      if (selectedSource == 'freeCredits') {
        formData.append('free_credit', 'yes')
      } else {
        formData.append('free_credit', 'no')
      }

      const data = await confirmBet(formData);
      
      if(data.authenticated)
      {
        alert(data.message);
        setScores(Array.from({ length: digits }, () => ""));
        setInverseScores(Array.from({ length: digits }, () => ""));
        setLoading(false);

        navigate('/ticketreceipt', { state: { receiptID: data.receipt_id, from: 'Game', isSavedBet: false } });
      }
      else
      {
        alert(data.message);
        if(data.back)
        {
          navigate(`/game-history/${gameId}`);
        }
        else
        {

          setScores(Array.from({ length: digits }, () => ""));
          setInverseScores(Array.from({ length: digits }, () => ""));
          setLoading(false);
        }
        
      }
    };

    const handleBetSave= async () => {
      setPlayModalOpen(false);
      setLoading(true);
      const formData = new FormData();
      formData.append("draw_id", drawId);
      formData.append("multiplier", multiplier.toString());
      formData.append('userID', userID);
      formData.append('clientID', clientId || "");  
      formData.append('game_type', gameType);
      formData.append('bets', scores.filter((score) => score !== "").join("-"));
      formData.append('jackpot', gameTypeData[0].jackpot);

      console.log(multiplier.toString());
      console.log(gameTypeData[0].jackpot);

      const data = await saveBet(formData);
      
      if(data.authenticated)
      {
        alert(data.message);
        setScores(Array.from({ length: digits }, () => ""));
        setInverseScores(Array.from({ length: digits }, () => ""));
        setLoading(false);

        navigate('/ticketreceipt', { state: { receiptID: data.receipt_id, from: 'Game', isSavedBet: true } })
      }
      else
      {
        alert(data.message);
        if(data.back)
        {
          navigate(`/game-history/${gameId}`);
        }
        else
        {

          setScores(Array.from({ length: digits }, () => ""));
          setInverseScores(Array.from({ length: digits }, () => ""));
          setLoading(false);
        }
        
      }
    };

    // Check if there are exactly 2 matching values in scores
const hasTwoMatchingScores = (scores: string[]) => {
  const countMap: { [key: string]: number } = {};

  scores.forEach((score) => {
    if (score.trim() !== "") {
      countMap[score] = (countMap[score] || 0) + 1;
    }
  });

  // Check if any value appears exactly 2 times
  return Object.values(countMap).includes(2);
};

const hasAllDistinctScores = (scores: string[]) => {
  const uniqueScores = new Set(scores.filter(score => score.trim() !== ""));
  return uniqueScores.size === scores.length;
};

    if (loading) {
        return (
          <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white p-8 rounded-xl shadow-md">
              <h2 className="text-xl font-bold mb-4">Game Loading..</h2>
              <Button             
              onClick={e => {
              e.preventDefault();
              window.location.href = "/dashboard";
              }}>Back to Dashboard</Button>
            </div>
          </div>
        );
      }

      const handleBetClick = () => {
        // Check if either multiplier is valid
        const hasValidInverse = !isNaN(inverseMultiplier) && inverseMultiplier >= 1;
        const hasValidMultiplier = !isNaN(multiplier) && multiplier >= 1;
        
        if (scores.filter((score) => score !== "").join("-") === scoresInverse.filter((score) => score !== "").join("-")) {
          alert('Both input are the same combination please change one of them');
          setBetAllow(false);
          return;
        }

        if (hasValidInverse || hasValidMultiplier) {
          setPlayModalOpen(true);
          setBetAllow(true);
        } else {
          setPlayModalOpen(true);
          setBetAllow(false);
        }
      };
  
  return (
    <div className="min-h-screen bg-gradient-to-r from-[#C0382C] to-[#C0382C] flex flex-col items-center justify-center p-4 overflow-hidden relative">
      {/* Back button */}
      <button 
        onClick={() => navigate(`/game-history/${gameId}`)}
        className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-md z-20"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
      </button>

      <div className="relative top-0 left-0 w-full h-full flex flex-col items-center gap-4">
          <h4 className="text-lg sm:text-xl font-bold text-[#FFD701]">
            {gameData[0]?.name} 
          </h4>
          <br/>
      </div>
      {/* Game container */}
      <div className="w-full h-full max-w-md overflow-hidden relative">
        {/* Score display */}
        <div className="flex flex-col items-center gap-4">
          
          {/* Score Displays */}
          <div className="flex flex-nowrap justify-center items-center gap-4 sm:gap-6 max-w-[90vw] overflow-hidden mx-auto">
            <div
              className={`transition-transform duration-200 ${
                activeDisplay === "left" ? "scale-100" : "opacity-70"
              }`}
            >
              <ScoreDisplay scores={scores} />
            </div>

            {gameId === "26" && (
              <>
                <div className="h-10 w-[2px] bg-[#0a1765] opacity-60"></div>
                <div
                  className={`transition-transform duration-200 ${
                    activeDisplay === "right" ? "scale-100" : "opacity-70"
                  }`}
                >
                  <ScoreDisplay scores={scoresInverse} />
                </div>
              </>
            )}
          </div>

          {/* Picker Buttons */}
          {gameId === "26" && (
            <div className="flex w-full max-w-sm gap-3 text-xs pl-4 pr-4">
              <button
                onClick={() => setActiveDisplay("left")}
                className={`flex-1 px-4 py-2 rounded-lg font-semibold border transition-colors ${
                  activeDisplay === "left"
                    ? "bg-blue-900 text-white border-blue-700"
                    : "bg-gray-200 text-gray-700 border-gray-300"
                }`}
              >
                {activeDisplay == "left" ? "Selected" : "Select"}
              </button>
              <button
                onClick={() => setActiveDisplay("right")}
                className={`flex-1 px-4 py-2 rounded-lg font-semibold border transition-colors ${
                  activeDisplay === "right"
                    ? "bg-blue-900 text-white border-blue-700"
                    : "bg-gray-200 text-gray-700 border-gray-300"
                }`}
              >
                {activeDisplay == "right" ? "Selected" : "Select"}
              </button>
            </div>
          )}
        </div>

        {/* Stylish Game Type Dropdown */}
          <div className="relative z-10 p-4 pt-5">
            <label
              htmlFor="gameTypeDropdown"
              className="block text-sm font-medium text-[#FFD701] mb-2"
            >
              Select Draw:
            </label>
            <select
              id="gameTypeDropdowns"
              value={selectedDraw || gameDrawData[0]?.id || ""}
              onChange={(e) => {
              const selectedValue = e.target.value;
              setSelectedDraw(selectedValue);
              setLoading(true);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white shadow-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              {gameDrawOptions.map((draw) => (
              <option 
                key={draw.id} 
                value={draw.id}
                selected={draw.id === (gameDrawData[0]?.id)}
              >
                {draw.date} {draw.time}
              </option>
              ))}
            </select>

              {gameTypeData[0].game_type!=="" &&(
                <>
                <label
                  htmlFor="gameTypeDropdown"
                  className="block text-sm font-medium text-[#FFD701] mb-2"
                >
                  Select Type:
                </label>
                <select
                  id="gameTypeDropdown"
                  value={selectedGameType || gameTypeData[0].id || ""}
                  onChange={(e) => {
                  const selectedValue = e.target.value;
                  setSelectedGameType(selectedValue);
                  setLoading(true);
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white shadow-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                  {gameTypeOptions.map((type) => (
                  <option 
                    key={type.id} 
                    value={type.id}
                    selected={type.id === gameTypeData[0].id}
                  >
                    {type.name}
                  </option>
                    ))}
                  </select>
                    <br/><br/>
                </>
                    )}
          </div>
        
        {/* Game board */}
        <div className="relative z-10 p-4 pt-3">
          <div className="bg-gradient-to-br from-[#E1BA5C] to-[#E1BA5C] backdrop-blur-sm rounded-3xl p-4 shadow-inner">
            {gameData &&
            (
              <GameBoard onTileClick={activeDisplay === 'left' ? handleTileClick : handleInverseTileClick} lengthChoice={lengthChoice} lengthStart={lengthStart} scores={activeDisplay === 'left' ? scores : scoresInverse} gameId={gameId} gameType={gameType} />
            )}
          </div>
        </div>
        
            {/* Action buttons */}
            <div className="relative z-10 p-4 flex flex-col items-center gap-4">
              <div className="relative z-10 p-4 flex flex-col items-center gap-4">
                    <div className="flex justify-center space-x-4">
                          <button 
                            onClick={handleLuckyPick} 
                            disabled={!gameId || !gameType} 
                            //disabled
                            className={`px-4 py-2 rounded-lg shadow-md text-white border-2 border-yellow-500
                              ${!gameId || !gameType ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"}`}>
                            🎲
                          </button>
                          {favorites?.length > 0 && (
                            <button 
                              onClick={handleSaveCombination}
                              disabled={
                                !(
                                  favorites.every((favorites) => favorites.trim() !== "") &&
                                  userID.trim() !== "" &&
                                  (
                                    (gameId === "2" || gameId === "3") &&
                                    (gameType === "4" || gameType === "7")
                                      ? hasTwoMatchingScores(favorites)
                                      : true
                                  )
                                  &&
                                  (
                                    (gameId === "2" || gameId === "3") &&
                                    (gameType === "5" || gameType === "8")
                                      ? hasAllDistinctScores(favorites)
                                      : true
                                  )
                                )
                              } 
                              className={`${
                                favorites.every((favorites) => favorites.trim() !== "") &&
                                userID.trim() !== "" &&
                                (
                                  (gameId === "2" || gameId === "3") &&
                                  (gameType === "4" || gameType === "7")
                                    ? hasTwoMatchingScores(favorites)
                                    : true
                                )
                                &&
                                  (
                                    (gameId === "2" || gameId === "3") &&
                                    (gameType === "5" || gameType === "8")
                                      ? hasAllDistinctScores(favorites)
                                      : true
                                  )
                                  ? "px-4 py-2 bg-blue-500 hover:bg-blue-600"
                                  : "px-4 py-2 bg-gray-300 cursor-not-allowed"
                              }
                              text-white rounded-lg shadow-md `}>
                              ⭐ {favorites.filter(fav => fav !== "").join("-")}
                            </button>
                          )}

                          <button 
                            onClick={saveFavoriteClicked} 
                            disabled={
                              !(
                                scores.every((score) => score.trim() !== "") &&
                                userID.trim() !== "" &&
                                (
                                  (gameId === "2" || gameId === "3") &&
                                  (gameType === "4" || gameType === "7")
                                    ? hasTwoMatchingScores(scores)
                                    : true
                                )
                              )
                            }
                            className={`${
                              scores.every((score) => score.trim() !== "") &&
                              userID.trim() !== "" &&
                              (
                                (gameId === "2" || gameId === "3") &&
                                (gameType === "4" || gameType === "7")
                                  ? hasTwoMatchingScores(scores)
                                  : true
                              )
                                ? "px-4 py-2 bg-blue-500 hover:bg-blue-600"
                                : "px-4 py-2 bg-gray-300 cursor-not-allowed"
                            }
                            text-white rounded-lg shadow-md border-2 border-yellow-500`}>
                            💾
                          </button>
                        </div>

                        <h4 className="text-sm sm:text-base text-gray-600"></h4>

                        {/* Countdown Timer */}
                        <p className="text-gray-100 text-sm  sm:text-base">
                          Time left:{" "}
                          <CountdownTimer
                            date={gameDrawData[0]?.date}
                            time={gameDrawData[0]?.time}
                            cutoffMinutes={gameDrawData[0]?.deadline}
                          />
                        </p>

                        {clientId && (
                          <>
                        <p className="text-red-500 text-sm sm:text-base">
                          Playing as : {clientFullName}
                        </p>
                        </>
                        )} 
                    </div>



           
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleBetClick}
                    disabled={
                      !(
                        scores.every((score) => score.trim() !== "") &&
                        userID.trim() !== "" &&
                        (
                          (gameId === "2" || gameId === "3") &&
                          (gameType === "4" || gameType === "7")
                            ? hasTwoMatchingScores(scores)
                            : true
                        )
                      )
                    }
                    className={`w-full ${
                      scores.every((score) => score.trim() !== "") &&
                      userID.trim() !== "" &&
                      (
                        (gameId === "2" || gameId === "3") &&
                        (gameType === "4" || gameType === "7")
                          ? hasTwoMatchingScores(scores)
                          : true
                      )
                        ? "bg-[#000080] border-2 border-yellow-500 shadow-md hover:bg-yellow-500"
                        : "bg-gray-300 cursor-not-allowed"
                    } text-white font-bold w-full py-2 px-28 rounded-full shadow-md transition-transform hover:scale-105 active:scale-95 uppercase text-sm tracking-wider `}
                  >
                    Bet
                  </button>
                
                  <Dialog open={playModalOpen} onOpenChange={setPlayModalOpen}>
                    <DialogContent className="bg-gradient-to-b from-[#348df3cf] to-[#002a6e] border-2 border-[#348df3cf] rounded-xl max-w-xs sm:max-w-sm">
                      <DialogHeader>
                        <DialogTitle className="text-center text-xl font-bold text-gray-100">
                        <h5>Selected Numbers:</h5>
                  <h4>
                    {scores.filter((score) => score !== "").join("-")}
                    {gameId === "26" && scoresInverse.every(score => score.trim() !== "") && (
                      <>
                        {"\u00A0|\u00A0"}
                        {scoresInverse
                          .filter((score) => score !== "")
                          .slice()
                          .join("-")}
                      </>
                    )}
                  </h4>

                  <br />

                  <h4>{gameData[0]?.name} {gameTypeData[0]?.game_type}</h4>
                  <h4>{gameDrawData[0]?.date} {gameDrawData[0]?.time}</h4>

                  <br />

                  {/* Bet + Winnings Display */}
                  <div className="flex flex-wrap justify-center text-center">
                    {/* Original section */}
                    <div className='text-xs'>
                      <h4 className="font-semibold text-[#002a6e]">{scores.filter((score) => score !== "").join("-") || ""}</h4>
                      <p>Bet: {formatPeso(adjustedBet)}</p>
                      <p>Winnings: {formatPeso(adjustedWinnings)}</p>
                    </div>

                    {gameId === "26" && scoresInverse.every(score => score.trim() !== "") && (
                      <>
                        {/* Separator */}
                        <div className="w-[2px] bg-[#0a1765] opacity-50 mx-2"></div>

                        {/* Inverse section */}
                        <div className='text-xs'>
                          <h4 className="font-semibold text-[#002a6e]">{scoresInverse.filter((score) => score !== "").slice().join("-") || ""}</h4>
                          <p>Bet: {formatPeso(adjustedInverseBet)}</p>
                          <p>Winnings: {formatPeso(adjustedInverseWinnings)}</p>
                        </div>
                      </>
                    )}
                    
                  </div>

                  <p className="text-gray-200 font-bold text-sm sm:text-base mt-4">
                    Time left:{" "}
                    <CountdownTimer
                      date={gameDrawData[0]?.date}
                      time={gameDrawData[0]?.time}
                      cutoffMinutes={gameDrawData[0]?.deadline}
                    />
                  </p>

                  </DialogTitle>
                  </DialogHeader>

                  <div className="space-y-4 my-0">
                    <div className="bg-white/70 backdrop-blur-sm p-4 rounded-lg">
                      <Label htmlFor="bet" className="text-[#002a6e] font-medium block mb-2">
                        Your Current Balance : {formatPeso(balance)}
                      </Label>
                    </div>

                    {clientId && (
                      <div className="bg-white/70 backdrop-blur-sm p-4 rounded-lg">
                        <Label htmlFor="bet" className="text-[#002a6e] font-medium block mb-2">
                          Playing as : {clientFullName}
                        </Label>
                      </div>
                    )}

                    {/* Horizontal inputs */}
                    <div className="flex flex-wrap justify-center gap-2">
                      {/* Original bet */}
                      <div className="bg-white/70 backdrop-blur-sm p-4 rounded-lg flex-1 min-w-[50px]">
                        <Label htmlFor="multiplier" className="text-[#002a6e] font-medium block mb-2">
                          Bet Amount ({scores.filter((score) => score !== "").join("-") || ""})
                        </Label>
                        <input
                          type="number"
                          id="multiplier"
                          value={multiplier}
                          onChange={handleMultiplierChange}
                          min={1}
                          className="w-full p-2 rounded border border-[#002a6e] focus:outline-none focus:ring-2 focus:ring-[#348df3cf] text-center font-bold text-[#002a6e]"
                        />
                      </div>

                      {gameId == "26" && scoresInverse.every(score => score.trim() !== "") && (
                        <>
                          {/* Inverse bet */}
                          <div className="bg-white/70 backdrop-blur-sm p-4 rounded-lg flex-1 min-w-[50px]">
                            <Label htmlFor="inverseMultiplier" className="text-[#002a6e] font-medium block mb-2">
                              Bet Amount ({scoresInverse.filter((score) => score !== "").join("-") || ""})
                            </Label>
                            <input
                              type="number"
                              id="inverseMultiplier"
                              value={inverseMultiplier}
                              onChange={handleInverseMultiplierChange}
                              min={1}
                              className="w-full p-2 rounded border border-[#002a6e] focus:outline-none focus:ring-2 focus:ring-[#348df3cf] text-center font-bold text-[#002a6e]"
                            />
                          </div>
                        </>
                      )}
                      
                    </div>
                  <Button 
                    className="w-full bg-gradient-to-r from-[#348df3cf] to-[#002a6e] hover:from-pink-600 hover:to-orange-600 text-white rounded-full py-4 text-sm font-bold"
                    disabled={balance < gameTypeData[0]?.bet || betAllow===false}
                    onClick={gameId == "26"  && scoresInverse.every(score => score.trim() !== "") && !isNaN(inverseMultiplier) && inverseMultiplier > 0 ? handleDoubleBetConfirm : handleBetConfirm}
                    >
                    CONFIRM BET
                  </Button>
                  {agent === "yes" && (
                  <>
                  <Button 
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-700 hover:from-green-600 hover:to-green-800 text-white rounded-full py-4 text-sm font-bold"
                    disabled={betAllow === false}
                    onClick={gameId == "26"  && scoresInverse.every(score => score.trim() !== "") && !isNaN(inverseMultiplier) && inverseMultiplier > 0  && scoresInverse !== scores ? handleDoubleBetSave : handleBetSave }
                  >
                    SAVE BET
                  </Button>
                  <h5 className='text-xxs text-white'>*Note that you can't edit or delete it once you save a bet</h5>
                  </>
                  )}
                </div>
                <DialogFooter>
                  <Button 
                      onClick={() => setPlayModalOpen(false)}
                      variant="outline"
                      className="w-full border-[#348df3cf] text-[#002a6e] rounded-full py-4"
                      >
                      Back
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
}