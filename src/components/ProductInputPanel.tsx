import React, { useState } from 'react';
import { 
  Wand2, 
  Sparkles, 
  Layers, 
  Tag, 
  CheckCircle2, 
  Palette,
  ChevronDown,
  ChevronUp,
  Sliders
} from 'lucide-react';
import { BrandProfile } from '../types';
import { PRESET_PRODUCTS } from '../data/presets';

interface ProductInputPanelProps {
  rawInput: string;
  onChangeRawInput: (val: string) => void;
  profile: BrandProfile;
  onChangeProfile: (profile: BrandProfile) => void;
  onAnalyzeAndBuildAnchor: () => void;
  isAnalyzing: boolean;
  onSelectPreset: (presetId: string) => void;
}

export const ProductInputPanel: React.FC<ProductInputPanelProps> = ({
  rawInput,
  onChangeRawInput,
  profile,
  onChangeProfile,
  onAnalyzeAndBuildAnchor,
  isAnalyzing,
  onSelectPreset,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-4 sm:p-6 shadow-xl shadow-black/40 relative">
      {/* Top Section / Presets */}
      <div className="mb-4">
        <div className="flex items-center justify-between gap-2 mb-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-stone-400 flex items-center gap-1.5 font-display">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Product Concept & Brand Archetype</span>
          </label>
          <span className="text-[11px] text-stone-500">
            Quick Starter Presets
          </span>
        </div>

        {/* Preset Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {PRESET_PRODUCTS.map((preset) => {
            const isSelected = profile.productName === preset.name;
            return (
              <button
                key={preset.id}
                id={`preset-${preset.id}`}
                onClick={() => onSelectPreset(preset.id)}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-amber-500/10 border-amber-500/40 text-amber-200 shadow-sm'
                    : 'bg-stone-950/60 hover:bg-stone-800/80 border-stone-800/80 text-stone-300'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <div
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: preset.colorPalette.primary }}
                  />
                  <p className="text-xs font-bold truncate">
                    {preset.name}
                  </p>
                </div>
                <p className="text-[10px] text-stone-400 line-clamp-1">
                  {preset.category}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Natural Language Description Textarea */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="product-description-input" className="text-xs font-medium text-stone-300">
            Describe Your Product in Detail:
          </label>
          <span className="text-[11px] text-stone-500">
            Describe shape, textures, materials, colors & logos
          </span>
        </div>

        <textarea
          id="product-description-input"
          value={rawInput}
          onChange={(e) => onChangeRawInput(e.target.value)}
          placeholder="e.g. A luxury botanical facial serum called 'Vespera' in a frosted heavy amber glass bottle with knurled brass dropper and an embossed textured ivory label with gold foil accents..."
          rows={3}
          className="w-full rounded-xl bg-stone-950/80 border border-stone-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 p-3.5 text-xs text-stone-100 placeholder-stone-600 resize-none transition-all"
        />
      </div>

      {/* Primary Action Button */}
      <div className="mt-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-xs text-stone-400 hover:text-stone-200 inline-flex items-center gap-1 transition-colors self-start"
        >
          <Sliders className="w-3.5 h-3.5 text-amber-400" />
          <span>{showAdvanced ? 'Hide Fine Brand Controls' : 'Fine-Tune Brand Attributes'}</span>
          {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        <button
          id="btn-analyze-and-anchor"
          onClick={onAnalyzeAndBuildAnchor}
          disabled={!rawInput.trim() || isAnalyzing}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-stone-950 text-xs font-bold inline-flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all transform hover:scale-[1.01] active:scale-[0.99]"
        >
          {isAnalyzing ? (
            <>
              <div className="w-4 h-4 rounded-full border-2 border-stone-950 border-t-transparent animate-spin" />
              <span>Analyzing & Anchoring Specs...</span>
            </>
          ) : (
            <>
              <Wand2 className="w-4 h-4" />
              <span>Lock Product Identity & Studio Anchor</span>
            </>
          )}
        </button>
      </div>

      {/* Advanced Fine-Tuning Drawer */}
      {showAdvanced && (
        <div className="mt-4 pt-4 border-t border-stone-800/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 animate-in fade-in duration-300">
          <div>
            <label className="text-[11px] text-stone-400 block mb-1">Product Name</label>
            <input
              type="text"
              value={profile.productName}
              onChange={(e) => onChangeProfile({ ...profile, productName: e.target.value })}
              placeholder="Brand or Product Name"
              className="w-full px-3 py-1.5 rounded-lg bg-stone-950 border border-stone-800 text-xs text-stone-200 focus:border-amber-500"
            />
          </div>

          <div>
            <label className="text-[11px] text-stone-400 block mb-1">Product Category</label>
            <input
              type="text"
              value={profile.category}
              onChange={(e) => onChangeProfile({ ...profile, category: e.target.value })}
              placeholder="Category (e.g. Skincare, Audio)"
              className="w-full px-3 py-1.5 rounded-lg bg-stone-950 border border-stone-800 text-xs text-stone-200 focus:border-amber-500"
            />
          </div>

          <div>
            <label className="text-[11px] text-stone-400 block mb-1">Tagline / Hook</label>
            <input
              type="text"
              value={profile.tagline}
              onChange={(e) => onChangeProfile({ ...profile, tagline: e.target.value })}
              placeholder="Tagline"
              className="w-full px-3 py-1.5 rounded-lg bg-stone-950 border border-stone-800 text-xs text-stone-200 focus:border-amber-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-[11px] text-stone-400 block mb-1">Materials & Physical Finishes</label>
            <input
              type="text"
              value={profile.materialsAndFinish}
              onChange={(e) => onChangeProfile({ ...profile, materialsAndFinish: e.target.value })}
              placeholder="e.g. Anodized matte titanium, frosted amber glass, debossed leather"
              className="w-full px-3 py-1.5 rounded-lg bg-stone-950 border border-stone-800 text-xs text-stone-200 focus:border-amber-500"
            />
          </div>

          <div>
            <label className="text-[11px] text-stone-400 block mb-1">Primary Color (Hex)</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={profile.colorPalette.primary || '#B45309'}
                onChange={(e) => onChangeProfile({
                  ...profile,
                  colorPalette: { ...profile.colorPalette, primary: e.target.value }
                })}
                className="w-8 h-7 rounded border-0 bg-transparent cursor-pointer"
              />
              <input
                type="text"
                value={profile.colorPalette.primary || '#B45309'}
                onChange={(e) => onChangeProfile({
                  ...profile,
                  colorPalette: { ...profile.colorPalette, primary: e.target.value }
                })}
                className="w-full px-2 py-1 rounded bg-stone-950 border border-stone-800 text-xs text-stone-200"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
