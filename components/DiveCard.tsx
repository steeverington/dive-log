import React from 'react';
import { Dive } from '../types';
import { MapPin, Calendar, Clock, ArrowDown } from 'lucide-react';

interface DiveCardProps {
  dive: Dive;
  onClick: (dive: Dive) => void;
}

const DiveCard: React.FC<DiveCardProps> = ({ dive, onClick }) => {
  return (
    <div className="relative mb-4 rounded-3xl overflow-hidden select-none">
       <div 
        className="relative glass border-0 rounded-3xl p-5 hover:bg-white/10 transition-transform duration-300 ease-out z-10 active:scale-[0.98] cursor-pointer"
        onClick={() => onClick(dive)}
       >
        {/* Top Row: Badge & Date */}
        <div className="flex justify-between items-center mb-3 pointer-events-none">
            <span className="bg-sky-500/20 text-sky-300 text-xs font-bold px-2.5 py-1 rounded-full">
                #{dive.diveNumber}
            </span>
            <span className="text-sky-200/60 text-xs flex items-center font-medium">
                <Calendar size={12} className="mr-1.5" />
                {dive.date}
            </span>
        </div>

        {/* Middle Row: Site Name & Location */}
        <div className="mb-5 pointer-events-none">
            <h3 className="text-2xl font-bold text-white mb-1.5 leading-tight shadow-black drop-shadow-sm">
                {dive.site}
            </h3>
            <div className="flex items-center text-sky-200/80 text-sm">
                <MapPin size={14} className="mr-1.5 shrink-0 opacity-70" />
                <span className="truncate font-medium">{dive.location}</span>
            </div>
        </div>

        {/* Bottom Row: Stats */}
        <div className="grid grid-cols-3 gap-2 pointer-events-none">
            <div className="bg-sky-950/40 rounded-2xl p-2.5 flex flex-col items-center justify-center">
                <div className="flex items-center text-sky-400/80 text-[10px] uppercase tracking-wider font-bold mb-0.5">
                    <ArrowDown size={10} className="mr-1" />
                    Depth
                </div>
                <span className="font-mono text-white font-bold text-lg leading-none">{dive.maxDepth}<span className="text-sm font-normal text-sky-200/50 ml-0.5">m</span></span>
            </div>
            <div className="bg-sky-950/40 rounded-2xl p-2.5 flex flex-col items-center justify-center">
                <div className="flex items-center text-sky-400/80 text-[10px] uppercase tracking-wider font-bold mb-0.5">
                    <Clock size={10} className="mr-1" />
                    Time
                </div>
                <span className="font-mono text-white font-bold text-lg leading-none">{dive.duration}<span className="text-sm font-normal text-sky-200/50 ml-0.5">'</span></span>
            </div>
            <div className="bg-sky-950/40 rounded-2xl p-2.5 flex flex-col items-center justify-center">
                <div className="text-sky-400/80 text-[10px] uppercase tracking-wider font-bold mb-0.5">
                    Rating
                </div>
                <div className="flex space-x-[1px] pt-1">
                     {[...Array(5)].map((_, i) => (
                        <span key={i} className={`text-xs leading-none ${i < dive.rating ? 'text-yellow-400' : 'text-sky-900'}`}>★</span>
                     ))}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default DiveCard;
