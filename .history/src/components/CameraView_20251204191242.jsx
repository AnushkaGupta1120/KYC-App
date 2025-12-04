import React, { useState, useEffect } from 'react';
import { User, X } from 'lucide-react';

const CameraView = ({ onCapture, onClose, instruction }) => {
  const [countdown, setCountdown] = useState(null);

  const handleCapture = () => {
    setCountdown(3);
    let count = 3;
    const timer = setInterval(() => {
      count--;
      setCountdown(count);
      if (count === 0) {
        clearInterval(timer);
        onCapture("captured_image_blob"); // In real app, this is base64
      }
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center">
      <div className="relative w-full max-w-md aspect-[3/4] bg-gray-900 overflow-hidden flex items-center justify-center">
        {/* Simulated Camera Feed */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50"></div>
        <div className="w-64 h-64 border-2 border-white/50 rounded-full flex items-center justify-center">
             <User size={120} className="text-white/20" />
        </div>
        
        {countdown !== null && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
             <span className="text-white text-8xl font-bold">{countdown > 0 ? countdown : "CLICK!"}</span>
          </div>
        )}
        
        <button onClick={onClose} className="absolute top-4 right-4 text-white bg-black/40 p-2 rounded-full">
          <X size={24} />
        </button>
      </div>
      
      <div className="absolute bottom-10 w-full flex flex-col items-center gap-4">
        <p className="text-white bg-black/50 px-4 py-1 rounded-full text-sm">{instruction}</p>
        <button 
          onClick={handleCapture}
          className="w-16 h-16 bg-white rounded-full border-4 border-gray-400 shadow-lg active:scale-95 transition-transform"
        ></button>
      </div>
    </div>
  );
};

export default CameraView;