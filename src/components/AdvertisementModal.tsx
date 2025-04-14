import React from 'react';
import PisoPlayLogo from "@/files/LogoWithName.svg";
import AdvertisementImage from "@/files/advertisement.svg"; 
import AdvertisementImageContent from "@/files/advertisementContent.pdf";

interface AdvertisementModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  imageUrl: string;
}

const AdvertisementModal: React.FC<AdvertisementModalProps> = ({ isOpen, onClose, title, description, imageUrl }) => {
  if (!isOpen) return null;

  return (
<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
  <div className="
    bg-white 
    rounded-lg 
    shadow-lg 
    w-full max-w-xs 
    sm:max-w-sm 
    md:max-w-md 
    lg:max-w-lg 
    xl:max-w-xl 
    2xl:max-w-2xl 
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
      <img src={PisoPlayLogo} alt="Advertisement" className="w-16 h-12 object-cover rounded-md mb-4" />
    </div>
    {/* Add clickable advertisement image */}
    <div className="flex justify-center mb-4">
      <a href={AdvertisementImageContent} target="_blank" rel="noopener noreferrer">
        <img src={AdvertisementImage} alt="Advertisement Link" className="max-w-full max-h-[70vh] object-contain rounded-md" />
      </a>
    </div>
    <h2 className="text-lg font-bold mb-2">{title}</h2>
    <p className="text-sm text-gray-600 mb-4">{description}</p>
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