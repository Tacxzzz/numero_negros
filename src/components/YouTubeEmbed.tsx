import React from 'react';

interface YouTubeEmbedProps {
  videoId: string;
  title?: string;
  className?: string;
}

export const YouTubeEmbed: React.FC<YouTubeEmbedProps> = ({
  videoId,
  title,
  className = '',
}) => {
  return (
    <div
      className={`relative w-full aspect-video rounded-xl overflow-hidden shadow-lg bg-black group ${className}`}
    >
      {/* YouTube Video */}
      <iframe
        width="100%"
        height="100%"
        src={`https://www.youtube.com/embed/${videoId}`}
        title={title || 'YouTube video'}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full"
      ></iframe>

      {/* Overlay gradient for title bar */}
      <div className="absolute left-0 right-0 top-0 h-14 bg-gradient-to-b from-black/80 to-transparent z-10 flex items-start">
        {title && (
          <span className="px-4 py-2 text-white font-semibold text-lg truncate drop-shadow-sm">
            {title}
          </span>
        )}
      </div>
    </div>
  );
};

export default YouTubeEmbed;
