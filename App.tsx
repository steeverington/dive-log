import React, { useState, useEffect, useMemo } from 'react';
import { Dive, ViewState } from './types';
import { INITIAL_DIVES, DATA_VERSION } from './constants';
import DiveCard from './components/DiveCard';
import AddDiveForm from './components/AddDiveForm';
import DiveDetails from './components/DiveDetails';
import Stats from './components/Stats';
import { Plus, List, PieChart, Anchor } from 'lucide-react';

const App: React.FC = () => {
  // Initialize state lazily from localStorage to avoid race conditions and ensure persistence works correctly
  const [dives, setDives] = useState<Dive[]>(() => {
    try {
      const savedVersion = localStorage.getItem('deepLogVersion');
      const savedDives = localStorage.getItem('deepLogDives');
      
      // Only load from storage if the data version matches the current version in code
      if (savedVersion === DATA_VERSION && savedDives) {
        return JSON.parse(savedDives);
      }
    } catch (e) {
      console.error("Failed to parse saved dives", e);
    }
    return INITIAL_DIVES;
  });

  const [view, setView] = useState<ViewState>('dashboard');
  const [selectedDive, setSelectedDive] = useState<Dive | null>(null);

  // Save dives to local storage whenever they change
  useEffect(() => {
    localStorage.setItem('deepLogDives', JSON.stringify(dives));
    localStorage.setItem('deepLogVersion', DATA_VERSION);
  }, [dives]);

  const handleAddDive = (newDive: Dive) => {
    setDives(prev => [...prev, newDive]);
    setView('dashboard');
  };

  const handleDeleteDive = (id: string) => {
    setDives(prev => {
      const remaining = prev.filter(d => d.id !== id);
      
      // Sort by date to ensure correct chronological re-numbering
      // If dates are the same, preserve original relative order using the previous dive number
      remaining.sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        if (dateA !== dateB) {
            return dateA - dateB;
        }
        return a.diveNumber - b.diveNumber;
      });

      // Re-assign dive numbers sequentially
      return remaining.map((dive, index) => ({
        ...dive,
        diveNumber: index + 1
      }));
    });
    setSelectedDive(null);
  };

  const handleDiveClick = (dive: Dive) => {
    setSelectedDive(dive);
    // Don't change view, we overlay
  };

  // Sort dives descending for the list
  const sortedDives = useMemo(() => {
    return [...dives].sort((a, b) => b.diveNumber - a.diveNumber);
  }, [dives]);

  return (
    <div className="min-h-screen bg-[#082f49] text-sky-50 font-sans selection:bg-sky-500/30">
        {/* Background Gradients/Glows */}
        <div className="fixed top-0 left-0 w-full h-96 bg-sky-900/20 blur-[100px] pointer-events-none z-0" />
        <div className="fixed bottom-0 right-0 w-64 h-64 bg-indigo-900/20 blur-[80px] pointer-events-none z-0" />

        {/* Content Area */}
        <main className="relative z-10 max-w-md mx-auto min-h-screen pt-12">
            
            {/* Header (Only show on dashboard) */}
            {(view === 'dashboard' || view === 'add') && (
                <div className={`flex justify-between items-end mb-6 px-4 ${view === 'add' ? 'opacity-30' : 'opacity-100'}`}>
                    <div>
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-200 to-white">
                            Dive Logbook
                        </h1>
                        <p className="text-sky-400 text-sm opacity-80">
                            {dives.length} dives
                        </p>
                    </div>
                </div>
            )}

            {/* Views */}
            {/* We keep the list rendered behind the add form for the overlay effect */}
            {(view === 'dashboard' || view === 'add') && (
                <div className={`pb-32 px-4 ${view === 'add' ? 'opacity-30 scale-95 origin-top blur-[2px]' : 'opacity-100'}`}>
                    {dives.length === 0 ? (
                        <div className="flex flex-col items-center justify-center mt-20 p-8 text-center animate-fade-in">
                            <div className="w-20 h-20 bg-sky-500/10 rounded-full flex items-center justify-center mb-4 border border-sky-500/20 shadow-[0_0_15px_rgba(14,165,233,0.1)]">
                                <Anchor size={32} className="text-sky-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">Start Your Log</h3>
                            <p className="text-sky-200/60 text-sm leading-relaxed max-w-xs">
                                Your logbook is currently empty. Tap the + button to record your first dive!
                            </p>
                        </div>
                    ) : (
                        sortedDives.map(dive => (
                            <DiveCard 
                                key={dive.id} 
                                dive={dive} 
                                onClick={handleDiveClick} 
                            />
                        ))
                    )}
                </div>
            )}

            {view === 'add' && (
                <AddDiveForm 
                    lastDiveNumber={dives.length > 0 ? Math.max(...dives.map(d => d.diveNumber)) : 0}
                    existingDives={dives}
                    onSave={handleAddDive}
                    onCancel={() => setView('dashboard')}
                />
            )}

            {view === 'stats' && (
                <div className="px-4">
                    <Stats dives={dives} />
                </div>
            )}

        </main>

        {/* Dive Details Modal Overlay */}
        {selectedDive && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Backdrop */}
                <div 
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
                    onClick={() => setSelectedDive(null)} 
                />
                
                {/* Card */}
                <div className="relative w-full max-w-md z-10 animate-pop-in">
                    <DiveDetails 
                        dive={selectedDive}
                        onClose={() => setSelectedDive(null)}
                        onDelete={handleDeleteDive}
                    />
                </div>
            </div>
        )}

        {/* Bottom Navigation Bar */}
        {(view === 'dashboard' || view === 'stats') && !selectedDive && (
            <div className="fixed bottom-0 left-0 w-full z-40">
                {/* Gradient scrim to fade out content behind the navbar area */}
                <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#082f49] via-[#082f49]/90 to-transparent pointer-events-none" />
                
                <div className="max-w-md mx-auto relative px-6 pb-8">
                    <div className="rounded-full py-2 flex items-center justify-evenly shadow-[0_8px_32px_rgba(0,0,0,0.5)] bg-[#082f49]/90 border border-sky-500/30 backdrop-blur-xl">
                        
                        <button 
                            onClick={() => setView('dashboard')}
                            className={`flex flex-col items-center justify-center h-14 w-14 transition-all duration-200 ${
                                view === 'dashboard' 
                                    ? 'text-sky-300' 
                                    : 'text-sky-400/50 hover:text-sky-300'
                            }`}
                        >
                            <List size={24} strokeWidth={view === 'dashboard' ? 2.5 : 2} />
                            <span className="text-[10px] font-bold tracking-wide mt-1">Logs</span>
                        </button>
                        
                        <button 
                            onClick={() => setView('add')}
                            className="bg-sky-400 text-sky-950 p-3.5 rounded-full active:scale-90 transition-transform"
                            aria-label="Log new dive"
                        >
                            <Plus size={28} strokeWidth={2.5} />
                        </button>

                        <button 
                            onClick={() => setView('stats')}
                            className={`flex flex-col items-center justify-center h-14 w-14 transition-all duration-200 ${
                                view === 'stats' 
                                    ? 'text-sky-300' 
                                    : 'text-sky-400/50 hover:text-sky-300'
                            }`}
                        >
                            <PieChart size={24} strokeWidth={view === 'stats' ? 2.5 : 2} />
                            <span className="text-[10px] font-bold tracking-wide mt-1">Stats</span>
                        </button>
                    </div>
                </div>
            </div>
        )}

        <style>{`
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            .animate-fade-in {
                animation: fadeIn 0.2s ease-out forwards;
            }
            @keyframes slideDown {
                from { opacity: 0; transform: translateY(-20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .animate-slide-down {
                animation: slideDown 0.4s ease-out forwards;
            }
            @keyframes slideUp {
                from { transform: translateY(100%); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            .animate-slide-up {
                animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            }
            @keyframes popIn {
                from { opacity: 0; transform: scale(0.95) translateY(10px); }
                to { opacity: 1; transform: scale(1) translateY(0); }
            }
            .animate-pop-in {
                animation: popIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            }
        `}</style>
    </div>
  );
};

export default App;
