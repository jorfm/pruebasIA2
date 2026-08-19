import React from 'react';
import { 
  X, 
  History, 
  Trash2, 
  ArrowRight, 
  Sparkles, 
  Clock,
  Layers
} from 'lucide-react';
import { BrandCampaign } from '../types';

interface CampaignHistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedCampaigns: BrandCampaign[];
  currentCampaignId: string;
  onLoadCampaign: (campaign: BrandCampaign) => void;
  onDeleteCampaign: (id: string) => void;
}

export const CampaignHistoryDrawer: React.FC<CampaignHistoryDrawerProps> = ({
  isOpen,
  onClose,
  savedCampaigns,
  currentCampaignId,
  onLoadCampaign,
  onDeleteCampaign,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-end">
      <div className="bg-stone-900 border-l border-stone-800 w-full max-w-md h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold text-stone-100 font-display">
              Saved Brand Campaigns
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-stone-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* List */}
        <div className="p-4 overflow-y-auto flex-1 space-y-3">
          {savedCampaigns.length === 0 ? (
            <div className="text-center py-12 text-stone-500 text-xs">
              <History className="w-8 h-8 mx-auto mb-2 text-stone-600" />
              <p>No saved campaigns yet.</p>
              <p className="text-[11px] text-stone-600 mt-1">
                Generated brand campaigns are automatically saved locally.
              </p>
            </div>
          ) : (
            savedCampaigns.map((camp) => {
              const isCurrent = camp.id === currentCampaignId;
              const shotsList = Object.values(camp.shots) as { status?: string }[];
              const completedCount = shotsList.filter(s => s?.status === 'completed').length;
              const dateStr = new Date(camp.updatedAt || camp.createdAt).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={camp.id}
                  className={`p-3.5 rounded-xl border transition-all ${
                    isCurrent
                      ? 'bg-amber-500/10 border-amber-500/40 text-amber-200 shadow-md'
                      : 'bg-stone-950/70 hover:bg-stone-800/80 border-stone-800 text-stone-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      {camp.anchorImage ? (
                        <img
                          src={camp.anchorImage}
                          alt={camp.profile.productName}
                          referrerPolicy="no-referrer"
                          className="w-12 h-12 rounded-lg object-cover bg-stone-900 border border-stone-800"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-stone-900 border border-stone-800 flex items-center justify-center text-stone-500">
                          <Layers className="w-5 h-5 text-amber-400/50" />
                        </div>
                      )}
                      <div>
                        <h4 className="text-xs font-bold text-stone-100 font-display">
                          {camp.profile.productName || 'Untitled Brand'}
                        </h4>
                        <p className="text-[11px] text-stone-400 line-clamp-1">
                          {camp.profile.category || 'Product Concept'}
                        </p>
                        <div className="flex items-center gap-2 mt-1 text-[10px] text-stone-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {dateStr}
                          </span>
                          <span>•</span>
                          <span className="text-amber-400 font-medium">
                            {completedCount} shots rendered
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteCampaign(camp.id);
                      }}
                      className="p-1.5 rounded-lg hover:bg-rose-500/20 text-stone-500 hover:text-rose-400 transition-colors"
                      title="Delete saved campaign"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {!isCurrent && (
                    <button
                      onClick={() => {
                        onLoadCampaign(camp);
                        onClose();
                      }}
                      className="mt-3 w-full py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <span>Load Campaign</span>
                      <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
