
import { GoogleGenAI, Chat, Content, Type } from "@google/genai";
import type { Handler, HandlerEvent } from "@netlify/functions";

// This is a server-side function, so process.env is available here.
const API_KEY = process.env.API_KEY;

const handler: Handler = async (event: HandlerEvent) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  if (!API_KEY) {
    return { statusCode: 500, body: JSON.stringify({ error: "Lỗi cấu hình phía máy chủ: API Key không được thiết lập." }) };
  }
  const ai = new GoogleGenAI({ apiKey: API_KEY });

  try {
    const body = JSON.parse(event.body || '{}');
    const { type, prompt, systemInstruction, history, hichText } = body;

    if (type === 'chat') {
        if (!prompt || !systemInstruction) {
            return { statusCode: 400, body: JSON.stringify({ error: "Yêu cầu chat thiếu 'prompt' hoặc 'systemInstruction'."}) };
        }
        
        const chat: Chat = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: { systemInstruction },
            history: history as Content[] || [],
        });
        const response = await chat.sendMessage({ message: prompt });

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: response.text }),
        };
    } else if (type === 'generate') {
        if (!prompt) {
            return { statusCode: 400, body: JSON.stringify({ error: "Yêu cầu generate thiếu 'prompt'."}) };
        }
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt,
        });
        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: response.text }),
        };
    } else if (type === 'generate_hich_puzzle') {
        if (!hichText) {
            return { statusCode: 400, body: JSON.stringify({ error: "Yêu cầu generate_hich_puzzle thiếu 'hichText'." }) };
        }
        const puzzlePrompt = `Phân tích đoạn văn sau: "${hichText}".
Nhiệm vụ: Tạo một câu đố điền từ cho trò chơi lịch sử.
Yêu cầu:
- Chọn 10 từ hoặc cụm từ có ý nghĩa (danh từ, động từ, tính từ).
- Thay thế chúng bằng "_BLANK_" trong văn bản gốc.
- Cung cấp định nghĩa ngắn gọn, dễ hiểu cho mỗi từ/cụm từ đã chọn.
- Trả về một đối tượng JSON duy nhất, không có markdown hay giải thích.
Format JSON: { "modifiedText": string, "answers": string[], "definitions": Record<string, string> }`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: puzzlePrompt,
            config: {
              responseMimeType: "application/json",
            },
        });
        
        let jsonStr = response.text.trim();
        const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
        const match = jsonStr.match(fenceRegex);
        if (match && match[2]) {
          jsonStr = match[2].trim();
        }

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: jsonStr, // Return the clean JSON string
        };
    } else if (type === 'generate_hue_quiz') {
      const quizPrompt = `Generate a single multiple-choice quiz question about the Nguyễn Dynasty of Vietnam. The question should be interesting and suitable for a history game. Provide 4 unique options, one of which is the correct answer.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: quizPrompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    question: { type: Type.STRING, description: "The quiz question in Vietnamese." },
                    options: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                        description: "An array of 4 possible answers in Vietnamese."
                    },
                    correctAnswer: { type: Type.STRING, description: "The correct answer, which must be one of the strings from the options array." }
                },
                required: ["question", "options", "correctAnswer"]
            }
        },
      });
      
      let jsonStr = response.text.trim();
      
      try {
        const parsed = JSON.parse(jsonStr);
        if (!parsed.question || !Array.isArray(parsed.options) || parsed.options.length !== 4 || !parsed.correctAnswer || !parsed.options.includes(parsed.correctAnswer)) {
            throw new Error('Invalid quiz format from AI');
        }
      } catch (e) {
        return { statusCode: 500, body: JSON.stringify({ error: "Failed to generate a valid quiz question." }) };
      }

      return {
          statusCode: 200,
          headers: { "Content-Type": "application/json" },
          body: jsonStr,
      };
    } else {
        return { statusCode: 400, body: JSON.stringify({ error: 'Loại yêu cầu không hợp lệ.' }) };
    }

  } catch (error: any) {
    console.error('Error in Netlify function:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || 'Đã có lỗi xảy ra phía máy chủ.' }),
    };
  }
};

export { handler };
