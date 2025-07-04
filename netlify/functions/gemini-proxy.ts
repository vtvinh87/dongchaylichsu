import { GoogleGenAI, Chat, Content } from "@google/genai";
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
            model: 'gemini-2.5-flash-preview-04-17',
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
          model: "gemini-2.5-flash-preview-04-17",
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
            model: "gemini-2.5-flash-preview-04-17",
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