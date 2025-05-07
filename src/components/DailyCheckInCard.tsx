import React, { useEffect, useState } from "react";
import { useUser } from "@/pages/UserContext";
import { claimDailyReward, setDailyRewards } from "@/lib/apiCalls";

// Coin Icon SVG (inline, accessible)
const CoinIcon: React.FC<{ size?: number; className?: string }> = ({
  size = 24,
  className = "",
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    className={className}
    aria-hidden="true"
    focusable="false"
  >
    <circle cx="16" cy="16" r="15" fill="url(#coin-gradient)" stroke="#FFD700" strokeWidth="2"/>
    <ellipse cx="16" cy="16" rx="11" ry="11" fill="url(#coin-gradient-inner)" />
    {/* Philippine Peso sign */}
    <g>
      <text
        x="17"
        y="18"
        textAnchor="middle"
        fontFamily="Arial, Helvetica, sans-serif"
        fontWeight="bold"
        fontSize="22"
        fill="#FFD700"
        stroke="#fffbe6"
        strokeWidth="0.5"
        dominantBaseline="middle"
      >
        ₱
      </text>
    </g>
    <defs>
      <radialGradient id="coin-gradient" cx="0.5" cy="0.5" r="0.7">
        <stop offset="0%" stopColor="#FFFACD" />
        <stop offset="100%" stopColor="#FFD700" />
      </radialGradient>
      <radialGradient id="coin-gradient-inner" cx="0.5" cy="0.5" r="0.7">
        <stop offset="0%" stopColor="#FFFDE4" />
        <stop offset="100%" stopColor="#FFD700" />
      </radialGradient>
    </defs>
  </svg>
);
type DayReward = {
  day: number;
  reward: number;
};

const REWARDS: DayReward[] = [
  { day: 1, reward: 0.10 },
  { day: 2, reward: 0.10 },
  { day: 3, reward: 0.20 },
  { day: 4, reward: 0.20 },
  { day: 5, reward: 0.30 },
  { day: 6, reward: 0.50 },
  { day: 7, reward: 1.00 },
];

type DailyCheckInCardProps = {
  className?: string;
  style?: React.CSSProperties;
  dayBoxClassName?: string;
  dayBoxStyle?: React.CSSProperties;
  claimButtonClassName?: string;
  claimButtonStyle?: React.CSSProperties;
  totalCoinsClassName?: string;
  totalCoinsStyle?: React.CSSProperties;
};

export const DailyCheckInCard: React.FC<DailyCheckInCardProps> = ({
  className = "",
  style = {},
  dayBoxClassName = "",
  dayBoxStyle = {},
  claimButtonClassName = "",
  claimButtonStyle = {},
  totalCoinsClassName = "",
  totalCoinsStyle = {},
}) => {
  const { setUserID, userID } = useUser();
  const [canClaimToday, setCanClaimToday] = useState(false);
  const [claimedDays, setClaimedDays] = useState(0);
  const [totalCoins, setTotalCoins] = useState(0);
  const [claimedMap, setClaimedMap] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (userID) {
      const handleUpdate = async () => {
        const dailyRewardsData = await setDailyRewards(userID); // [{ date: "05/05/2025", claimed: true }, ...]

        const todayDateStr = new Date().toLocaleDateString("en-US", {
          timeZone: "Asia/Manila", // adjust to your preferred TZ
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });

        let total = 0;
        let claimedToday = false;

        const newClaimedMap: Record<number, boolean> = {};

        dailyRewardsData.forEach((entry, index) => {
          const isClaimed = entry.claimed === "yes";
          const isToday = entry.date === todayDateStr;

          if (isClaimed) {
            total += REWARDS[index]?.reward ?? 0;
          }

          if (isToday && !isClaimed) {
            claimedToday = true;
          }

          newClaimedMap[index + 1] = isClaimed;
        });

        setClaimedMap(newClaimedMap);
        setClaimedDays(Object.values(newClaimedMap).filter(Boolean).length);
        setCanClaimToday(claimedToday);
        setTotalCoins(total);
      };

      handleUpdate();
    }
  }, [userID]);

  const handleClaim = async (reward: string) => {
    console.log(reward);
    const claimRewardData = await claimDailyReward(userID,reward);
    if(claimRewardData.authenticated)
    {
      const dailyRewardsData = await setDailyRewards(userID); // [{ date: "05/05/2025", claimed: true }, ...]

      const todayDateStr = new Date().toLocaleDateString("en-US", {
        timeZone: "Asia/Manila", // adjust to your preferred TZ
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });

      let total = 0;
      let claimedToday = false;

      const newClaimedMap: Record<number, boolean> = {};

      dailyRewardsData.forEach((entry, index) => {
        const isClaimed = entry.claimed === "yes";
        const isToday = entry.date === todayDateStr;

        if (isClaimed) {
          total += REWARDS[index]?.reward ?? 0;
        }

        if (isToday && !isClaimed) {
          claimedToday = true;
        }

        newClaimedMap[index + 1] = isClaimed;
      });

      setClaimedMap(newClaimedMap);
      setClaimedDays(Object.values(newClaimedMap).filter(Boolean).length);
      setCanClaimToday(claimedToday);
      setTotalCoins(total);

      alert("Claim button clicked!");
    }
    else
    {
      alert("Failed to claim!");
    }
    
    

        
  };

  return (
    <div
      className={`bg-white rounded-2xl shadow-2xl max-w-lg lg:max-w-3xl w-full p-2 lg:p-6 ${className}`}
      style={{
        ...style,
        boxShadow:
          "0 8px 32px 0 rgba(255, 215, 0, 0.25), 0 1.5px 6px 0 rgba(0,0,0,0.08)",
      }}
    >
      <div className="flex flex-col items-center mb-2">
        <CoinIcon size={32} className="mb-2 drop-shadow-lg" />
        <h2 className="text-xl font-extrabold mb-1 text-blue-700 tracking-wide drop-shadow">
          Daily Check-In
        </h2>
        <p className="text-center text-blue-700 mb-2 text-sm sm:text-base font-medium">
          Check in every day to earn more coins!
        </p>
      </div>

      <div
        className="flex gap-2 mb-2 overflow-x-auto pb-4 pt-2 pl-2 scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-blue-100"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {REWARDS.map((r) => {
          const claimed = claimedMap[r.day] ?? false;
          const isToday = canClaimToday && !claimed && claimedDays + 1 === r.day;

          return (
            <div
              key={r.day}
              className={`flex flex-col items-center flex-shrink-0 p-3 rounded-xl border-2 transition-all duration-200
                ${
                  claimed
                    ? "bg-gradient-to-br from-gray-100 to-gray-200 border-gray-300 text-gray-400 shadow-inner"
                    : isToday
                    ? "bg-gradient-to-br from-blue-200 via-blue-100 to-blue-50 border-blue-400 text-blue-900 shadow-lg scale-105"
                    : "bg-white border-blue-100 text-blue-400"
                }
                hover:shadow-xl
                ${dayBoxClassName}
              `}
              style={{
                ...dayBoxStyle,
                minWidth: 100,
                maxWidth: 130,
              }}
            >
              <span className="font-semibold mb-1 text-xs sm:text-sm tracking-wide">
                Day {r.day}
              </span>
              <span className="flex items-center text-xl font-extrabold mb-1">
                <CoinIcon size={20} className="mr-1" />
                +{r.reward.toFixed(2)}
              </span>
              <button
                disabled={claimed || !isToday}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-150 shadow
                  ${
                    claimed
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : isToday
                      ? "bg-gradient-to-r from-blue-400 to-blue-500 text-white hover:from-blue-500 hover:to-blue-600 shadow-lg"
                      : "bg-blue-50 text-blue-300"
                  }
                  ${claimButtonClassName}
                `}
                style={claimButtonStyle}
                onClick={() => isToday ? handleClaim(r.reward.toString()) : undefined}
              >
                {claimed
                  ? "Claimed"
                  : isToday
                  ? (
                    <span className="flex items-center">
                      <CoinIcon size={16} className="mr-1" />
                      Claim
                    </span>
                  )
                  : "Locked"}
              </button>
            </div>
          );
        })}
      </div>

      <div
        className={`text-center mt-4 text-xl font-extrabold flex items-center justify-center gap-2 ${totalCoinsClassName}`}
        style={totalCoinsStyle}
      >
        <CoinIcon size={28} className="inline-block" />
        <span className="text-blue-700">Total Earned:</span>
        <span className="text-blue-600 drop-shadow">+{totalCoins.toFixed(2)} coins</span>
      </div>

      <div className="text-center mt-2 text-xs text-blue-500 font-medium">
        {claimedDays === 7
          ? "All rewards claimed! Next reset: Monday."
          : canClaimToday
          ? "You can claim today's reward!"
          : "Come back tomorrow for your next reward."}
      </div>
    </div>
  );
};

export default DailyCheckInCard;