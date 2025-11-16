
import React from 'react';
import { SparklesIcon } from './icons/SparklesIcon';

interface PromptFormProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  onGenerate: (prompt:string) => void;
  isLoading: boolean;
}

const PromptForm: React.FC<PromptFormProps> = ({ prompt, setPrompt, onGenerate, isLoading }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(prompt);
  };
  
  return (
    <div className="sticky bottom-0 left-0 right-0 w-full py-4 bg-gray-900/80 backdrop-blur-sm mt-auto">
      <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto flex items-center gap-2 sm:gap-4 px-4 sm:px-0">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe your wallpaper vibe..."
          className="flex-grow bg-gray-800 border border-gray-700 rounded-full py-3 px-5 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 resize-none h-12 leading-tight"
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
          type="submit"
          disabled={isLoading || !prompt}
          className="flex-shrink-0 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-900/50 disabled:text-gray-500 disabled:cursor-not-allowed text-white font-bold rounded-full p-3 transition-all duration-300 transform hover:scale-105"
          aria-label="Generate wallpapers"
        >
          <SparklesIcon className="w-6 h-6" />
        </button>
      </form>
    </div>
  );
};

export default PromptForm;
