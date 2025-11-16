
import { GoogleGenAI, Modality } from "@google/genai";
import { GeneratedImage } from '../types';

const BATCH_SIZE = 4;

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

/**
 * Generates 4 wallpapers from a text prompt using the imagen-4.0 model.
 * @param prompt The user's text description.
 * @returns A promise that resolves to an array of GeneratedImage objects.
 */
export async function generateWallpapers(prompt: string): Promise<GeneratedImage[]> {
  try {
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: `${prompt}, 9:16 aspect ratio, phone wallpaper, high quality, vibrant colors`,
      config: {
        numberOfImages: BATCH_SIZE,
        aspectRatio: '9:16',
        outputMimeType: 'image/jpeg',
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
    console.error("Error generating wallpapers with Imagen:", error);
    throw new Error("Failed to generate images. Please try again.");
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
    try {
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
        throw new Error("API did not return a valid image part for remix.");
      }
    } catch (error) {
       console.error("Error generating a single remix:", error);
       throw new Error("Failed to generate a remixed image.");
    }
  };

  try {
    const remixPromises = Array(BATCH_SIZE).fill(null).map(() => generateSingleRemix());
    return await Promise.all(remixPromises);
  } catch (error) {
    console.error("Error generating wallpaper remixes:", error);
    throw new Error("Failed to generate remixes. The model may be unavailable. Please try again later.");
  }
}
