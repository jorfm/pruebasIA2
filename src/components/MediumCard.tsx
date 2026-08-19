import React, { useState } from 'react';
import { 
  RefreshCw, 
  Eye, 
  Download, 
  Sparkles, 
  AlertCircle, 
  ExternalLink,
  Layers,
  Edit3,
  Sliders,
  CheckCircle2,
  Copy,
  Check
} from 'lucide-react';
import { MediumDefinition, MediumShot } from '../types';
import { downloadSingleImage } from '../utils/exportUtils';

interface MediumCardProps {
  definition: MediumDefinition;
  shot?: MediumShot;
  anchorImage?: string;
  isGenerating: boolean;
  onGenerate: (mediumId: string, customPrompt?: string) => void;
  onInspect: (mediumId: string) => void;
}

export const MediumCard: React.FC<MediumCardProps> = ({
  definition,
  shot,
  anchorImage,
  isGenerating,
  onGenerate,
  onInspect,
}) => {
  const [copied, setCopied] = useState(false);
  const [showPromptEdit, setShowPromptEdit] = useState(false);
  const [customPromptInput, setCustomPromptInput] = useState(shot?.promptUsed || definition.suggestedContext);

  const status = isGenerating ? 'generating' : (shot?.status || 'idle');
  const imageUrl = shot?.imageUrl;

  const handleCopyPrompt = () => {
    if (shot?.promptUsed) {
      navigator.clipboard.writeText(shot.promptUsed);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowPromptEdit(false);
    onGenerate(definition.id, customPromptInput);
  };

  // Determine aspect ratio class for framing
  const getAspectRatioClasses = () => {
    switch (definition.defaultAspectRatio) {
      case '16:9': return 'aspect-[16/9]';
      case '3:4': return 'aspect-[3/4]';
      case '4:3': return 'aspect-[4/3]';
      case '9:16': return 'aspect-[9/16]';
      case '1:1': 
      default: return 'aspect-square';
    }
  };

  return (
    <div className="bg-stone-900/90 border border-stone-800/90 hover:border-stone-700/80 rounded-2xl p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 shadow-lg shadow-black/30 group">
      {/* Card Header */}
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-stone-100 font-display">
                {definition.name}
              </h4>
            </div>
            <p className="text-xs text-stone-400 mt-0.5 line-clamp-1">
              {definition.description}
            </p>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-stone-800 text-stone-300 border border-stone-700">
              {definition.defaultAspectRatio}
            </span>
          </div>
        </div>

        {/* Framing & Image Container */}
        <div className={`relative ${getAspectRatioClasses()} rounded-xl bg-stone-950 border border-stone-800 overflow-hidden flex items-center justify-center my-3 group/img shadow-inner`}>
          {imageUrl ? (
            <>
              {/* Product Image */}
              <img
                src={imageUrl}
                alt={definition.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105"
              />

              {/* Medium-specific realistic mockup decor */}
              {definition.id === 'billboard' && (
                <div className="absolute top-1.5 inset-x-3 flex justify-between pointer-events-none opacity-40">
                  <div className="w-4 h-1 rounded-full bg-amber-200/80 shadow-xs shadow-amber-300" />
                  <div className="w-4 h-1 rounded-full bg-amber-200/80 shadow-xs shadow-amber-300" />
                  <div className="w-4 h-1 rounded-full bg-amber-200/80 shadow-xs shadow-amber-300" />
                </div>
              )}

              {definition.id === 'newspaper' && (
                <div className="absolute top-0 inset-x-0 h-4 bg-stone-900/60 backdrop-blur-xs border-b border-stone-700/40 px-2 flex items-center justify-between text-[8px] text-stone-400 font-serif pointer-events-none">
                  <span>THE DAILY CHRONICLE</span>
                  <span>SPECIAL COMMERCIAL FEATURE</span>
                </div>
              )}

              {definition.id === 'social_post' && (
                <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-stone-950/70 backdrop-blur-md text-[10px] text-stone-300 pointer-events-none border border-stone-800">
                  <div className="w-2 h-2 rounded-full bg-amber-500" />
                  <span className="font-semibold">Sponsored</span>
                </div>
              )}

              {/* Hover Actions Overlay */}
              <div className="absolute inset-0 bg-stone-950/75 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-xs p-4">
                <button
                  id={`btn-inspect-${definition.id}`}
                  onClick={() => onInspect(definition.id)}
                  className="p-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-100 text-xs font-semibold flex items-center gap-1.5 shadow-lg border border-stone-700 transition-colors"
                >
                  <Eye className="w-4 h-4 text-amber-400" />
                  <span>Inspect</span>
                </button>
                <button
                  id={`btn-download-${definition.id}`}
                  onClick={() => downloadSingleImage(imageUrl, `Brand_${definition.id}`)}
                  className="p-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-100 text-xs font-semibold flex items-center gap-1.5 shadow-lg border border-stone-700 transition-colors"
                  title="Download full PNG"
                >
                  <Download className="w-4 h-4 text-stone-300" />
                </button>
                <button
                  id={`btn-reroll-${definition.id}`}
                  onClick={() => onGenerate(definition.id)}
                  disabled={isGenerating}
                  className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold flex items-center gap-1.5 shadow-lg transition-colors"
                  title="Regenerate this medium"
                >
                  <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
                </button>
              </div>

              {/* Completed badge */}
              <div className="absolute bottom-2 right-2 pointer-events-none">
                <span className="px-2 py-0.5 rounded-md bg-stone-950/80 backdrop-blur-md border border-stone-800 text-[10px] text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Nano-Banana Shot
                </span>
              </div>
            </>
          ) : (
            <div className="text-center p-4 flex flex-col items-center justify-center h-full">
              {status === 'generating' ? (
                <div className="flex flex-col items-center gap-2.5">
                  <div className="w-10 h-10 rounded-full border-2 border-amber-500/20 border-t-amber-400 animate-spin flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                  </div>
                  <p className="text-xs font-medium text-stone-300">
                    Imagining Medium Shot...
                  </p>
                  <p className="text-[10px] text-stone-500">
                    Preserving Anchor Identity & Zero Humans
                  </p>
                </div>
              ) : status === 'failed' ? (
                <div className="flex flex-col items-center gap-2 max-w-[200px]">
                  <AlertCircle className="w-6 h-6 text-rose-400" />
                  <p className="text-xs font-medium text-rose-300">
                    Generation Failed
                  </p>
                  <p className="text-[10px] text-stone-400">
                    {shot?.error || 'Error calling model. Please retry.'}
                  </p>
                  <button
                    onClick={() => onGenerate(definition.id)}
                    className="mt-1 px-3 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium"
                  >
                    Retry
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 max-w-[220px]">
                  <div className="w-10 h-10 rounded-xl bg-stone-900 border border-stone-800 flex items-center justify-center text-stone-500">
                    <Layers className="w-5 h-5 text-amber-400/50" />
                  </div>
                  <p className="text-xs font-medium text-stone-300">
                    Ready to Generate
                  </p>
                  <p className="text-[10px] text-stone-500">
                    {definition.suggestedContext}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="pt-2 border-t border-stone-800/80 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => setShowPromptEdit(!showPromptEdit)}
          className="text-[11px] text-stone-400 hover:text-stone-200 inline-flex items-center gap-1 transition-colors"
        >
          <Edit3 className="w-3 h-3 text-amber-400" />
          <span>{showPromptEdit ? 'Close Prompt' : 'Custom Scene'}</span>
        </button>

        <button
          id={`btn-generate-card-${definition.id}`}
          onClick={() => onGenerate(definition.id)}
          disabled={isGenerating || !anchorImage}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 transition-all ${
            imageUrl
              ? 'bg-stone-800 hover:bg-stone-700 text-stone-200'
              : 'bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-md shadow-amber-500/10'
          } disabled:opacity-40 disabled:cursor-not-allowed`}
        >
          {isGenerating ? (
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          ) : imageUrl ? (
            <RefreshCw className="w-3.5 h-3.5" />
          ) : (
            <Sparkles className="w-3.5 h-3.5" />
          )}
          <span>{imageUrl ? 'Reroll' : 'Generate Shot'}</span>
        </button>
      </div>

      {/* Custom Prompt Form Dropdown */}
      {showPromptEdit && (
        <form onSubmit={handleCustomSubmit} className="mt-3 pt-3 border-t border-stone-800 space-y-2">
          <label className="text-[11px] font-medium text-stone-300 block">
            Custom Placement Prompt for {definition.name}:
          </label>
          <textarea
            value={customPromptInput}
            onChange={(e) => setCustomPromptInput(e.target.value)}
            rows={2}
            className="w-full p-2 rounded-lg bg-stone-950 border border-stone-800 text-xs text-stone-200 focus:border-amber-500 resize-none"
            placeholder="Describe specific background, lighting, or setting..."
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowPromptEdit(false)}
              className="px-2.5 py-1 text-xs text-stone-400 hover:text-stone-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isGenerating}
              className="px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold"
            >
              Apply & Render
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
