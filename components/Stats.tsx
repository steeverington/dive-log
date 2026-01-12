import React from 'react';
import { Dive } from '../types';

interface StatsProps {
  dives: Dive[];
}

const Stats: React.FC<StatsProps> = ({ dives }) => {
  // Sort dives by date/number just in case
  const sortedDives = [...dives].sort((a, b) => a.diveNumber - b.diveNumber);

  const totalTime = sortedDives.reduce((acc, curr) => acc + curr.duration, 0);
  const maxDepth = sortedDives.length > 0 ? Math.max(...sortedDives.map(d => d.maxDepth)) : 0;
  const totalDives = sortedDives.length;

  return (
    <div className="pb-24 animate-fade-in">
       <h2 className="text-xl font-bold mb-6 text-white">Logbook Stats</h2>

       <div className="grid grid-cols-3 gap-3 mb-8">
         <div className="glass p-3 rounded-xl flex flex-col items-center justify-center text-center">
            <span className="text-2xl font-bold text-sky-300">{totalDives}</span>
            <span className="text-[10px] text-sky-200/60 uppercase tracking-wide mt-1">Total Dives</span>
         </div>
         <div className="glass p-3 rounded-xl flex flex-col items-center justify-center text-center">
            <span className="text-2xl font-bold text-sky-300">{(totalTime / 60).toFixed(1)}</span>
            <span className="text-[10px] text-sky-200/60 uppercase tracking-wide mt-1">Hours Underwater</span>
         </div>
         <div className="glass p-3 rounded-xl flex flex-col items-center justify-center text-center">
            <span className="text-2xl font-bold text-sky-300">{maxDepth}m</span>
            <span className="text-[10px] text-sky-200/60 uppercase tracking-wide mt-1">Deepest Dive</span>
         </div>
       </div>

       <div className="glass p-4 rounded-xl">
           <h3 className="text-sm font-semibold text-sky-400 mb-4">Locations</h3>
           {dives.length > 0 ? (
               <div className="space-y-3">
                   {Array.from(new Set(dives.map(d => d.location))).map((loc) => {
                       const count = dives.filter(d => d.location === loc).length;
                       return (
                           <div key={loc} className="flex justify-between items-center text-sm">
                               <span className="text-white">{loc}</span>
                               <span className="bg-sky-900/50 text-sky-300 px-2 py-1 rounded-md text-xs">{count} dives</span>
                           </div>
                       )
                   })}
               </div>
           ) : (
                <div className="text-center text-sky-200/30 text-sm italic py-4">
                    No locations explored yet
                </div>
           )}
       </div>
    </div>
  );
};

export default Stats;
