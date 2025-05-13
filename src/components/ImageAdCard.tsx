import React, { useState } from "react";
import Modal from "react-modal";


interface ImageAdCardProps {
  image: string;
  alt: string;
}

const ImageAdCard: React.FC<ImageAdCardProps> = ({ image, alt }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setIsZoomed(false); // Reset zoom state when modal is closed
  };

  const toggleZoom = () => setIsZoomed((prev) => !prev);

  return (
    <div>
      {/* Display the image */}
      <div
        className="cursor-pointer"
        onClick={openModal}
        style={{
          width: "100%", // Match the size of VideoAdPlayer
          height: "48px",
        }}
      >
        <img src={image} alt={alt} className="w-full h-auto object-cover" />
      </div>

      {/* Modal for enlarged image */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Enlarged Image"
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <div
          className={`relative w-full h-full overflow-hidden ${
            isZoomed ? "overflow-scroll" : ""
          }`}
        >
          <button
            className="absolute top-5 right-2 z-510 bg-white bg-opacity-50 text-black text-xl rounded-full p-2 hover:bg-opacity-75 transition"
            onClick={closeModal}
            aria-label="Close Modal"
          >
            &times;
          </button>
          <div
            className={`transition-transform duration-300 ${
              isZoomed ? "scale-150" : "scale-100"
            } w-full h-full flex items-center justify-center ${
              isZoomed ? "overflow-scroll" : ""
            }`}
            onDoubleClick={toggleZoom}
            style={{
                cursor: isZoomed ? "grab" : "zoom-in",
                maxWidth: "100%",
                maxHeight: "100%",
                overflow: isZoomed ? "scroll" : "hidden",
                touchAction: isZoomed ? "pan-x pan-y" : "auto", // Enable scrolling on touch devices
            }}
          >
            {/* <button
            className="absolute bg-blue-500 text-white top-40 right-6 px-2 py-1 rounded-full hover:bg-blue-600"
            onClick={closeModal}
            >
            ✕
            </button> */}
            <img
              src={image}
              alt={alt}
              className="max-w-full max-h-screen object-contain"
              style={{
                transformOrigin: "center",
              }}
            />

    <button
      className="
        absolute 
        top-48 right-6 
        sm:top-6 sm:right-6 
        md:top-8 md:right-8 
        lg:top-40 lg:right-10 
        xl:top-40 xl:right-10 
        text-black-500 hover:text-gray-700
        bg-white bg-opacity-50 
        px-2 py-1 rounded-full
        "
      onClick={closeModal}
    >
      ✕
    </button>
          </div>
        </div>
      </Modal>

    </div>
  );
};

export default ImageAdCard;