/**
 * Generate Skreens-format L-Bar images using Playwright
 * Full 1920x1080 with transparent content area
 */

import { chromium } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

const WIDTH = 1920;
const HEIGHT = 1080;

interface LBarConfig {
  id: string;
  orientation: 'top-right' | 'left-bottom';
  topBarHeight?: number;
  rightBarWidth?: number;
  leftBarWidth?: number;
  bottomBarHeight?: number;
  backgroundColor: string;
  accentColor: string;
  textColor: string;
  headline: string;
  subheadline?: string;
  cta: string;
  logoUrl?: string;
}

const configs: LBarConfig[] = [
  {
    id: 'ubereats-delivery',
    orientation: 'top-right',
    topBarHeight: 80,
    rightBarWidth: 320,
    backgroundColor: '#FFFFFF',
    accentColor: '#06C167',
    textColor: '#000000',
    headline: 'GET ALMOST ANYTHING. DELIVERED.',
    cta: 'ORDER NOW',
  },
  {
    id: 'ford-f150-touchdown',
    orientation: 'top-right',
    topBarHeight: 80,
    rightBarWidth: 300,
    backgroundColor: '#00274D',
    accentColor: '#F5B400',
    textColor: '#FFFFFF',
    headline: 'TOUCHDOWN DEAL!',
    subheadline: '$5,000 off F-150',
    cta: 'SCAN FOR OFFER',
  },
  {
    id: 'draftkings-live-odds',
    orientation: 'top-right',
    topBarHeight: 80,
    rightBarWidth: 300,
    backgroundColor: '#1A1A1A',
    accentColor: '#53D769',
    textColor: '#FFFFFF',
    headline: 'LIVE ODDS',
    subheadline: 'Bet the game now!',
    cta: 'BET NOW',
  },
  {
    id: 'pepsi-zero-refresh',
    orientation: 'top-right',
    topBarHeight: 80,
    rightBarWidth: 300,
    backgroundColor: '#004B93',
    accentColor: '#E32934',
    textColor: '#FFFFFF',
    headline: 'ZERO SUGAR. MAX TASTE.',
    subheadline: 'Pepsi Zero Sugar',
    cta: 'FIND YOURS',
  },
  {
    id: 'budweiser-celebration',
    orientation: 'left-bottom',
    leftBarWidth: 300,
    bottomBarHeight: 80,
    backgroundColor: '#8B0000',
    accentColor: '#FFD700',
    textColor: '#FFFFFF',
    headline: "THIS BUD'S FOR YOU",
    subheadline: 'Celebrate the moment',
    cta: 'CHEERS!',
  },
  {
    id: 'lavazza-tabli',
    orientation: 'left-bottom',
    leftBarWidth: 280,
    bottomBarHeight: 100,
    backgroundColor: '#F5F0E8',
    accentColor: '#8B4513',
    textColor: '#4A3728',
    headline: 'LAVAZZA TABLÌ',
    subheadline: 'Entra nel mondo',
    cta: 'SCAN QR',
  },
  {
    id: 'toyota-halftime',
    orientation: 'left-bottom',
    leftBarWidth: 300,
    bottomBarHeight: 80,
    backgroundColor: '#EB0A1E',
    accentColor: '#FFFFFF',
    textColor: '#FFFFFF',
    headline: "LET'S GO PLACES",
    subheadline: 'Toyota Halftime',
    cta: 'EXPLORE',
  },
];

function generateHTML(config: LBarConfig): string {
  if (config.orientation === 'top-right') {
    const topH = config.topBarHeight || 80;
    const rightW = config.rightBarWidth || 300;

    return `
<!DOCTYPE html>
<html>
<head>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      width: ${WIDTH}px;
      height: ${HEIGHT}px;
      background: transparent;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    .top-bar {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: ${topH}px;
      background: ${config.backgroundColor};
      display: flex;
      align-items: center;
      padding-left: 20px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .accent-stripe {
      position: absolute;
      left: 0;
      top: 0;
      width: 130px;
      height: 100%;
      background: ${config.accentColor};
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .accent-stripe span {
      color: white;
      font-weight: bold;
      font-size: 24px;
    }
    .headline {
      margin-left: 150px;
      font-size: 32px;
      font-weight: bold;
      color: ${config.textColor};
      letter-spacing: 1px;
    }
    .right-bar {
      position: absolute;
      top: ${topH}px;
      right: 0;
      width: ${rightW}px;
      height: calc(100% - ${topH}px);
      background: ${config.backgroundColor};
      display: flex;
      flex-direction: column;
      padding: 30px;
      box-shadow: -2px 0 4px rgba(0,0,0,0.1);
    }
    .subheadline {
      font-size: 24px;
      font-weight: bold;
      color: ${config.textColor};
      margin-bottom: 20px;
    }
    .cta-button {
      position: absolute;
      bottom: 100px;
      left: 30px;
      right: 30px;
      background: ${config.accentColor};
      color: ${config.backgroundColor === '#FFFFFF' ? '#000' : '#FFF'};
      padding: 15px 30px;
      border-radius: 8px;
      font-size: 18px;
      font-weight: bold;
      text-align: center;
      letter-spacing: 1px;
    }
    .qr-placeholder {
      position: absolute;
      bottom: 180px;
      left: 50%;
      transform: translateX(-50%);
      width: 100px;
      height: 100px;
      background: white;
      border: 2px solid #ccc;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      color: #666;
    }
  </style>
</head>
<body>
  <div class="top-bar">
    <div class="accent-stripe"><span>Ad</span></div>
    <div class="headline">${config.headline}</div>
  </div>
  <div class="right-bar">
    ${config.subheadline ? `<div class="subheadline">${config.subheadline}</div>` : ''}
    <div class="qr-placeholder">QR Code</div>
    <div class="cta-button">${config.cta}</div>
  </div>
</body>
</html>`;
  } else {
    // left-bottom orientation
    const leftW = config.leftBarWidth || 300;
    const bottomH = config.bottomBarHeight || 80;

    return `
<!DOCTYPE html>
<html>
<head>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      width: ${WIDTH}px;
      height: ${HEIGHT}px;
      background: transparent;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    .left-bar {
      position: absolute;
      top: 0;
      left: 0;
      width: ${leftW}px;
      height: calc(100% - ${bottomH}px);
      background: ${config.backgroundColor};
      display: flex;
      flex-direction: column;
      padding: 30px;
      box-shadow: 2px 0 4px rgba(0,0,0,0.1);
    }
    .accent-stripe {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 8px;
      background: ${config.accentColor};
    }
    .subheadline {
      margin-top: 50px;
      font-size: 20px;
      font-weight: bold;
      color: ${config.textColor};
    }
    .cta-button {
      position: absolute;
      bottom: 30px;
      left: 30px;
      right: 30px;
      background: ${config.accentColor};
      color: ${config.backgroundColor === '#FFFFFF' || config.backgroundColor === '#F5F0E8' ? '#000' : '#FFF'};
      padding: 12px 20px;
      border-radius: 8px;
      font-size: 16px;
      font-weight: bold;
      text-align: center;
    }
    .qr-placeholder {
      position: absolute;
      bottom: 100px;
      left: 50%;
      transform: translateX(-50%);
      width: 80px;
      height: 80px;
      background: white;
      border: 2px solid #ccc;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      color: #666;
    }
    .bottom-bar {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: ${bottomH}px;
      background: ${config.backgroundColor};
      display: flex;
      align-items: center;
      padding-left: ${leftW + 40}px;
      box-shadow: 0 -2px 4px rgba(0,0,0,0.1);
    }
    .headline {
      font-size: 32px;
      font-weight: bold;
      color: ${config.textColor};
      letter-spacing: 1px;
    }
  </style>
</head>
<body>
  <div class="left-bar">
    <div class="accent-stripe"></div>
    ${config.subheadline ? `<div class="subheadline">${config.subheadline}</div>` : ''}
    <div class="qr-placeholder">QR</div>
    <div class="cta-button">${config.cta}</div>
  </div>
  <div class="bottom-bar">
    <div class="headline">${config.headline}</div>
  </div>
</body>
</html>`;
  }
}

async function main() {
  console.log('Generating Skreens-format L-Bar images...');

  const outputDir = path.join(process.cwd(), 'public/ads/skreens-format');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: WIDTH, height: HEIGHT },
    deviceScaleFactor: 1,
  });

  for (const config of configs) {
    console.log(`Generating ${config.id}...`);

    const page = await context.newPage();
    const html = generateHTML(config);

    await page.setContent(html);
    await page.waitForLoadState('networkidle');

    const outputPath = path.join(outputDir, `${config.id}.png`);
    await page.screenshot({
      path: outputPath,
      omitBackground: true, // Makes the content area transparent
    });

    console.log(`  -> ${outputPath}`);
    await page.close();
  }

  await browser.close();
  console.log('\nDone! Generated', configs.length, 'images.');
}

main().catch(console.error);
