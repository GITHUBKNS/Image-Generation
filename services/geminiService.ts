import { GoogleGenAI, Modality } from "@google/genai";
import { GeneratedImage } from '../types';

const BATCH_SIZE = 4;

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

/**
 * Parses API errors and returns a user-friendly message.
 * @param error The error object caught from the API call.
 * @param context A string indicating the operation (e.g., 'generating wallpapers').
 * @returns A user-friendly error string.
 */
function getErrorMessage(error: any, context: string): string {
    console.error(`Error ${context}:`, error);

    if (error instanceof Error) {
        const message = error.message.toLowerCase();
        
        // Safety settings block
        if (message.includes('safety')) {
            return "Your prompt was blocked for safety reasons. Please modify your prompt and try again.";
        }
        // Rate limiting / Quota issues
        if (message.includes('429') || message.includes('resource_exhausted')) {
            return "You've made too many requests. Please wait a moment and try again.";
        }
        // API key issues
        if (message.includes('api_key_invalid')) {
             return "There is an issue with the API configuration. Please try again later.";
        }
         // Server-side errors
        if (message.includes('500') || message.includes('503') || message.includes('internal')) {
            return "The image service is temporarily unavailable. Please try again later.";
        }
    }
    
    // Generic fallback
    return `Failed to ${context.replace(/ing/,'e')}. Please try again.`;
}

// Maps user-friendly quality names to guidanceScale values for the API.
const qualityMap: { [key: string]: number } = {
  'Standard': 7,
  'High': 9,
  'Ultra': 12,
};

/**
 * Generates 4 wallpapers from a text prompt using the imagen-4.0 model.
 * @param prompt The user's text description.
 * @param aspectRatio The desired aspect ratio for the images.
 * @param quality The desired quality level for the images.
 * @returns A promise that resolves to an array of GeneratedImage objects.
 */
export async function generateWallpapers(prompt: string, aspectRatio: string, quality: string): Promise<GeneratedImage[]> {
  try {
    const guidanceScale = qualityMap[quality] || 9;
    const wallpaperType = aspectRatio === '9:16' ? 'phone wallpaper' : 'wallpaper';
    
    const augmentedPrompt = `${prompt}, ${aspectRatio} aspect ratio, ${wallpaperType}, ${quality.toLowerCase()} quality, vibrant colors`;

    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: augmentedPrompt,
      config: {
        numberOfImages: BATCH_SIZE,
        aspectRatio: aspectRatio,
        outputMimeType: 'image/jpeg',
        guidanceScale: guidanceScale,
      },
    });

    if (!response.generatedImages || response.generatedImages.length === 0) {
      throw new Error("The API did not return any images.");
    }

    return response.generatedImages.map(img => ({
      id: self.crypto.randomUUID(),
      base64: img.image.imageBytes,
      prompt: prompt,
    }));
  } catch (error) {
    throw new Error(getErrorMessage(error, 'generating wallpapers'));
  }
}

/**
 * Generates 4 new wallpaper variations based on a reference image and a prompt.
 * Uses the gemini-2.5-flash-image model for image-to-image generation.
 * @param prompt The original text prompt.
 * @param referenceImage The image to use as a reference for the remix.
 * @returns A promise that resolves to an array of new GeneratedImage objects.
 */
export async function remixWallpaper(prompt: string, referenceImage: GeneratedImage): Promise<GeneratedImage[]> {
  const remixPrompt = `${prompt}, in a similar style to the reference image`;

  const generateSingleRemix = async (): Promise<GeneratedImage> => {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: referenceImage.base64,
              mimeType: 'image/jpeg',
            },
          },
          {
            text: remixPrompt,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    const imagePart = response.candidates?.[0]?.content?.parts?.find(part => part.inlineData);
    if (imagePart && imagePart.inlineData) {
      return {
        id: self.crypto.randomUUID(),
        base64: imagePart.inlineData.data,
        prompt: prompt,
      };
    } else {
      // This will be caught and handled by the outer catch block
      throw new Error("API did not return a valid image part for remix.");
    }
  };

  try {
    const remixPromises = Array(BATCH_SIZE).fill(null).map(() => generateSingleRemix());
    return await Promise.all(remixPromises);
  } catch (error) {
    throw new Error(getErrorMessage(error, "remixing wallpaper"));
  }
}