import React, { useState } from 'react';
import { 
  Sparkles, 
  Layers, 
  Plus, 
  CheckCircle2, 
  Filter, 
  RefreshCw,
  SlidersHorizontal,
  Flame
} from 'lucide-react';
import { MediumDefinition, MediumShot, AspectRatio } from '../types';
import { MEDIUM_DEFINITIONS } from '../data/presets';
import { MediumCard } from './MediumCard';

interface MediumGridProps {
  shots: Record<string, MediumShot>;
  anchorImage?: string;
  generatingMediums: Set<string>;
  onGenerateMedium: (mediumId: string, customPrompt?: string) => void;
  onGenerateAll: () => void;
  onInspectMedium: (mediumId: string) => void;
  onAddCustomMedium: (name: string, prompt: string, aspectRatio: AspectRatio) => void;
}

export const MediumGrid: React.FC<MediumGridProps> = ({
  shots,
  anchorImage,
  generatingMediums,
  onGenerateMedium,
  onGenerateAll,
  onInspectMedium,
  onAddCustomMedium,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');
  const [customAspect, setCustomAspect] = useState<AspectRatio>('16:9');

  const categories = ['All', 'Outdoor', 'Print', 'Digital', 'Retail', 'Experimental'];

  const filteredMediums = selectedCategory === 'All'
    ? MEDIUM_DEFINITIONS
    : MEDIUM_DEFINITIONS.filter(m => m.category === selectedCategory);

  const shotsList = Object.values(shots) as { status?: string }[];
  const completedCount = shotsList.filter(s => s?.status === 'completed').length;
  const isAnyGenerating = generatingMediums.size > 0;

  const handleCreateCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim() || !customPrompt.trim()) return;
    onAddCustomMedium(customName.trim(), customPrompt.trim(), customAspect);
    setCustomName('');
    setCustomPrompt('');
    setShowCustomModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Control Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-stone-900/80 border border-stone-800 backdrop-blur-md">
        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <Filter className="w-4 h-4 text-stone-400 shrink-0 mr-1" />
          {categories.map((cat) => (
            <button
              key={cat}
              id={`filter-cat-${cat.toLowerCase()}`}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-md shadow-amber-500/10'
                  : 'bg-stone-950/60 hover:bg-stone-800 text-stone-300 border border-stone-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Batch Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            id="btn-add-custom-medium"
            onClick={() => setShowCustomModal(true)}
            className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 border border-stone-700 text-stone-200 text-xs font-medium inline-flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-amber-400" />
            <span>Custom Placement</span>
          </button>

          <button
            id="btn-generate-all-mediums"
            onClick={onGenerateAll}
            disabled={!anchorImage || isAnyGenerating}
            className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 text-xs font-bold inline-flex items-center gap-1.5 shadow-lg shadow-amber-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            {isAnyGenerating ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Generating ({generatingMediums.size})...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Generate All Mediums</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Grid of Mediums */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredMediums.map((definition) => {
          const isGen = generatingMediums.has(definition.id);
          const shot = shots[definition.id];

          return (
            <MediumCard
              key={definition.id}
              definition={definition}
              shot={shot}
              anchorImage={anchorImage}
              isGenerating={isGen}
              onGenerate={onGenerateMedium}
              onInspect={onInspectMedium}
            />
          );
        })}
      </div>

      {/* Custom Placement Modal */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-base font-bold text-stone-100 font-display flex items-center gap-2 mb-1">
              <Plus className="w-5 h-5 text-amber-400" />
              Add Custom Marketing Medium
            </h3>
            <p className="text-xs text-stone-400 mb-4">
              Imagine your product in any specific placement or setting (e.g. Airport VIP lounge display, Subway train car panel, Coffee shop menu board).
            </p>

            <form onSubmit={handleCreateCustom} className="space-y-4">
              <div>
                <label className="text-xs text-stone-300 block mb-1">Medium Name</label>
                <input
                  type="text"
                  required
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="e.g. Airport Duty-Free Showcase"
                  className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-100 focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs text-stone-300 block mb-1">Aspect Ratio</label>
                <div className="grid grid-cols-5 gap-2">
                  {(['1:1', '16:9', '3:4', '4:3', '9:16'] as AspectRatio[]).map((ar) => (
                    <button
                      key={ar}
                      type="button"
                      onClick={() => setCustomAspect(ar)}
                      className={`p-2 rounded-xl text-xs font-mono font-medium border text-center transition-all ${
                        customAspect === ar
                          ? 'bg-amber-500 text-stone-950 border-amber-400 font-bold'
                          : 'bg-stone-950 text-stone-300 border-stone-800'
                      }`}
                    >
                      {ar}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs text-stone-300 block mb-1">Scene Description</label>
                <textarea
                  required
                  rows={3}
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="Describe the environment, lighting, surface props, and architectural context without any people..."
                  className="w-full p-3 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-100 focus:border-amber-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCustomModal(false)}
                  className="px-4 py-2 rounded-xl text-xs text-stone-400 hover:text-stone-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold shadow-lg shadow-amber-500/20"
                >
                  Create & Generate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
