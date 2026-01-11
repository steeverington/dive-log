import React from 'react';
import { Dive } from '../types';
import { X, MapPin, Clock, Calendar, Anchor, Thermometer, Eye, AlignLeft } from 'lucide-react';

interface DiveDetailsProps {
  dive: Dive;
  onClose: () => void;
}

const DiveDetails: React.FC<DiveDetailsProps> = ({ dive, onClose }) => {
  return (
    <div className="bg-[#083344] rounded-t-3xl sm:rounded-2xl overflow-hidden shadow-2xl border border-white/10 flex flex-col max-h-[85vh] w-full">
      {/* Header Image Section */}
      <div className="relative p-6 pb-8 bg-gradient-to-br from-cyan-600 to-blue-900 flex-shrink-0">
        <button 
          onClick={onClose} 
          className="absolute right-4 top-4 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full backdrop-blur-sm transition-colors z-20"
        >
          <X size={20} />
        </button>

        {/* Decorative bubbles */}
        <div className="absolute top-4 right-16 w-24 h-24 bg-white/5 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-cyan-400/10 rounded-full blur-2xl"></div>
        
        <div className="relative z-10 mt-8">
            <div className="flex items-center space-x-3 mb-3">
                <span className="px-2.5 py-1 rounded-lg bg-white/20 backdrop-blur-md text-xs font-bold text-white shadow-sm border border-white/10">
                  #{dive.diveNumber}
                </span>
            </div>
            
            <h1 className="text-2xl font-bold text-white leading-tight mb-2 pr-8">{dive.site}</h1>
            
            <div className="flex justify-between items-end">
                <div className="flex flex-col space-y-1 text-cyan-100 text-sm">
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
      <div className="p-5 overflow-y-auto no-scrollbar bg-[#083344] flex-1">
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-cyan-950/40 p-3 rounded-xl border border-cyan-800/30 flex items-center space-x-3">
                <div className="p-2 bg-blue-500/20 rounded-lg text-blue-300">
                    <Anchor size={18} />
                </div>
                <div>
                    <div className="text-[10px] text-cyan-200/60 uppercase tracking-wider">Depth</div>
                    <div className="text-white font-semibold">{dive.maxDepth}m</div>
                </div>
            </div>

            <div className="bg-cyan-950/40 p-3 rounded-xl border border-cyan-800/30 flex items-center space-x-3">
                <div className="p-2 bg-cyan-500/20 rounded-lg text-cyan-300">
                    <Clock size={18} />
                </div>
                <div>
                    <div className="text-[10px] text-cyan-200/60 uppercase tracking-wider">Duration</div>
                    <div className="text-white font-semibold">{dive.duration} min</div>
                </div>
            </div>

            <div className="bg-cyan-950/40 p-3 rounded-xl border border-cyan-800/30 flex items-center space-x-3">
                <div className="p-2 bg-orange-500/20 rounded-lg text-orange-300">
                    <Thermometer size={18} />
                </div>
                <div>
                    <div className="text-[10px] text-cyan-200/60 uppercase tracking-wider">Temp</div>
                    <div className="text-white font-semibold">{dive.waterTemp ? `${dive.waterTemp}°C` : '-'}</div>
                </div>
            </div>

            <div className="bg-cyan-950/40 p-3 rounded-xl border border-cyan-800/30 flex items-center space-x-3">
                <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-300">
                    <Eye size={18} />
                </div>
                <div>
                    <div className="text-[10px] text-cyan-200/60 uppercase tracking-wider">Vis</div>
                    <div className="text-white font-semibold">{dive.visibility || '-'}</div>
                </div>
            </div>
        </div>

        {/* Notes */}
        <div className="glass p-5 rounded-2xl bg-white/5 border border-white/5">
            <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-3 flex items-center">
                <AlignLeft size={14} className="mr-2" /> Notes
            </h3>
            <p className="text-cyan-50 leading-relaxed text-sm whitespace-pre-line opacity-90">
                {dive.notes || <span className="text-cyan-200/40 italic">No notes recorded for this dive.</span>}
            </p>
        </div>

      </div>
    </div>
  );
};

export default DiveDetails;
