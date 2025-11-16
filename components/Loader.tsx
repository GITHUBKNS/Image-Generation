import React from 'react';

const getAspectRatioClass = (ratio: string): string => {
  if (ratio === '1:1') return 'aspect-square';
  if (ratio === '16:9') return 'aspect-video';
  return `aspect-[${ratio.replace(':', '/')}]`;
};

const SkeletonCard: React.FC<{ aspectRatioClass: string }> = ({ aspectRatioClass }) => (
    <div className={`${aspectRatioClass} bg-gray-800 rounded-lg animate-pulse`}></div>
);

const Loader: React.FC<{ aspectRatio: string }> = ({ aspectRatio }) => {
  const aspectRatioClass = getAspectRatioClass(aspectRatio);
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 pb-36 sm:pb-28">
      <SkeletonCard aspectRatioClass={aspectRatioClass} />
      <SkeletonCard aspectRatioClass={aspectRatioClass} />
      <SkeletonCard aspectRatioClass={aspectRatioClass} />
      <SkeletonCard aspectRatioClass={aspectRatioClass} />
    </div>
  );
};

export default Loader;