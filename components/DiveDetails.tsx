import React, { useState } from 'react';
import { Dive } from '../types';
import { X, MapPin, Clock, Calendar, Anchor, Thermometer, Eye, AlignLeft, Trash2, AlertCircle, Users } from 'lucide-react';

interface DiveDetailsProps {
  dive: Dive;
  onClose: () => void;
  onDelete: (id: string) => void;
}

const DiveDetails: React.FC<DiveDetailsProps> = ({ dive, onClose, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  
  const handleConfirmDelete = () => {
    onDelete(dive.id);
  };

  return (
    <div className="bg-[#082f49] rounded-3xl overflow-hidden shadow-2xl border border-white/10 flex flex-col max-h-[85vh] w-full">
      {/* Header Image Section */}
      <div className="relative p-6 pb-8 bg-gradient-to-br from-sky-600 to-blue-900 flex-shrink-0">
        <button 
          onClick={onClose} 
          className="absolute right-4 top-4 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full backdrop-blur-sm transition-colors z-20"
        >
          <X size={20} />
        </button>

        {/* Decorative bubbles */}
        <div className="absolute top-4 right-16 w-24 h-24 bg-white/5 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-sky-400/10 rounded-full blur-2xl"></div>
        
        <div className="relative z-10 mt-8">
            <div className="flex items-center space-x-3 mb-3">
                <span className="px-2.5 py-1 rounded-lg bg-white/20 backdrop-blur-md text-xs font-bold text-white shadow-sm border border-white/10">
                  #{dive.diveNumber}
                </span>
            </div>
            
            <h1 className="text-2xl font-bold text-white leading-tight mb-2 pr-8">{dive.site}</h1>
            
            <div className="flex justify-between items-end">
                <div className="flex flex-col space-y-1 text-sky-100 text-sm">
                    <div className="flex items-center">
                        <MapPin size={14} className="mr-2 opacity-70" />
                        {dive.location}
                    </div>
                    <div className="flex items-center">
                        <Calendar size={14} className="mr-2 opacity-70" />
                        {dive.date}
                    </div>
                </div>

                <div className="flex space-x-0.5 bg-black/20 backdrop-blur-sm rounded-full px-2 py-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star} className={`text-sm ${star <= dive.rating ? 'text-yellow-400' : 'text-white/20'}`}>★</span>
                    ))}
                </div>
            </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="p-5 overflow-y-auto no-scrollbar bg-[#082f49] flex-1">
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-sky-900/20 p-3 rounded-xl border border-sky-800/30 flex items-center space-x-3">
                <div className="p-2 bg-blue-500/20 rounded-lg text-blue-300">
                    <Anchor size={18} />
                </div>
                <div>
                    <div className="text-[10px] text-sky-200/60 uppercase tracking-wider">Depth</div>
                    <div className="text-white font-semibold">{dive.maxDepth}m</div>
                </div>
            </div>

            <div className="bg-sky-900/20 p-3 rounded-xl border border-sky-800/30 flex items-center space-x-3">
                <div className="p-2 bg-sky-500/20 rounded-lg text-sky-300">
                    <Clock size={18} />
                </div>
                <div>
                    <div className="text-[10px] text-sky-200/60 uppercase tracking-wider">Duration</div>
                    <div className="text-white font-semibold">{dive.duration} min</div>
                </div>
            </div>

            <div className="bg-sky-900/20 p-3 rounded-xl border border-sky-800/30 flex items-center space-x-3">
                <div className="p-2 bg-orange-500/20 rounded-lg text-orange-300">
                    <Thermometer size={18} />
                </div>
                <div>
                    <div className="text-[10px] text-sky-200/60 uppercase tracking-wider">Temp</div>
                    <div className="text-white font-semibold">{dive.waterTemp ? `${dive.waterTemp}°C` : '-'}</div>
                </div>
            </div>

            <div className="bg-sky-900/20 p-3 rounded-xl border border-sky-800/30 flex items-center space-x-3">
                <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-300">
                    <Eye size={18} />
                </div>
                <div>
                    <div className="text-[10px] text-sky-200/60 uppercase tracking-wider">Vis</div>
                    <div className="text-white font-semibold">{dive.visibility || '-'}</div>
                </div>
            </div>
        </div>

        {/* Buddies */}
        {dive.buddies && (
            <div className="glass p-5 rounded-2xl bg-white/5 border border-white/5 mb-4">
                <h3 className="text-xs font-bold text-sky-400 uppercase tracking-wider mb-2 flex items-center">
                    <Users size={14} className="mr-2" /> Buddies
                </h3>
                <p className="text-sky-50 leading-relaxed text-sm opacity-90">
                    {dive.buddies}
                </p>
            </div>
        )}

        {/* Notes */}
        <div className="glass p-5 rounded-2xl bg-white/5 border border-white/5 mb-6">
            <h3 className="text-xs font-bold text-sky-400 uppercase tracking-wider mb-3 flex items-center">
                <AlignLeft size={14} className="mr-2" /> Notes
            </h3>
            <p className="text-sky-50 leading-relaxed text-sm whitespace-pre-line opacity-90">
                {dive.notes || <span className="text-sky-200/40 italic">No notes recorded for this dive.</span>}
            </p>
        </div>

        {/* Delete Action with In-place Confirmation */}
        <div className="mt-auto">
            {!isDeleting ? (
                <button 
                  onClick={() => setIsDeleting(true)}
                  className="w-full py-3.5 rounded-full border border-red-500/30 text-red-400 bg-red-500/10 hover:bg-red-500/20 active:scale-[0.98] transition-all flex items-center justify-center space-x-2 text-sm font-semibold"
                >
                  <Trash2 size={16} />
                  <span>Delete Dive Log</span>
                </button>
            ) : (
                <div className="bg-red-950/30 border border-red-500/30 rounded-3xl p-3 animate-fade-in">
                    <div className="flex items-center justify-center text-red-300 mb-3 space-x-2">
                        <AlertCircle size={16} />
                        <span className="text-sm font-medium">Are you sure?</span>
                    </div>
                    <div className="flex space-x-3">
                        <button 
                          onClick={() => setIsDeleting(false)}
                          className="flex-1 py-2.5 rounded-full border border-white/10 text-white bg-white/5 hover:bg-white/10 active:scale-[0.98] transition-all text-sm font-medium"
                        >
                          Cancel
                        </button>
                        <button 
                          onClick={handleConfirmDelete}
                          className="flex-1 py-2.5 rounded-full bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-900/50 active:scale-[0.98] transition-all text-sm font-bold"
                        >
                          Delete
                        </button>
                    </div>
                </div>
            )}
        </div>

      </div>
    </div>
  );
};

export default DiveDetails;
