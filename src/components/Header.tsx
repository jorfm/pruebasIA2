import React from 'react';
import { 
  Sparkles, 
  Download, 
  History, 
  Plus, 
  ShieldCheck, 
  Layers,
  Cpu
} from 'lucide-react';
import { BrandCampaign } from '../types';

interface HeaderProps {
  campaign: BrandCampaign;
  onNewCampaign: () => void;
  onOpenHistory: () => void;
  onExportZip: () => void;
  onOpenSpecs: () => void;
  selectedModel: string;
  onChangeModel: (model: string) => void;
  isExporting?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  campaign,
  onNewCampaign,
  onOpenHistory,
  onExportZip,
  onOpenSpecs,
  selectedModel,
  onChangeModel,
  isExporting = false,
}) => {
  const shotsList = Object.values(campaign.shots) as { status?: string }[];
  const completedCount = shotsList.filter(s => s?.status === 'completed').length;
  const totalCount = shotsList.length;

  return (
    <header className="sticky top-0 z-30 border-b border-stone-800/80 bg-stone-950/90 backdrop-blur-md px-4 sm:px-6 lg:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 via-orange-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-500/20 ring-1 ring-amber-400/30">
            <Sparkles className="w-5 h-5 text-stone-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-stone-100 font-display">
                Brand Builder
              </h1>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                <Cpu className="w-3 h-3 text-amber-400" />
                Nano-Banana
              </span>
            </div>
            <p className="text-xs text-stone-400">
              Multi-Medium Visual Consistency Studio
            </p>
          </div>
        </div>

        {/* Center / Model & Constraints Badge */}
        <div className="flex items-center flex-wrap gap-2 text-xs">
          {/* No people guarantee badge */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-stone-900/90 border border-stone-800 text-stone-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Strict <strong className="text-stone-200">No-People</strong> Policy</span>
          </div>

          {/* Model selector toggle */}
          <div className="inline-flex items-center rounded-lg bg-stone-900 border border-stone-800 p-0.5">
            <button
              id="model-nano-banana-lite"
              onClick={() => onChangeModel('gemini-3.1-flash-lite-image')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                selectedModel === 'gemini-3.1-flash-lite-image'
                  ? 'bg-amber-500 text-stone-950 shadow-sm font-semibold'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
              title="Nano-Banana standard fast image model"
            >
              Nano-Banana Lite
            </button>
            <button
              id="model-nano-banana-plus"
              onClick={() => onChangeModel('gemini-3.1-flash-image')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                selectedModel === 'gemini-3.1-flash-image'
                  ? 'bg-amber-500 text-stone-950 shadow-sm font-semibold'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
              title="Nano-Banana 2 high-res image model"
            >
              Nano-Banana 2
            </button>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          {campaign.profile.productName && (
            <button
              id="btn-open-specs"
              onClick={onOpenSpecs}
              className="px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-300 hover:text-stone-100 text-xs font-medium inline-flex items-center gap-1.5 transition-colors"
            >
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              <span>Brand Specs</span>
            </button>
          )}

          <button
            id="btn-campaign-history"
            onClick={onOpenHistory}
            className="px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-300 hover:text-stone-100 text-xs font-medium inline-flex items-center gap-1.5 transition-colors"
          >
            <History className="w-3.5 h-3.5 text-stone-400" />
            <span className="hidden sm:inline">Saved</span>
          </button>

          <button
            id="btn-export-campaign-zip"
            onClick={onExportZip}
            disabled={completedCount === 0 || isExporting}
            className="px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-200 text-xs font-medium inline-flex items-center gap-1.5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            title="Download full campaign archive with all generated images and guidelines"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Export Kit</span>
            {completedCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500/20 text-amber-300 font-mono">
                {completedCount}/{totalCount}
              </span>
            )}
          </button>

          <button
            id="btn-new-campaign"
            onClick={onNewCampaign}
            className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 text-xs font-bold inline-flex items-center gap-1.5 shadow-md shadow-amber-500/10 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Product</span>
          </button>
        </div>
      </div>
    </header>
  );
};
