import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { ProductInputPanel } from './components/ProductInputPanel';
import { AnchorPreviewCard } from './components/AnchorPreviewCard';
import { MediumGrid } from './components/MediumGrid';
import { MediumInspectorModal } from './components/MediumInspectorModal';
import { BrandSpecModal } from './components/BrandSpecModal';
import { CampaignHistoryDrawer } from './components/CampaignHistoryDrawer';
import { 
  BrandCampaign, 
  BrandProfile, 
  MediumId, 
  MediumShot, 
  AspectRatio,
  MediumDefinition
} from './types';
import { MEDIUM_DEFINITIONS, PRESET_PRODUCTS } from './data/presets';
import { downloadCampaignZip } from './utils/exportUtils';
import { 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  Cpu, 
  Layers, 
  Info,
  AlertCircle
} from 'lucide-react';

const STORAGE_KEY = 'brand_builder_campaigns_v1';
const CURRENT_KEY = 'brand_builder_active_id';

const INITIAL_PROFILE: BrandProfile = {
  productName: 'Vespera Botanical Elixir',
  category: 'Luxury Skincare',
  tagline: 'Deep Restorative Cellular Hydration',
  keyFeatures: [
    'Frosted heavy amber glass octagonal bottle',
    'Knurled brushed brass cap dropper',
    'Textured ecru label with delicate gold foil typography'
  ],
  materialsAndFinish: 'Frosted amber glass, brushed brass, textured cotton paper label with gold stamping',
  colorPalette: {
    primary: '#B45309',
    secondary: '#D97706',
    accent: '#CA8A04',
    surface: '#FDFBF7'
  },
  packagingStyle: 'Minimalist luxury apothecary bottle with knurled metallic cap',
  typographyVibe: 'Refined high-contrast serif with geometric modern tracking',
  canonicalDescription: 'A luxury facial elixir in a frosted octagonal amber glass bottle with a knurled brass dropper cap and a minimalist ecru label.'
};

function createInitialCampaign(): BrandCampaign {
  const initialShots: Record<MediumId, MediumShot> = {} as any;
  for (const med of MEDIUM_DEFINITIONS) {
    initialShots[med.id] = {
      mediumId: med.id,
      title: med.name,
      aspectRatio: med.defaultAspectRatio,
      status: 'idle',
    };
  }

  return {
    id: `camp_${Date.now()}`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    name: 'Vespera Botanical Elixir Campaign',
    rawInput: PRESET_PRODUCTS[0].rawInput,
    profile: INITIAL_PROFILE,
    modelUsed: 'gemini-3.1-flash-lite-image',
    shots: initialShots,
  };
}

export default function App() {
  const [campaign, setCampaign] = useState<BrandCampaign>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const activeId = localStorage.getItem(CURRENT_KEY);
      if (saved) {
        const list: BrandCampaign[] = JSON.parse(saved);
        const active = list.find(c => c.id === activeId) || list[0];
        if (active) return active;
      }
    } catch (e) {
      console.error('Error loading saved campaign:', e);
    }
    return createInitialCampaign();
  });

  const [savedCampaigns, setSavedCampaigns] = useState<BrandCampaign[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error reading localStorage:', e);
    }
    return [];
  });

  const [selectedModel, setSelectedModel] = useState<string>('gemini-3.1-flash-lite-image');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isGeneratingAnchor, setIsGeneratingAnchor] = useState<boolean>(false);
  const [generatingMediums, setGeneratingMediums] = useState<Set<string>>(new Set());
  const [isRefining, setIsRefining] = useState<boolean>(false);
  const [selectedInspectorMediumId, setSelectedInspectorMediumId] = useState<string | null>(null);
  const [showBrandSpecs, setShowBrandSpecs] = useState<boolean>(false);
  const [showHistoryDrawer, setShowHistoryDrawer] = useState<boolean>(false);
  const [isExportingZip, setIsExportingZip] = useState<boolean>(false);
  const [serverNotice, setServerNotice] = useState<string | null>(null);

  // Synchronize campaign updates to localStorage
  const saveCampaignState = useCallback((updated: BrandCampaign) => {
    setCampaign(updated);
    setSavedCampaigns(prev => {
      const filtered = prev.filter(c => c.id !== updated.id);
      const nextList = [updated, ...filtered].slice(0, 15);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(nextList));
        localStorage.setItem(CURRENT_KEY, updated.id);
      } catch (e) {
        console.warn('Storage quota exceeded or error saving:', e);
      }
      return nextList;
    });
  }, []);

  // Handle selecting a preset product
  const handleSelectPreset = (presetId: string) => {
    const preset = PRESET_PRODUCTS.find(p => p.id === presetId);
    if (!preset) return;

    const initialShots: Record<MediumId, MediumShot> = {} as any;
    for (const med of MEDIUM_DEFINITIONS) {
      initialShots[med.id] = {
        mediumId: med.id,
        title: med.name,
        aspectRatio: med.defaultAspectRatio,
        status: 'idle',
      };
    }

    const newCampaign: BrandCampaign = {
      id: `camp_${Date.now()}`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      name: `${preset.name} Campaign`,
      rawInput: preset.rawInput,
      profile: {
        productName: preset.name,
        category: preset.category,
        tagline: preset.tagline,
        keyFeatures: [preset.shortDesc],
        materialsAndFinish: preset.shortDesc,
        colorPalette: preset.colorPalette,
        packagingStyle: preset.category,
        typographyVibe: 'Clean editorial modern',
        canonicalDescription: preset.rawInput,
      },
      modelUsed: selectedModel,
      shots: initialShots,
    };

    saveCampaignState(newCampaign);
  };

  // Analyze product description & lock initial studio anchor shot
  const handleAnalyzeAndBuildAnchor = async () => {
    if (!campaign.rawInput.trim()) return;

    setIsAnalyzing(true);
    setServerNotice(null);

    try {
      const res = await fetch('/api/brand/analyze-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productDescription: campaign.rawInput,
          productName: campaign.profile.productName,
          category: campaign.profile.category,
        }),
      });

      const json = await res.json();
      if (!res.ok || json.error) {
        throw new Error(json.error || 'Failed to analyze product specifications.');
      }

      const analyzed = json.data;
      const updatedProfile: BrandProfile = {
        productName: analyzed.productName || campaign.profile.productName,
        category: analyzed.category || campaign.profile.category,
        tagline: analyzed.tagline || campaign.profile.tagline,
        keyFeatures: analyzed.keyFeatures || campaign.profile.keyFeatures,
        materialsAndFinish: analyzed.materialsAndFinish || campaign.profile.materialsAndFinish,
        colorPalette: analyzed.colorPalette || campaign.profile.colorPalette,
        packagingStyle: analyzed.packagingStyle || campaign.profile.packagingStyle,
        typographyVibe: analyzed.typographyVibe || campaign.profile.typographyVibe,
        canonicalDescription: analyzed.canonicalDescription || campaign.profile.canonicalDescription,
      };

      const updatedCampaign: BrandCampaign = {
        ...campaign,
        updatedAt: Date.now(),
        name: `${updatedProfile.productName} Campaign`,
        profile: updatedProfile,
        anchorPrompt: analyzed.anchorPrompt || `Commercial studio photograph of ${updatedProfile.productName}, ${updatedProfile.materialsAndFinish}, seamless light cyclorama background, soft studio strobe, 8k advertising photography, strict no people, pure product.`,
      };

      saveCampaignState(updatedCampaign);
      setIsAnalyzing(false);

      // Automatically generate the studio anchor shot
      await generateAnchorShot(updatedCampaign, analyzed.anchorPrompt);
    } catch (error: any) {
      console.error('Error analyzing product:', error);
      setIsAnalyzing(false);
      setServerNotice(error.message || 'Error communicating with AI service.');
    }
  };

  // Generate 1:1 Canonical Anchor Studio Shot
  const generateAnchorShot = async (currentCamp: BrandCampaign, customPrompt?: string) => {
    setIsGeneratingAnchor(true);
    setServerNotice(null);

    const promptText = customPrompt || currentCamp.anchorPrompt || `Luxury commercial 1:1 studio product photography of ${currentCamp.profile.productName}: ${currentCamp.profile.canonicalDescription || currentCamp.rawInput}. Seamless neutral cyclorama stage, soft rim lighting, sharp 8k advertising detail, strict requirement: absolutely no people, no hands, no faces, inanimate product subject only.`;

    try {
      const res = await fetch('/api/brand/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptText,
          aspectRatio: '1:1',
          model: selectedModel,
          mediumId: 'anchor',
          productSpecs: `${currentCamp.profile.productName} - ${currentCamp.profile.materialsAndFinish}`,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to generate studio anchor image.');
      }

      const updated: BrandCampaign = {
        ...currentCamp,
        updatedAt: Date.now(),
        anchorImage: data.imageUrl,
        anchorPrompt: promptText,
        modelUsed: selectedModel,
      };

      saveCampaignState(updated);
    } catch (error: any) {
      console.error('Error generating anchor:', error);
      setServerNotice(error.message || 'Failed to generate anchor shot.');
    } finally {
      setIsGeneratingAnchor(false);
    }
  };

  // Upload user's custom product image as anchor
  const handleUploadAnchor = (base64Image: string) => {
    const updated: BrandCampaign = {
      ...campaign,
      updatedAt: Date.now(),
      anchorImage: base64Image,
    };
    saveCampaignState(updated);
  };

  // Generate a single medium shot with visual product consistency
  const handleGenerateMedium = async (mediumId: string, customPrompt?: string) => {
    if (!campaign.anchorImage) {
      alert('Please generate or upload the Canonical Studio Anchor shot first to maintain product consistency.');
      return;
    }

    setGeneratingMediums(prev => new Set(prev).add(mediumId));
    setServerNotice(null);

    const definition = MEDIUM_DEFINITIONS.find(m => m.id === mediumId);
    const targetAspect = definition?.defaultAspectRatio || '1:1';

    // Construct prompt
    let scenePrompt = customPrompt || definition?.suggestedContext || `Commercial marketing photograph for ${definition?.name || mediumId}`;
    scenePrompt = `${scenePrompt}. Featuring the exact product: ${campaign.profile.productName} (${campaign.profile.materialsAndFinish}). Strict rule: Absolutely no people, no human models, no hands, no faces in frame. Inanimate product advertisement.`;

    try {
      const res = await fetch('/api/brand/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: scenePrompt,
          aspectRatio: targetAspect,
          referenceImage: campaign.anchorImage, // The secret to product consistency!
          model: selectedModel,
          mediumId,
          productSpecs: `${campaign.profile.productName}: ${campaign.profile.materialsAndFinish}. Colors: ${JSON.stringify(campaign.profile.colorPalette)}`,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || `Failed to generate image for ${definition?.name || mediumId}`);
      }

      const updatedShot: MediumShot = {
        mediumId: mediumId as MediumId,
        title: definition?.name || mediumId,
        aspectRatio: targetAspect,
        status: 'completed',
        imageUrl: data.imageUrl,
        promptUsed: data.promptUsed || scenePrompt,
        timestamp: Date.now(),
      };

      const nextShots = {
        ...campaign.shots,
        [mediumId]: updatedShot,
      };

      const updated: BrandCampaign = {
        ...campaign,
        updatedAt: Date.now(),
        shots: nextShots,
      };

      saveCampaignState(updated);
    } catch (error: any) {
      console.error(`Error generating ${mediumId}:`, error);
      const failedShot: MediumShot = {
        mediumId: mediumId as MediumId,
        title: definition?.name || mediumId,
        aspectRatio: targetAspect,
        status: 'failed',
        error: error.message || 'Generation failed',
        timestamp: Date.now(),
      };

      const nextShots = {
        ...campaign.shots,
        [mediumId]: failedShot,
      };

      saveCampaignState({ ...campaign, shots: nextShots });
    } finally {
      setGeneratingMediums(prev => {
        const next = new Set(prev);
        next.delete(mediumId);
        return next;
      });
    }
  };

  // Batch generate all medium shots
  const handleGenerateAll = async () => {
    if (!campaign.anchorImage) {
      alert('Please generate the studio anchor shot first to anchor the visual identity.');
      return;
    }

    const pending = MEDIUM_DEFINITIONS.map(m => m.id);
    for (const medId of pending) {
      await handleGenerateMedium(medId);
    }
  };

  // Refine an existing medium shot in the inspector modal
  const handleRefineShot = async (mediumId: string, instructions: string) => {
    const existingShot = campaign.shots[mediumId as MediumId];
    if (!existingShot?.imageUrl && !campaign.anchorImage) return;

    setIsRefining(true);
    setServerNotice(null);

    try {
      const res = await fetch('/api/brand/edit-shot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentImage: existingShot?.imageUrl,
          anchorImage: campaign.anchorImage,
          modificationInstructions: instructions,
          aspectRatio: existingShot?.aspectRatio || '1:1',
          model: selectedModel,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to refine shot.');
      }

      const updatedShot: MediumShot = {
        ...existingShot,
        imageUrl: data.imageUrl,
        timestamp: Date.now(),
        notes: instructions,
      };

      const updated: BrandCampaign = {
        ...campaign,
        updatedAt: Date.now(),
        shots: {
          ...campaign.shots,
          [mediumId]: updatedShot,
        },
      };

      saveCampaignState(updated);
    } catch (error: any) {
      console.error('Error refining shot:', error);
      alert(error.message || 'Failed to apply refinement.');
    } finally {
      setIsRefining(false);
    }
  };

  // Add custom placement
  const handleAddCustomMedium = (name: string, prompt: string, aspectRatio: AspectRatio) => {
    const customId = `custom_${Date.now()}`;
    const newDefinition: MediumDefinition = {
      id: customId as MediumId,
      name,
      category: 'Experimental',
      description: prompt,
      defaultAspectRatio: aspectRatio,
      badge: `${aspectRatio} Custom`,
      iconName: 'Plus',
      suggestedContext: prompt,
      lightingPreset: 'Custom Scene Lighting',
    };

    MEDIUM_DEFINITIONS.push(newDefinition);

    const newShot: MediumShot = {
      mediumId: customId as MediumId,
      title: name,
      aspectRatio,
      status: 'idle',
    };

    const updated: BrandCampaign = {
      ...campaign,
      updatedAt: Date.now(),
      shots: {
        ...campaign.shots,
        [customId]: newShot,
      },
    };

    saveCampaignState(updated);
    handleGenerateMedium(customId, prompt);
  };

  // Export campaign zip
  const handleExportZip = async () => {
    setIsExportingZip(true);
    try {
      await downloadCampaignZip(campaign);
    } catch (e) {
      console.error('Export failed:', e);
      alert('Failed to create campaign archive.');
    } finally {
      setIsExportingZip(false);
    }
  };

  // Reset to brand new campaign
  const handleNewCampaign = () => {
    const fresh = createInitialCampaign();
    saveCampaignState(fresh);
  };

  const inspectedDefinition = MEDIUM_DEFINITIONS.find(m => m.id === selectedInspectorMediumId);
  const inspectedShot = selectedInspectorMediumId ? campaign.shots[selectedInspectorMediumId as MediumId] : undefined;

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col selection:bg-amber-500/30 selection:text-amber-200">
      {/* Top Header */}
      <Header
        campaign={campaign}
        onNewCampaign={handleNewCampaign}
        onOpenHistory={() => setShowHistoryDrawer(true)}
        onExportZip={handleExportZip}
        onOpenSpecs={() => setShowBrandSpecs(true)}
        selectedModel={selectedModel}
        onChangeModel={setSelectedModel}
        isExporting={isExportingZip}
      />

      {/* Main Workspace Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        {/* Error / Server Notice Banner */}
        {serverNotice && (
          <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-800/50 flex items-start gap-3 animate-in fade-in">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="flex-1 text-xs">
              <span className="font-bold text-rose-200 block">Notice</span>
              <p className="text-stone-300 mt-0.5 leading-relaxed">{serverNotice}</p>
            </div>
            <button
              onClick={() => setServerNotice(null)}
              className="text-stone-400 hover:text-stone-200 text-xs font-semibold px-2 py-1"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Top Split: Product Input & Studio Anchor Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Product Definition Input (7 cols) */}
          <div className="lg:col-span-7">
            <ProductInputPanel
              rawInput={campaign.rawInput}
              onChangeRawInput={(val) => setCampaign({ ...campaign, rawInput: val })}
              profile={campaign.profile}
              onChangeProfile={(prof) => setCampaign({ ...campaign, profile: prof })}
              onAnalyzeAndBuildAnchor={handleAnalyzeAndBuildAnchor}
              isAnalyzing={isAnalyzing || isGeneratingAnchor}
              onSelectPreset={handleSelectPreset}
            />
          </div>

          {/* Right Column: Canonical Studio Anchor Lock (5 cols) */}
          <div className="lg:col-span-5">
            <AnchorPreviewCard
              campaign={campaign}
              isGeneratingAnchor={isGeneratingAnchor}
              onGenerateAnchor={() => generateAnchorShot(campaign)}
              onUploadAnchor={handleUploadAnchor}
              onViewFullscreen={(_img, _title) => {
                setSelectedInspectorMediumId('anchor');
              }}
            />
          </div>
        </div>

        {/* Section Divider & Consistency Philosophy */}
        <div className="pt-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h2 className="text-lg font-bold text-stone-100 flex items-center gap-2 font-display">
                <Layers className="w-5 h-5 text-amber-400" />
                Multi-Medium Campaign Placements
              </h2>
              <p className="text-xs text-stone-400">
                Conditioned on the studio anchor shot to ensure 100% product fidelity across billboards, newsprint, social, and transit
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" />
                Zero Humans Policy
              </span>
            </div>
          </div>

          {/* Medium Showcase Grid */}
          <MediumGrid
            shots={campaign.shots}
            anchorImage={campaign.anchorImage}
            generatingMediums={generatingMediums}
            onGenerateMedium={handleGenerateMedium}
            onGenerateAll={handleGenerateAll}
            onInspectMedium={(id) => setSelectedInspectorMediumId(id)}
            onAddCustomMedium={handleAddCustomMedium}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-800/80 bg-stone-950 py-6 px-4 text-center text-xs text-stone-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="font-semibold text-stone-300">Brand Builder</span>
            <span>— Powered by Google GenAI Nano-Banana model</span>
          </div>
          <p className="text-stone-500 text-[11px]">
            Strict Inanimate Commercial Guarantee • 100% Human-Free Advertising Concept Studio
          </p>
        </div>
      </footer>

      {/* Deep Inspection Modal */}
      {selectedInspectorMediumId && (
        <MediumInspectorModal
          mediumDefinition={inspectedDefinition}
          shot={
            selectedInspectorMediumId === 'anchor'
              ? {
                  mediumId: 'anchor',
                  title: 'Canonical Studio Anchor',
                  aspectRatio: '1:1',
                  status: 'completed',
                  imageUrl: campaign.anchorImage,
                  promptUsed: campaign.anchorPrompt,
                }
              : inspectedShot
          }
          campaign={campaign}
          onClose={() => setSelectedInspectorMediumId(null)}
          onRefineShot={handleRefineShot}
          isRefining={isRefining}
        />
      )}

      {/* Brand Specifications Modal */}
      {showBrandSpecs && (
        <BrandSpecModal
          campaign={campaign}
          onClose={() => setShowBrandSpecs(false)}
        />
      )}

      {/* Saved Campaigns Drawer */}
      <CampaignHistoryDrawer
        isOpen={showHistoryDrawer}
        onClose={() => setShowHistoryDrawer(false)}
        savedCampaigns={savedCampaigns}
        currentCampaignId={campaign.id}
        onLoadCampaign={(camp) => setCampaign(camp)}
        onDeleteCampaign={(id) => {
          const nextList = savedCampaigns.filter(c => c.id !== id);
          setSavedCampaigns(nextList);
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(nextList));
          } catch (e) {}
        }}
      />
    </div>
  );
}
