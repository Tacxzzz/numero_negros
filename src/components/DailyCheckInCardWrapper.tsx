import React, { useState } from "react";
import DailyCheckInCard from "./DailyCheckInCard";

const DailyCheckInCardWrapper: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow font-bold"
      >
        {open ? "Hide Daily Check-In" : "Show Daily Check-In"}
      </button>
      {open && (
        <div className="mt-6">
          <DailyCheckInCard />
        </div>
      )}
    </div>
  );
};

export default DailyCheckInCardWrapper;