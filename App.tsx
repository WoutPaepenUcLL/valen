import React, { useEffect, useState } from 'react';
import { SwipeCard } from './components/SwipeCard';
import { Controls } from './components/Controls';
import { MatchOverlay } from './components/MatchOverlay';
import { AppMode, Profile } from './types';
import { AnimatePresence, motion } from 'framer-motion';
import { MessageCircle, User, AlertCircle } from 'lucide-react';


// --- CONFIGURATION ---

// 1. YOUR PHOTOS (Swiping Stack)
// Add URLs to your photos here.
const MY_PHOTOS: string[] = [
  './ME/20250821_151940.jpg',
  './ME/20250830_191515.jpg',
  './ME/20251116_212241.jpg',
  './ME/20251219_175154.jpg',
  './ME/20260103_113324.jpg',
  './ME/20260202_091657.jpg',
  './ME/20260209_145808.jpg',
];

// 2. MATCH SCREEN PHOTOS
// URL for HER photo (appears on the left in match screen)
const HER_PHOTO = './her/20260105_172329.jpg'; // e.g., "https://mysite.com/her.jpg"

// Optional: URL for YOUR photo in match screen (appears on right).
// If left empty, it will use the photo from the card she just swiped right on.
const MATCH_PHOTO_OVERRIDE = ""; 

// ---------------------

// Fallback photos if the list is empty
const FALLBACK_PHOTOS = [
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&q=80",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&q=80",
    "https://images.unsplash.com/photo-1534030347209-7147fd9e791a?w=800&q=80",
    "https://images.unsplash.com/photo-1480455624313-e29b44bbfde1?w=800&q=80"
];

const PHOTOS_TO_USE = MY_PHOTOS.length > 0 ? MY_PHOTOS : FALLBACK_PHOTOS;

const INITIAL_PROFILE: Profile = {
  name: "Jouw Valentijn",
  age: "Forever",
  bio: "Ik heb een belangrijke vraag voor je... Swipe rechts om het te ontdekken! 🌹",
  photos: PHOTOS_TO_USE
};

const preloadImages = (sources: string[]) => {
  sources.filter(Boolean).forEach((src) => {
    const img = new Image();
    img.src = src;
  });
};

function App() {
  const [mode, setMode] = useState<AppMode>(AppMode.SWIPE);
  const [profile] = useState<Profile>(INITIAL_PROFILE);
  const [photoIndex, setPhotoIndex] = useState(0);

  useEffect(() => {
    preloadImages([HER_PHOTO, MATCH_PHOTO_OVERRIDE, ...PHOTOS_TO_USE]);
  }, []);

  // Derived state to check position in stack
  const totalPhotos = profile.photos.length;
  const isSecondToLast = photoIndex === totalPhotos - 2;
  const isLastCard = photoIndex === totalPhotos - 1;

  const handleSwipe = (direction: 'left' | 'right') => {
    if (direction === 'right') {
      // It's a match!
      setMode(AppMode.MATCH);
    } else {
      // Swipe Left logic
      if (isLastCard) {
        // Technically this should be handled by SwipeCard forcing a right swipe,
        // but if it somehow bubbles up as left, we treat it as match anyway because LOVE WINS.
        setMode(AppMode.MATCH);
      } else {
        // Move to next photo
        setTimeout(() => {
          setPhotoIndex(prev => prev + 1);
        }, 200);
      }
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gray-100 flex flex-col items-center justify-center">
      {/* Top Bar */}
      <div className="absolute top-0 w-full h-16 bg-white z-10 flex items-center justify-between px-4 shadow-sm">
        <button className="text-gray-400 p-2">
            <User size={28} />
        </button>
        <div className="flex gap-1">
             <img src="https://cdn-icons-png.flaticon.com/512/2504/2504929.png" alt="Logo" className="w-8 h-8" />
             <span className="text-rose-500 font-bold text-2xl tracking-tighter">tinder</span>
        </div>
        <button className="text-gray-400 p-2">
            <MessageCircle size={28} />
        </button>
      </div>

      {/* Main Card Area */}
      <div className="relative w-full max-w-sm h-[65vh] md:h-[70vh] mt-4">
        <AnimatePresence>
          {mode === AppMode.SWIPE && (
            <React.Fragment key={photoIndex}>
               {/* Underlay card to make it look like a stack */}
               <div className="absolute top-2 w-[95%] left-[2.5%] h-full bg-white rounded-3xl shadow-sm border border-gray-200" />
               
               {/* The Active Card */}
               <SwipeCard 
                  profile={profile} 
                  photoIndex={photoIndex}
                  isLastCard={isLastCard}
                  onSwipe={handleSwipe} 
               />
            </React.Fragment>
          )}
        </AnimatePresence>
      </div>

      {/* Popups / Toast Messages for specific cards */}
      <AnimatePresence>
        {isSecondToLast && mode === AppMode.SWIPE && (
            <motion.div 
                initial={{ opacity: 0, y: 50, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="absolute bottom-32 z-30 w-full px-8 pointer-events-none"
            >
                <div className="bg-yellow-400 text-black font-bold p-4 rounded-xl shadow-xl text-center border-4 border-white transform rotate-2">
                    <div className="flex items-center justify-center gap-2 mb-1">
                        <AlertCircle size={24} />
                        <span className="text-lg uppercase">Pas op!</span>
                    </div>
                    Serieus nog steeds niet overtuigd?! 🤨
                </div>
            </motion.div>
        )}

        {isLastCard && mode === AppMode.SWIPE && (
            <motion.div 
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute bottom-32 z-30 w-full px-8 pointer-events-none"
            >
                <div className="bg-red-600 text-white font-black p-6 rounded-xl shadow-2xl text-center border-4 border-white animate-pulse">
                    <h2 className="text-2xl uppercase italic">Halloooo!</h2>
                    SWIPE RECHTS! 👉
                </div>
            </motion.div>
        )}
      </AnimatePresence>

      {/* Controls */}
      <div className="w-full absolute bottom-4 md:bottom-8 px-4">
         <Controls 
            onSwipeLeft={() => {
                // Manually trigger left swipe via props logic in SwipeCard usually, 
                // but buttons invoke direct handler.
                // We add the same check here:
                if (isLastCard) {
                    // If button is clicked on last card, we force right logic
                    handleSwipe('right'); 
                } else {
                    handleSwipe('left');
                }
            }}
            onSwipeRight={() => handleSwipe('right')}
         />
      </div>

      {/* Match Overlay */}
      {mode === AppMode.MATCH && (
        <MatchOverlay 
          partnerName={profile.name} 
          myPhoto={MATCH_PHOTO_OVERRIDE || profile.photos[photoIndex % profile.photos.length]} 
          partnerPhoto={HER_PHOTO}
        />
      )}
    </div>
  );
}

export default App;