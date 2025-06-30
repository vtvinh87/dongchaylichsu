import React, { useState, useEffect, useMemo } from 'react';
import { DialogueEntry, Speaker, SpeakerKey, AvatarCustomization, DialogueOption } from '../types';
import { playSound } from '../utils/audio';
import AvatarDisplay from './AvatarDisplay';

interface DialogueModalProps {
  isOpen: boolean;
  script: DialogueEntry[];
  speakers: Record<SpeakerKey, Speaker>;
  playerAvatar: AvatarCustomization;
  gender: 'male' | 'female';
  onClose: () => void;
  onEvent: (event: DialogueEntry) => void;
  onOptionClick: (option: DialogueOption) => void;
}

const DialogueModal: React.FC<DialogueModalProps> = ({ isOpen, script, speakers, playerAvatar, gender, onClose, onEvent, onOptionClick }) => {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setCurrentLineIndex(0);
      let nextIndex = 0;
      while (script[nextIndex] && script[nextIndex].type !== 'dialogue') {
        onEvent(script[nextIndex]);
        nextIndex++;
      }
      setCurrentLineIndex(nextIndex);

      if (nextIndex >= script.length) {
        onClose(); 
      }
    }
  }, [isOpen, script, onClose, onEvent]);

  const handleContinue = () => {
    playSound('sfx_click');
    let nextIndex = currentLineIndex + 1;

    while (script[nextIndex] && script[nextIndex].type !== 'dialogue') {
      onEvent(script[nextIndex]);
      nextIndex++;
    }

    if (nextIndex >= script.length) {
      onClose();
    } else {
      setCurrentLineIndex(nextIndex);
    }
  };

  if (!isOpen || !script || currentLineIndex >= script.length) {
    return null;
  }

  const currentEntry = script[currentLineIndex];

  if (currentEntry.type !== 'dialogue') {
    return null;
  }
  
  const currentSpeakerKey = currentEntry.speaker;
  const speakerInfo = speakers[currentSpeakerKey];
  
  return (
    <div className="dialogue-modal-backdrop">
      <div className="dialogue-box">
        {currentSpeakerKey === 'nhan_vat_chinh' ? (
          <AvatarDisplay avatar={playerAvatar} gender={gender} className="character-portrait" />
        ) : (
          <img src={speakerInfo.avatarUrl} alt={speakerInfo.name} className="character-portrait" />
        )}
        <div className="dialogue-content">
          <div>
            <h3 className="speaker-name">{speakerInfo.name}</h3>
            <p id="dialogue-text">{currentEntry.text}</p>
          </div>
          <div className="dialogue-controls">
            {currentEntry.options && currentEntry.options.length > 0 ? (
              currentEntry.options.map((option, index) => (
                <button
                  key={index}
                  className="dialogue-option-button"
                  onClick={() => onOptionClick(option)}
                >
                  {option.text}
                </button>
              ))
            ) : (
              <button id="dialogue-continue-button" onClick={handleContinue}>
                Tiếp tục &rarr;
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DialogueModal;