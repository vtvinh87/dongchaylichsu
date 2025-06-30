import React, { useState, useEffect } from 'react';
import { NotebookPage } from '../types';
import { playSound } from '../utils/audio';

interface NotebookModalProps {
  isOpen: boolean;
  onClose: () => void;
  pagesData: NotebookPage[];
  unlockedPageIndices: number[];
}

const NotebookModal: React.FC<NotebookModalProps> = ({
  isOpen,
  onClose,
  pagesData,
  unlockedPageIndices,
}) => {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  useEffect(() => {
    // When opening, jump to the latest unlocked page if it's an even number
    if (isOpen && unlockedPageIndices.length > 0) {
      const latestPage = Math.max(...unlockedPageIndices);
      setCurrentPageIndex(latestPage % 2 === 0 ? latestPage : latestPage - 1);
    }
  }, [isOpen, unlockedPageIndices]);

  if (!isOpen) {
    return null;
  }

  const handleClose = () => {
    playSound('sfx_click');
    onClose();
  };

  const handlePrevPage = () => {
    if (currentPageIndex > 0) {
      playSound('sfx_page_turn');
      setCurrentPageIndex(prev => prev - 2);
    }
  };

  const handleNextPage = () => {
    const nextLeftPageIndex = currentPageIndex + 2;
    if (unlockedPageIndices.includes(nextLeftPageIndex)) {
      playSound('sfx_page_turn');
      setCurrentPageIndex(prev => prev + 2);
    }
  };
  
  const totalPages = pagesData.length;
  const isPrevDisabled = currentPageIndex === 0;
  // Next is disabled if the *next* left page is not in the unlocked list.
  const isNextDisabled = currentPageIndex + 2 >= totalPages || !unlockedPageIndices.includes(currentPageIndex + 2);

  const leftPageContent = pagesData[currentPageIndex]?.content || '';
  const rightPageContent = unlockedPageIndices.includes(currentPageIndex + 1) ? (pagesData[currentPageIndex + 1]?.content || '') : '...';

  return (
    <div id="notebook-modal" className="animate-fadeInScaleUp" onClick={handleClose}>
      <div id="notebook-container" onClick={(e) => e.stopPropagation()}>
        <div id="left-page" className="notebook-page">
          {leftPageContent}
        </div>
        <div id="right-page" className="notebook-page">
          {rightPageContent}
        </div>

        <div className="notebook-controls">
          <button id="prev-page-button" onClick={handlePrevPage} disabled={isPrevDisabled}>
            &larr; Trang trước
          </button>
          <span id="notebook-page-indicator">
            Trang {currentPageIndex + 1} - {currentPageIndex + 2}
          </span>
          <button id="next-page-button" onClick={handleNextPage} disabled={isNextDisabled}>
            Trang sau &rarr;
          </button>
        </div>
         <button id="close-notebook-button" onClick={handleClose}>Đóng</button>
      </div>
    </div>
  );
};

export default NotebookModal;