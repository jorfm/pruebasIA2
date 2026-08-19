import React, { useRef } from 'react';
import { 
  Lock, 
  RefreshCw, 
  Upload, 
  Sparkles, 
  ShieldCheck, 
  Eye, 
  Download,
  AlertCircle
} from 'lucide-react';
import { BrandCampaign } from '../types';
import { downloadSingleImage } from '../utils/exportUtils';

interface AnchorPreviewCardProps {
  campaign: BrandCampaign;
  isGeneratingAnchor: boolean;
  onGenerateAnchor: () => void;
  onUploadAnchor: (base64Image: string) => void;
  onViewFullscreen: (imageUrl: string, title: string) => void;
}

export const AnchorPreviewCard: React.FC<AnchorPreviewCardProps> = ({
  campaign,
  isGeneratingAnchor,
  onGenerateAnchor,
  onUploadAnchor,
  onViewFullscreen,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { anchorImage, profile } = campaign;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (PNG, JPG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        onUploadAnchor(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-4 sm:p-5 shadow-xl shadow-black/40 relative overflow-hidden">
      {/* Background ambient glow */}
      <div 
        className="absolute -right-16 -bottom-16 w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ backgroundColor: profile.colorPalette.accent || '#F59E0B' }}
      />

      {/* Header bar */}
      <div className="flex items-center justify-between gap-2 mb-3.5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-stone-100 flex items-center gap-1.5 font-display">
              Canonical Studio Anchor
              <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                Ground Truth
              </span>
            </h3>
            <p className="text-xs text-stone-400">
              Conditioning reference image for 100% product consistency
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          <button
            id="btn-upload-anchor-custom"
            onClick={() => fileInputRef.current?.click()}
            className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs inline-flex items-center gap-1 transition-colors"
            title="Upload custom product photo as anchor reference"
          >
            <Upload className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Upload</span>
          </button>
        </div>
      </div>

      {/* Anchor Image Stage */}
      <div className="relative aspect-square rounded-xl bg-stone-950/80 border border-stone-800/80 overflow-hidden flex items-center justify-center group shadow-inner">
        {anchorImage ? (
          <>
            <img
              src={anchorImage}
              alt={`${profile.productName} Canonical Studio Anchor`}
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain p-2 transition-transform duration-500 group-hover:scale-105"
            />

            {/* Hover Overlay Controls */}
            <div className="absolute inset-0 bg-stone-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-xs p-4">
              <button
                id="btn-view-anchor-fullscreen"
                onClick={() => onViewFullscreen(anchorImage, `${profile.productName} - Canonical Anchor Studio Shot`)}
                className="p-2.5 rounded-xl bg-stone-800/90 hover:bg-stone-700 text-stone-100 text-xs font-medium flex items-center gap-1.5 shadow-lg border border-stone-700"
              >
                <Eye className="w-4 h-4 text-amber-400" />
                <span>Inspect</span>
              </button>
              <button
                id="btn-download-anchor-image"
                onClick={() => downloadSingleImage(anchorImage, `${profile.productName}_Anchor_Studio_Shot`)}
                className="p-2.5 rounded-xl bg-stone-800/90 hover:bg-stone-700 text-stone-100 text-xs font-medium flex items-center gap-1.5 shadow-lg border border-stone-700"
              >
                <Download className="w-4 h-4 text-stone-300" />
                <span>Save</span>
              </button>
              <button
                id="btn-regen-anchor-overlay"
                onClick={onGenerateAnchor}
                disabled={isGeneratingAnchor}
                className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold flex items-center gap-1.5 shadow-lg"
              >
                <RefreshCw className={`w-4 h-4 ${isGeneratingAnchor ? 'animate-spin' : ''}`} />
                <span>Reroll</span>
              </button>
            </div>

            {/* Consistency Badge */}
            <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
              <span className="px-2 py-0.8 rounded-md bg-stone-950/80 backdrop-blur-md border border-stone-800 text-[11px] font-medium text-amber-300 flex items-center gap-1 shadow-md">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Product Shape & Color Locked
              </span>
            </div>
          </>
        ) : (
          <div className="text-center p-6 flex flex-col items-center justify-center h-full">
            {isGeneratingAnchor ? (
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-full border-2 border-amber-500/20 border-t-amber-400 animate-spin flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-stone-200">
                    Generating Studio Anchor Shot...
                  </p>
                  <p className="text-[11px] text-stone-400 mt-0.5">
                    Using Nano-Banana model (Inanimate 1:1 commercial lighting)
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 max-w-xs">
                <div className="w-12 h-12 rounded-2xl bg-stone-900 border border-stone-800 flex items-center justify-center text-stone-500">
                  <Sparkles className="w-6 h-6 text-amber-400/60" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-stone-200">
                    No Anchor Shot Yet
                  </h4>
                  <p className="text-[11px] text-stone-400 mt-1 leading-relaxed">
                    Generate the canonical 1:1 studio photo first, or upload your own product image to anchor all medium variations.
                  </p>
                </div>
                <button
                  id="btn-generate-anchor-primary"
                  onClick={onGenerateAnchor}
                  disabled={!profile.productName}
                  className="mt-1 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 text-xs font-bold inline-flex items-center gap-2 shadow-lg shadow-amber-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Generate Anchor Shot</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Visual Identity Spec Chips */}
      {profile.productName && (
        <div className="mt-4 pt-3.5 border-t border-stone-800/80 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-stone-400">Locked Materials:</span>
            <span className="text-stone-200 font-medium truncate max-w-[200px] text-right" title={profile.materialsAndFinish}>
              {profile.materialsAndFinish || 'Premium custom finish'}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-stone-400">Color Palette:</span>
            <div className="flex items-center gap-1.5">
              {Object.entries(profile.colorPalette).map(([key, hex]) => (
                <div
                  key={key}
                  className="w-4 h-4 rounded-full border border-stone-700/80 shadow-xs"
                  style={{ backgroundColor: hex }}
                  title={`${key}: ${hex}`}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-emerald-400/90 bg-emerald-500/5 px-2 py-1 rounded-lg border border-emerald-500/10">
            <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
            <span>Strictly Inanimate: 0% Humans / 100% Product Focus</span>
          </div>
        </div>
      )}
    </div>
  );
};
