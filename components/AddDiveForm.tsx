import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Dive } from '../types';
import { X, ChevronRight, Star, Eye, Anchor, MapPin, Clock, ChevronLeft } from 'lucide-react';

interface AddDiveFormProps {
  lastDiveNumber: number;
  existingDives: Dive[];
  onSave: (dive: Dive) => void;
  onCancel: () => void;
}

// --- Constants ---
const MAX_DEPTH_SCALE = 40;
const MAX_TEMP_SCALE = 40;
const SPRING_STRENGTH = 0.08;
const DAMPING = 0.82;
const WAVE_BASE_AMP = 8;
const WAVE_SPEED_BASE = 0.035;

// --- Helper: Sort by Frequency ---
const sortByFrequency = (items: string[]) => {
  const counts: Record<string, number> = {};
  for (const item of items) {
    if (!item) continue;
    counts[item] = (counts[item] || 0) + 1;
  }
  // Object.keys implicitly deduplicates
  return Object.keys(counts).sort((a, b) => {
    const diff = counts[b] - counts[a];
    // Sort by count desc, then alpha asc
    return diff !== 0 ? diff : a.localeCompare(b);
  });
};

// --- Combined Physics Background ---
const ScubaBackground = ({ step, depth, temp, active }: { step: number; depth: number; temp: number; active: boolean }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Store current props in a ref to access them in the animation loop without restarting it
  const propsRef = useRef({ step, depth, temp });

  useEffect(() => {
    propsRef.current = { step, depth, temp };
  }, [step, depth, temp]);

  const physics = useRef({
    level: 50, // starting height in pixels
    velocity: 0,
    phase: 0,
    turbulence: 0,
    color: { r: 14, g: 165, b: 233 } // Sky 500
  });

  const dimensions = useRef({ width: 0, height: 0 });

  useEffect(() => {
    if (!active) return;
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      const width = entry.contentRect.width;
      const height = entry.contentRect.height;
      
      // Prevent unnecessary canvas resets if dimensions haven't changed (e.g. mobile scroll/address bar)
      if (Math.abs(width - dimensions.current.width) < 1 && Math.abs(height - dimensions.current.height) < 1) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.scale(dpr, dpr);
      dimensions.current = { width, height };
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, [active]);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const render = () => {
      const { width, height } = dimensions.current;
      if (width === 0 || height === 0) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      // Read latest values from ref to avoid hook dependency restart
      const { step, depth, temp } = propsRef.current;
      const p = physics.current;
      
      // Target Level based on step
      // Default: 15% baseline fill
      let targetLevel = height * 0.15; 
      
      // For drag steps, map directly to value (0 at bottom, MAX at top)
      // Removing min-height clamps so water follows finger precisely to the bottom
      if (step === 2) targetLevel = (depth / MAX_DEPTH_SCALE) * height;
      if (step === 3) targetLevel = (temp / MAX_TEMP_SCALE) * height;

      // Target Color based on step
      let targetColor = { r: 14, g: 165, b: 233 }; // Step 1, 4, 5: Sky 500
      if (step === 2) {
         targetColor = { r: 3, g: 105, b: 161 }; // Step 2: Sky 700
      } else if (step === 3) {
         if (temp <= 25) targetColor = { r: 56, g: 189, b: 248 }; // Sky 400 (Cold)
         else if (temp <= 30) targetColor = { r: 251, g: 146, b: 60 }; // Orange 400 (Warm)
         else targetColor = { r: 239, g: 68, b: 68 }; // Red 500 (Hot)
      }

      // Physics interpolation
      const displacement = targetLevel - p.level;
      p.velocity += displacement * SPRING_STRENGTH;
      p.velocity *= DAMPING;
      p.level += p.velocity;
      
      p.color.r += (targetColor.r - p.color.r) * 0.05;
      p.color.g += (targetColor.g - p.color.g) * 0.05;
      p.color.b += (targetColor.b - p.color.b) * 0.05;

      p.phase += WAVE_SPEED_BASE;
      const waterSurfaceY = height - p.level;

      ctx.clearRect(0, 0, width, height);

      const drawWave = (offset: number, alpha: number, ampMult: number, yShift: number) => {
        ctx.beginPath();
        ctx.moveTo(0, height);
        const stepSize = 10;
        for (let x = 0; x <= width + stepSize; x += stepSize) {
          const y = waterSurfaceY + yShift + Math.sin(x * 0.012 + p.phase + offset) * WAVE_BASE_AMP * ampMult;
          ctx.lineTo(x, y);
        }
        ctx.lineTo(width, height);
        ctx.fillStyle = `rgba(${Math.round(p.color.r)}, ${Math.round(p.color.g)}, ${Math.round(p.color.b)}, ${alpha})`;
        ctx.fill();
      };

      // Background layers
      drawWave(0, 0.25, 0.8, 15);
      drawWave(2, 0.4, 0.6, 8);
      
      // Main Surface layer
      const grad = ctx.createLinearGradient(0, waterSurfaceY - 20, 0, height);
      grad.addColorStop(0, `rgba(${Math.round(p.color.r)}, ${Math.round(p.color.g)}, ${Math.round(p.color.b)}, 0.9)`);
      grad.addColorStop(1, `rgba(${Math.round(p.color.r * 0.5)}, ${Math.round(p.color.g * 0.5)}, ${Math.round(p.color.b * 0.5)}, 0.8)`);
      
      ctx.beginPath();
      ctx.moveTo(0, height);
      for (let x = 0; x <= width + 10; x += 10) {
        const y = waterSurfaceY + Math.sin(x * 0.015 + p.phase + 4) * WAVE_BASE_AMP;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(width, height);
      ctx.fillStyle = grad;
      ctx.fill();

      animationFrameId = requestAnimationFrame(render);
    };
    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [active]);

  return (
    <div ref={containerRef} className="absolute inset-0 z-0 bg-sky-950/40 pointer-events-none">
      {active && <canvas ref={canvasRef} className="block w-full h-full" />}
    </div>
  );
};

const AddDiveForm: React.FC<AddDiveFormProps> = ({ lastDiveNumber, existingDives, onSave, onCancel }) => {
  const [step, setStep] = useState(1);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [activeField, setActiveField] = useState<'location' | 'site' | null>(null);

  const [formData, setFormData] = useState<Partial<Dive>>({
    diveNumber: lastDiveNumber + 1,
    date: new Date().toISOString().split('T')[0],
    rating: 3,
    duration: 45,
    maxDepth: 18,
    waterTemp: 24,
    site: '',
    location: '',
    notes: '',
  });

  const stepTitles = ["Log a new dive", "Max Depth", "Water Temp", "Conditions", "Reflections"];

  // --- AutoComplete Logic ---
  const uniqueLocations = useMemo(() => {
    const locations = existingDives.map(d => d.location).filter(Boolean);
    return sortByFrequency(locations);
  }, [existingDives]);

  const relevantSites = useMemo(() => {
      const currentLoc = formData.location?.trim();
      let sites: string[] = [];
      if (currentLoc) {
          const locDives = existingDives.filter(d => d.location.toLowerCase() === currentLoc.toLowerCase());
          if (locDives.length > 0) {
              sites = locDives.map(d => d.site);
          } else {
              sites = existingDives.map(d => d.site);
          }
      } else {
          sites = existingDives.map(d => d.site);
      }
      return sortByFrequency(sites);
  }, [existingDives, formData.location]);

  const filteredLocations = uniqueLocations.filter(l => 
    !formData.location || l.toLowerCase().includes(formData.location.toLowerCase())
  );
  
  const filteredSites = relevantSites.filter(s => 
     !formData.site || s.toLowerCase().includes(formData.site.toLowerCase())
  );

  const handleNext = () => setStep(s => Math.min(s + 1, 5));
  const handlePrev = () => setStep(s => Math.max(s - 1, 1));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? undefined : Number(value)) : value
    }));
  };

  const handleSave = () => {
    if (!formData.site || !formData.location || !formData.date) {
        alert("Please fill in location, site and date.");
        setStep(1);
        return;
    }
    onSave({
      id: Date.now().toString(),
      diveNumber: formData.diveNumber!,
      date: formData.date!,
      location: formData.location!,
      site: formData.site!,
      duration: formData.duration || 0,
      maxDepth: formData.maxDepth || 0,
      waterTemp: formData.waterTemp,
      visibility: formData.visibility,
      notes: formData.notes || '',
      rating: formData.rating || 3,
    });
  };

  // --- Interaction Logic (Full Screen Drag for Depth/Temp) ---
  const handleDrag = (e: React.PointerEvent<HTMLDivElement>, type: 'depth' | 'temp') => {
    // Capture pointer to ensure tracking even if finger leaves the div
    e.currentTarget.setPointerCapture(e.pointerId);

    const clientY = e.clientY;
    const height = window.innerHeight;
    
    // Invert Y: 0 at bottom, 1 at top
    let percent = (height - clientY) / height;
    percent = Math.max(0, Math.min(1, percent));
    
    const scale = type === 'depth' ? MAX_DEPTH_SCALE : MAX_TEMP_SCALE;
    const val = Math.round(percent * scale);
    
    setFormData(prev => ({ ...prev, [type === 'depth' ? 'maxDepth' : 'waterTemp']: val }));
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#082f49] overflow-hidden">
      
      {!isInputFocused && (
        <ScubaBackground 
          step={step} 
          depth={formData.maxDepth || 0} 
          temp={formData.waterTemp || 0} 
          active={true}
        />
      )}

      {/* Header Overlay */}
      <div className="relative z-20 flex items-start justify-between px-6 py-6 pt-[calc(1.5rem+env(safe-area-inset-top))] pointer-events-none">
        <div className="flex flex-col">
          <h2 className="text-3xl font-black text-white drop-shadow-lg">{stepTitles[step - 1]}</h2>
          <span className="text-xs font-bold text-sky-200 mt-1 uppercase tracking-wider">Entry #{formData.diveNumber}</span>
        </div>
        <button onClick={onCancel} className="pointer-events-auto p-2 bg-black/20 rounded-full text-white backdrop-blur-md border border-white/10">
          <X size={24} />
        </button>
      </div>

      {/* Content Area */}
      {/* For Steps 2 and 3, we use a full-screen overlay for interaction */}
      {(step === 2 || step === 3) && (
        <div 
            className="fixed inset-0 z-10 flex flex-col items-center justify-center cursor-ns-resize touch-none"
            onPointerDown={(e) => handleDrag(e, step === 2 ? 'depth' : 'temp')}
            onPointerMove={(e) => { if (e.buttons === 1 || e.pointerType === 'touch') handleDrag(e, step === 2 ? 'depth' : 'temp'); }}
        >
             {/* Visuals only (pointer-events-none allows clicks to pass through if needed, but the parent captures all anyway) */}
             <div className="pointer-events-none flex flex-col items-center justify-center">
                 {step === 2 ? (
                    <>
                        <div className="text-9xl font-black text-white tracking-tighter drop-shadow-2xl">{formData.maxDepth}</div>
                        <div className="text-2xl text-white/60 font-bold tracking-widest">METERS</div>
                    </>
                 ) : (
                    <>
                        <div className="flex items-start justify-center">
                            <span className="text-9xl font-black text-white tracking-tighter drop-shadow-2xl">{formData.waterTemp}</span>
                            <span className="text-5xl font-bold text-white/90 mt-4 ml-1">ºC</span>
                        </div>
                    </>
                 )}
                 <div className="mt-8 text-white/30 text-[10px] uppercase font-bold animate-pulse">Drag anywhere</div>
             </div>
        </div>
      )}

      {/* For other steps, standard layout */}
      <div className="relative z-10 flex-1 flex flex-col justify-center px-6 pointer-events-none">
        <div className="w-full max-w-sm mx-auto pointer-events-auto">
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-sky-200 uppercase tracking-widest ml-1">Date</label>
                <input 
                  type="date" name="date" value={formData.date} onChange={handleChange}
                  onFocus={() => setIsInputFocused(true)} onBlur={() => setIsInputFocused(false)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-sky-400 transition-all min-w-0 appearance-none"
                />
              </div>
              <div className="space-y-1 relative">
                <label className="text-[10px] font-bold text-sky-200 uppercase tracking-widest ml-1">Location</label>
                <div className="relative">
                  <MapPin size={18} className="absolute left-4 top-4 text-sky-400" />
                  <input 
                    type="text" 
                    name="location" 
                    placeholder="e.g. Thailand" 
                    value={formData.location} 
                    onChange={handleChange}
                    onFocus={() => { setIsInputFocused(true); setActiveField('location'); }} 
                    onBlur={() => { setIsInputFocused(false); setTimeout(() => setActiveField(null), 200); }}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 pl-12 text-white placeholder:text-white/20 focus:outline-none focus:border-sky-400 min-w-0"
                    autoComplete="off"
                  />
                </div>
                {/* Location Suggestions */}
                {activeField === 'location' && filteredLocations.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-[#0c4a6e] border border-sky-500/30 rounded-xl shadow-2xl max-h-48 overflow-y-auto z-50 animate-fade-in">
                         {filteredLocations.map(loc => (
                             <div 
                                key={loc}
                                className="p-3 text-sm text-sky-100 border-b border-sky-500/10 last:border-0 hover:bg-sky-500/20 active:bg-sky-500/30 transition-colors cursor-pointer"
                                onMouseDown={(e) => { e.preventDefault(); setFormData(p => ({...p, location: loc})); setActiveField(null); }}
                             >
                                 {loc}
                             </div>
                         ))}
                    </div>
                )}
              </div>
              <div className="space-y-1 relative">
                <label className="text-[10px] font-bold text-sky-200 uppercase tracking-widest ml-1">Dive Site</label>
                <div className="relative">
                  <Anchor size={18} className="absolute left-4 top-4 text-sky-400" />
                  <input 
                    type="text" 
                    name="site" 
                    placeholder="e.g. Chumphon Pinnacle" 
                    value={formData.site} 
                    onChange={handleChange}
                    onFocus={() => { setIsInputFocused(true); setActiveField('site'); }} 
                    onBlur={() => { setIsInputFocused(false); setTimeout(() => setActiveField(null), 200); }}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 pl-12 text-white placeholder:text-white/20 focus:outline-none focus:border-sky-400 min-w-0"
                    autoComplete="off"
                  />
                </div>
                 {/* Site Suggestions */}
                 {activeField === 'site' && filteredSites.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-[#0c4a6e] border border-sky-500/30 rounded-xl shadow-2xl max-h-48 overflow-y-auto z-50 animate-fade-in">
                         {filteredSites.map(site => (
                             <div 
                                key={site}
                                className="p-3 text-sm text-sky-100 border-b border-sky-500/10 last:border-0 hover:bg-sky-500/20 active:bg-sky-500/30 transition-colors cursor-pointer"
                                onMouseDown={(e) => { e.preventDefault(); setFormData(p => ({...p, site: site})); setActiveField(null); }}
                             >
                                 {site}
                             </div>
                         ))}
                    </div>
                )}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-sky-200 uppercase tracking-widest ml-1">Duration (min)</label>
                <div className="relative">
                  <Clock size={18} className="absolute left-4 top-4 text-sky-400" />
                  <input 
                    type="number" name="duration" value={formData.duration} onChange={handleChange}
                    onFocus={() => setIsInputFocused(true)} onBlur={() => setIsInputFocused(false)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 pl-12 text-white focus:outline-none focus:border-sky-400 min-w-0 appearance-none"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-sky-200 uppercase tracking-widest ml-1">Visibility</label>
                <div className="relative">
                  <Eye size={18} className="absolute left-4 top-4 text-sky-400" />
                  <input 
                    type="text" name="visibility" placeholder="e.g. 15m" value={formData.visibility} onChange={handleChange}
                    onFocus={() => setIsInputFocused(true)} onBlur={() => setIsInputFocused(false)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 pl-12 text-white placeholder:text-white/20 focus:outline-none focus:border-sky-400 min-w-0"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center">
                 <label className="text-[10px] font-bold text-sky-200 uppercase tracking-widest">Rate this dive</label>
                 <div className="flex justify-center space-x-2 mt-2">
                   {[1, 2, 3, 4, 5].map(s => (
                     <button key={s} onClick={() => setFormData(p => ({...p, rating: s}))} className={`transition-transform active:scale-125 ${formData.rating! >= s ? 'text-yellow-400' : 'text-white/10'}`}>
                        <Star size={36} fill="currentColor" />
                     </button>
                   ))}
                 </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-sky-200 uppercase tracking-widest ml-1">Notes</label>
                <textarea 
                  name="notes" placeholder="How was it? Mention cool critters..." value={formData.notes} onChange={handleChange}
                  onFocus={() => setIsInputFocused(true)} onBlur={() => setIsInputFocused(false)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-sky-400 h-32 resize-none leading-relaxed"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Navigation Overlay */}
      <div className="relative z-20 px-6 pb-[calc(2rem+env(safe-area-inset-bottom))] bg-gradient-to-t from-[#082f49] via-[#082f49]/80 to-transparent">
        <div className="flex justify-center space-x-2 mb-6">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className={`h-1 rounded-full transition-all duration-300 ${step === i ? 'bg-sky-400 w-6' : 'bg-white/20 w-1.5'}`} />
          ))}
        </div>
        <div className="flex space-x-3">
          {step > 1 && (
            <button onClick={handlePrev} className="flex-1 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl border border-white/10 flex items-center justify-center">
              <ChevronLeft size={20} className="mr-1" /> Back
            </button>
          )}
          <button 
            onClick={step === 5 ? handleSave : handleNext} 
            className="flex-[2] py-4 bg-sky-500 hover:bg-sky-400 text-sky-950 font-black rounded-2xl shadow-xl shadow-sky-950/20 active:scale-[0.98] transition-all flex items-center justify-center"
          >
            {step === 5 ? "Log Dive" : "Next Step"} {step < 5 && <ChevronRight size={20} className="ml-1" />}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fadeIn 0.4s cubic-bezier(0.23, 1, 0.32, 1) forwards; }
      `}</style>
    </div>
  );
};

export default AddDiveForm;
