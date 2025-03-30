import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const formatPeso = (amount: number): string => {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};


export function getTransCode(dateString) {
  const date = new Date(dateString);

  const month = String(date.getMonth() + 1).padStart(2, "0"); // 03
  const day = String(date.getDate()).padStart(2, "0"); // 14
  const year = String(date.getFullYear()).slice(-2); // 25
  const hours = String(date.getHours()).padStart(2, "0"); // 02
  const minutes = String(date.getMinutes()).padStart(2, "0"); // 07
  const seconds = String(date.getSeconds()).padStart(2, "0"); // 48

  return `${month}${day}${year}${hours}${minutes}${seconds}`;
}


export function checkBettingTime (drawDate: string, drawTime: string, cutoffMinutes: number)
{
  try {
    // Split draw time to extract hours, minutes, and period (AM/PM)
    const [time, period] = drawTime.split(" ");
    const [hours, minutes, seconds] = time.split(":").map(Number);

    // Create a draw date object in PHT
    const [month, day, year] = drawDate.split("/").map(Number); // MM/DD/YYYY

    // Convert to Date object and set the correct PHT time manually
    let drawDateTime = new Date(year, month - 1, day, period === "pm" && hours !== 12 ? hours + 12 : hours % 12, minutes, seconds || 0);

    // Get current time in PHT
    const currentTime = new Date(
      new Date().toLocaleString("en-US", { timeZone: "Asia/Manila" })
    );

    // Calculate cutoff time (subtract cutoffMinutes)
    const cutoffTime = new Date(drawDateTime.getTime() - cutoffMinutes * 60000);

    // ✅ Debug to verify the correct time
    console.log(`✅ Draw Time: ${drawDateTime}`);
    console.log(`🕒 Cutoff Time: ${cutoffTime}`);
    console.log(`⏰ Current Time: ${currentTime}`);

    // Check if the current time is before the cutoff
    return currentTime <= cutoffTime;
  } catch (error) {
    console.error("Error parsing date/time:", error);
    return false;
  }
};



export const parseDateTime = (date, time) => {
  const [month, day, year] = date.split("/");
  let [timePart, period] = time.split(" ");
  let [hours, minutes, seconds] = timePart.split(":").map(Number);

  // Convert to 24-hour format if PM
  if (period.toLowerCase() === "pm" && hours !== 12) {
    hours += 12;
  }
  // Handle 12 AM case
  if (period.toLowerCase() === "am" && hours === 12) {
    hours = 0;
  }

  // Return ISO 8601 format (YYYY-MM-DDTHH:MM:SS)
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}T${String(
    hours
  ).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(
    seconds
  ).padStart(2, "0")}`;
};
