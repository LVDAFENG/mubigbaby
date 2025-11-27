import React, { useState, useEffect, useMemo } from 'react';
import Hero from './components/Hero';
import MemoryCard from './components/MemoryCard';
import YearSeparator from './components/YearSeparator';
import AddMemoryModal from './components/AddMemoryModal';
import ConfirmDeleteModal from './components/ConfirmDeleteModal';
import { Memory, UserSettings } from './types';
import { Plus } from 'lucide-react';

const DEFAULT_SETTINGS: UserSettings = {
  startDate: '2023-01-01', // Fallback if no memories exist
  partnerName: 'My Love',
};

// Seed data if empty
const SEED_MEMORIES: Memory[] = [
  {
    id: '1',
    date: '2023-01-01',
    title: 'The Day We Met',
    description: 'The world seemed to stop when our eyes first met at the coffee shop. The aroma of roasted beans, the soft jazz playing, and your shy smile—it was the beginning of my favorite story.',
    imageUrl: 'https://picsum.photos/800/600?random=1'
  },
  {
    id: '2',
    date: '2023-02-14',
    title: 'First Valentine',
    description: 'A quiet dinner, just the two of us. We laughed until our sides hurt and talked about everything and nothing. I knew then that I never wanted to spend this day with anyone else.',
    imageUrl: 'https://picsum.photos/800/600?random=2'
  }
];

const generateId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

const App: React.FC = () => {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMemory, setEditingMemory] = useState<Memory | undefined>(undefined); // Track memory being edited
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Load from local storage on mount
  useEffect(() => {
    try {
      const storedMemories = localStorage.getItem('our_journey_memories');
      if (storedMemories) {
        setMemories(JSON.parse(storedMemories));
      } else {
        setMemories(SEED_MEMORIES);
        localStorage.setItem('our_journey_memories', JSON.stringify(SEED_MEMORIES));
      }
    } catch (e) {
      console.error("Failed to load memories", e);
      setMemories(SEED_MEMORIES);
    }
    setLoading(false);
  }, []);

  // Save to local storage whenever memories change
  useEffect(() => {
    if (!loading) {
      try {
        localStorage.setItem('our_journey_memories', JSON.stringify(memories));
      } catch (e) {
        console.error("Failed to save memories", e);
      }
    }
  }, [memories, loading]);

  // Dynamic Start Date Calculation
  // Finds the earliest date among all memories to set as the "Together Since" date
  const calculatedStartDate = useMemo(() => {
    if (memories.length === 0) return DEFAULT_SETTINGS.startDate;
    
    // Sort memories by date ascending to find the earliest one
    const sortedByDate = [...memories].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    return sortedByDate[0].date;
  }, [memories]);

  // Open Modal for Creating
  const openCreateModal = () => {
    setEditingMemory(undefined);
    setIsModalOpen(true);
  };

  // Open Modal for Editing
  const openEditModal = (id: string) => {
    const memoryToEdit = memories.find(m => m.id === id);
    if (memoryToEdit) {
      setEditingMemory(memoryToEdit);
      setIsModalOpen(true);
    }
  };

  // Handle Save (Create or Update)
  const handleSaveMemory = (memoryData: Omit<Memory, 'id'>) => {
    if (editingMemory) {
      // Update existing
      setMemories(prev => prev.map(m => 
        m.id === editingMemory.id ? { ...memoryData, id: editingMemory.id } : m
      ));
    } else {
      // Create new
      const newMemory: Memory = {
        ...memoryData,
        id: generateId(),
      };
      setMemories(prev => [newMemory, ...prev]);
    }
    setIsModalOpen(false);
    setEditingMemory(undefined);
  };

  const requestDeleteMemory = (id: string) => {
    setDeleteId(id);
  };

  const confirmDeleteMemory = () => {
    if (deleteId) {
      setMemories(prev => prev.filter(m => m.id !== deleteId));
      setDeleteId(null);
    }
  };

  // Sort memories by date descending for display
  const sortedMemories = useMemo(() => {
    return [...memories].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [memories]);

  return (
    <div className="min-h-screen bg-rose-50/50 font-sans text-slate-800">
      
      {/* Hero Section with Dynamic Start Date */}
      <Hero 
        startDate={calculatedStartDate} 
        partnerName={DEFAULT_SETTINGS.partnerName} 
      />

      {/* Main Timeline */}
      <main className="max-w-5xl mx-auto px-4 pb-32 relative">
        
        {/* Timeline Vertical Line (Desktop) */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-rose-200 -translate-x-1/2 hidden md:block" />

        <div className="pt-8">
          {sortedMemories.map((memory, index) => {
            const dateObj = new Date(memory.date);
            const year = dateObj.getFullYear();
            
            // Logic to show year separator
            const prevDateObj = index > 0 ? new Date(sortedMemories[index - 1].date) : null;
            const prevYear = prevDateObj ? prevDateObj.getFullYear() : null;
            const showYear = index === 0 || year !== prevYear;

            return (
              <React.Fragment key={memory.id}>
                {showYear && <YearSeparator year={year.toString()} />}
                <MemoryCard 
                  memory={memory} 
                  onDelete={requestDeleteMemory}
                  onEdit={openEditModal}
                  index={index}
                />
              </React.Fragment>
            );
          })}

          {sortedMemories.length === 0 && (
            <div className="text-center py-20 bg-white/50 rounded-3xl border border-dashed border-rose-200 mt-16">
              <p className="text-slate-500 text-lg font-serif">Our book of memories is waiting to be written...</p>
              <button 
                onClick={openCreateModal}
                className="mt-4 text-rose-500 font-medium hover:underline"
              >
                Add the first page
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Floating Action Button */}
      <button 
        onClick={openCreateModal}
        className="fixed bottom-8 right-8 md:bottom-12 md:right-12 z-40 bg-rose-600 hover:bg-rose-700 text-white w-14 h-14 md:w-16 md:h-16 rounded-full shadow-lg shadow-rose-300 flex items-center justify-center transition-transform hover:scale-110 active:scale-95 group"
        aria-label="Add Memory"
      >
        <Plus className="w-8 h-8 group-hover:rotate-90 transition-transform" />
      </button>

      {/* Add/Edit Memory Modal */}
      <AddMemoryModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setEditingMemory(undefined);
        }} 
        onSave={handleSaveMemory} 
        initialData={editingMemory}
      />

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal 
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDeleteMemory}
      />

      {/* Footer */}
      <footer className="py-8 text-center text-slate-400 text-sm bg-white/30 backdrop-blur-sm border-t border-rose-100">
        <p>Built with ❤️ for Us.</p>
      </footer>
    </div>
  );
};

export default App;