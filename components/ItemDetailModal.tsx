import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Artifact, HeroCard, Decoration } from '../types';
import { playSound } from '../utils/audio';
import { BRONZE_DRUM_ARTIFACT_ID } from '../constants';
import { SKETCHFAB_BRONZE_DRUM_EMBED_URL } from '../imageUrls';

type DisplayableItem = Artifact | HeroCard | Decoration;

interface ItemDetailModalProps {
  item: DisplayableItem;
  isOpen: boolean;
  onClose: () => void;
}

const API_KEY = process.env.API_KEY;

const ItemDetailModal: React.FC<ItemDetailModalProps> = ({ item, isOpen, onClose }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [aiContent, setAiContent] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !item) return;

    // Reset state for new item
    setIsLoading(true);
    setAiContent("");
    setError(null);

    if (!API_KEY) {
      setError("Lỗi cấu hình: Không thể kết nối tới dịch vụ AI.");
      setIsLoading(false);
      return;
    }

    const fetchAiInfo = async () => {
      try {
        const ai = new GoogleGenAI({ apiKey: API_KEY });
        const prompt = `Bạn là một nhà sử học chuyên nghiệp. Cung cấp thông tin chi tiết, ngắn gọn và súc tích về chủ đề sau: '${item.name}'. Viết bằng tiếng Việt. Tập trung vào các khía cạnh quan trọng, ý nghĩa văn hóa hoặc lịch sử của nó. Không cần viết lời chào hay câu kết.`;

        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash-preview-04-17",
          contents: prompt,
        });
        
        setAiContent(response.text);
      } catch (e) {
        console.error("Error fetching AI details:", e);
        setError("Rất tiếc, đã có lỗi xảy ra khi tìm kiếm thông tin. Vui lòng thử lại sau.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAiInfo();
  }, [item, isOpen]);

  const handleCloseAction = () => {
    playSound('sfx-click');
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col justify-center items-center h-48">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500 mb-4"></div>
          <p className="text-amber-600 dark:text-amber-400">Đang tìm kiếm trong dòng chảy lịch sử...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="p-4 bg-red-100 dark:bg-red-900/50 rounded-lg text-center">
            <p className="text-red-700 dark:text-red-300">{error}</p>
        </div>
      );
    }

    return (
        <p className="text-stone-700 dark:text-stone-200 text-base text-left leading-relaxed whitespace-pre-wrap">
            {aiContent}
        </p>
    );
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 dark:bg-opacity-75 flex justify-center items-center z-50 p-4 transition-opacity duration-300 ease-in-out"
      onClick={handleCloseAction}
      role="dialog"
      aria-modal="true"
      aria-labelledby="item-detail-title"
    >
      <div
        className="modal-content bg-amber-50 dark:bg-stone-800 p-6 rounded-xl shadow-2xl w-full max-w-2xl text-center relative transform transition-all duration-300 ease-in-out scale-95 opacity-0 animate-fadeInScaleUp flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleCloseAction}
          className="modal-close-button absolute top-3 right-4 text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-100 text-3xl font-bold leading-none z-10"
          aria-label="Đóng"
        >
          &times;
        </button>
        <h2 id="item-detail-title" className="text-3xl font-bold text-amber-700 dark:text-amber-400 mb-4 font-serif">{item.name}</h2>
        
        <div className="overflow-y-auto pr-2">
            {item.id === BRONZE_DRUM_ARTIFACT_ID ? (
                <div className="mb-5">
                    <iframe 
                        title="Trống Đồng Đông Sơn ( Dong Son bronze drum)" 
                        frameBorder="0" 
                        allowFullScreen 
                        allow="autoplay; fullscreen; xr-spatial-tracking" 
                        src={SKETCHFAB_BRONZE_DRUM_EMBED_URL}
                        className="w-full h-80 rounded-lg border-2 border-amber-300 dark:border-amber-700 bg-stone-200 dark:bg-stone-900"
                    >
                    </iframe>
                     <p className="text-xs text-stone-500 dark:text-stone-400 mt-2 text-center">
                        Mô hình 3D <a href="https://sketchfab.com/3d-models/trong-ong-ong-son-dong-son-bronze-drum-c91e55f6db8742f09ad2d5815ca6b749" target="_blank" rel="noopener noreferrer" className="underline font-bold text-sky-600 dark:text-sky-400">Trống Đồng Đông Sơn</a> của <a href="https://sketchfab.com/Aaannnn" target="_blank" rel="noopener noreferrer" className="underline font-bold text-sky-600 dark:text-sky-400">Aaannnn</a> trên <a href="https://sketchfab.com" target="_blank" rel="noopener noreferrer" className="underline font-bold text-sky-600 dark:text-sky-400">Sketchfab</a>.
                    </p>
                </div>
            ) : (
                <img
                    src={item.imageUrl}
                    alt={`Hình ảnh ${item.name}`}
                    className="max-w-xs h-auto max-h-64 object-contain mx-auto mb-5 rounded-lg border-2 border-amber-300 dark:border-amber-700 p-1 bg-white dark:bg-stone-700"
                />
            )}
            {renderContent()}
        </div>

        <button
          onClick={handleCloseAction}
          className="mt-6 bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600 text-white dark:text-stone-900 font-semibold py-2 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 focus:ring-opacity-50 flex-shrink-0"
        >
          Đã hiểu
        </button>
      </div>
    </div>
  );
};

export default ItemDetailModal;

if (typeof process === 'undefined') {
  // @ts-ignore
  globalThis.process = { env: {} };
}