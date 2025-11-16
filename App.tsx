
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

  const handleGenerate = useCallback(async (currentPrompt: string) => {
    if (!currentPrompt || isLoading) return;
    setIsLoading(true);
    setError(null);
    setImages([]);

    try {
      const newImages = await generateWallpapers(currentPrompt);
      setImages(newImages);
    } catch (e: any) {
      setError(e.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

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
            <Loader />
          ) : images.length > 0 ? (
            <ImageGrid images={images} onImageSelect={setSelectedImage} />
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
        />
      </main>

      {selectedImage && (
        <ImageModal
          image={selectedImage}
          onClose={() => setSelectedImage(null)}
          onDownload={handleDownload}
          onRemix={handleRemix}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}

export default App;
