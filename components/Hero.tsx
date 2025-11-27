import React, { useMemo } from 'react';
import { Heart, Calendar } from 'lucide-react';

interface HeroProps {
  startDate: string;
  partnerName: string;
}

const Hero: React.FC<HeroProps> = ({ startDate, partnerName }) => {
  const daysTogether = useMemo(() => {
    const start = new Date(startDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }, [startDate]);

  return (
    <div className="relative w-full h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden bg-rose-50">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full opacity-30">
        <div className="absolute top-10 left-10 w-64 h-64 bg-rose-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-10 right-10 w-64 h-64 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-64 h-64 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 text-center px-4">
        <div className="inline-flex items-center justify-center p-3 mb-6 bg-white/50 backdrop-blur-sm rounded-full shadow-sm">
          <Heart className="w-5 h-5 text-rose-500 fill-rose-500 mr-2" />
          <span className="text-rose-800 font-medium tracking-wide">Our Love Story</span>
        </div>
        
        <h1 className="font-serif text-5xl md:text-7xl text-slate-800 mb-6 tracking-tight leading-tight">
          Together for <br/>
          <span className="text-rose-500">{daysTogether}</span> Days
        </h1>
        
        <p className="text-lg md:text-xl text-slate-600 max-w-lg mx-auto leading-relaxed">
          Every moment with you is a memory I want to keep forever. Here is the story of us, {partnerName}.
        </p>

        <div className="mt-8 flex items-center justify-center gap-2 text-sm text-slate-500 font-medium">
          <Calendar className="w-4 h-4" />
          <span>Started {new Date(startDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
      </div>
    </div>
  );
};

export default Hero;
