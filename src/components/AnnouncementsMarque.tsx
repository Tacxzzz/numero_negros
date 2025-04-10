import { getAnnouncements } from '@/lib/apiCalls';
import React, { useState, useEffect } from 'react';

const AnnouncementsMarquee = () => {
  const [announcements, setAnnouncements] = useState<any[]>([]);

  useEffect(() => {
    const handleUpdate = async () => {
      const gamesData = await getAnnouncements();
      setAnnouncements(gamesData);
    };
    handleUpdate();
  }, []);

  return (
    <div className="bg-green-100 text-green-800 py-2 overflow-hidden relative">
      <div className="flex w-max animate-marquee-loop whitespace-nowrap gap-8">
        {[...announcements, ...announcements].map((announcement, index) => (
          <span key={index} className="font-medium">
            {announcement.announcement}
          </span>
        ))}
      </div>
    </div>
  );
};

export default AnnouncementsMarquee;
