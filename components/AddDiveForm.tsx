import React, { useState } from 'react';
import { Dive } from '../types';
import { ArrowLeft, Save, Waves } from 'lucide-react';

interface AddDiveFormProps {
  lastDiveNumber: number;
  onSave: (dive: Dive) => void;
  onCancel: () => void;
}

const AddDiveForm: React.FC<AddDiveFormProps> = ({ lastDiveNumber, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Partial<Dive>>({
    diveNumber: lastDiveNumber + 1,
    date: new Date().toISOString().split('T')[0],
    rating: 3,
    duration: 45,
    maxDepth: 10,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.site || !formData.location || !formData.date) {
      alert("Please fill in the required fields (Site, Location, Date)");
      return;
    }
    
    // Construct new dive
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

  return (
    <div className="pb-24 animate-fade-in">
      {/* Header with Dive Number */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
            <button onClick={onCancel} className="p-2 -ml-2 text-cyan-300 hover:text-white transition-colors">
            <ArrowLeft />
            </button>
            <h2 className="text-xl font-bold ml-2 text-white">Log Dive</h2>
        </div>
        
        <div className="flex flex-col items-end">
            <span className="text-[10px] text-cyan-400 uppercase font-bold tracking-wider mb-1">Dive #</span>
            <span className="text-2xl font-bold text-white bg-white/5 px-4 py-1 rounded-xl border border-white/10 font-mono shadow-sm">
                {formData.diveNumber}
            </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Core Info */}
        <div className="space-y-4">
          <h3 className="text-cyan-400 text-sm font-semibold uppercase tracking-wider flex items-center">
            <Waves size={14} className="mr-2" /> Basic Info
          </h3>
          
          <div>
              <label className="block text-xs text-cyan-200/70 mb-1">Date</label>
              <input 
                type="date" 
                name="date" 
                value={formData.date}
                onChange={handleChange}
                className="w-full bg-cyan-950/50 border border-cyan-800 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
              />
          </div>

          <div>
            <label className="block text-xs text-cyan-200/70 mb-1">Location</label>
            <input 
              type="text" 
              name="location" 
              placeholder="e.g. Koh Tao, Thailand"
              value={formData.location || ''}
              onChange={handleChange}
              className="w-full bg-cyan-950/50 border border-cyan-800 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs text-cyan-200/70 mb-1">Dive Site</label>
            <input 
              type="text" 
              name="site" 
              placeholder="e.g. Chumphon Pinnacle"
              value={formData.site || ''}
              onChange={handleChange}
              className="w-full bg-cyan-950/50 border border-cyan-800 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>
        </div>

        {/* Technical Data */}
        <div className="space-y-4 pt-4 border-t border-cyan-800/30">
          <h3 className="text-cyan-400 text-sm font-semibold uppercase tracking-wider">Dive Stats</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-cyan-200/70 mb-1">Max Depth (m)</label>
              <input 
                type="number" 
                step="0.1"
                name="maxDepth" 
                value={formData.maxDepth}
                onChange={handleChange}
                className="w-full bg-cyan-950/50 border border-cyan-800 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-500 font-mono transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-cyan-200/70 mb-1">Duration (min)</label>
              <input 
                type="number" 
                name="duration" 
                value={formData.duration}
                onChange={handleChange}
                className="w-full bg-cyan-950/50 border border-cyan-800 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-500 font-mono transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Experience */}
        <div className="space-y-4 pt-4 border-t border-cyan-800/30">
          <h3 className="text-cyan-400 text-sm font-semibold uppercase tracking-wider">Experience</h3>
          
          <div>
            <label className="block text-xs text-cyan-200/70 mb-1">Notes & Sightings</label>
            <textarea 
              name="notes" 
              rows={4}
              placeholder="What did you see? How did you feel?"
              value={formData.notes || ''}
              onChange={handleChange}
              className="w-full bg-cyan-950/50 border border-cyan-800 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs text-cyan-200/70 mb-2">Rating</label>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                  className={`p-2 rounded-full transition-colors ${
                    (formData.rating || 0) >= star ? 'bg-yellow-500/20 text-yellow-400' : 'bg-cyan-900/30 text-cyan-700'
                  }`}
                >
                  <span className="text-xl">★</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <button 
          type="submit" 
          className="w-full bg-cyan-500 hover:bg-cyan-400 text-cyan-950 font-bold py-4 rounded-xl shadow-lg shadow-cyan-900/50 transition-all active:scale-[0.98] flex items-center justify-center space-x-2 mt-8"
        >
          <Save size={20} />
          <span>Save to Log</span>
        </button>
      </form>
    </div>
  );
};

export default AddDiveForm;
