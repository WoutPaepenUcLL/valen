import React, { useState } from 'react';
import { motion, Variants } from 'framer-motion';
import { Heart } from 'lucide-react';

interface MatchOverlayProps {
  partnerName: string;
  myPhoto: string;      // The photo of the person being swiped (You/Boyfriend)
  partnerPhoto?: string; // The photo of the person swiping (Her/Girlfriend)
}

export const MatchOverlay: React.FC<MatchOverlayProps> = ({ partnerName, myPhoto, partnerPhoto }) => {
  const [response, setResponse] = useState<'pending' | 'yes'>('pending');

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  const textVariants: Variants = {
    hidden: { scale: 0.5, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { 
        type: "spring",
        stiffness: 200,
        damping: 10,
        delay: 0.2 
      }
    }
  };

  if (response === 'yes') {
    return (
      <div className="fixed inset-0 z-50 bg-rose-600 flex flex-col items-center justify-center p-6 text-white text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", bounce: 0.5 }}
        >
          <Heart size={120} fill="white" className="mb-8" />
        </motion.div>
        <h1 className="text-5xl font-extrabold mb-4">Liefde! ❤️</h1>
        <p className="text-xl">Ik hou van je! Tot snel xx</p>
      </div>
    );
  }

  return (
    <motion.div 
      className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-4 overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Background stars effect could go here */}
      
      <motion.div variants={textVariants} className="mb-12 rotate-[-5deg]">
        <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-green-400 to-green-600 italic tracking-tighter drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] border-white">
          It's a<br/>Match!
        </h1>
      </motion.div>

      <p className="text-white text-lg mb-8">Jij en <span className="font-bold">{partnerName}</span> vinden elkaar leuk.</p>

      <div className="flex items-center justify-center gap-8 mb-12">
        {/* HER PHOTO (Left) */}
        <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-200 overflow-hidden relative shadow-[0_0_20px_rgba(255,255,255,0.3)]">
             {partnerPhoto ? (
                 <img src={partnerPhoto} alt="Her" className="w-full h-full object-cover" />
             ) : (
                 <div className="absolute inset-0 flex items-center justify-center bg-gray-300 text-gray-500">
                   <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 24 24">
                     <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                   </svg>
                 </div>
             )}
        </div>
        
        {/* HIM/YOUR PHOTO (Right) */}
        <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden relative shadow-[0_0_20px_rgba(255,255,255,0.3)]">
          <img src={myPhoto} alt="Me" className="w-full h-full object-cover" />
        </div>
      </div>

      <div className="w-full max-w-md bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 text-center">
         <h2 className="text-3xl font-bold text-white mb-6 leading-tight">
           Wil je mijn Valentijn zijn? 🌹
         </h2>
         
         <div className="space-y-3">
           <button 
             onClick={() => setResponse('yes')}
             className="w-full bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold py-4 rounded-full text-lg shadow-lg uppercase tracking-wide hover:scale-105 transition-transform"
           >
             JA, IK WIL!
           </button>
           
           <button 
             disabled
             className="w-full bg-transparent text-white/50 font-semibold py-4 rounded-full text-sm uppercase tracking-wide cursor-not-allowed"
           >
             Nee (knop is stuk)
           </button>
         </div>
      </div>

    </motion.div>
  );
};