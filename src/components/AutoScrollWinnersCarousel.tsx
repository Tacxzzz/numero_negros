import React, { useEffect, useState } from 'react';
import { getBetsWinners } from '@/lib/apiCalls'; // replace with your actual fetch
import { formatPeso } from '@/lib/utils';

const FADE_DURATION = 500; // ms
const DISPLAY_DURATION = 2500; // ms

const AutoScrollWinnersCarousel = () => {
  const [winners, setWinners] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const fetchWinners = async () => {
      const data = await getBetsWinners();
      setWinners(data || []);
    };
    fetchWinners();
  }, []);

  useEffect(() => {
    if (winners.length === 0) return;

    let fadeTimeout: NodeJS.Timeout;
    let displayTimeout: NodeJS.Timeout;

    // Fade out, then change index, then fade in
    displayTimeout = setTimeout(() => {
      setFade(false); // start fade out

      fadeTimeout = setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % winners.length);
        setFade(true); // fade in next
      }, FADE_DURATION);
    }, DISPLAY_DURATION);

    return () => {
      clearTimeout(displayTimeout);
      clearTimeout(fadeTimeout);
    };
  }, [currentIndex, winners.length]);

  if (winners.length === 0) {
    return (
      <div className="overflow-hidden bg-white-500 py-2 flex justify-center items-center">
        <div
        className={`w-full rounded-xl shadow-lg p-2 pr-6 pl-6 flex-shrink-0 text-center transition-opacity ${
            fade ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
            backgroundImage: 'linear-gradient(to right, #348df3cf, #485ebd)'
        }}
        ><span className="text-white">Loading Winners...</span></div>
      </div>
    );
  }

  const winner = winners[currentIndex];

  return (
    // <div className="overflow-hidden bg-blue-500 py-3 flex justify-center items-center min-h-[120px]">
    //   <div
    //     className={`min-w-[330px] bg-gray-100 rounded-xl shadow-lg p-4 flex-shrink-0 text-center transition-opacity ${
    //       fade ? 'opacity-100' : 'opacity-0'
    //     }`}
    //     style={{
    //       transitionProperty: 'opacity',
    //       transitionDuration: `${FADE_DURATION}ms`,
    //     }}
    //   >
    //     <p className="text-base font-bold text-blue-500">{winner.game_name}</p>
    //     <p className="text-base text-gray-500">
    //       {winner.date} {winner.time}
    //     </p>
    //     <p className="font-bold text-lg text-green-700">{winner.results}</p>
    //     <p className="text-base text-gray-500">
    //       Winners : <span className="text-base font-bold text-green-500"> {winner.total_winners} </span>
    //     </p>
    //   </div>
    // </div>

    // <div
    //     className={`min-w-[300px]  shadow-lg p-4 flex-shrink-0 text-center transition-opacity ${
    //       fade ? 'opacity-100' : 'opacity-0'
    //     }`}
    //     style={{
    //       backgroundImage: `url(${winner.backgroundImage || 'default-image.jpg'})`,
    //       backgroundSize: 'cover',
    //       backgroundPosition: 'center',
    //       backgroundColor: winner.color || 'gray', // Fallback color
    //       transitionProperty: 'opacity',
    //       transitionDuration: `${FADE_DURATION}ms`,
    //     }}
    //   >
    //     <p className="text-base font-bold text-blue-500">{winner.game_name}</p>
    //     <p className="text-base text-gray-100">
    //       {winner.date} {winner.time}
    //     </p>
    //     <p className="font-bold text-lg text-green-700">{winner.results}</p>
    //     <p className="text-base text-gray-100">
    //       Winners : <span className="text-base font-bold text-green-500"> {winner.total_winners} </span>
    //     </p>
    //   </div>

    <div className="overflow-hidden bg-white-500 py-2 flex justify-center items-center">
      <div
        className={`w-full rounded-xl shadow-lg p-2 flex-shrink-0 text-center transition-opacity ${
          fade ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          backgroundImage: 'linear-gradient(to right, #348df3cf, #485ebd)', // Gradient background
          transitionProperty: 'opacity',
          transitionDuration: `${FADE_DURATION}ms`,
        }}
      >
        <div className='flex justify-center items-center'>
          <p className="text-base font-bold text-orange-300 mr-2">{winner.game_name}</p>
          <p className="text-xs text-gray-100">
            {winner.date} {winner.time}
          </p>
        </div>
        <div className='flex justify-center items-center'>
          <p className="font-bold text-sm text-yellow-300 mr-2">{winner.results}</p>
          <p className="text-base text-gray-100">
            Winners : <span className="text-base font-bold text-green-300"> {winner.total_winners} </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AutoScrollWinnersCarousel;
