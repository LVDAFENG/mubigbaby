import React, { useState, useRef, useEffect } from 'react';
import { X, Upload, Sparkles, Loader2, Image as ImageIcon } from 'lucide-react';
import { Memory, PolishStatus } from '../types';
import { polishMemoryText, suggestMemoryTitle } from '../services/geminiService';

interface AddMemoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (memory: Omit<Memory, 'id'>) => void;
  initialData?: Memory; // Optional prop for editing
}

const AddMemoryModal: React.FC<AddMemoryModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [polishStatus, setPolishStatus] = useState<PolishStatus>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Effect to populate form when initialData changes or modal opens
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setDate(initialData.date);
        setTitle(initialData.title);
        setDescription(initialData.description);
        setImage(initialData.imageUrl || null);
      } else {
        // Reset defaults for new entry
        setDate(new Date().toISOString().split('T')[0]);
        setTitle('');
        setDescription('');
        setImage(null);
      }
      setPolishStatus('idle');
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePolish = async () => {
    if (!description) return;
    setPolishStatus('loading');
    
    // Parallel execution for better UX
    const [polishedDesc, suggestedTitle] = await Promise.all([
      polishMemoryText(description),
      !title ? suggestMemoryTitle(description) : Promise.resolve(title)
    ]);

    setDescription(polishedDesc);
    if (!title) setTitle(suggestedTitle);
    
    setPolishStatus('success');
    setTimeout(() => setPolishStatus('idle'), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      date,
      title: title || 'A Special Day',
      description,
      imageUrl: image || undefined,
    });
    // Don't close here, parent handles closing
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-300">
        
        {/* Header */}
        <div className="bg-rose-50 px-6 py-4 flex items-center justify-between border-b border-rose-100">
          <h2 className="text-xl font-serif text-rose-900">
            {initialData ? 'Edit Memory' : 'New Memory'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-rose-200/50 transition-colors text-rose-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Date Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Date</label>
            <input 
              type="date" 
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-200 outline-none transition-all text-slate-700"
            />
          </div>

          {/* Image Upload */}
          <div>
             <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Photo</label>
             <div 
               onClick={() => fileInputRef.current?.click()}
               className={`relative h-48 rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all ${image ? 'border-transparent' : 'border-slate-300 hover:border-rose-400 hover:bg-rose-50'}`}
             >
               {image ? (
                 <>
                   <img src={image} alt="Preview" className="absolute inset-0 w-full h-full object-cover rounded-xl" />
                   <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
                      <span className="text-white font-medium flex items-center gap-2"><ImageIcon className="w-4 h-4" /> Change Photo</span>
                   </div>
                 </>
               ) : (
                 <div className="text-slate-400 flex flex-col items-center">
                   <Upload className="w-8 h-8 mb-2" />
                   <span className="text-sm">Click to upload a photo</span>
                 </div>
               )}
               <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageUpload} 
                  className="hidden" 
                  accept="image/*"
                />
             </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Title</label>
            <input 
              type="text" 
              placeholder="e.g., Our First Date"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-200 outline-none transition-all text-slate-700"
            />
          </div>

          {/* Description with AI Polish */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Description</label>
              <button 
                type="button" 
                onClick={handlePolish}
                disabled={polishStatus === 'loading' || !description}
                className={`text-xs flex items-center gap-1 px-2 py-1 rounded-lg transition-all ${polishStatus === 'loading' ? 'bg-slate-100 text-slate-400' : 'bg-gradient-to-r from-rose-100 to-purple-100 text-rose-600 hover:from-rose-200 hover:to-purple-200'}`}
              >
                {polishStatus === 'loading' ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                {polishStatus === 'loading' ? 'Magic working...' : 'AI Polish'}
              </button>
            </div>
            <textarea 
              rows={4}
              required
              placeholder="What happened on this day?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-200 outline-none transition-all text-slate-700 resize-none"
            />
          </div>

          <button 
            type="submit"
            className="w-full py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-medium shadow-lg shadow-rose-200 transition-transform active:scale-95"
          >
            {initialData ? 'Update Memory' : 'Save Memory'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddMemoryModal;