import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleGenAI, Chat } from "@google/genai";
import { ChatMessage, AiCharacter } from '../types';
import { playSound } from '../utils/audio';
import { AI_CHARACTERS, FREE_DAILY_CHAT_LIMIT } from '../constants';
import { AVATAR_PLACEHOLDER_URL } from '../imageUrls';

interface ChatbotProps {
  isOpen: boolean;
  onClose: () => void;
  unlockedCharacterIds: string[];
  isPremium: boolean;
  dailyChatCount: number;
  onIncrementChatCount: () => void;
  onUpgradePrompt: () => void;
}

const Chatbot: React.FC<ChatbotProps> = ({ 
  isOpen, 
  onClose, 
  unlockedCharacterIds,
  isPremium,
  dailyChatCount,
  onIncrementChatCount,
  onUpgradePrompt
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const [inputValue, setInputValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeCharacterId, setActiveCharacterId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const aiRef = useRef<GoogleGenAI | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  // Initialize the GenAI instance once
  useEffect(() => {
    if (!aiRef.current) {
      aiRef.current = new GoogleGenAI({apiKey: process.env.API_KEY as string});
    }
  }, []);

  useEffect(scrollToBottom, [messages]);
  
  const currentCharacter = activeCharacterId ? AI_CHARACTERS[activeCharacterId] : null;
  const isChatLimitReached = !isPremium && dailyChatCount >= FREE_DAILY_CHAT_LIMIT;

  const initializeChat = useCallback(async (characterId: string | null) => {
    if (!characterId || !AI_CHARACTERS[characterId] || !aiRef.current) {
        setError("Nhân vật không hợp lệ hoặc AI chưa sẵn sàng.");
        setMessages([{
            id: 'char-error-system',
            sender: 'system',
            text: "Vui lòng chọn một nhân vật để bắt đầu trò chuyện.",
            timestamp: new Date()
        }]);
        setChatSession(null);
        return;
    }

    const character = AI_CHARACTERS[characterId];
    setIsLoading(false);
    setError(null);
    setMessages([{
      id: 'welcome-' + Date.now(),
      sender: 'bot',
      text: `Xin chào! Ta là ${character.name}. Ngươi có điều gì muốn hỏi ta không?`,
      timestamp: new Date()
    }]);

    const newChat = aiRef.current.chats.create({
      model: 'gemini-2.5-flash-preview-04-17',
      config: { systemInstruction: character.systemInstruction },
      history: [],
    });
    setChatSession(newChat);
  }, []);

  // Effect to initialize or update active character and chat
  useEffect(() => {
    if (isOpen) {
      const unlockedChars = (Object.values(AI_CHARACTERS) as AiCharacter[]).filter(c => unlockedCharacterIds.includes(c.id));
      
      if (unlockedChars.length > 0) {
        if (!activeCharacterId || !unlockedCharacterIds.includes(activeCharacterId)) {
          const defaultChar = unlockedChars[0];
          setActiveCharacterId(defaultChar.id);
          initializeChat(defaultChar.id);
        } else {
           if(messages.length === 0 && !isLoading && !error) {
             initializeChat(activeCharacterId);
           }
        }
      } else {
        setActiveCharacterId(null);
        setError("Chưa có nhân vật nào được chiêu mộ.");
        setMessages([{id: 'no-char', sender: 'system', text: "Hãy hoàn thành các Hồi truyện để chiêu mộ nhân vật lịch sử!", timestamp: new Date()}]);
      }
    } else {
      setMessages([]);
      setChatSession(null);
    }
  }, [isOpen, unlockedCharacterIds, activeCharacterId, initializeChat, error, isLoading, messages.length]);


  const handleCharacterSelect = (characterId: string) => {
    const character = AI_CHARACTERS[characterId];
    if (!character) return;
    
    if (!unlockedCharacterIds.includes(characterId)) {
        alert(character.unlockMessage);
        return;
    }
    
    if (characterId !== activeCharacterId) {
      playSound('sfx_click');
      setActiveCharacterId(characterId);
      initializeChat(characterId);
    }
  };

  const handleSendMessage = async () => {
    if (inputValue.trim() === '' || isLoading || !currentCharacter || !chatSession) return;

    if (isChatLimitReached) {
        setMessages(prev => [...prev, {
            id: 'system-limit-' + Date.now(),
            sender: 'system',
            text: `Bạn đã hết ${FREE_DAILY_CHAT_LIMIT} lượt trò chuyện miễn phí hôm nay. Nâng cấp Premium để trò chuyện không giới hạn!`,
            timestamp: new Date()
        }]);
        playSound('sfx_click');
        if(onUpgradePrompt) {
            setTimeout(() => {
                onClose(); 
                onUpgradePrompt();
            }, 2500);
        }
        return;
    }

    const userMessageText = inputValue.trim();
    const userMessage: ChatMessage = {
      id: 'user-' + Date.now(),
      sender: 'user',
      text: userMessageText,
      timestamp: new Date()
    };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setError(null);
    playSound('sfx_click');

    try {
      if (!isPremium) {
          onIncrementChatCount();
      }
      
      const response = await chatSession.sendMessage({ message: userMessageText });
      const botMessageText = response.text;
      
      setMessages(prevMessages => [...prevMessages, {
        id: 'bot-' + Date.now(),
        sender: 'bot',
        text: botMessageText,
        timestamp: new Date()
      }]);

    } catch (e: any) {
      console.error(`Error sending message (character: ${currentCharacter.name}):`, e);
      const displayError = e.message || `Xin lỗi, ${currentCharacter.name} không thể trả lời ngay lúc này. Hãy thử lại sau.`;
      
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

  const allCharacters = Object.values(AI_CHARACTERS) as AiCharacter[];

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
            {!isPremium && (
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

      <div id="character-selection">
        <p className="text-xs text-center text-amber-700 dark:text-amber-300 mb-1 font-semibold">CHIÊU MỘ NHÂN VẬT</p>
        <div id="character-selection-scroll">
            {allCharacters.map(char => {
            const isUnlocked = unlockedCharacterIds.includes(char.id);
            return (
                <button
                key={char.id}
                onClick={() => handleCharacterSelect(char.id)}
                title={isUnlocked ? `Trò chuyện với ${char.name}` : char.unlockMessage}
                className={`character-avatar-button ${activeCharacterId === char.id ? 'avatar-selected' : ''} ${!isUnlocked ? 'avatar-locked' : ''}`}
                aria-pressed={activeCharacterId === char.id}
                >
                <img 
                    src={char.avatarUrl} 
                    alt={char.name}
                    onError={(e) => (e.currentTarget.src = AVATAR_PLACEHOLDER_URL)}
                />
                </button>
            );
            })}
        </div>
      </div>

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
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[80%] p-3 rounded-lg shadow bg-stone-200 dark:bg-stone-700 rounded-bl-none">
              <div className="flex items-center space-x-1">
                <span className="typing-dot"></span>
                <span className="typing-dot" style={{ animationDelay: '0.2s' }}></span>
                <span className="typing-dot" style={{ animationDelay: '0.4s' }}></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 border-t border-amber-200 dark:border-stone-700 bg-white dark:bg-stone-800">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={
                currentCharacter 
                ? (isChatLimitReached ? 'Đã hết lượt trò chuyện miễn phí.' : 'Nhập câu hỏi của bạn...')
                : 'Vui lòng chọn một nhân vật.'
            }
            className="flex-grow w-full px-4 py-2 bg-amber-50 dark:bg-stone-700 text-stone-800 dark:text-stone-100 border border-amber-300 dark:border-stone-600 rounded-full focus:ring-2 focus:ring-amber-500 outline-none transition-all"
            disabled={isLoading || !currentCharacter || isChatLimitReached}
            aria-label="Nhập câu hỏi"
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || inputValue.trim() === '' || !currentCharacter || isChatLimitReached}
            className="bg-amber-600 hover:bg-amber-700 text-white dark:text-stone-900 rounded-full p-2.5 shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Gửi tin nhắn"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;