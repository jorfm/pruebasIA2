import JSZip from 'jszip';
import { BrandCampaign } from '../types';

export async function downloadCampaignZip(campaign: BrandCampaign): Promise<void> {
  const zip = new JSZip();
  const folderName = `${campaign.profile.productName.replace(/[^a-zA-Z0-9_-]/g, '_')}_Brand_Campaign`;
  const root = zip.folder(folderName) || zip;

  // Add Brand Identity Guidelines MD
  const markdownContent = `# ${campaign.profile.productName} — Brand Identity & Medium Campaign Kit
Generated with Google AI Studio Brand Builder using the Nano-Banana model (${campaign.modelUsed}).

## Visual Identity Specification
- **Product Name:** ${campaign.profile.productName}
- **Category:** ${campaign.profile.category}
- **Tagline:** ${campaign.profile.tagline}
- **Materials & Finish:** ${campaign.profile.materialsAndFinish}
- **Packaging Style:** ${campaign.profile.packagingStyle}
- **Typography Vibe:** ${campaign.profile.typographyVibe}

### Color Palette
- Primary: ${campaign.profile.colorPalette.primary}
- Secondary: ${campaign.profile.colorPalette.secondary}
- Accent: ${campaign.profile.colorPalette.accent}
- Surface: ${campaign.profile.colorPalette.surface}

### Strict Consistency Constraint
- Strictly NO human figures, models, faces, or hands in any marketing assets.
- Inanimate product-first visual consistency maintained across all commercial mediums.

## Medium Placement Shots
${Object.entries(campaign.shots)
  .map(([key, shot]) => `- **${shot.title}** (${shot.aspectRatio}): ${shot.status === 'completed' ? 'Included in archive' : 'Not generated'}`)
  .join('\n')}
`;

  root.file('BRAND_GUIDELINES.md', markdownContent);
  root.file('campaign_data.json', JSON.stringify(campaign, null, 2));

  // Add Anchor image
  if (campaign.anchorImage) {
    const base64Data = campaign.anchorImage.replace(/^data:image\/\w+;base64,/, '');
    root.file('00_Anchor_Studio_Shot.png', base64Data, { base64: true });
  }

  // Add all completed medium shots
  let index = 1;
  for (const [key, shot] of Object.entries(campaign.shots)) {
    if (shot.status === 'completed' && shot.imageUrl) {
      const paddedIndex = String(index).padStart(2, '0');
      const safeTitle = shot.title.replace(/[^a-zA-Z0-9_-]/g, '_');
      const base64Data = shot.imageUrl.replace(/^data:image\/\w+;base64,/, '');
      root.file(`${paddedIndex}_${safeTitle}.png`, base64Data, { base64: true });
      index++;
    }
  }

  const content = await zip.generateAsync({ type: 'blob' });
  const downloadUrl = URL.createObjectURL(content);
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.download = `${folderName}.zip`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(downloadUrl);
}

export function downloadSingleImage(imageUrl: string, filename: string): void {
  const link = document.createElement('a');
  link.href = imageUrl;
  link.download = filename.endsWith('.png') ? filename : `${filename}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
