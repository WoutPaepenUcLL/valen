import React from 'react';
import { X, Heart, Star, RotateCw, Zap } from 'lucide-react';

interface ControlsProps {
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
}

export const Controls: React.FC<ControlsProps> = ({ onSwipeLeft, onSwipeRight }) => {
  return (
    <div className="flex items-center justify-center gap-4 py-4 w-full max-w-sm mx-auto">
      <button 
        className="p-3 bg-white text-yellow-500 rounded-full shadow-lg hover:scale-110 transition border border-gray-100"
        onClick={() => {}} // No-op for rewind
      >
        <RotateCw size={24} />
      </button>

      <button 
        onClick={onSwipeLeft}
        className="p-4 bg-white text-red-500 rounded-full shadow-xl hover:scale-110 transition border border-gray-100"
      >
        <X size={32} />
      </button>

      <button 
        className="p-3 bg-white text-blue-500 rounded-full shadow-lg hover:scale-110 transition border border-gray-100"
        onClick={() => {}} // No-op
      >
        <Star size={24} />
      </button>

      <button 
        onClick={onSwipeRight}
        className="p-4 bg-white text-green-500 rounded-full shadow-xl hover:scale-110 transition border border-gray-100"
      >
        <Heart size={32} fill="currentColor" />
      </button>

      <button 
        className="p-3 bg-white text-purple-500 rounded-full shadow-lg hover:scale-110 transition border border-gray-100"
        onClick={() => {}} // No-op
      >
        <Zap size={24} />
      </button>
    </div>
  );
};
