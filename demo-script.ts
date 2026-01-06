/**
 * Skreens + HyperMindZ PMP Monetization Demo Script
 *
 * This Playwright script automates a walkthrough of the Skreens integration demo,
 * showcasing how venue owners can monetize their screens with contextual L-Bar ads
 * triggered by live sports events through Private Marketplace (PMP) deals.
 *
 * Run with: npx playwright test demo-script.ts --headed --project=chromium
 */

import { test, expect, Page } from '@playwright/test';

// Demo configuration
const DEMO_URL = 'http://localhost:3002';
const PAUSE_SHORT = 3000;
const PAUSE_MEDIUM = 6000;
const PAUSE_LONG = 9000;

// Overlay helper - injects a visual overlay with text
async function showOverlay(page: Page, text: string, position: 'top' | 'center' | 'bottom' = 'top', duration = 4000) {
  await page.evaluate(({ text, position, duration }) => {
    // Remove existing overlay
    const existing = document.getElementById('demo-overlay');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.id = 'demo-overlay';
    overlay.innerHTML = text;
    overlay.style.cssText = `
      position: fixed;
      left: 50%;
      transform: translateX(-50%);
      ${position === 'top' ? 'top: 20px;' : position === 'bottom' ? 'bottom: 100px;' : 'top: 50%; transform: translate(-50%, -50%);'}
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      color: white;
      padding: 20px 40px;
      border-radius: 12px;
      font-size: 24px;
      font-weight: 600;
      z-index: 10000;
      box-shadow: 0 20px 60px rgba(0,0,0,0.4);
      border: 2px solid rgba(255,255,255,0.1);
      text-align: center;
      max-width: 800px;
      animation: fadeIn 0.5s ease-out;
    `;

    // Add animation keyframes
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; transform: translateX(-50%) translateY(-20px); }
        to { opacity: 1; transform: translateX(-50%) translateY(0); }
      }
      @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
      }
    `;
    document.head.appendChild(style);
    document.body.appendChild(overlay);

    // Auto-remove after duration
    setTimeout(() => {
      overlay.style.animation = 'fadeOut 0.5s ease-out forwards';
      setTimeout(() => overlay.remove(), 500);
    }, duration);
  }, { text, position, duration });
}

// Highlight helper - adds a pulsing highlight around an element
async function highlightElement(page: Page, selector: string, duration = 3000) {
  await page.evaluate(({ selector, duration }) => {
    const element = document.querySelector(selector);
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const highlight = document.createElement('div');
    highlight.id = 'demo-highlight';
    highlight.style.cssText = `
      position: fixed;
      top: ${rect.top - 8}px;
      left: ${rect.left - 8}px;
      width: ${rect.width + 16}px;
      height: ${rect.height + 16}px;
      border: 3px solid #3b82f6;
      border-radius: 12px;
      z-index: 9999;
      pointer-events: none;
      animation: pulse 1.5s ease-in-out infinite;
      box-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
    `;

    const style = document.createElement('style');
    style.id = 'highlight-style';
    style.textContent = `
      @keyframes pulse {
        0%, 100% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.02); opacity: 0.8; }
      }
    `;
    document.head.appendChild(style);
    document.body.appendChild(highlight);

    setTimeout(() => {
      highlight.remove();
      style.remove();
    }, duration);
  }, { selector, duration });
}

// Arrow pointer helper
async function showArrow(page: Page, x: number, y: number, label: string) {
  await page.evaluate(({ x, y, label }) => {
    const arrow = document.createElement('div');
    arrow.id = 'demo-arrow';
    arrow.innerHTML = `
      <div style="display: flex; align-items: center; gap: 10px;">
        <span style="font-size: 32px;">👆</span>
        <span style="background: #ef4444; color: white; padding: 8px 16px; border-radius: 8px; font-weight: 600;">${label}</span>
      </div>
    `;
    arrow.style.cssText = `
      position: fixed;
      top: ${y}px;
      left: ${x}px;
      z-index: 10001;
      animation: bounce 1s ease-in-out infinite;
    `;

    const style = document.createElement('style');
    style.textContent = `
      @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
      }
    `;
    document.head.appendChild(style);
    document.body.appendChild(arrow);
  }, { x, y, label });
}

async function removeArrow(page: Page) {
  await page.evaluate(() => {
    const arrow = document.getElementById('demo-arrow');
    if (arrow) arrow.remove();
  });
}

// ============================================================================
// DEMO SCRIPT
// ============================================================================

test.describe('Skreens PMP Monetization Demo', () => {

  test('Full Demo Walkthrough', async ({ page }) => {
    // Set viewport for recording
    await page.setViewportSize({ width: 1920, height: 1080 });

    // ========================================================================
    // INTRO
    // ========================================================================
    await page.goto(DEMO_URL);
    await page.waitForLoadState('networkidle');

    await showOverlay(page, `
      <div style="font-size: 32px; margin-bottom: 16px;">🎯 Skreens + HyperMindZ</div>
      <div style="font-size: 20px; opacity: 0.9;">Monetizing DOOH with Contextual L-Bar Advertising</div>
    `, 'center', PAUSE_LONG);
    await page.waitForTimeout(PAUSE_LONG);

    // ========================================================================
    // SECTION 1: L-BAR DEMO
    // ========================================================================
    await showOverlay(page, '📺 L-Bar Contextual Advertising Demo', 'top', PAUSE_MEDIUM);
    await page.waitForTimeout(PAUSE_SHORT);

    // Click on L-Bar Demo
    await page.click('a[href="/lbar-demo"]');
    await page.waitForTimeout(PAUSE_SHORT);

    await showOverlay(page, `
      <div>Live Sports Simulation</div>
      <div style="font-size: 16px; opacity: 0.8; margin-top: 8px;">
        Watch how L-Bar ads are triggered by real-time game events
      </div>
    `, 'top', PAUSE_MEDIUM);
    await page.waitForTimeout(PAUSE_MEDIUM);

    // Highlight the video area
    await showOverlay(page, '🏈 NFL Game in Progress: KC vs SF', 'bottom', PAUSE_MEDIUM);
    await page.waitForTimeout(PAUSE_MEDIUM);

    // Trigger TOUCHDOWN
    await showOverlay(page, '⚡ Event Detected: TOUCHDOWN!', 'center', PAUSE_SHORT);
    await page.waitForTimeout(PAUSE_SHORT);

    await page.click('button:has-text("Touchdown")');
    await page.waitForTimeout(500);

    await showOverlay(page, `
      <div>🍕 Pizza Hut L-Bar Ad Triggered</div>
      <div style="font-size: 16px; opacity: 0.8; margin-top: 8px;">
        Contextual ad served in &lt;50ms via MCP API
      </div>
    `, 'top', PAUSE_LONG);
    await page.waitForTimeout(PAUSE_LONG);

    await showOverlay(page, `
      <div style="font-size: 18px;">💰 Revenue Generated</div>
      <div style="font-size: 28px; color: #22c55e; margin-top: 8px;">$6.00 CPM × Impression</div>
    `, 'bottom', PAUSE_MEDIUM);
    await page.waitForTimeout(PAUSE_LONG);

    // Wait for L-Bar to close (15s countdown, but we'll skip ahead)
    await page.waitForTimeout(5000);

    // Reset and trigger FIELD GOAL
    await page.click('button:has-text("Reset Demo")');
    await page.waitForTimeout(500);

    await showOverlay(page, '⚡ Event Detected: FIELD GOAL!', 'center', PAUSE_SHORT);
    await page.waitForTimeout(PAUSE_SHORT);

    await page.click('button:has-text("Field Goal")');
    await page.waitForTimeout(500);

    await showOverlay(page, `
      <div>🍺 Bud Light L-Bar Ad Triggered</div>
      <div style="font-size: 16px; opacity: 0.8; margin-top: 8px;">
        Different creative based on event type
      </div>
    `, 'top', PAUSE_LONG);
    await page.waitForTimeout(PAUSE_LONG);

    // ========================================================================
    // SECTION 2: MCP API VISUALIZATION
    // ========================================================================
    await showOverlay(page, '🔌 MCP API Communication', 'top', PAUSE_MEDIUM);
    await page.waitForTimeout(PAUSE_SHORT);

    await page.click('a[href="/mcp-monitor"]');
    await page.waitForTimeout(PAUSE_SHORT);

    await showOverlay(page, `
      <div>Real-time JSON-RPC Communication</div>
      <div style="font-size: 16px; opacity: 0.8; margin-top: 8px;">
        Skreens ↔ HyperMindZ via Model Context Protocol
      </div>
    `, 'top', PAUSE_MEDIUM);
    await page.waitForTimeout(PAUSE_MEDIUM);

    // Run demo flow
    await page.click('button:has-text("Run Demo Flow")');
    await page.waitForTimeout(PAUSE_LONG);

    await showOverlay(page, `
      <div>📡 API Methods</div>
      <div style="font-size: 16px; opacity: 0.8; margin-top: 8px; text-align: left;">
        • resolve_identity - Match viewer to audience segments<br/>
        • get_contextual_ad - Fetch targeted creative<br/>
        • post_ad_events - Track impressions & engagement
      </div>
    `, 'bottom', PAUSE_LONG);
    await page.waitForTimeout(PAUSE_LONG);

    // ========================================================================
    // SECTION 3: DEAL CREATION
    // ========================================================================
    await showOverlay(page, '📝 Creating a PMP Deal', 'top', PAUSE_MEDIUM);
    await page.waitForTimeout(PAUSE_SHORT);

    await page.click('a[href="/deals"]');
    await page.waitForTimeout(PAUSE_SHORT);

    await showOverlay(page, `
      <div>Private Marketplace Deals</div>
      <div style="font-size: 16px; opacity: 0.8; margin-top: 8px;">
        Premium inventory sold directly to advertisers
      </div>
    `, 'top', PAUSE_MEDIUM);
    await page.waitForTimeout(PAUSE_MEDIUM);

    // Open Deal Wizard
    await page.click('button:has-text("Create New Deal")');
    await page.waitForTimeout(PAUSE_SHORT);

    await showOverlay(page, 'Step 1: Deal Information', 'bottom', PAUSE_MEDIUM);
    await page.waitForTimeout(PAUSE_SHORT);

    // Fill deal info
    await page.fill('input[placeholder*="Ford F-150"]', 'Super Bowl Sports Package');
    await page.fill('input[placeholder*="Ford Motor"]', 'Major Auto Brand');
    await page.waitForTimeout(PAUSE_SHORT);

    await page.click('button:has-text("Next")');
    await page.waitForTimeout(PAUSE_SHORT);

    await showOverlay(page, 'Step 2: Select Supply Packages', 'bottom', PAUSE_MEDIUM);
    await page.waitForTimeout(PAUSE_SHORT);

    // Select supply
    await page.click('text=Sports Bar Premium');
    await page.waitForTimeout(PAUSE_SHORT);

    await showOverlay(page, `
      <div>📍 1,248 Screens Selected</div>
      <div style="font-size: 16px; opacity: 0.8; margin-top: 8px;">
        342 Sports Bar venues with L-Bar capability
      </div>
    `, 'bottom', PAUSE_MEDIUM);
    await page.waitForTimeout(PAUSE_MEDIUM);

    await page.click('button:has-text("Next")');
    await page.waitForTimeout(PAUSE_SHORT);

    await showOverlay(page, 'Step 3: Audience Targeting', 'bottom', PAUSE_MEDIUM);
    await page.waitForTimeout(PAUSE_SHORT);

    // Select audience
    await page.click('text=Sports Fans 25-54');
    await page.waitForTimeout(500);
    await page.click('text=Auto Intenders');
    await page.waitForTimeout(PAUSE_SHORT);

    await showOverlay(page, `
      <div>🎯 Audience Reach: 1.2M Households</div>
      <div style="font-size: 16px; opacity: 0.8; margin-top: 8px;">
        Sports fans with auto purchase intent
      </div>
    `, 'bottom', PAUSE_MEDIUM);
    await page.waitForTimeout(PAUSE_MEDIUM);

    // Close wizard
    await page.click('button:has-text("Close")');
    await page.waitForTimeout(PAUSE_SHORT);

    // ========================================================================
    // SECTION 4: DASHBOARD METRICS
    // ========================================================================
    await showOverlay(page, '📊 Performance Dashboard', 'top', PAUSE_MEDIUM);
    await page.waitForTimeout(PAUSE_SHORT);

    await page.click('a[href="/"]');
    await page.waitForTimeout(PAUSE_SHORT);

    await showOverlay(page, `
      <div style="font-size: 20px;">Today's Performance</div>
      <div style="display: flex; gap: 40px; margin-top: 16px; font-size: 16px;">
        <div>📈 1.2M Impressions</div>
        <div>💰 $9,600 Revenue</div>
        <div>⚡ 94% Fill Rate</div>
      </div>
    `, 'bottom', PAUSE_LONG);
    await page.waitForTimeout(PAUSE_LONG);

    // ========================================================================
    // OUTRO
    // ========================================================================
    await showOverlay(page, `
      <div style="font-size: 32px; margin-bottom: 16px;">✅ Skreens + HyperMindZ</div>
      <div style="font-size: 18px; opacity: 0.9; line-height: 1.6;">
        Contextual L-Bar Advertising • PMP Deal Management<br/>
        Real-time MCP Integration • Audience Targeting
      </div>
      <div style="margin-top: 20px; font-size: 16px; color: #22c55e;">
        Ready to monetize your venue screens?
      </div>
    `, 'center', PAUSE_LONG + 2000);
    await page.waitForTimeout(PAUSE_LONG + 2000);
  });
});
