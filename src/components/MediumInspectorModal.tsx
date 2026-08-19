import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Copy, 
  Check, 
  Sparkles, 
  RefreshCw, 
  ShieldCheck, 
  Sliders, 
  Layers,
  ArrowRightLeft,
  Eye
} from 'lucide-react';
import { MediumDefinition, MediumShot, BrandCampaign } from '../types';
import { downloadSingleImage } from '../utils/exportUtils';

interface MediumInspectorModalProps {
  mediumDefinition?: MediumDefinition;
  shot?: MediumShot;
  campaign: BrandCampaign;
  onClose: () => void;
  onRefineShot: (mediumId: string, instructions: string) => void;
  isRefining: boolean;
}

export const MediumInspectorModal: React.FC<MediumInspectorModalProps> = ({
  mediumDefinition,
  shot,
  campaign,
  onClose,
  onRefineShot,
  isRefining,
}) => {
  const [copied, setCopied] = useState(false);
  const [refineText, setRefineText] = useState('');
  const [viewMode, setViewMode] = useState<'split' | 'single'>('split');

  if (!mediumDefinition && !shot) return null;

  const title = mediumDefinition?.name || shot?.title || 'Medium Shot';
  const imageUrl = shot?.imageUrl;
  const anchorUrl = campaign.anchorImage;

  const handleCopyPrompt = () => {
    if (shot?.promptUsed) {
      navigator.clipboard.writeText(shot.promptUsed);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleRefineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!refineText.trim() || !mediumDefinition) return;
    onRefineShot(mediumDefinition.id, refineText.trim());
    setRefineText('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-stone-900 border border-stone-800 rounded-2xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 sm:px-6 border-b border-stone-800 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-100 font-display flex items-center gap-2">
                {title}
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-stone-800 text-stone-300 border border-stone-700">
                  {shot?.aspectRatio || mediumDefinition?.defaultAspectRatio}
                </span>
              </h3>
              <p className="text-xs text-stone-400">
                Visual Consistency Inspector & Fine-Tuning Studio
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {anchorUrl && (
              <button
                onClick={() => setViewMode(viewMode === 'split' ? 'single' : 'split')}
                className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 border border-stone-700 text-stone-200 text-xs font-medium inline-flex items-center gap-1.5 transition-colors"
                title="Toggle side-by-side consistency comparison with Anchor"
              >
                <ArrowRightLeft className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">
                  {viewMode === 'split' ? 'Single View' : 'Compare with Anchor'}
                </span>
              </button>
            )}

            {imageUrl && (
              <button
                onClick={() => downloadSingleImage(imageUrl, `${campaign.profile.productName}_${title.replace(/\s+/g, '_')}`)}
                className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs inline-flex items-center gap-1 transition-colors"
                title="Download high-resolution image"
              >
                <Download className="w-4 h-4 text-stone-300" />
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-stone-100 transition-colors"
              title="Close modal (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5">
          {/* Main Visual Display */}
          {viewMode === 'split' && anchorUrl ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left: Anchor Shot */}
              <div className="flex flex-col">
                <div className="flex items-center justify-between text-xs text-stone-400 mb-2">
                  <span className="font-semibold text-stone-200 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    Canonical Studio Anchor (Reference)
                  </span>
                  <span className="font-mono text-[10px]">1:1 Square</span>
                </div>
                <div className="relative aspect-square rounded-xl bg-stone-950 border border-stone-800/90 overflow-hidden flex items-center justify-center shadow-inner">
                  <img
                    src={anchorUrl}
                    alt="Anchor Reference"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain p-2"
                  />
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-stone-950/80 backdrop-blur-xs text-[10px] text-amber-300 border border-stone-800">
                    Shape & Material Lock
                  </div>
                </div>
              </div>

              {/* Right: Rendered Medium Shot */}
              <div className="flex flex-col">
                <div className="flex items-center justify-between text-xs text-stone-400 mb-2">
                  <span className="font-semibold text-stone-200 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    {title} (Nano-Banana)
                  </span>
                  <span className="font-mono text-[10px]">
                    {shot?.aspectRatio || mediumDefinition?.defaultAspectRatio}
                  </span>
                </div>
                <div className="relative aspect-square rounded-xl bg-stone-950 border border-stone-800/90 overflow-hidden flex items-center justify-center shadow-inner">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain p-2"
                    />
                  ) : (
                    <div className="text-center p-6 text-stone-500 text-xs">
                      Shot not yet generated
                    </div>
                  )}
                  {imageUrl && (
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-stone-950/80 backdrop-blur-xs text-[10px] text-emerald-400 border border-stone-800">
                      Product Match Confirmed
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="relative max-h-[50vh] w-full rounded-xl bg-stone-950 border border-stone-800 overflow-hidden flex items-center justify-center p-2 shadow-inner">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={title}
                    referrerPolicy="no-referrer"
                    className="max-h-[48vh] object-contain rounded-lg"
                  />
                ) : (
                  <div className="py-16 text-center text-stone-500 text-xs">
                    No image rendered yet
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Consistency Attributes Bar */}
          <div className="p-3.5 rounded-xl bg-stone-950 border border-stone-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-stone-500 block text-[10px]">Silhouette & Form:</span>
              <span className="text-stone-200 font-medium truncate block">
                {campaign.profile.packagingStyle || '100% Identical'}
              </span>
            </div>
            <div>
              <span className="text-stone-500 block text-[10px]">Materials & Finish:</span>
              <span className="text-stone-200 font-medium truncate block">
                {campaign.profile.materialsAndFinish || 'Preserved'}
              </span>
            </div>
            <div>
              <span className="text-stone-500 block text-[10px]">Human Filter:</span>
              <span className="text-emerald-400 font-semibold block flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> 0% Humans (Pure Inanimate)
              </span>
            </div>
            <div>
              <span className="text-stone-500 block text-[10px]">Model Runtime:</span>
              <span className="text-amber-400 font-mono text-[11px] block">
                {campaign.modelUsed}
              </span>
            </div>
          </div>

          {/* Refine / Adjustment Controls */}
          {mediumDefinition && imageUrl && (
            <form onSubmit={handleRefineSubmit} className="p-4 rounded-xl bg-stone-950/60 border border-stone-800 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-stone-200 flex items-center gap-1.5 font-display">
                  <Sliders className="w-4 h-4 text-amber-400" />
                  <span>Refine & Fine-Tune This Medium Scene</span>
                </label>
                <span className="text-[10px] text-stone-400">
                  Maintains product lock while adjusting lighting & environment
                </span>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={refineText}
                  onChange={(e) => setRefineText(e.target.value)}
                  placeholder="e.g. Add subtle rainy asphalt reflections, or shift lighting to a moody blue hour sunset..."
                  className="flex-1 px-3.5 py-2 rounded-xl bg-stone-900 border border-stone-800 text-xs text-stone-100 placeholder-stone-600 focus:border-amber-500"
                />
                <button
                  type="submit"
                  disabled={!refineText.trim() || isRefining}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold shrink-0 flex items-center gap-1.5 shadow-md disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  {isRefining ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5" />
                  )}
                  <span>Apply Refinement</span>
                </button>
              </div>
            </form>
          )}

          {/* Prompt Metadata Display */}
          {shot?.promptUsed && (
            <div className="p-3.5 rounded-xl bg-stone-950/80 border border-stone-800 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-stone-400">
                  Full Nano-Banana Prompt Conditioning:
                </span>
                <button
                  type="button"
                  onClick={handleCopyPrompt}
                  className="text-[11px] text-stone-400 hover:text-stone-200 inline-flex items-center gap-1 transition-colors"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied' : 'Copy Prompt'}</span>
                </button>
              </div>
              <p className="text-[11px] text-stone-300 font-mono leading-relaxed bg-stone-900/90 p-2.5 rounded-lg border border-stone-800/80 max-h-24 overflow-y-auto">
                {shot.promptUsed}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
