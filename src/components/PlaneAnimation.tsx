import React, { useState, useEffect } from 'react';
import { Plane } from 'lucide-react';

interface PlaneAnimationProps {
  onComplete: () => void;
}

const PlaneAnimation: React.FC<PlaneAnimationProps> = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [animationPhase, setAnimationPhase] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationPhase(1);
    }, 600);

    const completeTimer = setTimeout(() => {
      setAnimationPhase(2);
      setTimeout(() => {
        setIsVisible(false);
        onComplete();
      }, 800);
    }, 2700);

    return () => {
      clearTimeout(timer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center overflow-hidden">
      {/* Background stars */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${1 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Cloud elements */}
      <div className="absolute inset-0">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white/10 rounded-full blur-sm"
            style={{
              width: `${60 + Math.random() * 80}px`,
              height: `${30 + Math.random() * 40}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 2}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center">
        {/* Logo */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="flex-shrink-0">
              <img 
                src="/images/valentia-logo.png" 
                alt="Valentia Logo" 
                className="h-16 w-auto"
              />
            </div>
            <div className="text-left">
              <h1 className="text-4xl font-bold text-white">VALENTIA</h1>
              <p className="text-lg text-blue-200">CABIN CREW ACADEMY</p>
            </div>
          </div>
        </div>

        {/* Flying plane */}
        <div className="relative mb-8">
          <div
            className={`transition-all duration-1200 ease-out ${
              animationPhase === 0 
                ? 'opacity-0 transform translate-x-[-200px] scale-50' 
                : animationPhase === 1 
                ? 'opacity-100 transform translate-x-0 scale-100' 
                : 'opacity-0 transform translate-x-[200px] scale-50'
            }`}
          >
            <Plane className="h-16 w-16 text-yellow-400 mx-auto drop-shadow-lg" />
          </div>
          
          {/* Flight trail */}
          <div
            className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1200 ${
              animationPhase === 1 ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="w-32 h-1 bg-gradient-to-r from-transparent via-yellow-300/50 to-transparent rounded-full blur-sm"></div>
          </div>
        </div>

        {/* Loading text */}
        <div className="text-center">
          <div
            className={`transition-all duration-1000 ${
              animationPhase === 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <h2 className="text-2xl font-semibold text-white mb-2">
              Elevating Aviation Excellence
            </h2>
            <p className="text-blue-200 text-lg">
              Preparing for takeoff...
            </p>
          </div>
        </div>

        {/* Loading dots */}
        <div
          className={`flex justify-center space-x-2 mt-6 transition-all duration-1000 ${
            animationPhase === 1 ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>

      {/* CSS animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          25% { transform: translateY(-10px) translateX(5px); }
          50% { transform: translateY(-5px) translateX(-5px); }
          75% { transform: translateY(-15px) translateX(3px); }
        }
      `}</style>
    </div>
  );
};

export default PlaneAnimation;
