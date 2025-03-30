import { useState, useEffect } from "react";

const CountdownTimer = ({ date, time, cutoffMinutes = 0 }) => {
  // Correct Date and Time Parsing
  const parseDateTime = (date, time) => {
    // Split date properly
    const [month, day, year] = date.split("/");

    // Convert to ISO-8601 (YYYY-MM-DDTHH:mm:ss)
    const formattedDate = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;

    // Convert time to 24-hour format
    const drawTime = convertTo24Hour(time);

    // Final draw datetime
    const dateTimeString = `${formattedDate}T${drawTime}`;
    return new Date(dateTimeString).getTime();
  };

  // Convert time to 24-hour format
  const convertTo24Hour = (time) => {
    const [timePart, modifier] = time.split(" ");
    let [hours, minutes, seconds] = timePart.split(":");

    if (modifier.toLowerCase() === "pm" && hours !== "12") {
      hours = String(parseInt(hours, 10) + 12);
    }
    if (modifier.toLowerCase() === "am" && hours === "12") {
      hours = "00";
    }

    return `${hours.padStart(2, "0")}:${minutes}:${seconds}`;
  };

  // Calculate Time Left
  const calculateTimeLeft = () => {
    const drawTime = parseDateTime(date, time);
    if (isNaN(drawTime)) {
      console.error("❌ Invalid date or time format! Check inputs.");
      return null;
    }

    // Set deadline before cutoff time
    const deadline = drawTime - cutoffMinutes * 60 * 1000;
    const now = new Date().getTime();
    const difference = deadline - now;

    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)), // NEW: Add Days
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      };
    } else {
      return null; // Deadline passed
    }
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  // Update countdown every second
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
          {timeLeft.days > 0 && `${timeLeft.days}d `} {/* Show Days if > 0 */}
          {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
        </span>
      ) : (
        <span className="text-red-500">Betting Closed</span>
      )}
    </>
  );
};

export default CountdownTimer;
