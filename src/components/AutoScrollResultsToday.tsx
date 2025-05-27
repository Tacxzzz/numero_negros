import React, { useEffect, useState } from 'react';
import { getDrawResultsToday } from '@/lib/apiCalls'; // replace with your actual fetch
import { formatPeso } from '@/lib/utils';

const FADE_DURATION = 500; // ms
const DISPLAY_DURATION = 2500; // ms

const AutoScrollResultsToday = () => {
  const [resultsToday, setResultsToday] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const fetchDrawResultsToday = async () => {
    const data = await getDrawResultsToday();

    if (!data || !Array.isArray(data)) return;

    const parseTime = (timeStr: string) => {
        const [time, meridian] = timeStr.toLowerCase().split(' ');
        const [hours, minutes, seconds] = time.split(':').map(Number);
        let hour = hours;

        if (meridian === 'pm' && hour !== 12) hour += 12;
        if (meridian === 'am' && hour === 12) hour = 0;

        return new Date(1970, 0, 1, hour, minutes, seconds);
    };

    // ✅ Sort the incoming `data`, not the `resultsToday` state
    const sortedResults = [...data].sort((a, b) => {
        if (a.game_id !== b.game_id) {
        return a.game_id - b.game_id; // sort by game_id first
        }

        const timeA = parseTime(a.time);
        const timeB = parseTime(b.time);
        return timeA.getTime() - timeB.getTime(); // then sort by time
    });

    // ✅ Group by game_id
    const grouped: { [key: string]: any } = {};
    sortedResults.forEach((result) => {
        const key = result.game_id;
        if (!grouped[key]) {
        grouped[key] = {
            game_id: result.game_id,
            name: result.name,
            date: result.date,
            draws: []
        };
        }
        grouped[key].draws.push({
        date: result.date,
        time: result.time,
        results: result.results
        });
    });

    // ✅ Convert to array and set state
    setResultsToday(Object.values(grouped));
    };

    fetchDrawResultsToday();
  }, []);

  useEffect(() => {
    if (resultsToday.length === 0) return;

    let fadeTimeout: NodeJS.Timeout;
    let displayTimeout: NodeJS.Timeout;

    // Fade out, then change index, then fade in
    displayTimeout = setTimeout(() => {
      setFade(false); // start fade out

      fadeTimeout = setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % resultsToday.length);
        setFade(true); // fade in next
      }, FADE_DURATION);
    }, DISPLAY_DURATION);

    return () => {
      clearTimeout(displayTimeout);
      clearTimeout(fadeTimeout);
    };
  }, [currentIndex, resultsToday.length]);

  if (resultsToday.length === 0) {
    return (
      <div className="overflow-hidden bg-white-500 py-2 flex justify-center items-center">
        <div
        className={`w-full rounded-xl shadow-lg p-2 pr-6 pl-6 flex-shrink-0 text-center transition-opacity ${
            fade ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
            backgroundImage: 'linear-gradient(to right, #348df3cf, #485ebd)'
        }}
        ><span className="text-white">Loading Today Draws...</span></div>
      </div>
    );
  }

  const current = resultsToday[currentIndex];

    return (
    <div className="overflow-hidden m-0 bg-white-500 py-2 flex justify-center items-center">
        <div
        className={`w-full rounded-xl shadow-lg p-2 pr-6 pl-6 flex-shrink-0 text-center transition-opacity ${
            fade ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
            backgroundImage: 'linear-gradient(to right, #348df3cf, #485ebd)',
            transitionProperty: 'opacity',
            transitionDuration: `${FADE_DURATION}ms`,
        }}
        >
        <div className='flex justify-center items-center'>
          <p className="text-base font-bold text-orange-300 mr-2">{current.name}</p>
          <p className="text-xs text-gray-100">
            {current.date} {current.time}
          </p>
        </div>

        {current.draws.map((draw: any, i: number) => (
            <div key={i} className="text-gray-100">
                <div className='flex justify-center items-center'>
                    <p className="text-sm mr-10">{draw.time}</p>
                    <p className="font-bold text-sm text-yellow-300">{draw.results === '-' ? 'No result yet.' : draw.results}</p>
                </div>
            </div>
        ))}
        </div>
    </div>
    );
};

export default AutoScrollResultsToday;