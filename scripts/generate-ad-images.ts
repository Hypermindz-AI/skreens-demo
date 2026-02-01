/**
 * Generate L-Bar Ad Images using OpenAI gpt-image-1-mini
 *
 * Usage: npx tsx scripts/generate-ad-images.ts
 *
 * Requires: OPENAI_API_KEY environment variable
 *
 * Reference: https://platform.openai.com/docs/api-reference/images/
 */

import fs from 'fs';
import path from 'path';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  console.error('Error: OPENAI_API_KEY environment variable is required');
  process.exit(1);
}

interface ImageConfig {
  filename: string;
  prompt: string;
  size: '1024x1024' | '1536x1024' | '1024x1536';
}

// Ad image configurations
const AD_IMAGES: ImageConfig[] = [
  // Ford
  {
    filename: 'ford-logo.png',
    prompt: 'Ford Motor Company logo, blue oval with white "Ford" script text inside, clean professional corporate logo design, solid white background, high quality',
    size: '1024x1024',
  },
  {
    filename: 'ford-f150-lbar.png',
    prompt: 'Ford F-150 pickup truck advertisement banner, dark blue background (#003478), showing silver F-150 truck, text "TOUCHDOWN DEAL! $5,000 OFF", golden yellow accent color, professional automotive ad creative, clean modern design',
    size: '1536x1024',
  },
  {
    filename: 'qr-ford.png',
    prompt: 'QR code with Ford branding, blue and white colors, scannable QR code pattern with small Ford logo in center, clean white background',
    size: '1024x1024',
  },

  // Toyota
  {
    filename: 'toyota-logo.png',
    prompt: 'Toyota logo, three overlapping ovals forming the Toyota emblem, red color (#EB0A1E), clean corporate logo design, solid white background',
    size: '1024x1024',
  },
  {
    filename: 'toyota-poster.png',
    prompt: 'Toyota Tundra truck advertisement, dark background, red Toyota Tundra pickup truck, text "HALFTIME DEAL - 0% APR", red accent color, professional automotive ad, modern clean design',
    size: '1536x1024',
  },
  {
    filename: 'qr-toyota.png',
    prompt: 'QR code with Toyota branding, red and white colors, scannable QR code pattern with small Toyota logo in center, clean white background',
    size: '1024x1024',
  },

  // UberEats
  {
    filename: 'examples/ubereats-lbar-topright.png',
    prompt: 'Uber Eats food delivery advertisement banner, bright green background (#06C167), showing delicious food items, text "GET ALMOST ANYTHING DELIVERED - $0 DELIVERY FEE", Uber Eats logo, professional ad creative',
    size: '1536x1024',
  },
  {
    filename: 'qr-ubereats.png',
    prompt: 'QR code with Uber Eats branding, green and black colors, scannable QR code pattern with Uber Eats logo in center, clean white background',
    size: '1024x1024',
  },

  // Lavazza
  {
    filename: 'lavazza-logo.png',
    prompt: 'Lavazza coffee logo, elegant Italian coffee brand logo, dark blue and gold colors, "LAVAZZA" text in serif font, professional premium branding',
    size: '1024x1024',
  },
  {
    filename: 'examples/lavazza-poster.png',
    prompt: 'Lavazza premium Italian coffee advertisement, dark blue background (#1B3A6D), elegant coffee cup with steam, gold accents, text "LAVAZZA QUALITA ORO", luxury premium feel, professional coffee ad',
    size: '1536x1024',
  },
  {
    filename: 'qr-lavazza.png',
    prompt: 'QR code with Lavazza branding, dark blue and gold colors, scannable QR code pattern with Lavazza logo in center, clean white background',
    size: '1024x1024',
  },

  // Budweiser
  {
    filename: 'budweiser-logo.png',
    prompt: 'Budweiser beer logo, classic red and white Budweiser bowtie logo design, "KING OF BEERS" tagline, professional beer branding',
    size: '1024x1024',
  },
  {
    filename: 'budweiser-poster.png',
    prompt: 'Budweiser beer celebration advertisement, red background (#C8102E), ice cold Budweiser beer bottles, text "THIS BUDS FOR YOU! CHEERS!", gold accents, sports celebration theme, professional beer ad',
    size: '1536x1024',
  },
  {
    filename: 'qr-budweiser.png',
    prompt: 'QR code with Budweiser branding, red and white colors, scannable QR code pattern with Budweiser logo in center, clean white background',
    size: '1024x1024',
  },

  // DraftKings
  {
    filename: 'draftkings-logo.png',
    prompt: 'DraftKings Sportsbook logo, bright green (#53D337) crown icon with DRAFTKINGS text, professional sports betting brand logo, clean design',
    size: '1024x1024',
  },
  {
    filename: 'draftkings-lbar.png',
    prompt: 'DraftKings Sportsbook live odds advertisement banner, black background, bright green accents (#53D337), text "LIVE ODDS NOW! BET THE NEXT PLAY", sports betting interface showing odds, professional sportsbook ad',
    size: '1536x1024',
  },
  {
    filename: 'qr-draftkings.png',
    prompt: 'QR code with DraftKings branding, green and black colors, scannable QR code pattern with DraftKings crown logo in center, clean white background',
    size: '1024x1024',
  },

  // Pepsi
  {
    filename: 'pepsi-logo.png',
    prompt: 'Pepsi logo, classic red white and blue Pepsi globe circle logo, modern design, clean professional branding',
    size: '1024x1024',
  },
  {
    filename: 'pepsi-lbar.png',
    prompt: 'Pepsi Zero Sugar advertisement banner, dark blue background (#004B93), Pepsi can with ice splash, text "ZERO SUGAR MAX TASTE", red accent color, refreshing beverage ad, professional soda advertisement',
    size: '1536x1024',
  },
  {
    filename: 'qr-pepsi.png',
    prompt: 'QR code with Pepsi branding, blue red and white colors, scannable QR code pattern with Pepsi globe logo in center, clean white background',
    size: '1024x1024',
  },
];

async function generateImage(config: ImageConfig): Promise<void> {
  const outputPath = path.join(process.cwd(), 'public/ads', config.filename);
  const outputDir = path.dirname(outputPath);

  // Ensure directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log(`Generating: ${config.filename}...`);

  try {
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-image-1-mini',
        prompt: config.prompt,
        n: 1,
        size: config.size,
        output_format: 'png',
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`API error: ${JSON.stringify(error)}`);
    }

    const data = await response.json();
    const imageData = data.data[0].b64_json;

    // Save the image
    const buffer = Buffer.from(imageData, 'base64');
    fs.writeFileSync(outputPath, buffer);

    console.log(`  ✓ Saved: ${outputPath}`);
  } catch (error) {
    console.error(`  ✗ Failed: ${config.filename}`, error);
  }
}

async function main() {
  console.log('===========================================');
  console.log('L-Bar Ad Image Generator (gpt-image-1-mini)');
  console.log('===========================================\n');

  console.log(`Generating ${AD_IMAGES.length} images...\n`);

  for (const config of AD_IMAGES) {
    await generateImage(config);
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log('\n===========================================');
  console.log('Done! Update lbar-concepts.ts to use .png extensions');
  console.log('===========================================');
}

main().catch(console.error);
