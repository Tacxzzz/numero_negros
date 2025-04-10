import { getAnnouncements } from '@/lib/apiCalls';
import React, { useState, useEffect } from 'react';

const AnnouncementsMarquee = () => {
  const [announcements, setAnnouncements] = useState<string[]>([]);

  useEffect(() => {
    const handleUpdate = async () => {
      try {
        const gamesData = await getAnnouncements();
        console.log(gamesData);  // Log the response to check its structure

        // Assuming the response is an array of objects with the structure: { id, announcement, status }
        if (gamesData && Array.isArray(gamesData)) {
          const announcementsArray = gamesData.map((data: { announcement: string }) => data.announcement);
          setAnnouncements(announcementsArray);
        } else {
          console.error("Invalid data format");
        }
      } catch (error) {
        console.error("Error fetching announcements:", error);
      }
    };

    handleUpdate();
  }, []);

  return (
    <div className="bg-green-100 text-green-800 py-2 overflow-hidden relative">
      <div className="animate-marquee whitespace-nowrap px-4 font-medium">
        {announcements.map((announcement, index) => (
          <span key={index} className="mr-8">
            {announcement}
          </span>
        ))}
      </div>
    </div>
  );
};

export default AnnouncementsMarquee;
