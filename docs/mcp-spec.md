# HyperMindZ MCP Server Specification

**Version**: 1.0.0
**Last Updated**: January 2025
**Status**: Draft

---

## Table of Contents

1. [Overview](#overview)
2. [Personas & User Stories](#personas--user-stories)
3. [Authentication](#authentication)
4. [Transport & Protocol](#transport--protocol)
5. [API Methods](#api-methods)
6. [Error Handling](#error-handling)
7. [Rate Limits & SLAs](#rate-limits--slas)
8. [Webhooks](#webhooks)
9. [Changelog](#changelog)

---

## Overview

The HyperMindZ MCP (Model Context Protocol) Server provides contextual advertising capabilities for DOOH (Digital Out-of-Home) displays. It enables real-time ad decisioning based on live events, audience identity resolution, and comprehensive event tracking.

### Base URL

| Environment | URL |
|-------------|-----|
| Production | `https://<production-domain>/mcp` |
| Sandbox | `https://<sandbox-domain>/mcp` |

### Key Capabilities

- **Identity Resolution**: Map device IDs to household segments
- **Contextual Ad Delivery**: Trigger ads based on live sports events
- **Event Tracking**: Track impressions, engagement, and conversions
- **Supply Synchronization**: Sync available inventory packages

---

## Personas & User Stories

### Personas

| Persona | Description | Primary Goals |
|---------|-------------|---------------|
| **Skreens Device** | Software running on DOOH displays in venues | Display contextual ads, track impressions, handle events |
| **Venue Operator** | Sports bar/venue manager using Skreens | Maximize ad revenue, ensure smooth playback |
| **Ad Ops Manager** | HyperMindZ advertising operations | Set up deals, monitor performance, optimize campaigns |
| **Brand Advertiser** | Ford, Toyota, etc. running campaigns | Reach sports fans with contextual messaging |

---

### User Story 1: Contextual Ad During Live Sports Event

**As a** Skreens Device at a sports bar,
**I want to** display a relevant L-Bar ad when a touchdown is scored,
**So that** viewers see contextually relevant advertising at the moment of peak engagement.

#### Sequence Diagram

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Skreens    │     │  HyperMindZ  │     │   Tracking   │
│   Device     │     │  MCP Server  │     │   Server     │
└──────┬───────┘     └──────┬───────┘     └──────┬───────┘
       │                    │                    │
       │ ──── STARTUP ────  │                    │
       │                    │                    │
       │ 1. resolve_identity│                    │
       │ (device_id, ip)    │                    │
       │───────────────────>│                    │
       │                    │                    │
       │ household_id,      │                    │
       │ segments           │                    │
       │<───────────────────│                    │
       │                    │                    │
       │ ─── TOUCHDOWN! ─── │                    │
       │                    │                    │
       │ 2. get_contextual_ad                    │
       │ (TOUCHDOWN, household_id)               │
       │───────────────────>│                    │
       │                    │                    │
       │ creative_id,       │                    │
       │ assets, template   │                    │
       │<───────────────────│                    │
       │                    │                    │
       │ ─── DISPLAY AD ─── │                    │
       │ [L-Bar renders     │                    │
       │  for 15 seconds]   │                    │
       │                    │                    │
       │ 3. post_ad_events  │                    │
       │ (impression, view) │                    │
       │───────────────────>│                    │
       │                    │ Fire tracking pixel│
       │                    │───────────────────>│
       │ events_processed   │                    │
       │<───────────────────│                    │
```

#### MCP Methods Used

| Step | Method | Purpose |
|------|--------|---------|
| 1 | `resolve_identity` | Map device to household segments for targeting |
| 2 | `get_contextual_ad` | Get touchdown-triggered ad creative |
| 3 | `post_ad_events` | Report impression and viewability |

---

### User Story 2: QR Code Engagement Tracking

**As a** Brand Advertiser,
**I want to** know when viewers scan the QR code on my L-Bar ad,
**So that** I can measure engagement and attribute conversions.

#### Sequence Diagram

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Viewer's   │     │   Skreens    │     │  HyperMindZ  │
│   Phone      │     │   Device     │     │  MCP Server  │
└──────┬───────┘     └──────┬───────┘     └──────┬───────┘
       │                    │                    │
       │ [L-Bar displaying  │                    │
       │  Ford ad with QR]  │                    │
       │                    │                    │
       │ 1. Scan QR code    │                    │
       │───────────────────>│                    │
       │                    │                    │
       │                    │ 2. post_ad_events  │
       │                    │ (qr_scan event)    │
       │                    │───────────────────>│
       │                    │                    │
       │ 3. Redirect to     │                    │
       │ ford.com/promo     │                    │
       │<───────────────────│                    │
       │                    │                    │
       │ [Viewer lands on   │                    │
       │  Ford promo page]  │                    │
       │                    │                    │
       │                    │ 4. post_ad_events  │
       │                    │ (conversion event) │
       │                    │───────────────────>│
```

#### MCP Methods Used

| Step | Method | Purpose |
|------|--------|---------|
| 2 | `post_ad_events` | Track QR scan with timestamp and device context |
| 4 | `post_ad_events` | Track conversion (optional, if pixel fires) |

---

### User Story 3: Standard Ad Rotation (Non-Event)

**As a** Skreens Device,
**I want to** display ads during non-event periods,
**So that** inventory is monetized even when no sports events are occurring.

#### Sequence Diagram

```
┌──────────────┐     ┌──────────────┐
│   Skreens    │     │  HyperMindZ  │
│   Device     │     │  MCP Server  │
└──────┬───────┘     └──────┬───────┘
       │                    │
       │ [Ad slot available]│
       │                    │
       │ 1. get_ad_decision │
       │ (placement_id,     │
       │  household_id)     │
       │───────────────────>│
       │                    │
       │ creative_id,       │
       │ assets, bid_price  │
       │<───────────────────│
       │                    │
       │ [Display ad for    │
       │  10 seconds]       │
       │                    │
       │ 2. post_ad_events  │
       │ (impression,       │
       │  video quartiles)  │
       │───────────────────>│
       │                    │
       │ events_processed   │
       │<───────────────────│
       │                    │
       │ [Next ad slot...   │
       │  repeat]           │
```

#### MCP Methods Used

| Step | Method | Purpose |
|------|--------|---------|
| 1 | `get_ad_decision` | Get next ad for standard rotation |
| 2 | `post_ad_events` | Report impression and video progress |

---

### User Story 4: Campaign Setup & Inventory Sync

**As an** Ad Ops Manager,
**I want to** sync available inventory packages and active deals,
**So that** Skreens devices know what campaigns are eligible to serve.

#### Sequence Diagram

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Skreens    │     │  HyperMindZ  │     │   HyperMindZ │
│   Backend    │     │  MCP Server  │     │   Dashboard  │
└──────┬───────┘     └──────┬───────┘     └──────┬───────┘
       │                    │                    │
       │                    │ [Ad Ops creates    │
       │                    │  new PMP deal]     │
       │                    │<───────────────────│
       │                    │                    │
       │ 1. sync_supply_packages                 │
       │ (full sync)        │                    │
       │───────────────────>│                    │
       │                    │                    │
       │ packages[],        │                    │
       │ deals[],           │                    │
       │ sync_timestamp     │                    │
       │<───────────────────│                    │
       │                    │                    │
       │ [Cache packages    │                    │
       │  and deals locally]│                    │
       │                    │                    │
       │ ─── 1 HOUR LATER ──│                    │
       │                    │                    │
       │ 2. sync_supply_packages                 │
       │ (incremental,      │                    │
       │  last_sync_ts)     │                    │
       │───────────────────>│                    │
       │                    │                    │
       │ updated packages,  │                    │
       │ new/modified deals │                    │
       │<───────────────────│                    │
```

#### MCP Methods Used

| Step | Method | Purpose |
|------|--------|---------|
| 1 | `sync_supply_packages` | Full sync of all packages and deals |
| 2 | `sync_supply_packages` | Incremental sync for updates only |

---

### User Story 5: Multi-Event Game Day

**As a** Skreens Device during Super Bowl Sunday,
**I want to** handle rapid-fire events (touchdowns, field goals, halftime),
**So that** each moment triggers the right contextual ad without conflicts.

#### Sequence Diagram

```
┌──────────────┐     ┌──────────────┐
│   Skreens    │     │  HyperMindZ  │
│   Device     │     │  MCP Server  │
└──────┬───────┘     └──────┬───────┘
       │                    │
       │ [Game starts]      │
       │                    │
       │ 1. get_contextual_ad
       │ (GAME_START)       │
       │───────────────────>│
       │ Ford "Game Day" ad │
       │<───────────────────│
       │                    │
       │ [Q1: Touchdown KC] │
       │                    │
       │ 2. get_contextual_ad
       │ (TOUCHDOWN, team=KC)
       │───────────────────>│
       │ Budweiser "TD!" ad │
       │<───────────────────│
       │                    │
       │ [Q2: Field Goal SF]│
       │                    │
       │ 3. get_contextual_ad
       │ (FIELD_GOAL, team=SF)
       │───────────────────>│
       │ Toyota "3 Points!" │
       │<───────────────────│
       │                    │
       │ [Halftime]         │
       │                    │
       │ 4. get_contextual_ad
       │ (HALFTIME)         │
       │───────────────────>│
       │ Apple "Halftime    │
       │ Show Sponsor" ad   │
       │<───────────────────│
       │                    │
       │ [Post each ad...]  │
       │                    │
       │ 5. post_ad_events  │
       │ (batch of events)  │
       │───────────────────>│
```

#### MCP Methods Used

| Step | Method | Purpose |
|------|--------|---------|
| 1-4 | `get_contextual_ad` | Event-specific ad retrieval |
| 5 | `post_ad_events` | Batch reporting of all impressions |

---

### User Story 6: Fallback Handling

**As a** Skreens Device,
**I want to** gracefully handle API failures or no-fill responses,
**So that** viewers always see appropriate content without errors.

#### Sequence Diagram

```
┌──────────────┐     ┌──────────────┐
│   Skreens    │     │  HyperMindZ  │
│   Device     │     │  MCP Server  │
└──────┬───────┘     └──────┬───────┘
       │                    │
       │ [Touchdown event]  │
       │                    │
       │ 1. get_contextual_ad
       │───────────────────>│
       │                    │
       │ [Scenario A: No Fill]
       │ creative_id: null  │
       │ no_ad_reason:      │
       │ "frequency_capped" │
       │<───────────────────│
       │                    │
       │ [Use cached        │
       │  fallback ad]      │
       │                    │
       │ ─── OR ───         │
       │                    │
       │ [Scenario B: Timeout]
       │ (no response       │
       │  within 300ms)     │
       │         X          │
       │                    │
       │ [Use local         │
       │  default creative] │
       │                    │
       │ ─── OR ───         │
       │                    │
       │ [Scenario C: Error]│
       │ error: -32603      │
       │ "Internal Error"   │
       │<───────────────────│
       │                    │
       │ [Retry with        │
       │  exponential       │
       │  backoff]          │
       │                    │
       │ 2. get_contextual_ad
       │ (retry attempt)    │
       │───────────────────>│
```

#### Fallback Strategy

| Scenario | Response | Skreens Action |
|----------|----------|----------------|
| No Fill | `creative_id: null` | Show cached/default ad |
| Timeout | No response in 300ms | Show local fallback |
| Server Error | Error code -32603 | Retry with backoff |
| Auth Error | Error code -32000 | Refresh OAuth token |

---

### Summary: Method Usage by User Story

| User Story | `resolve_identity` | `get_contextual_ad` | `get_ad_decision` | `post_ad_events` | `sync_supply_packages` |
|------------|:------------------:|:-------------------:|:-----------------:|:----------------:|:----------------------:|
| 1. Contextual Ad | ✓ | ✓ | | ✓ | |
| 2. QR Engagement | | | | ✓ | |
| 3. Standard Rotation | | | ✓ | ✓ | |
| 4. Campaign Setup | | | | | ✓ |
| 5. Multi-Event Game | | ✓ | | ✓ | |
| 6. Fallback Handling | | ✓ | | | |

---

## Authentication

HyperMindZ uses **OAuth 2.1 with PKCE** via Clerk for authentication. All API requests must include a valid Bearer token.

### OAuth Flow

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Skreens Client │     │   Clerk OAuth   │     │ HyperMindZ MCP  │
└────────┬────────┘     └────────┬────────┘     └────────┬────────┘
         │                       │                       │
         │ 1. GET /.well-known/oauth-protected-resource  │
         │──────────────────────────────────────────────>│
         │                       │                       │
         │ 2. Protected Resource Metadata                │
         │<──────────────────────────────────────────────│
         │                       │                       │
         │ 3. Authorization Request (PKCE)               │
         │──────────────────────>│                       │
         │                       │                       │
         │ 4. Access Token       │                       │
         │<──────────────────────│                       │
         │                       │                       │
         │ 5. MCP Request + Bearer Token                 │
         │──────────────────────────────────────────────>│
         │                       │                       │
         │ 6. MCP Response       │                       │
         │<──────────────────────────────────────────────│
```

### Discovery Endpoint

```
GET /.well-known/oauth-protected-resource
```

**Response:**
```json
{
  "resource": "https://<production-domain>/mcp",
  "authorization_servers": ["https://<clerk-domain>"],
  "scopes_supported": [
    "mcp:read",
    "mcp:write",
    "mcp:admin"
  ],
  "bearer_methods_supported": ["header"],
  "resource_documentation": "https://<docs-domain>/mcp"
}
```

### Required Scopes

| Scope | Description |
|-------|-------------|
| `mcp:read` | Read-only access (resolve_identity, get_contextual_ad, get_ad_decision) |
| `mcp:write` | Write access (post_ad_events) |
| `mcp:admin` | Admin access (sync_supply_packages) |

### Request Headers

```http
POST /mcp HTTP/1.1
Host: <production-domain>
Authorization: Bearer <access_token>
Content-Type: application/json
X-Request-ID: <unique-request-id>
X-Client-Version: <client-version>
```

---

## Transport & Protocol

### JSON-RPC 2.0

All MCP communication uses JSON-RPC 2.0 over HTTPS POST requests.

**Request Format:**
```json
{
  "jsonrpc": "2.0",
  "method": "<method_name>",
  "params": { ... },
  "id": "<request_id>"
}
```

**Response Format (Success):**
```json
{
  "jsonrpc": "2.0",
  "result": { ... },
  "id": "<request_id>"
}
```

**Response Format (Error):**
```json
{
  "jsonrpc": "2.0",
  "error": {
    "code": <error_code>,
    "message": "<error_message>",
    "data": { ... }
  },
  "id": "<request_id>"
}
```

### Batch Requests

Multiple methods can be called in a single request:

```json
[
  { "jsonrpc": "2.0", "method": "resolve_identity", "params": {...}, "id": "1" },
  { "jsonrpc": "2.0", "method": "get_contextual_ad", "params": {...}, "id": "2" }
]
```

---

## API Methods

### 1. resolve_identity

Resolves a device identifier to a household profile with audience segments.

**Required Scope:** `mcp:read`

**Request:**
```json
{
  "jsonrpc": "2.0",
  "method": "resolve_identity",
  "params": {
    "device_id": "skreens-venue-342-screen-7",
    "ip_address": "192.168.1.45",
    "user_agent": "Skreens/3.2.1",
    "venue_id": "venue-342",
    "timestamp": "2025-01-23T14:30:00.000Z"
  },
  "id": "req-001"
}
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `device_id` | string | Yes | Unique device identifier |
| `ip_address` | string | No | Device IP address |
| `user_agent` | string | No | Client user agent string |
| `venue_id` | string | No | Venue identifier for location context |
| `timestamp` | string | No | ISO 8601 timestamp |

**Response:**
```json
{
  "jsonrpc": "2.0",
  "result": {
    "household_id": "HH-8847291",
    "segments": [
      "sports_fan",
      "high_hhi",
      "auto_intender",
      "qsr_frequent"
    ],
    "consent_status": "opted_in",
    "match_confidence": 0.94,
    "match_type": "deterministic",
    "demographics": {
      "age_range": "25-54",
      "income_bracket": "100k+",
      "presence": {
        "adults": 2,
        "children": 1
      }
    },
    "ttl_seconds": 3600
  },
  "id": "req-001"
}
```

| Field | Type | Description |
|-------|------|-------------|
| `household_id` | string | Unique household identifier |
| `segments` | string[] | Audience segment tags |
| `consent_status` | enum | `opted_in`, `opted_out`, `unknown` |
| `match_confidence` | number | 0.0 - 1.0 confidence score |
| `match_type` | enum | `deterministic`, `probabilistic`, `contextual` |
| `demographics` | object | Demographic attributes |
| `ttl_seconds` | number | Cache TTL for this resolution |

---

### 2. get_contextual_ad

Retrieves a contextual ad creative based on a live event trigger.

**Required Scope:** `mcp:read`

**Request:**
```json
{
  "jsonrpc": "2.0",
  "method": "get_contextual_ad",
  "params": {
    "event_type": "TOUCHDOWN",
    "event_data": {
      "team": "KC",
      "player": "Mahomes",
      "quarter": 2,
      "score_home": 14,
      "score_away": 7
    },
    "content_id": "nfl-kc-sf-2025",
    "household_id": "HH-8847291",
    "screen_capabilities": {
      "lbar_supported": true,
      "overlay_supported": true,
      "max_width_percent": 30,
      "resolution": "1920x1080",
      "hdr_supported": false
    },
    "deal_ids": ["deal-pmp-001", "deal-pmp-002"]
  },
  "id": "req-002"
}
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `event_type` | enum | Yes | Event trigger type (see Event Types) |
| `event_data` | object | No | Additional event context |
| `content_id` | string | Yes | Content/program identifier |
| `household_id` | string | No | From resolve_identity |
| `screen_capabilities` | object | Yes | Display capabilities |
| `deal_ids` | string[] | No | PMP deal IDs to consider |

**Event Types:**

| Event Type | Sport | Description |
|------------|-------|-------------|
| `TOUCHDOWN` | NFL | Touchdown scored |
| `FIELD_GOAL` | NFL | Field goal made |
| `HALFTIME` | All | Halftime break |
| `GOAL` | NHL/Soccer | Goal scored |
| `HOME_RUN` | MLB | Home run hit |
| `THREE_POINTER` | NBA | Three-point shot made |
| `TIMEOUT` | All | Timeout called |
| `GAME_START` | All | Game beginning |
| `GAME_END` | All | Game conclusion |
| `HIGHLIGHT` | All | Replay/highlight moment |

**Response:**
```json
{
  "jsonrpc": "2.0",
  "result": {
    "creative_id": "ford-f150-sports-2025",
    "advertiser": "Ford Motor Company",
    "campaign_id": "camp-ford-q1-2025",
    "deal_id": "deal-pmp-001",
    "template": "lbar_squeeze_20",
    "duration_ms": 15000,
    "priority": 1,
    "assets": {
      "headline": "TOUCHDOWN DEAL!",
      "subheadline": "Celebrate with $5,000 off",
      "cta": "Scan for Offer",
      "logo_url": "https://<cdn-domain>/assets/ford-logo.png",
      "background_url": "https://<cdn-domain>/assets/ford-f150-bg.jpg",
      "qr_code_url": "https://<cdn-domain>/qr/ford-f150-promo",
      "qr_destination": "https://ford.com/f150-promo?utm_source=skreens"
    },
    "tracking": {
      "impression_url": "https://<tracking-domain>/imp/abc123",
      "viewable_url": "https://<tracking-domain>/view/abc123",
      "click_url": "https://<tracking-domain>/clk/abc123",
      "qr_scan_url": "https://<tracking-domain>/qr/abc123"
    },
    "restrictions": {
      "frequency_cap": {
        "max_impressions": 3,
        "period_hours": 24
      },
      "dayparting": {
        "allowed_hours": [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22]
      }
    },
    "fallback_creative_id": "generic-sports-2025"
  },
  "id": "req-002"
}
```

**Template Types:**

| Template | Description | Duration |
|----------|-------------|----------|
| `lbar_squeeze_20` | L-Bar with 20% content squeeze | 15-30s |
| `lbar_squeeze_30` | L-Bar with 30% content squeeze | 15-30s |
| `lbar_overlay` | L-Bar overlay (no squeeze) | 10-20s |
| `full_overlay` | Full-screen overlay | 5-15s |
| `lower_third` | Lower third banner | 10-20s |
| `corner_bug` | Corner logo/bug | 5-30s |

---

### 3. get_ad_decision

General ad decision for non-event-triggered placements.

**Required Scope:** `mcp:read`

**Request:**
```json
{
  "jsonrpc": "2.0",
  "method": "get_ad_decision",
  "params": {
    "placement_id": "venue-342-lobby-screen",
    "placement_type": "standard",
    "household_id": "HH-8847291",
    "content_context": {
      "category": "sports",
      "subcategory": "nfl",
      "content_rating": "G"
    },
    "screen_capabilities": {
      "resolution": "1920x1080",
      "audio_enabled": false
    },
    "excluded_advertisers": ["competitor-brand-1"],
    "excluded_categories": ["alcohol", "gambling"]
  },
  "id": "req-003"
}
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `placement_id` | string | Yes | Unique placement identifier |
| `placement_type` | enum | Yes | `standard`, `premium`, `remnant` |
| `household_id` | string | No | Audience identifier |
| `content_context` | object | No | Content metadata |
| `screen_capabilities` | object | Yes | Display capabilities |
| `excluded_advertisers` | string[] | No | Blocked advertisers |
| `excluded_categories` | string[] | No | Blocked ad categories |

**Response:**
```json
{
  "jsonrpc": "2.0",
  "result": {
    "decision_id": "dec-789xyz",
    "creative_id": "toyota-tundra-2025",
    "advertiser": "Toyota",
    "deal_id": "deal-pg-002",
    "deal_type": "programmatic_guaranteed",
    "bid_price_cpm": 12.50,
    "currency": "USD",
    "template": "full_overlay",
    "duration_ms": 10000,
    "assets": {
      "video_url": "https://<cdn-domain>/video/toyota-tundra.mp4",
      "companion_image": "https://<cdn-domain>/assets/toyota-companion.jpg"
    },
    "tracking": {
      "impression_url": "https://<tracking-domain>/imp/xyz789",
      "quartile_urls": {
        "first": "https://<tracking-domain>/q1/xyz789",
        "mid": "https://<tracking-domain>/q2/xyz789",
        "third": "https://<tracking-domain>/q3/xyz789",
        "complete": "https://<tracking-domain>/q4/xyz789"
      }
    },
    "no_ad_reason": null
  },
  "id": "req-003"
}
```

**No Ad Reasons** (when `creative_id` is null):

| Reason | Description |
|--------|-------------|
| `no_fill` | No eligible ads available |
| `frequency_capped` | User hit frequency cap |
| `blocked_category` | All ads in blocked categories |
| `below_floor` | No bids above floor price |
| `consent_required` | User consent not available |

---

### 4. post_ad_events

Reports ad delivery and engagement events.

**Required Scope:** `mcp:write`

**Request:**
```json
{
  "jsonrpc": "2.0",
  "method": "post_ad_events",
  "params": {
    "events": [
      {
        "event_type": "impression",
        "creative_id": "ford-f150-sports-2025",
        "decision_id": "dec-abc123",
        "timestamp": "2025-01-23T14:32:45.123Z",
        "device_id": "skreens-venue-342-screen-7",
        "duration_viewed_ms": 15000,
        "viewability": {
          "in_view_percent": 100,
          "audible": false
        }
      },
      {
        "event_type": "qr_scan",
        "creative_id": "ford-f150-sports-2025",
        "decision_id": "dec-abc123",
        "timestamp": "2025-01-23T14:32:52.456Z",
        "device_id": "skreens-venue-342-screen-7",
        "scan_data": {
          "user_agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0)",
          "redirect_url": "https://ford.com/f150-promo"
        }
      }
    ]
  },
  "id": "req-004"
}
```

**Event Types:**

| Event Type | Description | Required Fields |
|------------|-------------|-----------------|
| `impression` | Ad was displayed | `duration_viewed_ms` |
| `viewable_impression` | Ad was viewable (MRC standard) | `viewability` |
| `click` | User clicked/tapped | `click_url` |
| `qr_scan` | QR code was scanned | `scan_data` |
| `video_start` | Video playback started | - |
| `video_q1` | Video 25% complete | - |
| `video_q2` | Video 50% complete | - |
| `video_q3` | Video 75% complete | - |
| `video_complete` | Video 100% complete | - |
| `engagement` | Custom engagement | `engagement_type` |
| `conversion` | Conversion tracked | `conversion_data` |

**Response:**
```json
{
  "jsonrpc": "2.0",
  "result": {
    "events_processed": 2,
    "events_failed": 0,
    "failed_events": [],
    "status": "success",
    "receipt_id": "rcpt-20250123-143245-abc"
  },
  "id": "req-004"
}
```

---

### 5. sync_supply_packages

Synchronizes available inventory packages and deal configurations.

**Required Scope:** `mcp:admin`

**Request:**
```json
{
  "jsonrpc": "2.0",
  "method": "sync_supply_packages",
  "params": {
    "sync_type": "full",
    "last_sync_timestamp": "2025-01-22T00:00:00.000Z",
    "venue_ids": ["venue-342", "venue-567"]
  },
  "id": "req-005"
}
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `sync_type` | enum | Yes | `full`, `incremental` |
| `last_sync_timestamp` | string | No | For incremental syncs |
| `venue_ids` | string[] | No | Filter to specific venues |

**Response:**
```json
{
  "jsonrpc": "2.0",
  "result": {
    "packages": [
      {
        "package_id": "pkg-sports-bars-premium",
        "name": "Premium Sports Bars - National",
        "description": "High-traffic sports bars in top 50 DMAs",
        "venue_count": 1250,
        "screen_count": 3800,
        "avg_daily_impressions": 2500000,
        "floor_cpm": 8.50,
        "deal_types_available": ["pmp", "preferred", "pg"],
        "audience_segments": ["sports_fan", "high_hhi", "male_25_54"],
        "content_categories": ["sports", "entertainment"],
        "geo_targeting": {
          "countries": ["US"],
          "dmas": ["501", "803", "623"]
        },
        "capabilities": {
          "lbar_enabled": true,
          "contextual_triggers": true,
          "audio_enabled": false
        },
        "quality_metrics": {
          "viewability_rate": 0.92,
          "brand_safety_score": 0.98,
          "ivt_rate": 0.02
        },
        "updated_at": "2025-01-23T10:00:00.000Z"
      }
    ],
    "deals": [
      {
        "deal_id": "deal-pmp-001",
        "deal_type": "pmp",
        "name": "Ford Q1 Sports Campaign",
        "advertiser": "Ford Motor Company",
        "package_ids": ["pkg-sports-bars-premium"],
        "floor_cpm": 12.00,
        "budget_daily": 50000,
        "budget_total": 1500000,
        "start_date": "2025-01-01",
        "end_date": "2025-03-31",
        "status": "active",
        "pacing": {
          "type": "even",
          "current_spend": 245000,
          "target_spend": 250000
        }
      }
    ],
    "sync_timestamp": "2025-01-23T14:35:00.000Z",
    "next_sync_recommended": "2025-01-23T15:35:00.000Z"
  },
  "id": "req-005"
}
```

---

## Error Handling

### Error Codes

| Code | Name | Description |
|------|------|-------------|
| -32700 | Parse Error | Invalid JSON |
| -32600 | Invalid Request | Invalid JSON-RPC request |
| -32601 | Method Not Found | Unknown method |
| -32602 | Invalid Params | Invalid method parameters |
| -32603 | Internal Error | Internal server error |
| -32000 | Authentication Error | Invalid or expired token |
| -32001 | Authorization Error | Insufficient scope |
| -32002 | Rate Limit Exceeded | Too many requests |
| -32003 | Resource Not Found | Requested resource not found |
| -32004 | Validation Error | Input validation failed |
| -32005 | Service Unavailable | Temporary service outage |

### Error Response Example

```json
{
  "jsonrpc": "2.0",
  "error": {
    "code": -32001,
    "message": "Insufficient scope for method sync_supply_packages",
    "data": {
      "required_scope": "mcp:admin",
      "current_scopes": ["mcp:read", "mcp:write"]
    }
  },
  "id": "req-005"
}
```

### Retry Strategy

| Error Type | Retry | Backoff |
|------------|-------|---------|
| -32700, -32600, -32601, -32602 | No | - |
| -32603, -32005 | Yes | Exponential (1s, 2s, 4s, 8s) |
| -32000, -32001 | No | Refresh token |
| -32002 | Yes | Wait for rate limit reset |
| -32003, -32004 | No | Fix request |

---

## Rate Limits & SLAs

### Rate Limits

| Scope | Limit | Window |
|-------|-------|--------|
| `mcp:read` | 1000 req/min | Per client |
| `mcp:write` | 500 req/min | Per client |
| `mcp:admin` | 60 req/min | Per client |

**Rate Limit Headers:**
```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 847
X-RateLimit-Reset: 1706019600
```

### Service Level Agreements

| Metric | Target | Measurement |
|--------|--------|-------------|
| Availability | 99.9% | Monthly |
| `resolve_identity` latency | < 50ms | p95 |
| `get_contextual_ad` latency | < 75ms | p95 |
| `get_ad_decision` latency | < 75ms | p95 |
| `post_ad_events` latency | < 30ms | p95 |
| `sync_supply_packages` latency | < 500ms | p95 |

### Timeout Recommendations

| Method | Client Timeout |
|--------|----------------|
| `resolve_identity` | 200ms |
| `get_contextual_ad` | 300ms |
| `get_ad_decision` | 300ms |
| `post_ad_events` | 100ms |
| `sync_supply_packages` | 2000ms |

---

## Webhooks

HyperMindZ can send real-time notifications for key events.

### Webhook Events

| Event | Description |
|-------|-------------|
| `deal.activated` | PMP deal activated |
| `deal.paused` | Deal paused (budget/pacing) |
| `deal.completed` | Deal reached end date |
| `creative.approved` | Creative approved |
| `creative.rejected` | Creative rejected |
| `alert.low_fill` | Fill rate below threshold |
| `alert.latency` | Latency SLA breach |

### Webhook Payload

```json
{
  "event_type": "deal.activated",
  "event_id": "evt-abc123",
  "timestamp": "2025-01-23T14:00:00.000Z",
  "data": {
    "deal_id": "deal-pmp-001",
    "deal_name": "Ford Q1 Sports Campaign"
  },
  "signature": "sha256=..."
}
```

### Webhook Security

- HTTPS required
- HMAC-SHA256 signature verification
- 5-second timeout
- 3 retry attempts with exponential backoff

---

## Changelog

### v1.0.0 (January 2025)
- Initial release
- 5 core methods: `resolve_identity`, `get_contextual_ad`, `get_ad_decision`, `post_ad_events`, `sync_supply_packages`
- Clerk OAuth 2.1 authentication
- JSON-RPC 2.0 transport

---

## Contact

- **Technical Support**: <support-email>
- **API Status**: https://<status-domain>
- **Documentation**: https://<docs-domain>/mcp
