import { useState, useEffect } from "react";

const CountdownTimer = ({ date, time, cutoffMinutes = 0 }) => {
  // Calculate Time Left Before Deadline
  const calculateTimeLeft = () => {
    // Draw time as a Date object
    const drawTime = new Date(`${date} ${time}`).getTime();
    // Set deadline by subtracting cutoffMinutes from draw time
    const deadline = drawTime - cutoffMinutes * 60 * 1000;
    const now = new Date().getTime();
    const difference = deadline - now;

    if (difference > 0) {
      return {
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      };
    } else {
      return null; // Deadline has passed
    }
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  // Update the countdown every second
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [date, time, cutoffMinutes]);

  return (
    <>
      {timeLeft ? (
        <span className="text-green-500">
          {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
        </span>
      ) : (
        <span className="text-red-500">Betting Closed</span>
      )}
    </>
  );
};

export default CountdownTimer;
