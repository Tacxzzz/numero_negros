import React from 'react';
import PisoPlayLogo from "@/files/LogoWithName.svg";
import AdvertisementImage from "@/files/advertisement.svg"; // Import the advertisement.svg

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
      <div className="bg-white rounded-lg shadow-lg w-96 p-6 relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          ✕
        </button>
        <div className="flex justify-center">
          <img src={PisoPlayLogo} alt="Advertisement" className="w-16 h-12 object-cover rounded-md mb-4" />
        </div>
        {/* Add clickable advertisement image */}
        <div className="flex justify-center mb-4">
          <a href="#" target="_blank" rel="noopener noreferrer">
            <img src={AdvertisementImage} alt="Advertisement Link" className="w-70 h-70 object-cover rounded-md" />
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