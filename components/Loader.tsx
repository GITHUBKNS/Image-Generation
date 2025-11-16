
import React from 'react';

const SkeletonCard: React.FC = () => (
    <div className="aspect-[9/16] bg-gray-800 rounded-lg animate-pulse"></div>
);

const Loader: React.FC = () => {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 pb-28">
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </div>
  );
};

export default Loader;
