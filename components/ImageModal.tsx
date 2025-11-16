import React from 'react';
import { GeneratedImage } from '../types';
import { DownloadIcon } from './icons/DownloadIcon';
import { RemixIcon } from './icons/RemixIcon';
import { CloseIcon } from './icons/CloseIcon';
import { ShareIcon } from './icons/ShareIcon';

interface ImageModalProps {
  image: GeneratedImage;
  onClose: () => void;
  onDownload: (image: GeneratedImage) => void;
  onRemix: (image: GeneratedImage) => void;
  onShare: (image: GeneratedImage) => void;
  isLoading: boolean;
}

const ImageModal: React.FC<ImageModalProps> = ({ image, onClose, onDownload, onRemix, onShare, isLoading }) => {
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-lg flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={handleBackdropClick}
    >
      <div className="relative w-full h-full max-w-md max-h-[90vh] flex flex-col gap-4">
        <button 
          onClick={onClose} 
          className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 z-10 bg-gray-800/80 rounded-full p-2 text-white hover:bg-gray-700 transition"
          aria-label="Close"
        >
          <CloseIcon className="w-5 h-5" />
        </button>
        
        <div className="flex-grow rounded-xl overflow-hidden shadow-2xl shadow-indigo-900/30">
          <img
            src={`data:image/jpeg;base64,${image.base64}`}
            alt={image.prompt}
            className="w-full h-full object-contain"
          />
        </div>

        <div className="flex justify-center gap-4">
          <button 
            onClick={() => onDownload(image)}
            className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold p-3 sm:py-3 sm:px-6 rounded-full transition-transform transform hover:scale-105"
            aria-label="Download"
          >
            <DownloadIcon className="w-5 h-5"/>
            <span className="hidden sm:inline">Download</span>
          </button>
          <button 
            onClick={() => onShare(image)}
            className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold p-3 sm:py-3 sm:px-6 rounded-full transition-transform transform hover:scale-105"
            aria-label="Share"
          >
            <ShareIcon className="w-5 h-5"/>
            <span className="hidden sm:inline">Share</span>
          </button>
          <button 
            onClick={() => onRemix(image)}
            disabled={isLoading}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-900/50 disabled:cursor-not-allowed text-white font-semibold p-3 sm:py-3 sm:px-6 rounded-full transition-transform transform hover:scale-105"
            aria-label="Remix"
          >
            <RemixIcon className="w-5 h-5"/>
            <span className="hidden sm:inline">Remix</span>
          </button>
        </div>
      </div>
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default ImageModal;