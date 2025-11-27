import React from 'react';

interface YearSeparatorProps {
  year: string;
}

const YearSeparator: React.FC<YearSeparatorProps> = ({ year }) => {
  return (
    <div className="flex items-center justify-center my-12 md:my-16 relative z-10 animate-in fade-in zoom-in duration-700">
      {/* Decorative lines */}
      <div className="absolute w-full top-1/2 -translate-y-1/2 flex justify-center items-center -z-10">
        <div className="w-full max-w-[200px] h-px bg-gradient-to-r from-transparent via-rose-200 to-transparent"></div>
      </div>
      
      <div className="bg-white/95 backdrop-blur-md text-rose-500 px-8 py-2 rounded-full border border-rose-100 shadow-[0_4px_20px_-5px_rgba(244,63,94,0.15)] font-serif text-3xl font-medium tracking-wide">
        {year}
      </div>
    </div>
  );
};

export default YearSeparator;