import React, { useState } from 'react';
import { 
  X, 
  Layers, 
  Copy, 
  Check, 
  Palette, 
  ShieldCheck, 
  Tag, 
  Sparkles,
  Download
} from 'lucide-react';
import { BrandCampaign } from '../types';

interface BrandSpecModalProps {
  campaign: BrandCampaign;
  onClose: () => void;
}

export const BrandSpecModal: React.FC<BrandSpecModalProps> = ({ campaign, onClose }) => {
  const [copied, setCopied] = useState(false);
  const { profile } = campaign;

  const handleCopySpec = () => {
    const specText = JSON.stringify(campaign, null, 2);
    navigator.clipboard.writeText(specText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-stone-900 border border-stone-800 rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-stone-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-100 font-display">
                Brand Consistency Specification
              </h3>
              <p className="text-xs text-stone-400">
                Visual identity rules and parameters enforced across all mediums
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopySpec}
              className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium inline-flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy JSON'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Overview */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3.5 rounded-xl bg-stone-950 border border-stone-800">
              <span className="text-[10px] text-stone-500 block uppercase font-mono">Product Name</span>
              <p className="text-sm font-bold text-stone-100 font-display mt-0.5">{profile.productName}</p>
            </div>
            <div className="p-3.5 rounded-xl bg-stone-950 border border-stone-800">
              <span className="text-[10px] text-stone-500 block uppercase font-mono">Category</span>
              <p className="text-sm font-bold text-stone-100 font-display mt-0.5">{profile.category}</p>
            </div>
          </div>

          {/* Tagline */}
          {profile.tagline && (
            <div className="p-3.5 rounded-xl bg-stone-950 border border-stone-800">
              <span className="text-[10px] text-stone-500 block uppercase font-mono">Brand Tagline / Hook</span>
              <p className="text-xs text-amber-300 font-medium italic mt-1 font-serif-brand">"{profile.tagline}"</p>
            </div>
          )}

          {/* Color Palette */}
          <div>
            <h4 className="text-xs font-bold text-stone-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5 font-display">
              <Palette className="w-3.5 h-3.5 text-amber-400" />
              Brand Color System
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {Object.entries(profile.colorPalette).map(([role, hex]) => (
                <div key={role} className="p-3 rounded-xl bg-stone-950 border border-stone-800 flex items-center gap-3">
                  <div
                    className="w-7 h-7 rounded-lg border border-stone-700 shadow-sm shrink-0"
                    style={{ backgroundColor: hex }}
                  />
                  <div className="min-w-0">
                    <span className="text-[10px] text-stone-500 uppercase block truncate">{role}</span>
                    <span className="text-xs font-mono font-bold text-stone-200">{hex}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Materials & Packaging */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-stone-300 uppercase tracking-wider flex items-center gap-1.5 font-display">
              <Tag className="w-3.5 h-3.5 text-amber-400" />
              Physical & Material Hallmarks
            </h4>

            <div className="p-3.5 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-200 leading-relaxed">
              <span className="text-stone-500 block text-[10px] uppercase font-mono mb-1">Materials & Finishes</span>
              {profile.materialsAndFinish}
            </div>

            <div className="p-3.5 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-200 leading-relaxed">
              <span className="text-stone-500 block text-[10px] uppercase font-mono mb-1">Canonical Consistency Profile</span>
              {profile.canonicalDescription}
            </div>
          </div>

          {/* Strict Policy Notice */}
          <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-800/40 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h5 className="text-xs font-bold text-emerald-300">
                Zero Human Figure Policy Enforced
              </h5>
              <p className="text-[11px] text-stone-400 mt-1 leading-relaxed">
                All prompts and conditioning instructions strictly forbid people, human models, hands, and faces to ensure a 100% focused, pristine commercial product showcase across all billboard, newspaper, and digital marketing formats.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
