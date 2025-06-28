
import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  const [inputValue, setInputValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeCharacterId, setActiveCharacterId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);
  
  const currentCharacter = activeCharacterId ? AI_CHARACTERS[activeCharacterId] : null;
  const isChatLimitReached = !isPremium && dailyChatCount >= FREE_DAILY_CHAT_LIMIT;

  const initializeChat = useCallback(async (characterId: string | null) => {
    if (!characterId || !AI_CHARACTERS[characterId]) {
      setError("Nhân vật không hợp lệ.");
      setMessages([{
        id: 'char-error-system',
        sender: 'system',
        text: "Vui lòng chọn một nhân vật để bắt đầu trò chuyện.",
        timestamp: new Date()
      }]);
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
  }, []);

  useEffect(() => {
    if (isOpen) {
      const unlockedChars = Object.values(AI_CHARACTERS).filter(c => unlockedCharacterIds.includes(c.id));
      
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
      setMessages([]); // Clear messages when closed
    }
  }, [isOpen, unlockedCharacterIds, activeCharacterId, initializeChat, messages.length, isLoading, error]);


  const handleCharacterSelect = (characterId: string) => {
    const character = AI_CHARACTERS[characterId];
    if (!character) return;
    
    if (!unlockedCharacterIds.includes(characterId)) {
        alert(character.unlockMessage);
        return;
    }
    
    if (characterId !== activeCharacterId) {
      playSound('sfx-click');
      setActiveCharacterId(characterId);
      initializeChat(characterId);
    }
  };

  const handleSendMessage = async () => {
    if (inputValue.trim() === '' || isLoading || !currentCharacter) return;

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

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputValue('');
    setIsLoading(true);
    setError(null);
    playSound('sfx-click');

    try {
      if (!isPremium) {
          onIncrementChatCount();
      }

      // Prepare history for the API
      const chatHistory = newMessages.filter(m => m.sender !== 'system').map(m => ({
          role: m.sender === 'user' ? 'user' : 'model',
          parts: [{ text: m.text }]
      }));
      // Remove the last message (the user's current prompt) from history
      chatHistory.pop();

      const apiResponse = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: userMessage.text,
          systemInstruction: currentCharacter.systemInstruction,
          chatHistory: chatHistory
        }),
      });

      if (!apiResponse.ok) {
        const errorData = await apiResponse.json();
        throw new Error(errorData.error || 'API request failed');
      }

      const { text: botMessageText } = await apiResponse.json();
      
      setMessages(prevMessages => [...prevMessages, {
        id: 'bot-' + Date.now(),
        sender: 'bot',
        text: botMessageText,
        timestamp: new Date()
      }]);
    } catch (e: any) {
      console.error(`Error sending message via proxy (character: ${currentCharacter.name}):`, e);
      let displayError = `Xin lỗi, ${currentCharacter.name} không thể trả lời ngay lúc này. Hãy thử lại sau.`;
      if (e.message && (e.message.includes('API key') || e.message.includes('configured'))) {
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

  const allCharacters = Object.values(AI_CHARACTERS);

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
        {isLoading && (
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
                    unlockedCharacterIds.length === 0 ? "Chiêu mộ nhân vật để chat..."
                    : isLoading ? "Đang chờ phản hồi..."
                    : "Nhập tin nhắn..."
                }
                className="flex-grow bg-white dark:bg-stone-700 text-stone-800 dark:text-stone-100 border border-amber-300 dark:border-stone-600 rounded-lg p-2 focus:ring-1 focus:ring-amber-500 dark:focus:ring-amber-400 focus:border-amber-500 dark:focus:border-amber-400 outline-none transition-shadow"
                aria-label="Tin nhắn"
                disabled={isLoading || !currentCharacter || unlockedCharacterIds.length === 0}
            />
            <button
                onClick={handleSendMessage}
                disabled={isLoading || !currentCharacter || inputValue.trim() === '' || unlockedCharacterIds.length === 0}
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
