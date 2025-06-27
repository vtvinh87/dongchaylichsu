import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleGenAI, Chat } from "@google/genai";
import { ChatMessage, AiCharacter } from '../types';
import { playSound } from '../utils/audio';
import { AI_CHARACTER_QUANG_TRUNG_ID, FREE_DAILY_CHAT_LIMIT } from '../constants';
import { AVATAR_PLACEHOLDER_URL } from '../imageUrls';

interface ChatbotProps {
  isOpen: boolean;
  onClose: () => void;
  availableCharacters: Record<string, AiCharacter>;
  isPremium: boolean;
  dailyChatCount: number;
  onIncrementChatCount: () => void;
  onUpgradePrompt: () => void;
}

const API_KEY = process.env.API_KEY;

const Chatbot: React.FC<ChatbotProps> = ({ 
  isOpen, 
  onClose, 
  availableCharacters,
  isPremium,
  dailyChatCount,
  onIncrementChatCount,
  onUpgradePrompt
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeCharacterId, setActiveCharacterId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);
  
  const currentCharacter = activeCharacterId ? availableCharacters[activeCharacterId] : null;
  const isChatLimitReached = !isPremium && dailyChatCount >= FREE_DAILY_CHAT_LIMIT;


  const initializeChat = useCallback(async (characterId: string | null) => {
    if (!API_KEY) {
        console.error("API Key for Gemini is missing. Chatbot cannot be initialized.");
        setError("Lỗi cấu hình: Không thể kết nối tới dịch vụ AI.");
        setMessages([{
            id: 'init-error-system',
            sender: 'system',
            text: "Xin lỗi, chức năng trò chuyện hiện không khả dụng do lỗi cấu hình.",
            timestamp: new Date()
        }]);
        return;
    }
    if (!characterId || !availableCharacters[characterId]) {
        setError("Nhân vật không hợp lệ hoặc chưa được mở khóa.");
        setMessages([{
            id: 'char-error-system',
            sender: 'system',
            text: "Vui lòng chọn một nhân vật để bắt đầu trò chuyện.",
            timestamp: new Date()
        }]);
        setChatSession(null);
        return;
    }

    const character = availableCharacters[characterId];
    setIsLoading(true);
    setError(null);
    setMessages([]); // Clear previous messages when character changes

    try {
      const ai = new GoogleGenAI({ apiKey: API_KEY });
      const newChat = ai.chats.create({
        model: 'gemini-2.5-flash-preview-04-17',
        config: {
          systemInstruction: character.systemInstruction,
        },
      });
      setChatSession(newChat);
      setMessages([{
        id: 'welcome-' + Date.now(),
        sender: 'bot',
        text: `Xin chào! Ta là ${character.name}. Ngươi có điều gì muốn hỏi ta không?`,
        timestamp: new Date()
      }]);
    } catch (e) {
      console.error(`Failed to initialize chat session for ${character.name}:`, e);
      setError(`Không thể khởi tạo cuộc trò chuyện với ${character.name}.`);
       setMessages(prev => [...prev, {
            id: `init-catch-error-${character.id}`,
            sender: 'system',
            text: `Xin lỗi, đã có lỗi xảy ra khi cố gắng kết nối với ${character.name}.`,
            timestamp: new Date()
        }]);
        setChatSession(null);
    } finally {
        setIsLoading(false);
    }
  }, [availableCharacters]);

  // Effect to initialize or update active character and chat
  useEffect(() => {
    if (isOpen) {
      const charIds = Object.keys(availableCharacters);
      if (charIds.length > 0) {
        // If current activeCharacterId is not valid or not set, pick a default
        if (!activeCharacterId || !availableCharacters[activeCharacterId]) {
          const defaultCharId = charIds.includes(AI_CHARACTER_QUANG_TRUNG_ID) ? AI_CHARACTER_QUANG_TRUNG_ID : charIds[0];
          setActiveCharacterId(defaultCharId);
          initializeChat(defaultCharId); // Initialize chat with the new default
        } else {
          // If activeCharacterId is already set and valid, ensure chat is initialized (e.g. on first open)
           if(!chatSession && !isLoading && !error) {
             initializeChat(activeCharacterId);
           }
        }
      } else {
        // No characters available
        setActiveCharacterId(null);
        setChatSession(null);
        setError("Chưa có nhân vật nào được mở khóa để trò chuyện.");
        setMessages([{id: 'no-char', sender: 'system', text: "Hãy hoàn thành nhiệm vụ để mở khóa nhân vật!", timestamp: new Date()}]);
      }
    } else {
      // Reset chat session when closed to ensure fresh start if character changes before re-opening
      setChatSession(null);
      // setMessages([]); // Optionally clear messages when closed
    }
  }, [isOpen, availableCharacters, activeCharacterId, initializeChat, chatSession, isLoading, error]);


  const handleCharacterSelect = (characterId: string) => {
    if (characterId !== activeCharacterId) {
      playSound('sfx-click');
      setActiveCharacterId(characterId);
      initializeChat(characterId); // Re-initialize chat for the new character
    }
  };

  const handleSendMessage = async () => {
    if (inputValue.trim() === '' || isLoading || !chatSession || !currentCharacter) return;

    if (isChatLimitReached) {
        setMessages(prev => [...prev, {
            id: 'system-limit-' + Date.now(),
            sender: 'system',
            text: `Bạn đã hết ${FREE_DAILY_CHAT_LIMIT} lượt trò chuyện miễn phí hôm nay. Nâng cấp Premium để trò chuyện không giới hạn!`,
            timestamp: new Date()
        }]);
        playSound('sfx-click');
        if(onUpgradePrompt) {
            setTimeout(() => {
                onClose(); 
                onUpgradePrompt();
            }, 2500);
        }
        return;
    }


    const userMessage: ChatMessage = {
      id: 'user-' + Date.now(),
      sender: 'user',
      text: inputValue.trim(),
      timestamp: new Date()
    };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setError(null);
    playSound('sfx-click');

    try {
      if (!isPremium) {
          onIncrementChatCount();
      }
      const response = await chatSession.sendMessage({ message: userMessage.text });
      const botMessageText = response.text;
      
      setMessages(prevMessages => [...prevMessages, {
        id: 'bot-' + Date.now(),
        sender: 'bot',
        text: botMessageText,
        timestamp: new Date()
      }]);
    } catch (e: any) {
      console.error(`Error sending message to Gemini (character: ${currentCharacter.name}):`, e);
      let displayError = `Xin lỗi, ${currentCharacter.name} không thể trả lời ngay lúc này. Hãy thử lại sau.`;
      if (e.message && e.message.includes('API key not valid')) {
          displayError = "Lỗi xác thực: Không thể kết nối với dịch vụ AI. Vui lòng kiểm tra lại cấu hình.";
      }
      setError(displayError);
      setMessages(prevMessages => [...prevMessages, {
        id: 'error-' + Date.now(),
        sender: 'system',
        text: displayError,
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isLoading) {
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return null;
  }

  const characterList = Object.values(availableCharacters);

  return (
    <div 
        className="chatbot-container fixed bottom-4 right-4 w-[90vw] max-w-md h-[80vh] max-h-[600px] bg-white dark:bg-stone-800 rounded-lg shadow-2xl flex flex-col z-[100] border border-amber-300 dark:border-stone-700 transform transition-all duration-300 ease-in-out animate-fadeInScaleUp"
        role="dialog"
        aria-modal="true"
        aria-labelledby="chatbot-title"
    >
      <header className="bg-amber-600 dark:bg-amber-700 text-white p-3 flex justify-between items-center rounded-t-lg">
        <div className="flex flex-col">
            <h2 id="chatbot-title" className="font-semibold text-lg">
            {currentCharacter ? `Trò chuyện với ${currentCharacter.name}` : "Hỏi Đáp Lịch Sử"}
            </h2>
            {!isPremium && characterList.length > 0 && (
                <p className="text-xs text-amber-200">Lượt miễn phí còn lại: {Math.max(0, FREE_DAILY_CHAT_LIMIT - dailyChatCount)}</p>
            )}
        </div>
        <button
          onClick={onClose}
          className="text-white hover:text-amber-200 dark:hover:text-amber-300 text-2xl font-bold"
          aria-label="Đóng chatbot"
        >
          &times;
        </button>
      </header>

      {characterList.length > 1 && (
        <div id="character-selection" className="bg-amber-100 dark:bg-stone-700 p-2 border-b border-amber-200 dark:border-stone-600">
          <p className="text-xs text-center text-amber-700 dark:text-amber-300 mb-1">Chọn nhân vật:</p>
          <div className="flex justify-center items-center space-x-2 overflow-x-auto pb-1">
            {characterList.map(char => (
              <button
                key={char.id}
                onClick={() => handleCharacterSelect(char.id)}
                title={`Trò chuyện với ${char.name}`}
                className={`p-1 rounded-full transition-all duration-200 focus:outline-none 
                            ${activeCharacterId === char.id 
                              ? 'ring-2 ring-offset-1 ring-offset-amber-100 dark:ring-offset-stone-700 ring-amber-500 dark:ring-amber-400 scale-110' 
                              : 'hover:scale-105'
                            }`}
                aria-pressed={activeCharacterId === char.id}
              >
                <img 
                    src={char.avatarUrl} 
                    alt={char.name} 
                    className="w-10 h-10 rounded-full object-cover bg-gray-300 dark:bg-gray-500 border-2 border-white dark:border-stone-800" 
                    onError={(e) => (e.currentTarget.src = AVATAR_PLACEHOLDER_URL)}
                />
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex-grow overflow-y-auto p-4 space-y-3 bg-amber-50 dark:bg-stone-900">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg shadow ${
                msg.sender === 'user'
                  ? 'bg-sky-500 dark:bg-sky-600 text-white rounded-br-none'
                  : msg.sender === 'bot'
                  ? 'bg-stone-200 dark:bg-stone-700 text-stone-800 dark:text-stone-100 rounded-bl-none'
                  : 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 w-full text-center py-2' 
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
              {msg.sender !== 'system' && (
                <p className={`text-xs mt-1 ${
                  msg.sender === 'user' ? 'text-sky-200 dark:text-sky-300' : 'text-stone-500 dark:text-stone-400' 
                  }`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              )}
            </div>
          </div>
        ))}
        {isLoading && chatSession && ( // Only show "thinking" if a chat session is active and loading
          <div className="flex justify-start">
            <div className="max-w-[80%] p-3 rounded-lg shadow bg-stone-200 dark:bg-stone-700 text-stone-800 dark:text-stone-100 rounded-bl-none">
              <p className="text-sm italic">Đang suy nghĩ...</p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 border-t border-amber-200 dark:border-stone-700 bg-white dark:bg-stone-800 rounded-b-lg">
        {isChatLimitReached ? (
             <button
                onClick={onUpgradePrompt}
                className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg"
            >
                ⭐ Nâng cấp Premium để trò chuyện không giới hạn
            </button>
        ) : (
            <div className="flex items-center space-x-2">
            <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={
                    !API_KEY ? "Chatbot không khả dụng..." 
                    : characterList.length === 0 ? "Mở khóa nhân vật để chat..."
                    : !chatSession && !isLoading ? "Đang kết nối..." 
                    : isLoading ? "Đang chờ phản hồi..."
                    : "Nhập tin nhắn..."
                }
                className="flex-grow bg-white dark:bg-stone-700 text-stone-800 dark:text-stone-100 border border-amber-300 dark:border-stone-600 rounded-lg p-2 focus:ring-1 focus:ring-amber-500 dark:focus:ring-amber-400 focus:border-amber-500 dark:focus:border-amber-400 outline-none transition-shadow"
                aria-label="Tin nhắn"
                disabled={isLoading || !chatSession || !currentCharacter || !API_KEY || characterList.length === 0}
            />
            <button
                onClick={handleSendMessage}
                disabled={isLoading || !chatSession || !currentCharacter || inputValue.trim() === '' || !API_KEY || characterList.length === 0}
                className="bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600 text-white dark:text-stone-900 font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Gửi
            </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default Chatbot;

if (typeof process === 'undefined') {
  // @ts-ignore
  globalThis.process = { env: {} };
}