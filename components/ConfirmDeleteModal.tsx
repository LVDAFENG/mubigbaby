import React from 'react';
import { Trash2 } from 'lucide-react';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Modal Content */}
      <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full transform transition-all scale-100 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-50 rounded-full mb-4">
          <Trash2 className="w-6 h-6 text-red-500" />
        </div>
        
        <h3 className="text-xl font-serif text-slate-900 text-center mb-2">
          Remove Memory?
        </h3>
        
        <p className="text-sm text-slate-500 text-center mb-6 leading-relaxed">
          Are you sure you want to delete this memory? It will be removed from your timeline permanently.
        </p>
        
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-xl transition-colors outline-none focus:ring-2 focus:ring-slate-200"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-xl transition-colors shadow-lg shadow-red-200 outline-none focus:ring-2 focus:ring-red-200"
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;