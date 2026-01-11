import React from 'react';
import { Dive } from '../types';
import { MapPin, Calendar, Clock, ArrowDown } from 'lucide-react';

interface DiveCardProps {
  dive: Dive;
  onClick: (dive: Dive) => void;
}

const DiveCard: React.FC<DiveCardProps> = ({ dive, onClick }) => {
  return (
    <div 
      onClick={() => onClick(dive)}
      className="glass rounded-2xl p-4 mb-4 active:scale-[0.98] transition-transform duration-200 cursor-pointer border border-cyan-800/50 hover:bg-white/10"
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center space-x-2">
          <span className="bg-cyan-500/20 text-cyan-300 text-xs font-bold px-2 py-1 rounded-full">
            #{dive.diveNumber}
          </span>
          <h3 className="text-lg font-semibold text-white truncate">{dive.site}</h3>
        </div>
        <span className="text-cyan-200/60 text-xs flex items-center">
          <Calendar size={12} className="mr-1" />
          {dive.date}
        </span>
      </div>

      <div className="flex items-center text-cyan-200/80 text-sm mb-3">
        <MapPin size={14} className="mr-1" />
        <span className="truncate">{dive.location}</span>
      </div>

      <div className="grid grid-cols-3 gap-2 mt-2">
        <div className="bg-cyan-950/40 rounded-lg p-2 flex flex-col items-center justify-center">
          <div className="flex items-center text-cyan-400 text-xs mb-1">
            <ArrowDown size={12} className="mr-1" />
            Depth
          </div>
          <span className="font-mono text-white font-medium">{dive.maxDepth}m</span>
        </div>
        <div className="bg-cyan-950/40 rounded-lg p-2 flex flex-col items-center justify-center">
          <div className="flex items-center text-cyan-400 text-xs mb-1">
            <Clock size={12} className="mr-1" />
            Time
          </div>
          <span className="font-mono text-white font-medium">{dive.duration}'</span>
        </div>
        <div className="bg-cyan-950/40 rounded-lg p-2 flex flex-col items-center justify-center">
          <div className="text-cyan-400 text-xs mb-1">
            Rating
          </div>
          <span className="text-yellow-400 text-xs">
            {'★'.repeat(dive.rating)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default DiveCard;
