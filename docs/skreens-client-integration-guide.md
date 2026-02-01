# Skreens Client Integration Guide

## How to Display L-Bar Ads from HyperMindZ MCP

This guide explains the complete process for a Skreens client to request and display L-Bar ads during live sports events.

---

## Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           SKREENS DISPLAY                                   │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                      │   │
│  │                        LIVE SPORTS CONTENT                          │   │
│  │                         (NFL, NBA, etc.)                            │   │
│  │                                                                      │   │
│  │                    ┌─────────────────────────┐                      │   │
│  │                    │    L-BAR AD OVERLAY     │                      │   │
│  │                    │   (HyperMindZ served)   │                      │   │
│  │                    └─────────────────────────┘                      │   │
│  │                                                                      │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Integration Flow

### Step 0: Authentication Setup

The MCP API requires API key authentication in production. HyperMindZ will provide your API key.

**Authentication Methods (choose one):**

```javascript
// Option 1: Authorization header (recommended)
headers: {
  'Authorization': 'Bearer sk_live_your_api_key_here',
  'Content-Type': 'application/json'
}

// Option 2: X-API-Key header
headers: {
  'X-API-Key': 'sk_live_your_api_key_here',
  'Content-Type': 'application/json'
}
```

**Error Response (401 Unauthorized):**
```json
{
  "jsonrpc": "2.0",
  "error": {
    "code": -32000,
    "message": "Invalid or missing API key. Use Authorization: Bearer <key> or X-API-Key header."
  },
  "id": null
}
```

---

### Step 1: Initialize Connection

When the Skreens app starts, verify connectivity to the MCP server.

```javascript
// Check MCP server health (no auth required for health check)
const response = await fetch('https://<mcp-server>/api/mcp');
const serverInfo = await response.json();

console.log(serverInfo);
// {
//   "name": "hypermindz-lbar-mcp",
//   "version": "1.0.0",
//   "total_ads": 7,
//   "supported_orientations": ["top-right", "left-bottom", "top-left", "right-bottom"],
//   "supported_asset_types": ["image", "video"]
// }
```

---

### Step 2: Request an L-Bar Ad

When a triggering event occurs (touchdown, halftime, etc.), request an ad from the MCP server.

```javascript
const API_KEY = 'sk_live_your_api_key_here'; // Provided by HyperMindZ

async function requestLBarAd(eventType, options = {}) {
  const request = {
    jsonrpc: "2.0",
    method: "get_lbar_ad",
    params: {
      event_type: eventType,           // "TOUCHDOWN", "HALFTIME", etc.
      device_id: "skreens-venue-42-screen-1",
      venue_id: "venue-42",
      orientation: options.orientation, // Optional: "top-right", "left-bottom"
      asset_type: options.assetType,   // Optional: "image" or "video"
    },
    id: crypto.randomUUID(),
  };

  const response = await fetch('https://<mcp-server>/api/mcp', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
    },
    body: JSON.stringify(request),
  });

  const data = await response.json();
  return data.result;
}

// Example: Request any ad for a touchdown event
const adResponse = await requestLBarAd("TOUCHDOWN");

// Example: Request specifically a video ad with left-bottom orientation
const videoAd = await requestLBarAd("HALFTIME", {
  orientation: "left-bottom",
  assetType: "video"
});
```

---

### Step 3: Parse the Ad Response

The MCP server returns a complete ad specification:

```javascript
const adResponse = {
  success: true,
  ad: {
    id: "lavazza-tabli",
    advertiser: "Lavazza",
    campaign: "Lavazza Tablì",
    orientation: "left-bottom",        // Where the L-Bar appears
    dimensions: {
      left_bar_width: 22,              // 22% of screen width
      bottom_bar_height: 15,           // 15% of screen height
    },
    duration_ms: 10000,                // Display for 10 seconds
    assets: {
      type: "video",                   // "image" or "video"
      video_url: "/ads/examples/lavazza-lbar-leftbottom.mp4",
      poster_url: "/ads/examples/lavazza-poster.jpg",
      headline: "LAVAZZA TABLÌ",
      subheadline: "Entra nel mondo di Lavazza Tablì",
      cta: "Scan QR",
      logo_url: "/ads/lavazza-logo.png",
      background_color: "#F5F0E8",
      text_color: "#4A3728",
      accent_color: "#8B4513",
      qr_code_url: "/ads/qr-lavazza.png",
      qr_destination: "https://lavazza.com/tabli",
    },
    tracking: {
      impression_url: "/api/track/impression?ad=lavazza-tabli",
      click_url: "/api/track/click?ad=lavazza-tabli",
    },
    content_area: {
      position: "top-right",           // Where live content should be
      width_percent: 78,               // Content gets 78% width
      height_percent: 85,              // Content gets 85% height
    },
  },
  request_context: {
    event_type: "HALFTIME",
    device_id: "skreens-venue-42-screen-1",
    venue_id: "venue-42",
    timestamp: "2025-01-31T22:30:00.000Z",
  },
};
```

---

### Step 4: Render the L-Bar Overlay

Based on the `orientation`, position the L-Bar and resize the live content.

#### L-Bar Orientations

```
TOP-RIGHT                              LEFT-BOTTOM
┌──────────────────────┬─────┐        ┌──────┬───────────────────┐
│ ████ TOP BAR ████████│     │        │      │                   │
├──────────────────────┤RIGHT│        │ LEFT │   LIVE CONTENT    │
│                      │ BAR │        │  BAR │                   │
│    LIVE CONTENT      │     │        │      │                   │
│                      │     │        ├──────┴───────────────────┤
│                      │     │        │ ████ BOTTOM BAR █████████│
└──────────────────────┴─────┘        └──────────────────────────┘

TOP-LEFT                               RIGHT-BOTTOM
┌─────┬──────────────────────┐        ┌───────────────────┬──────┐
│     │ ████ TOP BAR ████████│        │                   │      │
│LEFT ├──────────────────────┤        │   LIVE CONTENT    │RIGHT │
│ BAR │                      │        │                   │  BAR │
│     │    LIVE CONTENT      │        │                   │      │
│     │                      │        ├───────────────────┴──────┤
│     │                      │        │ ████ BOTTOM BAR █████████│
└─────┴──────────────────────┘        └──────────────────────────┘
```

#### Rendering Logic (Pseudocode)

```javascript
function renderLBarAd(ad, screenWidth, screenHeight) {
  const { orientation, dimensions, assets, content_area, duration_ms } = ad;

  // 1. Calculate L-Bar dimensions based on orientation
  let lbarLayout = calculateLBarLayout(orientation, dimensions, screenWidth, screenHeight);

  // 2. Resize/reposition live content to content_area
  resizeLiveContent(content_area, screenWidth, screenHeight);

  // 3. Create L-Bar overlay
  const lbarOverlay = createLBarOverlay(lbarLayout, assets);

  // 4. Display the ad
  if (assets.type === "video") {
    playVideo(assets.video_url, lbarOverlay, duration_ms);
  } else {
    displayImage(assets.image_url, lbarOverlay, duration_ms);
  }

  // 5. Fire impression tracking
  fireImpressionPixel(ad.tracking.impression_url);

  // 6. Set timeout to remove ad after duration
  setTimeout(() => {
    removeLBarOverlay(lbarOverlay);
    restoreLiveContent();
  }, duration_ms);
}

function calculateLBarLayout(orientation, dimensions, screenWidth, screenHeight) {
  switch (orientation) {
    case "top-right":
      return {
        topBar: {
          x: 0,
          y: 0,
          width: screenWidth,
          height: screenHeight * (dimensions.top_bar_height / 100),
        },
        rightBar: {
          x: screenWidth * (1 - dimensions.right_bar_width / 100),
          y: screenHeight * (dimensions.top_bar_height / 100),
          width: screenWidth * (dimensions.right_bar_width / 100),
          height: screenHeight * (1 - dimensions.top_bar_height / 100),
        },
      };

    case "left-bottom":
      return {
        leftBar: {
          x: 0,
          y: 0,
          width: screenWidth * (dimensions.left_bar_width / 100),
          height: screenHeight * (1 - dimensions.bottom_bar_height / 100),
        },
        bottomBar: {
          x: 0,
          y: screenHeight * (1 - dimensions.bottom_bar_height / 100),
          width: screenWidth,
          height: screenHeight * (dimensions.bottom_bar_height / 100),
        },
      };

    // ... similar for top-left and right-bottom
  }
}
```

---

### Step 5: Handle Video L-Bars

For video L-Bars, load and play the video within the L-Bar region.

```javascript
async function playVideoLBar(ad) {
  const videoElement = document.createElement('video');
  videoElement.src = ad.assets.video_url;
  videoElement.poster = ad.assets.poster_url;
  videoElement.muted = true;  // Auto-play requires muted
  videoElement.playsInline = true;
  videoElement.loop = false;

  // Position video in L-Bar region
  videoElement.style.position = 'absolute';
  applyLBarStyles(videoElement, ad.orientation, ad.dimensions);

  // Add to overlay container
  lbarContainer.appendChild(videoElement);

  // Play video
  await videoElement.play();

  // Video will auto-stop after duration_ms
  setTimeout(() => {
    videoElement.pause();
    videoElement.remove();
  }, ad.duration_ms);
}
```

---

### Step 6: Track Impressions & Engagement

Fire tracking pixels at appropriate moments.

```javascript
// Fire on ad display
function fireImpressionPixel(url) {
  const img = new Image();
  img.src = url + '&ts=' + Date.now();
}

// Fire on QR code scan (if detected)
function fireQRScanEvent(ad) {
  fetch(ad.tracking.click_url + '&event=qr_scan&ts=' + Date.now());
}

// Fire on ad completion
function fireCompletionEvent(ad) {
  fetch(ad.tracking.impression_url + '&event=complete&ts=' + Date.now());
}
```

---

## Complete Client Implementation Example

```javascript
class SkreensLBarClient {
  constructor(mcpServerUrl, apiKey) {
    this.mcpServerUrl = mcpServerUrl;
    this.apiKey = apiKey;
    this.currentAd = null;
    this.isDisplayingAd = false;
  }

  // Initialize and verify connection
  async initialize() {
    const response = await fetch(this.mcpServerUrl);
    const serverInfo = await response.json();
    console.log('Connected to MCP server:', serverInfo.name, serverInfo.version);
    return serverInfo;
  }

  // Request an ad from the MCP server
  async requestAd(eventType, options = {}) {
    const request = {
      jsonrpc: "2.0",
      method: "get_lbar_ad",
      params: {
        event_type: eventType,
        device_id: this.deviceId,
        venue_id: this.venueId,
        ...options,
      },
      id: crypto.randomUUID(),
    };

    const response = await fetch(this.mcpServerUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(request),
    });

    const data = await response.json();

    if (data.error) {
      console.error('MCP Error:', data.error);
      return null;
    }

    return data.result.ad;
  }

  // Display the L-Bar ad
  async displayAd(ad) {
    if (this.isDisplayingAd) {
      console.log('Already displaying an ad, skipping');
      return;
    }

    this.isDisplayingAd = true;
    this.currentAd = ad;

    // 1. Squeeze live content
    this.squeezeLiveContent(ad.content_area);

    // 2. Create and show L-Bar overlay
    const overlay = this.createLBarOverlay(ad);
    document.body.appendChild(overlay);

    // 3. Fire impression
    this.fireTracking(ad.tracking.impression_url);

    // 4. If video, start playback
    if (ad.assets.type === 'video') {
      const video = overlay.querySelector('video');
      await video.play();
    }

    // 5. Schedule removal after duration
    setTimeout(() => {
      this.removeAd(overlay);
    }, ad.duration_ms);
  }

  // Remove the ad and restore content
  removeAd(overlay) {
    overlay.remove();
    this.restoreLiveContent();
    this.isDisplayingAd = false;
    this.currentAd = null;
  }

  // Squeeze live content based on content_area spec
  squeezeLiveContent(contentArea) {
    const liveContent = document.getElementById('live-content');
    liveContent.style.transition = 'all 0.3s ease';
    liveContent.style.width = contentArea.width_percent + '%';
    liveContent.style.height = contentArea.height_percent + '%';

    // Position based on content_area.position
    switch (contentArea.position) {
      case 'bottom-left':
        liveContent.style.top = 'auto';
        liveContent.style.bottom = '0';
        liveContent.style.left = '0';
        liveContent.style.right = 'auto';
        break;
      case 'top-right':
        liveContent.style.top = '0';
        liveContent.style.bottom = 'auto';
        liveContent.style.left = 'auto';
        liveContent.style.right = '0';
        break;
      // ... etc
    }
  }

  // Restore live content to full screen
  restoreLiveContent() {
    const liveContent = document.getElementById('live-content');
    liveContent.style.width = '100%';
    liveContent.style.height = '100%';
    liveContent.style.top = '0';
    liveContent.style.left = '0';
  }

  // Create the L-Bar overlay element
  createLBarOverlay(ad) {
    const overlay = document.createElement('div');
    overlay.id = 'lbar-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.pointerEvents = 'none';
    overlay.style.zIndex = '1000';

    if (ad.assets.type === 'video') {
      const video = document.createElement('video');
      video.src = ad.assets.video_url;
      video.poster = ad.assets.poster_url;
      video.muted = true;
      video.playsInline = true;
      video.style.width = '100%';
      video.style.height = '100%';
      video.style.objectFit = 'contain';
      overlay.appendChild(video);
    } else {
      const img = document.createElement('img');
      img.src = ad.assets.image_url;
      img.style.width = '100%';
      img.style.height = '100%';
      img.style.objectFit = 'contain';
      overlay.appendChild(img);
    }

    return overlay;
  }

  // Fire tracking pixel
  fireTracking(url) {
    const img = new Image();
    img.src = url + (url.includes('?') ? '&' : '?') + 'ts=' + Date.now();
  }
}

// Usage
const API_KEY = 'sk_live_your_api_key_here'; // Provided by HyperMindZ
const client = new SkreensLBarClient('https://<mcp-server>/api/mcp', API_KEY);

// Initialize on app start
await client.initialize();

// When a touchdown event is detected
sportsEventEmitter.on('TOUCHDOWN', async () => {
  const ad = await client.requestAd('TOUCHDOWN');
  if (ad) {
    await client.displayAd(ad);
  }
});

// When halftime starts
sportsEventEmitter.on('HALFTIME', async () => {
  const ad = await client.requestAd('HALFTIME', { asset_type: 'video' });
  if (ad) {
    await client.displayAd(ad);
  }
});
```

---

## Event Types

| Event | When to Trigger |
|-------|-----------------|
| `TOUCHDOWN` | NFL touchdown scored |
| `FIELD_GOAL` | NFL field goal made |
| `HALFTIME` | Any sport halftime break |
| `GOAL` | NHL/Soccer goal scored |
| `HOME_RUN` | MLB home run hit |
| `THREE_POINTER` | NBA three-point shot |
| `TIMEOUT` | Any timeout called |
| `GAME_START` | Game beginning |
| `GAME_END` | Game conclusion |
| `GENERIC` | Non-event ad request |

---

## Polling Strategy

For periodic ad display (non-event based), implement polling:

```javascript
class AdPoller {
  constructor(client, intervalMs = 300000) { // Default: 5 minutes
    this.client = client;
    this.intervalMs = intervalMs;
    this.timer = null;
  }

  start() {
    this.timer = setInterval(async () => {
      const ad = await this.client.requestAd('GENERIC');
      if (ad) {
        await this.client.displayAd(ad);
      }
    }, this.intervalMs);
  }

  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
}

// Poll for ads every 5 minutes during live content
const poller = new AdPoller(client, 5 * 60 * 1000);
poller.start();
```

---

## Error Handling

```javascript
async function requestAdWithRetry(eventType, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const ad = await client.requestAd(eventType);
      if (ad) return ad;
    } catch (error) {
      console.error(`Attempt ${attempt} failed:`, error);
      if (attempt < maxRetries) {
        await sleep(1000 * attempt); // Exponential backoff
      }
    }
  }

  // Fallback: show default/cached ad
  return getDefaultAd();
}
```

---

## Sequence Diagram

```
┌─────────────┐          ┌─────────────┐          ┌─────────────┐
│   Skreens   │          │  HyperMindZ │          │   Tracking  │
│   Client    │          │  MCP Server │          │   Server    │
└──────┬──────┘          └──────┬──────┘          └──────┬──────┘
       │                        │                        │
       │ 1. GET /api/mcp        │                        │
       │ (health check)         │                        │
       │───────────────────────>│                        │
       │                        │                        │
       │ 200 OK (server info)   │                        │
       │<───────────────────────│                        │
       │                        │                        │
       │ ═══ TOUCHDOWN EVENT ═══│                        │
       │                        │                        │
       │ 2. POST /api/mcp       │                        │
       │ {method: get_lbar_ad}  │                        │
       │───────────────────────>│                        │
       │                        │                        │
       │ 200 OK (ad response)   │                        │
       │<───────────────────────│                        │
       │                        │                        │
       │ 3. Squeeze live content│                        │
       │ 4. Render L-Bar overlay│                        │
       │ 5. Play video/image    │                        │
       │                        │                        │
       │ 6. Fire impression     │                        │
       │────────────────────────┼───────────────────────>│
       │                        │                        │
       │ [Wait duration_ms]     │                        │
       │                        │                        │
       │ 7. Remove overlay      │                        │
       │ 8. Restore content     │                        │
       │                        │                        │
       │ 9. Fire completion     │                        │
       │────────────────────────┼───────────────────────>│
       │                        │                        │
```

---

## Summary

1. **Initialize**: Check MCP server health on app start
2. **Listen**: Monitor for sports events (touchdown, halftime, etc.)
3. **Request**: Call `get_lbar_ad` with event type and optional filters
4. **Parse**: Extract orientation, dimensions, assets, and tracking URLs
5. **Render**: Squeeze live content, overlay L-Bar (image or video)
6. **Track**: Fire impression pixel on display
7. **Timeout**: Remove overlay after `duration_ms`
8. **Restore**: Return live content to full screen

The MCP server handles ad selection, rotation, and provides complete rendering specifications. The Skreens client is responsible for the actual display and content management.
