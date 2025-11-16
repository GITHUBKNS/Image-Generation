import React, { useState, useCallback } from 'react';
import { GeneratedImage } from './types';
import { generateWallpapers, remixWallpaper } from './services/geminiService';
import PromptForm from './components/PromptForm';
import ImageGrid from './components/ImageGrid';
import ImageModal from './components/ImageModal';
import Loader from './components/Loader';
import { SparklesIcon } from './components/icons/SparklesIcon';

function App() {
  const [prompt, setPrompt] = useState<string>('Bioluminescent forest at twilight, magical and serene');
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);
  const [aspectRatio, setAspectRatio] = useState<string>('9:16');
  const [quality, setQuality] = useState<string>('High');

  const handleGenerate = useCallback(async (currentPrompt: string) => {
    if (!currentPrompt || isLoading) return;
    setIsLoading(true);
    setError(null);
    setImages([]);

    try {
      const newImages = await generateWallpapers(currentPrompt, aspectRatio, quality);
      setImages(newImages);
    } catch (e: any) {
      setError(e.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, aspectRatio, quality]);

  const handleRemix = useCallback(async (imageToRemix: GeneratedImage) => {
    if (isLoading) return;
    
    setSelectedImage(null);
    setIsLoading(true);
    setError(null);
    setImages([]);

    try {
      const newImages = await remixWallpaper(imageToRemix.prompt, imageToRemix);
      setImages(newImages);
      setPrompt(imageToRemix.prompt);
    } catch (e: any) {
      setError(e.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);
  
  const handleDownload = (image: GeneratedImage) => {
    const link = document.createElement('a');
    link.href = `data:image/jpeg;base64,${image.base64}`;
    link.download = `${image.prompt.slice(0, 20).replace(/\s+/g, '_')}_${image.id.slice(0,4)}.jpeg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = useCallback(async (image: GeneratedImage) => {
    const fileName = `${image.prompt.slice(0, 20).replace(/\s+/g, '_')}_${image.id.slice(0,4)}.jpeg`;
    
    try {
      const response = await fetch(`data:image/jpeg;base64,${image.base64}`);
      const blob = await response.blob();
      const file = new File([blob], fileName, { type: 'image/jpeg' });

      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: 'VibePaper Wallpaper',
          text: `Check out this wallpaper I generated with VibePaper: "${image.prompt}"`,
          files: [file],
        });
      } else {
        setError('Image sharing is not supported on this device/browser.');
      }
    } catch (error: any) {
        if (error.name !== 'AbortError') {
             console.error('Error sharing image:', error);
             setError('An error occurred while trying to share the image.');
        }
    }
  }, []);


  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center p-4 pt-8 sm:p-6 md:p-8 relative overflow-x-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-900/40 via-gray-900 to-gray-900 z-0"></div>
      <main className="w-full max-w-4xl mx-auto z-10 flex flex-col flex-grow">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-white flex items-center justify-center gap-3">
            <SparklesIcon className="w-8 h-8 text-indigo-400" />
            VibePaper
          </h1>
          <p className="text-indigo-300 mt-2 text-lg">AI wallpapers based on your vibe.</p>
        </header>

        {error && (
          <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-md mb-6 text-center">
            <strong>Error:</strong> {error}
          </div>
        )}

        <div className="flex-grow w-full">
          {isLoading ? (
            <Loader aspectRatio={aspectRatio} />
          ) : images.length > 0 ? (
            <ImageGrid images={images} onImageSelect={setSelectedImage} aspectRatio={aspectRatio} />
          ) : (
             <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 pt-16">
                <SparklesIcon className="w-16 h-16 mb-4 text-gray-600"/>
                <p className="text-xl">Describe your desired vibe below</p>
                <p>e.g., "Peaceful cherry blossom zen garden"</p>
            </div>
          )}
        </div>
        
        <PromptForm
          prompt={prompt}
          setPrompt={setPrompt}
          onGenerate={handleGenerate}
          isLoading={isLoading}
          aspectRatio={aspectRatio}
          setAspectRatio={setAspectRatio}
          quality={quality}
          setQuality={setQuality}
        />
      </main>

      {selectedImage && (
        <ImageModal
          image={selectedImage}
          onClose={() => setSelectedImage(null)}
          onDownload={handleDownload}
          onRemix={handleRemix}
          onShare={handleShare}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}

export default App;