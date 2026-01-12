import React, { useState, useRef, useEffect } from 'react';
import { Dive } from '../types';
import { X, ChevronRight, Star, Eye, Calendar, Anchor, MapPin, Clock } from 'lucide-react';

interface AddDiveFormProps {
  lastDiveNumber: number;
  onSave: (dive: Dive) => void;
  onCancel: () => void;
}

// --- Physics Constants ---
const MAX_DEPTH_SCALE = 40; // Max depth in meters for the visual scale
const MAX_TEMP_SCALE = 40; // Max temp in celsius
const SPRING_STRENGTH = 0.1;
const DAMPING = 0.85;
const WAVE_BASE_AMP = 8;
const WAVE_SPEED_BASE = 0.05;

// --- Helper Component: Physics Water Canvas (Depth) ---
const DepthVisualizer = ({ depth, isInteract }: { depth: number, isInteract: boolean }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Physics State (kept in ref to avoid react render cycle lag)
  const physics = useRef({
    level: depth,      // Current visual level
    velocity: 0,       // Current velocity of level change
    phase: 0,          // Wave scroll phase
    turbulence: 0,     // Extra wave height based on movement
    bubbles: [] as {x: number, y: number, r: number, s: number, off: number}[]
  });
  
  // Track logical dimensions to sync render loop with resize observer
  const dimensions = useRef({ width: 0, height: 0 });

  // Sync target without triggering render loop resets
  const targetDepth = useRef(depth);
  useEffect(() => {
    targetDepth.current = depth;
  }, [depth]);

  // Handle Resize with ResizeObserver for robustness
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      const width = entry.contentRect.width;
      const height = entry.contentRect.height;
      const dpr = window.devicePixelRatio || 1;
      
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
          ctx.scale(dpr, dpr);
      }
      
      dimensions.current = { width, height };
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let lastTime = performance.now();

    // Initialize bubbles
    for(let i=0; i<20; i++) {
       physics.current.bubbles.push({
         x: Math.random(), 
         y: Math.random(), 
         r: 1 + Math.random() * 4, 
         s: 0.2 + Math.random() * 0.8, 
         off: Math.random() * Math.PI * 2 
       });
    }

    const render = (time: number) => {
      const { width, height } = dimensions.current;
      if (width === 0 || height === 0) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }
      
      const p = physics.current;
      const targetLevel = targetDepth.current;
      
      const displacement = targetLevel - p.level;
      const acceleration = displacement * SPRING_STRENGTH;
      p.velocity += acceleration;
      p.velocity *= DAMPING;
      p.level += p.velocity;

      const kinetic = Math.abs(p.velocity);
      const targetTurbulence = kinetic * 8; 
      p.turbulence = p.turbulence * 0.9 + targetTurbulence * 0.1;
      
      p.phase += WAVE_SPEED_BASE + (kinetic * 0.02);
      const currentAmp = WAVE_BASE_AMP + Math.min(p.turbulence, 35);

      const fillRatio = Math.max(0, Math.min(1.3, p.level / MAX_DEPTH_SCALE)); 
      const waterSurfaceY = height - (fillRatio * height);

      ctx.clearRect(0, 0, width, height);

      // Bubbles
      ctx.save();
      ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
      p.bubbles.forEach(b => {
         b.y -= b.s * 0.005;
         if (b.y < -0.1) b.y = 1.1;
         const bubbleY = b.y * height;
         const bubbleX = (b.x * width) + Math.sin(time * 0.001 + b.off) * (10 + p.turbulence);
         if (bubbleY > waterSurfaceY + (currentAmp * 0.5)) {
             ctx.beginPath();
             ctx.arc(bubbleX, bubbleY, b.r, 0, Math.PI * 2);
             ctx.fill();
         }
      });
      ctx.restore();

      // Waves
      const drawWave = (offsetPhase: number, color: string, ampFactor: number, yOffset: number) => {
        ctx.beginPath();
        ctx.moveTo(0, height); 
        const step = 5; 
        for (let x = 0; x <= width + step; x += step) {
           const scaledX = x * 0.015;
           const y = waterSurfaceY + yOffset + 
                     Math.sin(scaledX + p.phase + offsetPhase) * (currentAmp * ampFactor) + 
                     Math.sin(scaledX * 2.1 + p.phase * 1.3) * (currentAmp * 0.4 * ampFactor);
           ctx.lineTo(x, y);
        }
        ctx.lineTo(width, height); 
        ctx.lineTo(0, height);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
      };

      drawWave(0, 'rgba(6, 182, 212, 0.4)', 0.8, 10); 
      drawWave(2, 'rgba(34, 211, 238, 0.6)', 0.9, 5);
      
      const gradient = ctx.createLinearGradient(0, waterSurfaceY - 50, 0, height);
      gradient.addColorStop(0, 'rgba(103, 232, 249, 0.95)');
      gradient.addColorStop(1, 'rgba(8, 51, 68, 0.9)');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.moveTo(0, height);
      const step = 4;
      for (let x = 0; x <= width + step; x += step) {
           const scaledX = x * 0.015;
           const y = waterSurfaceY + 
                     Math.sin(scaledX + p.phase + 4) * currentAmp + 
                     Math.cos(scaledX * 1.7 - p.phase) * (currentAmp * 0.4);
           ctx.lineTo(x, y);
      }
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.closePath();
      ctx.fill();

      // Highlight
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let x = 0; x <= width + step; x += step) {
           const scaledX = x * 0.015;
           const y = waterSurfaceY + 
                     Math.sin(scaledX + p.phase + 4) * currentAmp + 
                     Math.cos(scaledX * 1.7 - p.phase) * (currentAmp * 0.4);
           if (x === 0) ctx.moveTo(0, y);
           else ctx.lineTo(x, y);
      }
      ctx.stroke();

      animationFrameId = requestAnimationFrame(render);
    };
    render(lastTime);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full pointer-events-none bg-cyan-900/20">
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
};

// --- Helper Component: Physics Water Canvas (Temperature) ---
const TemperatureVisualizer = ({ temp, isInteract }: { temp: number, isInteract: boolean }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const physics = useRef({
    level: temp,
    velocity: 0,
    phase: 0,
    turbulence: 0,
    bubbles: [] as {x: number, y: number, r: number, s: number, off: number}[]
  });
  
  const dimensions = useRef({ width: 0, height: 0 });
  const targetTemp = useRef(temp);

  useEffect(() => {
    targetTemp.current = temp;
  }, [temp]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      const width = entry.contentRect.width;
      const height = entry.contentRect.height;
      const dpr = window.devicePixelRatio || 1;
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
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let lastTime = performance.now();

    for(let i=0; i<20; i++) {
       physics.current.bubbles.push({
         x: Math.random(), 
         y: Math.random(), 
         r: 1 + Math.random() * 4, 
         s: 0.2 + Math.random() * 0.8, 
         off: Math.random() * Math.PI * 2 
       });
    }

    const render = (time: number) => {
      const { width, height } = dimensions.current;
      if (width === 0 || height === 0) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }
      
      const p = physics.current;
      const targetLevel = targetTemp.current;
      
      const displacement = targetLevel - p.level;
      const acceleration = displacement * SPRING_STRENGTH;
      p.velocity += acceleration;
      p.velocity *= DAMPING;
      p.level += p.velocity;

      const kinetic = Math.abs(p.velocity);
      const targetTurbulence = kinetic * 8; 
      p.turbulence = p.turbulence * 0.9 + targetTurbulence * 0.1;
      
      p.phase += WAVE_SPEED_BASE + (kinetic * 0.02);
      const currentAmp = WAVE_BASE_AMP + Math.min(p.turbulence, 35);

      const fillRatio = Math.max(0, Math.min(1.3, p.level / MAX_TEMP_SCALE)); 
      const waterSurfaceY = height - (fillRatio * height);

      // Color Interpolation Logic
      const getThemeColor = (t: number) => {
        let r, g, b;
        if (t <= 27) {
            // Cool Range (0-27)
            // 0: (224, 242, 254) -> Sky 100
            // 27: (14, 165, 233) -> Sky 500 (Vibrant Blue, keeping 23-27 blue)
            const p = Math.max(0, t / 27);
            r = 224 + (14 - 224) * p;
            g = 242 + (165 - 242) * p;
            b = 254 + (233 - 254) * p;
        } else if (t <= 32) {
            // Transition to Warm (27-32)
            // 27: (14, 165, 233)
            // 32: (251, 146, 60) -> Orange 400
            const p = (t - 27) / 5;
            r = 14 + (251 - 14) * p;
            g = 165 + (146 - 165) * p;
            b = 233 + (60 - 233) * p;
        } else {
            // Hot (32+)
            // 32: (251, 146, 60)
            // 40: (220, 38, 38) -> Red 600
            const p = Math.min(1, (t - 32) / 8);
            r = 251 + (220 - 251) * p;
            g = 146 + (38 - 146) * p;
            b = 60 + (38 - 60) * p;
        }
        return {r, g, b};
      };

      const c = getThemeColor(p.level); 
      const colorStr = (a: number) => `rgba(${Math.round(c.r)}, ${Math.round(c.g)}, ${Math.round(c.b)}, ${a})`;

      ctx.clearRect(0, 0, width, height);

      // Bubbles
      ctx.save();
      ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
      p.bubbles.forEach(b => {
         b.y -= b.s * 0.005;
         if (b.y < -0.1) b.y = 1.1;
         const bubbleY = b.y * height;
         const bubbleX = (b.x * width) + Math.sin(time * 0.001 + b.off) * (10 + p.turbulence);
         if (bubbleY > waterSurfaceY + (currentAmp * 0.5)) {
             ctx.beginPath();
             ctx.arc(bubbleX, bubbleY, b.r, 0, Math.PI * 2);
             ctx.fill();
         }
      });
      ctx.restore();

      // Waves
      const drawWave = (offsetPhase: number, color: string, ampFactor: number, yOffset: number) => {
        ctx.beginPath();
        ctx.moveTo(0, height); 
        const step = 5; 
        for (let x = 0; x <= width + step; x += step) {
           const scaledX = x * 0.015;
           const y = waterSurfaceY + yOffset + 
                     Math.sin(scaledX + p.phase + offsetPhase) * (currentAmp * ampFactor) + 
                     Math.sin(scaledX * 2.1 + p.phase * 1.3) * (currentAmp * 0.4 * ampFactor);
           ctx.lineTo(x, y);
        }
        ctx.lineTo(width, height); 
        ctx.lineTo(0, height);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
      };

      drawWave(0, colorStr(0.4), 0.8, 10); 
      drawWave(2, colorStr(0.6), 0.9, 5);
      
      const gradient = ctx.createLinearGradient(0, waterSurfaceY - 50, 0, height);
      gradient.addColorStop(0, colorStr(0.95));
      gradient.addColorStop(1, colorStr(0.8));

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.moveTo(0, height);
      const step = 4;
      for (let x = 0; x <= width + step; x += step) {
           const scaledX = x * 0.015;
           const y = waterSurfaceY + 
                     Math.sin(scaledX + p.phase + 4) * currentAmp + 
                     Math.cos(scaledX * 1.7 - p.phase) * (currentAmp * 0.4);
           ctx.lineTo(x, y);
      }
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.closePath();
      ctx.fill();

      // Highlight
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let x = 0; x <= width + step; x += step) {
           const scaledX = x * 0.015;
           const y = waterSurfaceY + 
                     Math.sin(scaledX + p.phase + 4) * currentAmp + 
                     Math.cos(scaledX * 1.7 - p.phase) * (currentAmp * 0.4);
           if (x === 0) ctx.moveTo(0, y);
           else ctx.lineTo(x, y);
      }
      ctx.stroke();

      animationFrameId = requestAnimationFrame(render);
    };
    render(lastTime);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full pointer-events-none bg-cyan-900/20">
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
};


const AddDiveForm: React.FC<AddDiveFormProps> = ({ lastDiveNumber, onSave, onCancel }) => {
  // Steps: 1. Loc/Date, 2. Depth, 3. Temp, 4. Conditions (Duration/Vis), 5. Notes/Rating
  const [step, setStep] = useState(1);
  const totalSteps = 5;
  const stepTitles = [
    "Where & When",
    "Max Depth",
    "Water Temp",
    "Conditions",
    "Reflections"
  ];
  
  const [formData, setFormData] = useState<Partial<Dive>>({
    diveNumber: lastDiveNumber + 1,
    date: new Date().toISOString().split('T')[0],
    rating: 3,
    duration: 45,
    maxDepth: 18,
    waterTemp: 24, // Default temp
    visibility: '',
  });

  // --- Carousel Swipe State ---
  const [startX, setStartX] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // --- Interaction State ---
  const [depthActive, setDepthActive] = useState(false);
  const [tempActive, setTempActive] = useState(false);

  // --- Helpers ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? undefined : Number(value)) : value
    }));
  };

  const handleNext = (e?: React.MouseEvent | React.FormEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setStep(prev => Math.min(prev + 1, totalSteps));
  };

  const handlePrev = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  const handleSave = () => {
    if (!formData.site || !formData.location || !formData.date) {
        alert("Please fill in location, site and date.");
        setStep(1);
        return;
    }

    const newDive: Dive = {
      id: Date.now().toString(),
      diveNumber: formData.diveNumber || lastDiveNumber + 1,
      date: formData.date!,
      location: formData.location!,
      site: formData.site!,
      duration: formData.duration || 0,
      maxDepth: formData.maxDepth || 0,
      visibility: formData.visibility,
      waterTemp: formData.waterTemp,
      notes: formData.notes || '',
      rating: formData.rating || 3,
    };

    onSave(newDive);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === totalSteps) {
      handleSave();
    } else {
      handleNext();
    }
  };

  // --- Carousel Drag Logic (Horizontal) ---
  const handleDragStart = (clientX: number) => {
    setStartX(clientX);
    setIsDragging(true);
  };

  const handleDragMove = (clientX: number) => {
    if (!isDragging || startX === null) return;
    const diff = clientX - startX;
    setDragOffset(diff);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    if (Math.abs(dragOffset) > 50) {
        if (dragOffset > 0) {
            handlePrev();
        } else {
            handleNext();
        }
    }
    setDragOffset(0);
    setStartX(null);
    setIsDragging(false);
  };

  // --- Depth Card Drag Logic (Vertical) ---
  const handleDepthInteraction = (clientY: number, rect: DOMRect) => {
    const height = rect.height;
    const yFromBottom = rect.bottom - clientY;
    const clampedY = Math.max(0, Math.min(height, yFromBottom));
    const percentage = clampedY / height;
    const newDepth = Math.round(percentage * MAX_DEPTH_SCALE);
    setFormData(prev => ({ ...prev, maxDepth: newDepth }));
  };

  const onDepthStart = (e: React.MouseEvent | React.TouchEvent) => {
      e.stopPropagation(); 
      if (!('touches' in e) && e.button !== 0) return;
      setDepthActive(true);
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const target = e.currentTarget as HTMLDivElement;
      handleDepthInteraction(clientY, target.getBoundingClientRect());
  };

  const onDepthMove = (e: React.MouseEvent | React.TouchEvent) => {
      e.stopPropagation(); 
      if (!('touches' in e) && e.buttons !== 1) return;
      if (!depthActive) setDepthActive(true);
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const target = e.currentTarget as HTMLDivElement;
      handleDepthInteraction(clientY, target.getBoundingClientRect());
  };

  const onDepthEnd = (e: React.MouseEvent | React.TouchEvent) => {
      e.stopPropagation();
      setDepthActive(false);
  };

  // --- Temp Card Drag Logic (Vertical) ---
  const handleTempInteraction = (clientY: number, rect: DOMRect) => {
    const height = rect.height;
    const yFromBottom = rect.bottom - clientY;
    const clampedY = Math.max(0, Math.min(height, yFromBottom));
    const percentage = clampedY / height;
    const newTemp = Math.round(percentage * MAX_TEMP_SCALE);
    setFormData(prev => ({ ...prev, waterTemp: newTemp }));
  };

  const onTempStart = (e: React.MouseEvent | React.TouchEvent) => {
      e.stopPropagation(); 
      if (!('touches' in e) && e.button !== 0) return;
      setTempActive(true);
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const target = e.currentTarget as HTMLDivElement;
      handleTempInteraction(clientY, target.getBoundingClientRect());
  };

  const onTempMove = (e: React.MouseEvent | React.TouchEvent) => {
      e.stopPropagation(); 
      if (!('touches' in e) && e.buttons !== 1) return;
      if (!tempActive) setTempActive(true);
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const target = e.currentTarget as HTMLDivElement;
      handleTempInteraction(clientY, target.getBoundingClientRect());
  };

  const onTempEnd = (e: React.MouseEvent | React.TouchEvent) => {
      e.stopPropagation();
      setTempActive(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#083344] animate-fade-in">
      {/* 
         Structure switched to Absolute Positioning for proper full-screen layering.
         Carousel is at the bottom (z-0), overlays are on top (z-30).
      */}
      <div className="relative w-full h-full overflow-hidden">

        {/* Header - Absolute Overlay */}
        <div className="absolute top-0 left-0 w-full z-30 flex items-start justify-between px-6 py-6 pt-[calc(1.5rem+env(safe-area-inset-top))] pointer-events-none">
            <div className="flex flex-col pointer-events-auto">
                {/* Animated Title Transition */}
                <h2 key={step} className="text-3xl font-black text-white drop-shadow-lg leading-tight animate-slide-down">
                   {stepTitles[step - 1]}
                </h2>
                <span className="text-xs font-bold text-cyan-200 mt-1 uppercase tracking-wide">Entry #{formData.diveNumber}</span>
            </div>

            <button 
                onClick={onCancel} 
                className="pointer-events-auto p-2.5 bg-black/20 hover:bg-black/40 rounded-full text-white transition-colors backdrop-blur-md border border-white/10 mt-1"
            >
                <X size={24} />
            </button>
        </div>

        {/* Footer Navigation - Absolute Overlay */}
        <div className="absolute bottom-0 left-0 w-full z-30 flex flex-col items-center pb-[calc(2rem+env(safe-area-inset-bottom))] pt-12 bg-gradient-to-t from-[#083344]/90 to-transparent pointer-events-none">
            {/* Pagination Dots */}
            <div className="flex justify-center space-x-2 pb-6 pointer-events-auto">
                {[1, 2, 3, 4, 5].map(i => (
                    <button
                        key={i} 
                        onClick={() => setStep(i)}
                        className={`h-1.5 rounded-full transition-all duration-300 shadow-sm ${step === i ? 'bg-cyan-400 w-6' : 'bg-white/30 w-1.5 hover:bg-white/50'}`} 
                        aria-label={`Go to step ${i}`}
                    />
                ))}
            </div>

            {/* Next/Save Button */}
            <div className="px-6 w-full pointer-events-auto">
               {step < totalSteps ? (
                 <button
                    onClick={handleNext}
                    className="w-full py-3.5 rounded-full bg-cyan-500 text-cyan-950 font-bold hover:bg-cyan-400 shadow-lg shadow-cyan-500/20 active:scale-[0.98] transition-all flex items-center justify-center text-base"
                 >
                    Next <ChevronRight size={18} className="ml-1" />
                 </button>
               ) : (
                 <button 
                   onClick={handleSave}
                   className="w-full py-3.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold shadow-lg shadow-cyan-500/20 active:scale-[0.98] transition-all flex items-center justify-center text-base"
                 >
                   Log dive
                 </button>
               )}
            </div>
        </div>

        {/* Full Screen Carousel - Behind overlays */}
        <div 
            className={`absolute inset-0 w-full h-full touch-pan-y cursor-grab ${isDragging ? 'cursor-grabbing' : ''} z-0`}
            onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
            onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
            onTouchEnd={handleDragEnd}
            onMouseDown={(e) => handleDragStart(e.clientX)}
            onMouseMove={(e) => {
                if (isDragging) {
                    e.preventDefault(); 
                    handleDragMove(e.clientX);
                }
            }}
            onMouseUp={handleDragEnd}
            onMouseLeave={() => isDragging && handleDragEnd()}
        >
            <form onSubmit={handleSubmit} className="w-full h-full">
                <div 
                    className={`flex h-full w-full ${isDragging ? '' : 'transition-transform duration-500 cubic-bezier(0.2, 0.8, 0.2, 1)'}`}
                    style={{ 
                        transform: `translateX(calc(-1 * ${step - 1} * 100% + ${dragOffset}px))` 
                    }}
                >
                    
                    {/* STEP 1: Basic Info */}
                    <div className="min-w-full h-full flex flex-col justify-center px-8 pt-32 pb-48 select-none" onMouseDown={e => e.stopPropagation()}>
                        <div className="w-full max-w-sm mx-auto space-y-8">
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-xs font-bold text-cyan-200 mb-2 uppercase tracking-wide">Date</label>
                                    <input 
                                        type="date" 
                                        name="date" 
                                        value={formData.date}
                                        onChange={handleChange}
                                        className="w-full bg-[#083344]/50 border border-cyan-500/30 rounded-xl p-4 text-base text-white focus:outline-none focus:border-cyan-300 focus:bg-[#083344] transition-all shadow-inner"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-cyan-200 mb-2 uppercase tracking-wide">Location</label>
                                    <div className="relative">
                                        <MapPin size={18} className="absolute left-4 top-4 text-cyan-400" />
                                        <input 
                                            type="text" 
                                            name="location" 
                                            placeholder="Thailand"
                                            value={formData.location || ''}
                                            onChange={handleChange}
                                            className="w-full bg-[#083344]/50 border border-cyan-500/30 rounded-xl p-4 pl-11 text-base text-white focus:outline-none focus:border-cyan-300 focus:bg-[#083344] transition-all shadow-inner placeholder:text-cyan-600"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-cyan-200 mb-2 uppercase tracking-wide">Dive Site</label>
                                    <div className="relative">
                                        <Anchor size={18} className="absolute left-4 top-4 text-cyan-400" />
                                        <input 
                                            type="text" 
                                            name="site" 
                                            placeholder="Chumphon Pinnacle"
                                            value={formData.site || ''}
                                            onChange={handleChange}
                                            className="w-full bg-[#083344]/50 border border-cyan-500/30 rounded-xl p-4 pl-11 text-base text-white focus:outline-none focus:border-cyan-300 focus:bg-[#083344] transition-all shadow-inner placeholder:text-cyan-600"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* STEP 2: Interactive Depth Card (Full Screen) */}
                    <div 
                        className="min-w-full h-full relative select-none cursor-ns-resize overflow-hidden"
                        onTouchStart={onDepthStart}
                        onTouchMove={onDepthMove}
                        onTouchEnd={onDepthEnd}
                        onMouseDown={onDepthStart}
                        onMouseMove={onDepthMove}
                        onMouseUp={onDepthEnd}
                        onMouseLeave={onDepthEnd}
                    >
                         <DepthVisualizer depth={formData.maxDepth || 0} isInteract={depthActive} />

                         <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none pb-20">
                            <div className="flex flex-col items-center drop-shadow-lg mt-12">
                                <span className={`text-9xl font-black text-white tracking-tighter transition-transform duration-100 ${depthActive ? 'scale-110' : 'scale-100'}`}>
                                    {formData.maxDepth}
                                </span>
                                <span className="text-3xl text-white/80 font-bold mt-2 tracking-widest">METERS</span>
                            </div>

                            <div className={`mt-10 text-cyan-100/80 text-xs transition-opacity duration-300 ${depthActive ? 'opacity-0' : 'opacity-100 animate-bounce'}`}>
                                <div className="uppercase tracking-wide font-bold drop-shadow-md">Drag to adjust</div>
                            </div>
                         </div>
                    </div>

                    {/* STEP 3: Interactive Temp Card (Full Screen) */}
                    <div 
                        className="min-w-full h-full relative select-none cursor-ns-resize overflow-hidden"
                        onTouchStart={onTempStart}
                        onTouchMove={onTempMove}
                        onTouchEnd={onTempEnd}
                        onMouseDown={onTempStart}
                        onMouseMove={onTempMove}
                        onMouseUp={onTempEnd}
                        onMouseLeave={onTempEnd}
                    >
                         <TemperatureVisualizer temp={formData.waterTemp || 0} isInteract={tempActive} />

                         <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none pb-20">
                            <div className="flex flex-col items-center drop-shadow-lg mt-12">
                                <span className={`text-9xl font-black text-white tracking-tighter transition-transform duration-100 ${tempActive ? 'scale-110' : 'scale-100'}`}>
                                    {formData.waterTemp}
                                </span>
                                <span className="text-3xl text-white/80 font-bold mt-2 tracking-widest">CELSIUS</span>
                            </div>

                            <div className={`mt-10 text-cyan-100/80 text-xs transition-opacity duration-300 ${tempActive ? 'opacity-0' : 'opacity-100 animate-bounce'}`}>
                                <div className="uppercase tracking-wide font-bold drop-shadow-md">Drag to adjust</div>
                            </div>
                         </div>
                    </div>

                    {/* STEP 4: Conditions (Stats - Duration & Vis) */}
                    <div className="min-w-full h-full flex flex-col justify-center px-8 pt-32 pb-48 select-none" onMouseDown={e => e.stopPropagation()}>
                         <div className="w-full max-w-sm mx-auto space-y-8">
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-xs font-bold text-cyan-200 mb-2 uppercase tracking-wide">Duration</label>
                                    <div className="relative">
                                        <Clock size={18} className="absolute left-4 top-4 text-cyan-400" />
                                        <input 
                                            type="number" 
                                            name="duration" 
                                            value={formData.duration}
                                            onChange={handleChange}
                                            className="w-full bg-[#083344]/50 border border-cyan-500/30 rounded-xl p-4 pl-11 text-base text-white focus:outline-none focus:border-cyan-300 focus:bg-[#083344] transition-all shadow-inner placeholder:text-cyan-600"
                                        />
                                        <span className="absolute right-4 top-4 text-cyan-600 text-sm font-medium">min</span>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-cyan-200 mb-2 uppercase tracking-wide">Visibility</label>
                                    <div className="relative">
                                        <Eye size={18} className="absolute left-4 top-4 text-cyan-400" />
                                        <input 
                                            type="text" 
                                            name="visibility" 
                                            placeholder="15m"
                                            value={formData.visibility || ''}
                                            onChange={handleChange}
                                            className="w-full bg-[#083344]/50 border border-cyan-500/30 rounded-xl p-4 pl-11 text-base text-white focus:outline-none focus:border-cyan-300 focus:bg-[#083344] transition-all shadow-inner placeholder:text-cyan-600"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* STEP 5: Experience */}
                    <div className="min-w-full h-full flex flex-col justify-center px-8 pt-32 pb-48 select-none" onMouseDown={e => e.stopPropagation()}>
                        <div className="w-full max-w-sm mx-auto space-y-6 h-full flex flex-col justify-center">
                            <div className="mb-6 mt-10">
                                <label className="block text-xs font-bold text-cyan-200 mb-3 uppercase tracking-wide text-center">Rate this dive</label>
                                <div className="flex justify-between px-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                                        className={`p-2 transition-transform active:scale-125 ${
                                        (formData.rating || 0) >= star ? 'text-yellow-400 drop-shadow-[0_0_12px_rgba(250,204,21,0.5)]' : 'text-cyan-900'
                                        }`}
                                    >
                                        <Star size={36} fill={(formData.rating || 0) >= star ? "currentColor" : "currentColor"} />
                                    </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex-1 flex flex-col min-h-0">
                                <label className="block text-xs font-bold text-cyan-200 mb-3 uppercase tracking-wide">Notes</label>
                                <textarea 
                                    name="notes" 
                                    placeholder="Describe your experience..."
                                    value={formData.notes || ''}
                                    onChange={handleChange}
                                    className="w-full flex-1 bg-[#083344]/50 border border-cyan-500/30 rounded-xl p-4 text-base text-white focus:outline-none focus:border-cyan-300 focus:bg-[#083344] transition-all placeholder:text-cyan-600 resize-none leading-relaxed shadow-inner"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
        
      </div>
    </div>
  );
};

export default AddDiveForm;
