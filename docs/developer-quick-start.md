# HyperMindZ MCP Integration - Developer Quick Start

## Endpoint

```
POST https://skreens-demo.vercel.app/api/mcp
```

## Authentication

| Environment | Auth Required |
|-------------|---------------|
| Development | No |
| Production  | Yes - `Authorization: Bearer <API_KEY>` or `X-API-Key: <API_KEY>` |

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

// Response
{
  "jsonrpc": "2.0",
  "result": {
    "success": true,
    "ad": {
      "id": "ford-f150-touchdown",
      "advertiser": "Ford",
      "orientation": "top-right",
      "duration_ms": 15000,
      "assets": {
        "headline": "BUILT FORD TOUGH",
        "cta": "Build Yours",
        "background_color": "#003478"
      }
    },
    "targeting": {
      "score": 0.98,
      "matched_segments": ["premium-auto-intenders", "sports-enthusiasts"]
    }
  },
  "id": "2"
}
```

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
curl -X POST https://skreens-demo.vercel.app/api/mcp \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{"jsonrpc":"2.0","method":"resolve_identity","params":{"device_id":"skreens-venue-42-screen-1"},"id":"1"}'

# 2. Get Contextual Ad
curl -X POST https://skreens-demo.vercel.app/api/mcp \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{"jsonrpc":"2.0","method":"get_contextual_ad","params":{"event_type":"TOUCHDOWN","household_id":"hh_001"},"id":"2"}'
```

---

## Interactive Test Client

Use the built-in test client to explore the API:

```
https://skreens-demo.vercel.app/test-client
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
