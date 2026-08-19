export type MediumId =
  | 'anchor'
  | 'billboard'
  | 'newspaper'
  | 'social_post'
  | 'social_story'
  | 'transit_shelter'
  | 'magazine_spread'
  | 'retail_display'
  | 'merch_suite'
  | 'neon_street'
  | 'custom';

export type AspectRatio = '1:1' | '3:4' | '4:3' | '9:16' | '16:9';

export interface MediumDefinition {
  id: MediumId;
  name: string;
  category: 'Outdoor' | 'Print' | 'Digital' | 'Retail' | 'Experimental';
  description: string;
  defaultAspectRatio: AspectRatio;
  badge: string;
  iconName: string;
  suggestedContext: string;
  lightingPreset: string;
}

export interface BrandProfile {
  productName: string;
  category: string;
  tagline: string;
  keyFeatures: string[];
  materialsAndFinish: string;
  colorPalette: {
    primary: string;
    secondary: string;
    accent: string;
    surface: string;
  };
  packagingStyle: string;
  typographyVibe: string;
  canonicalDescription: string;
}

export interface MediumShot {
  mediumId: MediumId;
  title: string;
  aspectRatio: AspectRatio;
  status: 'idle' | 'generating' | 'completed' | 'failed';
  imageUrl?: string;
  promptUsed?: string;
  timestamp?: number;
  error?: string;
  notes?: string;
}

export interface BrandCampaign {
  id: string;
  createdAt: number;
  updatedAt: number;
  name: string;
  rawInput: string;
  profile: BrandProfile;
  anchorImage?: string;
  anchorPrompt?: string;
  modelUsed: string;
  shots: Record<MediumId, MediumShot>;
}
