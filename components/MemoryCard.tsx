import React from 'react';
import { Memory } from '../types';
import { Calendar, Trash2, Pencil } from 'lucide-react';

interface MemoryCardProps {
  memory: Memory;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  index: number;
}

const MemoryCard: React.FC<MemoryCardProps> = ({ memory, onDelete, onEdit, index }) => {
  const isEven = index % 2 === 0;

  return (
    <div className={`flex flex-col md:flex-row items-center w-full mb-12 md:mb-24 ${isEven ? 'md:flex-row-reverse' : ''} group`}>
      {/* Date Marker Line (Desktop) */}
      <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center justify-center w-8 h-8 rounded-full bg-rose-500 border-4 border-white shadow-md z-10 transition-transform group-hover:scale-110">
        <div className="w-2 h-2 bg-white rounded-full"></div>
      </div>

      {/* Content Side */}
      <div className={`w-full md:w-5/12 px-4 ${isEven ? 'md:pl-12' : 'md:pr-12'}`}>
        <div 
          className="bg-white p-6 rounded-2xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_50px_-15px_rgba(244,63,94,0.2)] transition-all duration-500 border border-slate-100 relative overflow-hidden group/card"
        >
          {/* Decorative background accent */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-rose-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110 z-0"></div>

          <div className="relative z-10">
            <div className="flex items-center text-rose-500 text-sm font-semibold mb-2">
              <Calendar className="w-4 h-4 mr-1.5" />
              {new Date(memory.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
            
            <h3 className="font-serif text-2xl text-slate-800 mb-3">{memory.title}</h3>
            
            <p className="text-slate-600 leading-relaxed text-sm md:text-base mb-6">
              {memory.description}
            </p>

            <div className="flex gap-2">
              <button 
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onEdit(memory.id);
                }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium text-slate-500 bg-slate-50 hover:bg-slate-100 hover:text-slate-700 transition-colors border border-slate-100 hover:border-slate-200 cursor-pointer relative z-20"
                title="Edit this memory"
              >
                <Pencil className="w-3.5 h-3.5" />
                Edit
              </button>

              <button 
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onDelete(memory.id);
                }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium text-rose-400 bg-rose-50 hover:bg-red-50 hover:text-red-500 transition-colors border border-transparent hover:border-red-100 cursor-pointer relative z-20"
                title="Remove this memory"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Remove
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Image Side */}
      <div className={`w-full md:w-5/12 px-4 mt-6 md:mt-0 ${isEven ? 'md:pr-12' : 'md:pl-12'} flex ${isEven ? 'justify-start' : 'justify-end'}`}>
        {memory.imageUrl ? (
          <div className="relative rounded-2xl overflow-hidden shadow-lg aspect-[4/3] w-full max-w-md group-hover:rotate-1 transition-transform duration-500">
            <img 
              src={memory.imageUrl} 
              alt={memory.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>
        ) : (
          <div className="w-full max-w-md aspect-[4/3] bg-rose-50 rounded-2xl flex items-center justify-center border-2 border-dashed border-rose-200">
            <span className="text-rose-300 font-serif italic">No photo for this memory</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MemoryCard;