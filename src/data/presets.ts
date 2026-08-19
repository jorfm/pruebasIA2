import { MediumDefinition } from '../types';

export const MEDIUM_DEFINITIONS: MediumDefinition[] = [
  {
    id: 'billboard',
    name: 'City Skyline Billboard',
    category: 'Outdoor',
    description: 'A massive architectural highway or rooftop billboard overlooking a dramatic cityscape at twilight.',
    defaultAspectRatio: '16:9',
    badge: '16:9 Landscape',
    iconName: 'Billboard',
    suggestedContext: 'Metropolitan rooftop steel billboard framed against a cinematic dusk sky with warm skyscraper bokeh lights.',
    lightingPreset: 'Cinematic golden hour and dusk architectural spotlights'
  },
  {
    id: 'newspaper',
    name: 'Broadsheet Newspaper Ad',
    category: 'Print',
    description: 'A high-end editorial full-page broadsheet newspaper advertisement with authentic paper grain and crisp serif layout.',
    defaultAspectRatio: '3:4',
    badge: '3:4 Broadsheet',
    iconName: 'Newspaper',
    suggestedContext: 'Full-page luxury advertorial on textured newsprint paper, laid flat on a clean wooden editor table with subtle natural window light.',
    lightingPreset: 'Diffused morning window light with subtle tactile paper textures'
  },
  {
    id: 'social_post',
    name: 'Social Media Feed Post',
    category: 'Digital',
    description: 'A curated square commercial hero shot for Instagram/digital feeds with minimalist sculptural props.',
    defaultAspectRatio: '1:1',
    badge: '1:1 Square Feed',
    iconName: 'Instagram',
    suggestedContext: 'Sculptural studio tabletop arrangement on travertine stone slab with delicate palm leaf shadow play.',
    lightingPreset: 'Crisp editorial sunlight with sharp architectural shadows'
  },
  {
    id: 'social_story',
    name: 'Vertical Story / Ad Reel',
    category: 'Digital',
    description: 'Full-screen 9:16 vertical commercial format tailored for mobile stories and hero ad reels.',
    defaultAspectRatio: '9:16',
    badge: '9:16 Vertical Story',
    iconName: 'Smartphone',
    suggestedContext: 'Vertical editorial framing with dynamic negative space, floating product angles, and modern minimalist backdrop.',
    lightingPreset: 'Gradient ambient studio fill with subtle rim lighting'
  },
  {
    id: 'transit_shelter',
    name: 'Transit Shelter Lightbox',
    category: 'Outdoor',
    description: 'Illuminated glass bus stop poster backlit at blue hour with glossy reflections on the street.',
    defaultAspectRatio: '3:4',
    badge: '3:4 Poster',
    iconName: 'Bus',
    suggestedContext: 'Modern glass and dark metal urban bus shelter at blue hour dusk with glowing internal poster backlight and wet asphalt reflections.',
    lightingPreset: 'High-contrast backlit poster illumination in a moody twilight city'
  },
  {
    id: 'magazine_spread',
    name: 'Luxury Magazine Spread',
    category: 'Print',
    description: 'An expansive double-page editorial feature in a high-fashion or architecture design publication.',
    defaultAspectRatio: '16:9',
    badge: '16:9 Double Page',
    iconName: 'BookOpen',
    suggestedContext: 'Glossy open art-direction magazine spread laying on a minimalist concrete surface with elegant editorial typography layout.',
    lightingPreset: 'Soft diffused gallery studio lighting'
  },
  {
    id: 'retail_display',
    name: 'Boutique Storefront Display',
    category: 'Retail',
    description: 'A prestigious retail concept store window display with pedestal staging and museum spotlighting.',
    defaultAspectRatio: '4:3',
    badge: '4:3 Display',
    iconName: 'Store',
    suggestedContext: 'Minimalist boutique window showcase with fluted plaster pedestals, warm recessed downlights, and clean glass reflections.',
    lightingPreset: 'Warm focused museum spotlights with gentle ambient glow'
  },
  {
    id: 'merch_suite',
    name: 'Packaging & Merch Suite',
    category: 'Retail',
    description: 'A complete physical brand collateral lineup including rigid gift box, organic cotton tote, and custom canister.',
    defaultAspectRatio: '1:1',
    badge: '1:1 Merch Mockup',
    iconName: 'Package',
    suggestedContext: 'Art-directed overhead flat-lay staging of branded rigid unboxing box, natural linen tote bag, and embossed packaging elements on light oak surface.',
    lightingPreset: 'Neutral balanced 5000K commercial studio light'
  },
  {
    id: 'neon_street',
    name: 'Night Street Wheatpaste Poster',
    category: 'Experimental',
    description: 'Pasted urban street wall poster framed by vibrant nighttime neon signs and urban architectural textures.',
    defaultAspectRatio: '3:4',
    badge: '3:4 Night Street',
    iconName: 'Sparkles',
    suggestedContext: 'Textured brick and concrete alleyway wall with pasted commercial poster bathed in cinematic cyan and amber neon reflections.',
    lightingPreset: 'Vibrant neon street lights and deep moody shadows'
  }
];

export interface PresetProduct {
  id: string;
  name: string;
  category: string;
  tagline: string;
  shortDesc: string;
  rawInput: string;
  colorPalette: {
    primary: string;
    secondary: string;
    accent: string;
    surface: string;
  };
}

export const PRESET_PRODUCTS: PresetProduct[] = [
  {
    id: 'vespera',
    name: 'Vespera Botanical Elixir',
    category: 'Beauty & Skincare',
    tagline: 'Deep Restorative Cellular Hydration',
    shortDesc: 'Frosted amber glass apothecary bottle with knurled brushed brass dropper and minimalist embossed ecru label.',
    rawInput: 'A luxury facial elixir bottle called "Vespera". It features heavy frosted amber glass, an octagonal cylindrical silhouette, a knurled brushed brass cap dropper, and a minimalist textured ivory label with delicate serif typography and gold hot-stamped accents. The liquid inside has a subtle warm golden glow.',
    colorPalette: {
      primary: '#B45309',
      secondary: '#D97706',
      accent: '#CA8A04',
      surface: '#FDFBF7'
    }
  },
  {
    id: 'aeropulse',
    name: 'AeroPulse Horizon Earbuds',
    category: 'Consumer Audio Tech',
    tagline: 'Acoustic Precision in Aerospace Aluminum',
    shortDesc: 'Machined anodized aerospace aluminum charging capsule with matte obsidian finish and a slender glowing cyan pulse ring.',
    rawInput: 'High-end wireless noise-canceling earbuds called "AeroPulse Horizon". The charging case is machined from a single block of bead-blasted dark graphite aluminum with rounded aerodynamic curves, a flush magnetic lid seam, and a precision laser-etched geometric logo with a micro-thin illuminated cyan status ring. The earbuds themselves feature matching matte obsidian metal with ceramic touch pads.',
    colorPalette: {
      primary: '#1E293B',
      secondary: '#0F172A',
      accent: '#06B6D4',
      surface: '#F8FAFC'
    }
  },
  {
    id: 'komorebi',
    name: 'Komorebi Ceramic Pour-Over',
    category: 'Craft Homeware & Coffee',
    tagline: 'Mindful Brewing Crafted from Earth & Wood',
    shortDesc: 'Speckled artisanal clay dripper and heatproof ribbed glass carafe with raw turned walnut collar.',
    rawInput: 'An artisanal minimalist pour-over coffee set called "Komorebi". It consists of a conical dripper made of rough speckled warm grey stoneware with spiral interior ridges, resting upon a turned natural American walnut wood collar with branded laser engraving, and a precision-blown ribbed borosilicate glass server with ergonomic spout.',
    colorPalette: {
      primary: '#57534E',
      secondary: '#78716C',
      accent: '#B45309',
      surface: '#FAF8F5'
    }
  },
  {
    id: 'solstice',
    name: 'Solstice Botanical Sparkling Tonic',
    category: 'Beverage & Craft Soda',
    tagline: 'Sun-Drenched Citrus & Wild Juniper',
    shortDesc: 'Slender fluted glass beverage bottle with embossed tactile wave motifs and matte foil paper seal.',
    rawInput: 'A contemporary sparkling botanical tonic beverage called "Solstice". Comes in a tall, slender clear fluted glass bottle with vertical tactile ribbed patterns that refract light. It has a modern wrap-around matte off-white paper label with abstract sunburst gradients in terracotta and lemon zest, capped with a matte copper crown cap.',
    colorPalette: {
      primary: '#EA580C',
      secondary: '#F59E0B',
      accent: '#FDE047',
      surface: '#FFFBEB'
    }
  }
];
