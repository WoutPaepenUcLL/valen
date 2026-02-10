import React, { useEffect } from 'react';
import { motion, useMotionValue, useTransform, PanInfo, useAnimation } from 'framer-motion';
import { Profile } from '../types';
import { Info } from 'lucide-react';

interface SwipeCardProps {
  profile: Profile;
  photoIndex: number;
  isLastCard: boolean; // New prop to identify the final chance
  onSwipe: (direction: 'left' | 'right') => void;
}

export const SwipeCard: React.FC<SwipeCardProps> = ({ profile, photoIndex, isLastCard, onSwipe }) => {
  const x = useMotionValue(0);
  const controls = useAnimation();
  
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);

  // Visual cues
  const likeOpacity = useTransform(x, [20, 150], [0, 1]);
  const nopeOpacity = useTransform(x, [-20, -150], [0, 1]);

  const handleDragEnd = async (_: any, info: PanInfo) => {
    const threshold = 100;
    const velocity = info.velocity.x;

    if (info.offset.x > threshold || velocity > 500) {
      // Swipe Right (Normal)
      await controls.start({ x: 500, opacity: 0, transition: { duration: 0.3 } });
      onSwipe('right');
    } else if (info.offset.x < -threshold || velocity < -500) {
      // Swipe Left logic
      if (isLastCard) {
        // THE TRAP: If it's the last card, refuse the left swipe
        // 1. Animate slightly further left to acknowledge the attempt
        await controls.start({ x: -150, rotate: -20, transition: { duration: 0.2 } });
        
        // 2. Spring back to center ("No you don't")
        await controls.start({ x: 0, rotate: 0, transition: { type: "spring", stiffness: 300, damping: 20 } });
        
        // 3. Force Swipe Right
        await controls.start({ x: 500, opacity: 0, rotate: 20, transition: { duration: 0.4, ease: "easeIn" } });
        onSwipe('right');
      } else {
        // Normal Left Swipe
        await controls.start({ x: -500, opacity: 0, transition: { duration: 0.3 } });
        onSwipe('left');
      }
    } else {
      // Reset if not swiped far enough
      controls.start({ x: 0, transition: { type: 'spring', stiffness: 500, damping: 30 } });
    }
  };

  const currentPhoto = profile.photos[photoIndex % profile.photos.length];

  return (
    <motion.div
      style={{ x, rotate, opacity }}
      animate={controls}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      className="absolute top-0 w-full h-full rounded-3xl overflow-hidden shadow-2xl bg-black cursor-grab active:cursor-grabbing"
    >
      {/* Background Image */}
      <div 
        className="w-full h-full bg-cover bg-center pointer-events-none"
        style={{ backgroundImage: `url(${currentPhoto})` }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/80 pointer-events-none" />

      {/* Swipe Indicators */}
      <motion.div 
        style={{ opacity: likeOpacity }}
        className="absolute top-8 left-8 border-4 border-green-500 rounded-lg px-4 py-2 transform -rotate-12 pointer-events-none z-10"
      >
        <span className="text-green-500 font-extrabold text-4xl tracking-widest uppercase">LIKE</span>
      </motion.div>

      <motion.div 
        style={{ opacity: nopeOpacity }}
        className="absolute top-8 right-8 border-4 border-red-500 rounded-lg px-4 py-2 transform rotate-12 pointer-events-none z-10"
      >
        <span className="text-red-500 font-extrabold text-4xl tracking-widest uppercase">
          {isLastCard ? "NEVER!" : "NOPE"}
        </span>
      </motion.div>

      {/* Card Info */}
      <div className="absolute bottom-0 w-full p-6 text-white pointer-events-none">
        <div className="flex items-end justify-between mb-2">
          <div>
            <h2 className="text-3xl font-extrabold shadow-black drop-shadow-md">
              {profile.name} <span className="text-2xl font-medium ml-2">{profile.age}</span>
            </h2>
            <div className="flex items-center text-sm font-semibold opacity-90 mt-1">
              <span className="bg-green-500 w-2 h-2 rounded-full mr-2"></span>
              {photoIndex + 1} / {profile.photos.length}
            </div>
          </div>
          <button className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
            <Info size={24} />
          </button>
        </div>
        <p className="text-white/90 line-clamp-2 text-base font-medium drop-shadow-md">
          {profile.bio}
        </p>
      </div>
      
      {/* Photo Pagination Dots */}
      <div className="absolute top-2 w-full flex gap-1 px-2">
         {profile.photos.map((_, i) => (
           <div 
            key={i} 
            className={`h-1 flex-1 rounded-full ${i === photoIndex ? 'bg-white' : 'bg-white/40'}`}
           />
         ))}
      </div>

    </motion.div>
  );
};
