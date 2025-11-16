import React from 'react';
import { SparklesIcon } from './icons/SparklesIcon';
import { LightbulbIcon } from './icons/LightbulbIcon';

interface PromptFormProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  onGenerate: (prompt:string) => void;
  isLoading: boolean;
  aspectRatio: string;
  setAspectRatio: (ratio: string) => void;
  quality: string;
  setQuality: (quality: string) => void;
}

const aspectRatios = ['9:16', '16:9', '1:1', '4:3', '3:4'];
const qualityLevels = ['Standard', 'High', 'Ultra'];

const suggestionPrompts = [
  "Bioluminescent forest at twilight, magical and serene",
  "A lone astronaut gazing at a swirling nebula",
  "Vintage bookstore on a rainy night, cozy and warm",
  "Minimalist geometric landscape in pastel colors",
  "Cyberpunk city skyline with flying cars and neon signs",
  "Ancient Japanese temple surrounded by autumn foliage",
  "A majestic dragon soaring through storm clouds",
  "Underwater coral reef teeming with vibrant life",
  "Art deco pattern with gold and emerald green",
  "Surreal dreamscape with floating islands and waterfalls",
  "A field of sunflowers under a Van Gogh-style sky",
  "Steampunk mechanical owl with glowing eyes",
];

const OptionButton: React.FC<{
  onClick: () => void;
  isActive: boolean;
  children: React.ReactNode;
}> = ({ onClick, isActive, children }) => (
  <button
    type="button"
    onClick={onClick}
    className={`w-full px-3 py-1.5 text-xs font-semibold rounded-full transition-colors duration-200 ${
      isActive ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-gray-700'
    }`}
  >
    {children}
  </button>
);


const PromptForm: React.FC<PromptFormProps> = ({ prompt, setPrompt, onGenerate, isLoading, aspectRatio, setAspectRatio, quality, setQuality }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(prompt);
  };
  
  const handleSuggest = () => {
    const randomPrompt = suggestionPrompts[Math.floor(Math.random() * suggestionPrompts.length)];
    setPrompt(randomPrompt);
  };

  return (
    <div className="sticky bottom-0 left-0 right-0 w-full py-4 bg-gray-900/80 backdrop-blur-sm mt-auto">
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-0">
        <div className="flex flex-col sm:flex-row gap-4 mb-3">
          <div className="flex-1">
            <label className="text-sm font-medium text-gray-400 block mb-2 text-center">Aspect Ratio</label>
            <div className="flex justify-center bg-gray-800/50 rounded-full p-1 gap-1">
              {aspectRatios.map(ratio => (
                <OptionButton key={ratio} onClick={() => setAspectRatio(ratio)} isActive={aspectRatio === ratio}>
                  {ratio}
                </OptionButton>
              ))}
            </div>
          </div>
          <div className="flex-1">
            <label className="text-sm font-medium text-gray-400 block mb-2 text-center">Quality</label>
            <div className="flex justify-center bg-gray-800/50 rounded-full p-1 gap-1">
              {qualityLevels.map(level => (
                <OptionButton key={level} onClick={() => setQuality(level)} isActive={quality === level}>
                  {level}
                </OptionButton>
              ))}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="w-full flex items-center gap-2 sm:gap-4">
          <div className="relative flex-grow">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your wallpaper vibe..."
              className="w-full bg-gray-800 border border-gray-700 rounded-full py-3 px-5 pr-12 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 resize-none h-12 leading-tight"
              rows={1}
              onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                  }
              }}
              disabled={isLoading}
            />
            <button
                type="button"
                onClick={handleSuggest}
                disabled={isLoading}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-400 disabled:text-gray-600 disabled:cursor-not-allowed transition-colors"
                aria-label="Suggest a prompt"
            >
                <LightbulbIcon className="w-5 h-5" />
            </button>
          </div>
          <button
            type="submit"
            disabled={isLoading || !prompt}
            className="flex-shrink-0 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-900/50 disabled:text-gray-500 disabled:cursor-not-allowed text-white font-bold rounded-full p-3 transition-all duration-300 transform hover:scale-105"
            aria-label="Generate wallpapers"
          >
            <SparklesIcon className="w-6 h-6" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default PromptForm;