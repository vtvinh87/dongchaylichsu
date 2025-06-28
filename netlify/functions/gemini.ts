import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";

const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  const API_KEY = process.env.GEMINI_API;

  if (!API_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Gemini API key is not configured.' }),
    };
  }

  try {
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const { prompt, systemInstruction, chatHistory } = JSON.parse(event.body || '{}');

    if (!prompt && !chatHistory) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Prompt or chat history is required.' }),
      };
    }
    
    // Logic for Chat vs. single prompt
    if (chatHistory) {
        const chat = ai.chats.create({
            model: 'gemini-2.5-flash-preview-04-17',
            config: {
                systemInstruction: systemInstruction || '',
            },
            history: chatHistory,
        });
        const response: GenerateContentResponse = await chat.sendMessage({ message: prompt });
        return {
            statusCode: 200,
            body: JSON.stringify({ text: response.text }),
        };

    } else {
        // Single turn generation
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-04-17",
            contents: prompt,
            config: {
                systemInstruction: systemInstruction || undefined,
            }
        });

        return {
            statusCode: 200,
            body: JSON.stringify({ text: response.text }),
        };
    }

  } catch (error: any) {
    console.error('Error calling Gemini API:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `An error occurred: ${error.message}` }),
    };
  }
};

export { handler };
