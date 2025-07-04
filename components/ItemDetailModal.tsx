import React, { useState, useEffect } from 'react';
import { Artifact, HeroCard, Decoration } from '../types';
import { playSound } from '../utils/audio';
import { BRONZE_DRUM_ARTIFACT_ID } from '../constants';
import { SKETCHFAB_BRONZE_DRUM_EMBED_URL } from '../imageUrls';
import { GoogleGenAI } from "@google/genai";

type DisplayableItem = Artifact | HeroCard | Decoration;

interface ItemDetailModalProps {
  item: DisplayableItem;
  isOpen: boolean;
  onClose: () => void;
}

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

    const fetchAiInfo = async () => {
      try {
        const ai = new GoogleGenAI({apiKey: process.env.API_KEY as string});
        const prompt = `Bạn là một nhà sử học chuyên nghiệp. Cung cấp thông tin chi tiết, ngắn gọn và súc tích về chủ đề sau: '${item.name}'. Viết bằng tiếng Việt. Tập trung vào các khía cạnh quan trọng, ý nghĩa văn hóa hoặc lịch sử của nó. Không cần viết lời chào hay câu kết.`;

        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash-preview-04-17",
          contents: prompt,
        });

        setAiContent(response.text);

      } catch (e: any) {
        console.error("Error fetching AI details:", e);
        setError(e.message || "Rất tiếc, đã có lỗi xảy ra khi tìm kiếm thông tin. Vui lòng thử lại sau.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAiInfo();
  }, [item, isOpen]);

  const handleCloseAction = () => {
    playSound('sfx_click');
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
        
        <div className="overflow-y-auto pr-4 -mr-4 flex-grow">
          {item.id === BRONZE_DRUM_ARTIFACT_ID ? (
             <div className="aspect-video mb-4">
               <iframe title="Trong Dong Dong Son 3D Model" width="100%" height="100%" src={SKETCHFAB_BRONZE_DRUM_EMBED_URL} allowFullScreen allow="autoplay; fullscreen; xr-spatial-tracking"></iframe>
             </div>
          ) : (
            <img 
              src={item.imageUrl} 
              alt={`Hình ảnh ${item.name}`} 
              className="max-w-xs h-auto mx-auto mb-5 rounded-lg border-2 border-amber-300 dark:border-amber-700 p-1 bg-white dark:bg-stone-700"
            />
          )}

          <hr className="my-4 border-amber-200 dark:border-stone-600"/>

          <div className="mb-4">
              <h3 className="text-xl font-semibold text-amber-600 dark:text-amber-400 mb-2">Thông tin từ Bảo tàng</h3>
              <p className="text-stone-700 dark:text-stone-200 text-base text-left leading-relaxed">
                  {'description' in item && item.description}
                  {('detailedDescription' in item) && item.detailedDescription}
              </p>
          </div>

          <hr className="my-4 border-amber-200 dark:border-stone-600"/>

          <div>
              <h3 className="text-xl font-semibold text-amber-600 dark:text-amber-400 mb-2">Thông tin Chi tiết</h3>
              {renderContent()}
          </div>
        </div>

        <button
            onClick={handleCloseAction}
            className="mt-6 flex-shrink-0 bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600 text-white dark:text-stone-900 font-semibold py-2 px-6 rounded-lg shadow-md hover:shadow-lg transition-all"
        >
            Đóng
        </button>
      </div>
    </div>
  );
};

export default ItemDetailModal;