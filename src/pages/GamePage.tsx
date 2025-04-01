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
import { confirmBet, fetchUserData, getDrawByID, getDrawsByID, getGameByID, getGameTypeByID, getGameTypes, readMyFavorite, saveFavorite } from '@/lib/apiCalls';
import CountdownTimer from './CountdownTimer';
import { checkBettingTime, formatPeso } from '@/lib/utils';

export function GamePage() {
  const navigate = useNavigate();
  const { setUserID,userID } = useUser();
  console.log(userID);
  const { gameId, gameType, drawId } = useParams();
  const [balance, setBalance] = useState(10);


  const [lengthStart, setLengthStart] = useState(0);
  const [lengthChoice, setLengthChoice] = useState(0); 
  const [digits, setDigits] = useState(0); 
  const [scores, setScores] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [starModalOpen, setStarModalOpen] = useState(false);
  const [playModalOpen, setPlayModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [gameData, setGameData] = useState<any[]>([]);
  const [gameTypeData, setGameTypeData] = useState<any[]>([]);
  const [gameDrawData, setGameDrawData] = useState<any[]>([]);
  const [gameTypesData, setGameTypesData] = useState<any[]>([]);
  const [gameDrawsData, setGameDrawsData] = useState<any[]>([]);

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


  useEffect(() => {
    if (gameId && selectedDraw && selectedGameType) {
      const handleUpdate = async () => {
        
        const dataType = await getGameTypeByID(selectedGameType);
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
        setScores(Array.from({ length: digits }, () => ""));
        navigate(`/game/${gameId}/${selectedGameType}/${selectedDraw}`, { replace: true });
        setLoading(false);
      }

      handleUpdate();
    }
  }, [selectedDraw, selectedGameType, navigate, gameId]);

  useEffect(() => {
      if (userID) {
        const handleUpdate = async () => {
          const userData = await fetchUserData(userID);
          setBalance(userData.balance);
          const dataFave = await readMyFavorite(userID,gameId);
          if(dataFave.authenticated)
          {
            setFavorites(dataFave.bet.split("-"));
          }
          const data = await getGameByID(gameId);
          setGameData(data);
          setLengthStart(data[0].range_start);
          setLengthChoice(data[0].range_end);
          setDigits(data[0].num_digits);
          setScores(Array.from({ length: data[0].num_digits }, () => ""));
          const dataTypes = await getGameTypes(gameId);
          setGameTypesData(dataTypes);
          const dataDraws = await getDrawsByID(gameId);
          setGameDrawsData(dataDraws);
          const dataType = await getGameTypeByID(gameType);
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
      else if(Number(gameId)>4) {
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
    const handleBetConfirm = async () => {
      setPlayModalOpen(false);
      setLoading(true);
      const formData = new FormData();
      formData.append("draw_id", drawId);
      formData.append('userID', userID);
      formData.append('game_type', gameType);
      formData.append('bets', scores.filter((score) => score !== "").join("-"));
      formData.append('jackpot', gameTypeData[0].jackpot);
      const data = await confirmBet(formData);
      
      if(data.authenticated)
      {
        alert("Bet placed successfully!");
        setScores(Array.from({ length: digits }, () => ""));
        setLoading(false);
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
              <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
            </div>
          </div>
        );
      }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-400 to-sky-300 flex flex-col items-center justify-center p-4 overflow-hidden relative">
      {/* Back button */}
      <button 
        onClick={() => navigate(`/game-history/${gameId}`)}
        className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-md z-20"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
      </button>
      
      {/* Background decorations */}
      <div className="absolute left-0 bottom-0 w-24 h-32">
        <div className="absolute bottom-4 left-4 w-8 h-12 bg-pink-400 rounded-t-full"></div>
        <div className="absolute bottom-8 left-12 w-6 h-16 bg-green-400 rounded-t-full"></div>
      </div>
      <div className="absolute right-0 bottom-0 w-24 h-32">
        <div className="absolute bottom-4 right-4 w-8 h-12 bg-yellow-400 rounded-t-full"></div>
        <div className="absolute bottom-8 right-12 w-6 h-16 bg-purple-400 rounded-t-full"></div>
      </div>

      {/* Game container */}
      <div className="w-full h-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden relative">
        {/* Rainbow background */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-yellow-200 to-pink-200 opacity-50"></div>
        
        {/* Rainbow arc */}
        <div className="absolute top-0 left-0 right-0 h-32 overflow-hidden">
          <div className="w-[150%] h-[300px] mx-auto bg-gradient-to-r from-purple-500 via-pink-500 via-red-500 via-yellow-500 via-green-500 to-blue-500 rounded-[100%] relative -top-[200px]"></div>
        </div>
        
        {/* Clouds */}
        <div className="absolute top-4 left-6">
          <div className="bg-white w-10 h-5 rounded-full opacity-80"></div>
          <div className="bg-white w-6 h-4 rounded-full opacity-80 absolute -top-2 -left-2"></div>
          <div className="bg-white w-6 h-4 rounded-full opacity-80 absolute -top-1 left-6"></div>
        </div>
        <div className="absolute top-8 right-8">
          <div className="bg-white w-12 h-6 rounded-full opacity-80"></div>
          <div className="bg-white w-8 h-5 rounded-full opacity-80 absolute -top-2 -left-2"></div>
          <div className="bg-white w-8 h-5 rounded-full opacity-80 absolute -top-1 left-8"></div>
        </div>

        {/* Score display */}
        <ScoreDisplay scores={scores} />
        <br/><br/><br/>
        {/* Game board */}
        <div className="relative z-10 p-4 pt-16">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-4 shadow-inner">
            {gameData &&
            (
              <GameBoard onTileClick={handleTileClick} lengthChoice={lengthChoice} lengthStart={lengthStart} scores={scores} gameId={gameId} gameType={gameType} />
            )}
          </div>
        </div>
        
            {/* Action buttons */}
            <div className="relative z-10 p-4 flex flex-col items-center gap-4">
            <div className="relative z-10 p-4 flex flex-col items-center gap-4">
  {/* Game Title and Info */}
  <h4 className="text-lg sm:text-xl font-bold text-gray-800">
    {gameData[0]?.name} 
  </h4>

  <div className="flex justify-center space-x-4">
        <button 
          onClick={handleLuckyPick} 
          disabled={!gameId || !gameType} 
          className={`px-4 py-2 rounded-lg shadow-md text-white 
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
          text-white rounded-lg shadow-md `}>
          💾
        </button>
      </div>
            {/* Stylish Game Type Dropdown */}
  <div className="w-full max-w-xs">
    <label
      htmlFor="gameTypeDropdown"
      className="block text-sm font-medium text-gray-700 mb-2"
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
     <label
      htmlFor="gameTypeDropdown"
      className="block text-sm font-medium text-gray-700 mb-2"
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
  </div>
  <h4 className="text-sm sm:text-base text-gray-600">
    
  </h4>

  {/* Countdown Timer */}
  <p className="text-green-500 text-sm sm:text-base">
    Time left:{" "}
    <CountdownTimer
      date={gameDrawData[0]?.date}
      time={gameDrawData[0]?.time}
      cutoffMinutes={gameDrawData[0]?.deadline}
    />
  </p>

  
</div>



           
              <div className="flex items-center gap-4">
                
               
              
              <button
                  onClick={() => setPlayModalOpen(true)}
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
                      ? "bg-yellow-400 hover:bg-yellow-500"
                      : "bg-gray-300 cursor-not-allowed"
                  } text-white font-bold py-2 px-8 rounded-full shadow-md transition-transform hover:scale-105 active:scale-95 uppercase text-sm tracking-wider`}
                >
                  Bet
                </button>
                
                <Dialog open={playModalOpen} onOpenChange={setPlayModalOpen}>
                  <DialogContent className="bg-gradient-to-b from-pink-100 to-orange-100 border-2 border-pink-300 rounded-xl max-w-xs sm:max-w-sm">
                    <DialogHeader>
                      <DialogTitle className="text-center text-xl font-bold text-pink-700">
                      <h5>Selected Numbers: </h5><h4>{scores.filter((score) => score !== "").join("-") || ""}
                      </h4>
                      <br/>
                      <h4>{gameData[0]?.name} {gameTypeData[0]?.game_type}</h4>
                      <h4>{gameDrawData[0]?.date} {gameDrawData[0]?.time}</h4>
                      <br/>
                      <h4>Bet : {formatPeso(gameTypeData[0]?.bet)}<br/>Winnings : {formatPeso(gameTypeData[0]?.jackpot)}</h4>
                      <p className="text-green-500 text-sm sm:text-base">
                        Time left: <CountdownTimer date={gameDrawData[0]?.date} time={gameDrawData[0]?.time} cutoffMinutes={gameDrawData[0]?.deadline} />
                      </p>
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 my-2">
                      <div className="bg-white/70 backdrop-blur-sm p-4 rounded-lg">
                        <Label htmlFor="bet" className="text-pink-800 font-medium block mb-2">
                          Your Current Balance : {formatPeso(balance)}
                        </Label>
                      </div>
                      
                      <Button 
                        className="w-full bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white rounded-full py-6 text-lg font-bold"
                        disabled={balance < gameTypeData[0]?.bet}
                        onClick={handleBetConfirm}
                      >
                        CONFIRM BET
                      </Button>
                    </div>
                    <DialogFooter>
                      <Button 
                        onClick={() => setPlayModalOpen(false)}
                        variant="outline"
                        className="w-full border-pink-300 text-pink-700 rounded-full"
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