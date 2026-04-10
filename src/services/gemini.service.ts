import { Injectable } from '@angular/core';
import { GoogleGenAI, GenerateContentResponse } from '@google/genai';
import { DesignParameters } from '../models/design-parameters.model';

@Injectable({
  providedIn: 'root',
})
export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    // IMPORTANT: The API key is sourced from environment variables.
    // Do not hardcode or expose it in the client-side code.
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error('API_KEY environment variable not set.');
    }
    this.ai = new GoogleGenAI({ apiKey });
  }

  private buildPrompt(params: DesignParameters): string {
    // Use a helper to build sections only if they are relevant
    const buildSection = (title: string, content: string) => {
      if (!content.trim()) return '';
      return `* **${title}:**\n${content}`;
    };

    const claddingContent = `
      - Material: "${params.claddingMaterial}".
      - Finish: "${params.claddingFinish}".
      - Primary Color: "${params.claddingColor}".
      - Panel Pattern: "${params.claddingPattern}".
      - Groove Color: "${params.claddingGrooveColor}".
    `;

    const corniceContent = `
      - Position: "${params.cornicePosition}".
      - Shape: "${params.corniceShape}".
      - Color: "${params.corniceColor}".
      - Integrated Light: "${params.corniceIntegratedLight}".
    `;

    const typographyContent = `
      - Main Text: "${params.mainText}".
      - Font Style: "${params.mainTextFontType}".
      - Letter Type: "${params.mainTextLetterType}".
      - Material: "${params.mainTextMaterial}".
      - Lighting: "${params.mainTextLightingType}".
      - Letter Face Color: "${params.mainTextColor}".
      - Letter Return (Side) Color: "${params.mainTextReturnColor}".
    `;

    let subtextLogoContent = '';
    if (params.subText) {
      subtextLogoContent += `
      - Sub Text: "${params.subText}".
      - Sub Text Style: "${params.subTextStyle}".
      - Sub Text Position: "${params.subTextPosition}".
      `;
    }
    if (params.logoStyle !== 'None') {
      subtextLogoContent += `
      - Logo Style: "${params.logoStyle}".
      - Logo Position: "${params.logoPosition}".
      `;
    }
    
    let columnsContent = '';
    if (params.columnsCladding !== 'None') {
      columnsContent = `
      - Cladding Style: "${params.columnsCladding}".
      - Design: "${params.columnsDesign}".
      - Decoration: "${params.columnsDecor}".
      `;
    }

    const soffitContent = `
      - Color: "${params.soffitColor}".
      - Number of Spotlights: ${params.soffitSpotlightsCount}.
      - Light Color Temperature: "${params.soffitLightColorTemp}".
    `;

    let extrasContent = '';
    if (params.extrasScreen !== 'None') extrasContent += `    - Add a "${params.extrasScreen}".\n`;
    if (params.extrasAwning !== 'None') extrasContent += `    - Add a "${params.extrasAwning}".\n`;
    if (params.extrasWindowGraphics !== 'None') extrasContent += `    - Add graphics or stickers to the storefront glass.\n`;

    return `
      **Role:** Expert 3D Architect & Signage Designer.
      **Task:** Generate a hyper-realistic visualization of a shop storefront based on the provided input image and the detailed design parameters below. Your output MUST be ONLY the base64 encoded string of the final generated JPEG image. Do not include any other text, explanation, or markdown formatting like \`\`\`json or \`\`\`jpeg.

      **1. INPUT IMAGE ANALYSIS:**
      - Analyze the geometry, perspective, and lighting of the uploaded user image.
      - Identify the shop facade area. The user specifies there are ${params.openings} openings (doors/windows).
      - Maintain the surrounding environment (street, neighboring buildings, sky) exactly as it appears in the original photo; you must only modify the shop facade itself.

      **2. DETAILED DESIGN PARAMETERS:**
      Apply the following specifications to the facade renovation:

      ${buildSection('Base Cladding / Background', claddingContent)}
      ${buildSection('Cornice & Frame', corniceContent)}
      ${buildSection('Main Typography', typographyContent)}
      ${buildSection('Subtext & Logos', subtextLogoContent)}
      ${buildSection('Side Columns (if present in image)', columnsContent)}
      ${buildSection('Soffit (Ceiling of the overhang)', soffitContent)}
      ${buildSection('Additional Extras', extrasContent)}

      **3. RENDERING STYLE:**
      - Photorealistic, 8K resolution, with Unreal Engine 5 style lighting and reflections.
      - Ensure physically correct reflections on materials (glass, aluminum, acrylic).
      - The perspective and camera angle must perfectly match the original photo.

      **4. CRITICAL OUTPUT INSTRUCTION:**
      - Your final output must be ONLY the raw base64 encoded string for the generated JPEG image.
    `;
  }

  async generateFacade(params: DesignParameters, imageBase64: string, mimeType: string): Promise<string> {
    try {
      const textPart = { text: this.buildPrompt(params) };
      const imagePart = {
        inlineData: {
          mimeType: mimeType,
          data: imageBase64,
        },
      };

      const response: GenerateContentResponse = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [imagePart, textPart] },
      });
      
      const base64Image = response.text?.trim();

      if (!base64Image) {
        throw new Error('API returned an empty response. The model may have failed to generate an image or the response was blocked due to safety settings.');
      }
      
      return base64Image;

    } catch (error) {
      console.error('Error calling Gemini API:', error);
      if (error instanceof Error) {
        return Promise.reject(`Failed to generate design: ${error.message}`);
      }
      return Promise.reject('An unknown error occurred while generating the design.');
    }
  }

  async editImage(imageBase64: string, mimeType: string, prompt: string): Promise<string> {
    try {
      const textPart = { text: `
        **Role:** Expert Image Editor.
        **Task:** You must edit the provided image based on the following instruction. Your output MUST be ONLY the base64 encoded string of the final generated JPEG image. Do not include any other text, explanation, or markdown formatting like \`\`\`json or \`\`\`jpeg.
        **Instruction:** "${prompt}"
      `};
      const imagePart = {
        inlineData: {
          mimeType: mimeType,
          data: imageBase64,
        },
      };

      const response: GenerateContentResponse = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [imagePart, textPart] },
      });
      
      const base64Image = response.text?.trim();

      if (!base64Image) {
        throw new Error('API returned an empty response. The model may have failed to edit the image or the response was blocked due to safety settings.');
      }
      
      return base64Image;
    } catch (error) {
      console.error('Error calling Gemini API for image editing:', error);
      if (error instanceof Error) {
        return Promise.reject(`Failed to edit image: ${error.message}`);
      }
      return Promise.reject('An unknown error occurred while editing the image.');
    }
  }
}
