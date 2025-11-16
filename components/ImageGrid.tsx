
import React from 'react';
import { GeneratedImage } from '../types';

interface ImageGridProps {
  images: GeneratedImage[];
  onImageSelect: (image: GeneratedImage) => void;
}

const ImageGrid: React.FC<ImageGridProps> = ({ images, onImageSelect }) => {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 pb-28">
      {images.map((image) => (
        <div
          key={image.id}
          className="aspect-[9/16] bg-gray-800 rounded-lg overflow-hidden cursor-pointer group relative transform transition-transform duration-300 hover:scale-105"
          onClick={() => onImageSelect(image)}
        >
          <img
            src={`data:image/jpeg;base64,${image.base64}`}
            alt={image.prompt}
            className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-80"
          />
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <span className="text-white font-semibold">View</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ImageGrid;
