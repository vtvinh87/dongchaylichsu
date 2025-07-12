
import React from 'react';
import { Artifact } from '../types';

interface ArtifactCardProps {
  artifact: Artifact;
}

const ArtifactCard: React.FC<ArtifactCardProps> = ({ artifact }) => {
  return (
    <div
      className="bg-white dark:bg-stone-700 p-3 rounded-lg shadow-md text-center transition-transform duration-300 hover:scale-110 border border-amber-200 dark:border-stone-600"
      title={artifact.name}
    >
      <img src={artifact.imageUrl} alt={artifact.name} className="w-20 h-20 object-contain mx-auto rounded-full bg-amber-50 dark:bg-stone-600 p-1" />
    </div>
  );
};

export default ArtifactCard;