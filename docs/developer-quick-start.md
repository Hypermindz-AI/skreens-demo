# HyperMindZ MCP Integration - Developer Quick Start

## Endpoint

```
POST https://ad-server.agenticregistry.ai/api/mcp
```

## Authentication

**Required for all requests.** Use one of these headers:

```
Authorization: Bearer <API_KEY>
```
or
```
X-API-Key: <API_KEY>
```

Contact HyperMindZ to obtain your API key.

---

## Integration Flow

```
1. resolve_identity  →  Get household_id from device
2. get_contextual_ad →  Get targeted ad for event + household
3. Display L-Bar     →  Render ad overlay on screen
```

---

## Method 1: Resolve Identity

Maps a Skreens device to a household profile with audience segments.

```json
// Request
{
  "jsonrpc": "2.0",
  "method": "resolve_identity",
  "params": {
    "device_id": "skreens-venue-42-screen-1",
    "ip": "192.168.1.100"
  },
  "id": "1"
}

// Response
{
  "jsonrpc": "2.0",
  "result": {
    "success": true,
    "household_id": "hh_001",
    "profile": {
      "segments": ["sports-enthusiasts", "premium-auto-intenders"],
      "sports_affinities": ["NFL", "NBA"]
    },
    "resolution": {
      "method": "deterministic",
      "confidence": 0.95
    }
  },
  "id": "1"
}
```

**Device ID Format:** `skreens-{venue_id}-{screen_id}` (e.g., `skreens-venue-42-screen-1`)

---

## Method 2: Get Contextual Ad

Returns a targeted L-Bar ad based on event type and household segments.

```json
// Request
{
  "jsonrpc": "2.0",
  "method": "get_contextual_ad",
  "params": {
    "event_type": "TOUCHDOWN",
    "household_id": "hh_001",
    "orientation": "top-right",
    "asset_type": "image"
  },
  "id": "2"
}

// Response (Image Ad)
{
  "jsonrpc": "2.0",
  "result": {
    "success": true,
    "ad": {
      "id": "ford-f150-touchdown",
      "advertiser": "Ford",
      "campaign": "Touchdown Deals",
      "orientation": "top-right",
      "dimensions": {
        "top_bar_height": 12,
        "right_bar_width": 20
      },
      "duration_ms": 15000,
      "assets": {
        "type": "image",
        "image_url": "/ads/ford-f150-lbar.png",
        "logo_url": "/ads/ford-logo.png",
        "qr_code_url": "/ads/qr-ford.png",
        "headline": "BUILT FORD TOUGH",
        "subheadline": "$5,000 off F-150",
        "cta": "Build Yours",
        "background_color": "#003478",
        "text_color": "#FFFFFF",
        "accent_color": "#F5B400"
      },
      "tracking": {
        "impression_url": "/api/track/impression?ad=ford-f150",
        "click_url": "/api/track/click?ad=ford-f150"
      },
      "content_area": {
        "position": "bottom-left",
        "width_percent": 80,
        "height_percent": 88
      }
    },
    "targeting": {
      "method": "contextual",
      "score": 0.98,
      "matched_segments": ["premium-auto-intenders", "sports-enthusiasts"],
      "event_relevance": 1.0,
      "segment_relevance": 0.95
    }
  },
  "id": "2"
}

// Response (Video Ad)
{
  "jsonrpc": "2.0",
  "result": {
    "success": true,
    "ad": {
      "id": "toyota-halftime",
      "advertiser": "Toyota",
      "campaign": "Halftime Deals",
      "orientation": "left-bottom",
      "dimensions": {
        "left_bar_width": 22,
        "bottom_bar_height": 15
      },
      "duration_ms": 20000,
      "assets": {
        "type": "video",
        "video_url": "/ads/toyota-tundra.mp4",
        "poster_url": "/ads/toyota-poster.jpg",
        "logo_url": "/ads/toyota-logo.png",
        "headline": "HALFTIME DEAL",
        "subheadline": "0% APR for 60 months",
        "cta": "Shop Now",
        "background_color": "#1a1a1a",
        "text_color": "#FFFFFF",
        "accent_color": "#EB0A1E"
      },
      "tracking": {
        "impression_url": "/api/track/impression?ad=toyota-halftime",
        "click_url": "/api/track/click?ad=toyota-halftime"
      },
      "content_area": {
        "position": "top-right",
        "width_percent": 78,
        "height_percent": 85
      }
    },
    "targeting": {
      "method": "contextual",
      "score": 0.96,
      "matched_segments": ["premium-auto-intenders"],
      "event_relevance": 1.0,
      "segment_relevance": 0.90
    }
  },
  "id": "2"
}
```

---

## Asset URLs Reference

| Field | Type | Description |
|-------|------|-------------|
| `image_url` | string | Static image for image-type ads (download and display) |
| `video_url` | string | Video file for video-type ads (stream or download) |
| `poster_url` | string | Video thumbnail shown before playback |
| `logo_url` | string | Advertiser brand logo |
| `qr_code_url` | string | QR code image for mobile engagement |

**Base URL:** Relative paths are served from the MCP server origin. Prepend `https://ad-server.agenticregistry.ai` for absolute URLs.

---

## Valid Event Types

| Sport | Events |
|-------|--------|
| Football | `TOUCHDOWN`, `FIELD_GOAL`, `SAFETY`, `INTERCEPTION` |
| Basketball | `THREE_POINTER`, `SLAM_DUNK`, `BUZZER_BEATER` |
| Hockey | `GOAL`, `POWER_PLAY_GOAL`, `PENALTY_SHOT` |
| Baseball | `HOME_RUN`, `GRAND_SLAM`, `STRIKEOUT` |
| Soccer | `SOCCER_GOAL`, `PENALTY_KICK`, `RED_CARD` |
| Generic | `HALFTIME`, `TIMEOUT`, `GAME_START`, `GAME_END`, `COMMERCIAL_BREAK` |

---

## L-Bar Orientations

| Orientation | Layout |
|-------------|--------|
| `top-right` | Top bar + right sidebar |
| `left-bottom` | Left sidebar + bottom bar |
| `top-left` | Top bar + left sidebar |
| `right-bottom` | Right sidebar + bottom bar |

---

## Quick Test with cURL

```bash
# 1. Resolve Identity
curl -X POST https://ad-server.agenticregistry.ai/api/mcp \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{"jsonrpc":"2.0","method":"resolve_identity","params":{"device_id":"skreens-venue-42-screen-1"},"id":"1"}'

# 2. Get Contextual Ad
curl -X POST https://ad-server.agenticregistry.ai/api/mcp \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{"jsonrpc":"2.0","method":"get_contextual_ad","params":{"event_type":"TOUCHDOWN","household_id":"hh_001"},"id":"2"}'
```

---

## Interactive Test Client

Use the built-in test client to explore the API:

```
https://ad-server.agenticregistry.ai/test-client
```

Features:
- Identity resolution with device/IP inputs
- Event trigger buttons for all sports
- Live L-Bar overlay preview
- Debug log for request/response inspection
- API key input for production testing

---

## Support

- Full API spec: `/docs/mcp-spec.md`
- Integration guide: `/docs/skreens-client-integration-guide.md`
- Test client source: `/src/app/test-client/page.tsx`
