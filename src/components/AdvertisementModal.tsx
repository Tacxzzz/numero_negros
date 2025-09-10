import React from 'react';
import BetMotoLogo from "@/files/BetMotoLogoWithName.svg";
import AdvertisementImage from "@/files/advertisement.svg"; 
import AdvertisementImageContent from "@/files/advertisementContent.pdf";

interface AdvertisementModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: React.ReactNode;
  imageUrl: string;
  zIndex: number;
  youtubeUrl?: string; // Optional prop for YouTube video
}

/**
 * Helper to convert a YouTube URL (including Shorts) to an embed URL with controls and no autoplay.
 */
function getYouTubeEmbedUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    let videoId = '';

    if (urlObj.hostname === 'youtu.be') {
      // Shortened URL: https://youtu.be/{videoId}
      videoId = urlObj.pathname.slice(1);
    } else if (urlObj.hostname.includes('youtube.com')) {
      if (urlObj.pathname.startsWith('/shorts/')) {
        // Shorts URL: https://www.youtube.com/shorts/{videoId}
        videoId = urlObj.pathname.split('/')[2];
      } else {
        // Standard URL: https://www.youtube.com/watch?v={videoId}
        videoId = urlObj.searchParams.get('v') || '';
      }
    }
    if (videoId) {
      // Remove autoplay for full interactivity
      return `https://www.youtube.com/embed/${videoId}?rel=0&controls=1`;
    }
    return '';
  } catch {
    return '';
  }
}

const AdvertisementModal: React.FC<AdvertisementModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  description, 
  imageUrl,
  youtubeUrl,
  zIndex
}) => {
  if (!isOpen) return null;
  
  const embedUrl = youtubeUrl ? getYouTubeEmbedUrl(youtubeUrl) : '';

  return (
<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" style={{ zIndex: zIndex }}>
  <div className="
    bg-white 
    shadow-lg 
    w-full max-w-2xl 
    p-4 sm:p-6 md:py-8 md:px-10 lg:py-10 lg:px-12 xl:py-12 xl:px-16 
    mx-4 sm:mx-6 md:mx-8 lg:mx-10 xl:mx-12 
    my-8 
    max-h-[90vh] 
    overflow-auto 
    relative
  ">
    <button
      className="
        absolute 
        top-4 right-4 
        sm:top-6 sm:right-6 
        md:top-8 md:right-8 
        lg:top-10 lg:right-10 
        xl:top-12 xl:right-12 
        text-gray-500 hover:text-gray-700"
      onClick={onClose}
    >
      ✕
    </button>
    
    <div className="flex justify-center">
      <img src={BetMotoLogo} alt="Advertisement" className="w-16 h-12 object-cover rounded-md mb-4" />
    </div>
    {/* Conditional rendering: YouTube video or clickable image */}
    <div className="flex justify-center mb-4">
      {embedUrl ? (
        <div className="w-full flex justify-center">
          <iframe
            width="900"
            height="500"
            src={embedUrl}
            title="Advertisement Video"
            frameBorder="0"
            allow="encrypted-media; fullscreen; clipboard-write; picture-in-picture; web-share"
            allowFullScreen
            className="rounded-md max-w-full object-contain"
            style={{ minHeight: 350, minWidth: 320 }}
          ></iframe>
        </div>
      ) : imageUrl !== '' ? (
        <a href={AdvertisementImageContent} target="_blank" rel="noopener noreferrer">
          <img src={imageUrl || AdvertisementImage} alt="Advertisement Link" className="max-w-full max-h-[70vh] object-contain rounded-md" />
        </a>
      ) :
        description
      }
    </div>
    <h2 className="text-lg font-bold mb-2" style={{ display: 'none' }}>{title}</h2>
    <p className="text-sm text-gray-600 mb-4" style={{ display: 'none' }}>{description}</p>
    <button
      className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
      onClick={onClose}
    >
      Close
    </button>
  </div>
</div>
  );
};

export default AdvertisementModal;
