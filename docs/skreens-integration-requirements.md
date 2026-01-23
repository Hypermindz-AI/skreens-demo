# Skreens Integration Requirements

**Document Version**: 1.0.0
**Date**: January 2025
**Status**: Draft - Awaiting Skreens Input

---

## Executive Summary

This document captures the technical requirements needed from Skreens to enable real-time contextual advertising on DOOH displays via the HyperMindZ MCP (Model Context Protocol) server.

### What We're Building Together

A seamless integration that triggers **contextual L-Bar ads** on Skreens displays during live sports events (touchdowns, goals, halftime, etc.), with full impression tracking and PMP deal support.

### Key Information Needed from Skreens

| Category | What We Need | Why It Matters |
|----------|--------------|----------------|
| **Device Specs** | Screen capabilities, resolutions, L-Bar support | Ensures ads render correctly on all displays |
| **Event Detection** | Which sports events can trigger ads, detection latency | Determines real-time ad triggering capabilities |
| **Creative Support** | Supported templates, asset formats, file size limits | Ensures creative compatibility |
| **Tracking** | What metrics can be measured (impressions, QR scans, dwell time) | Enables accurate reporting and billing |
| **Infrastructure** | Expected traffic volume, latency requirements | Ensures we scale appropriately |
| **Compliance** | Privacy practices, consent handling | Ensures regulatory compliance |

### Timeline to Integration

| Phase | Duration |
|-------|----------|
| Requirements Alignment | 1-2 weeks |
| Sandbox Integration | 2-3 weeks |
| UAT Testing | 1-2 weeks |
| Production Pilot | 1-2 weeks |

### Next Steps

1. **HyperMindZ** sends Clerk organization invite
2. **Skreens** completes technical sections below
3. **Both teams** schedule kickoff call

---

## Detailed Requirements

The sections below capture the specific technical details needed for integration.

---

## Overview

This document outlines the information and technical requirements needed from Skreens to complete the HyperMindZ MCP integration for contextual DOOH advertising.

---

## 1. Authentication

Authentication is handled via our Clerk organization. We will send you an invite to join our Clerk workspace, which will provide you with the necessary credentials to authenticate with the MCP server.

---

## 2. Device & Screen Specifications

### Device Identification

| Question | Your Answer |
|----------|-------------|
| Device ID Format | (e.g., `skreens-{venue_id}-screen-{screen_num}`) |
| Device ID Generation | How are device IDs assigned? |
| Device ID Persistence | Are IDs permanent or can they change? |
| Multi-screen Venues | How do you identify screens within a venue? |

### Screen Capabilities

Please provide the schema for screen capabilities your devices support:

```json
{
  "screen_capabilities": {
    "resolution": "1920x1080",
    "aspect_ratio": "16:9",
    "lbar_supported": true,
    "lbar_max_width_percent": 30,
    "overlay_supported": true,
    "audio_enabled": false,
    "hdr_supported": false,
    "touch_enabled": false,
    "qr_display_supported": true
  }
}
```

**Questions:**
- What resolutions do you support? (1080p, 4K, etc.)
- What is the maximum L-Bar width percentage?
- Do any screens support audio?
- Are there touch-enabled displays?

### Firmware/Software

| Question | Your Answer |
|----------|-------------|
| User Agent Format | (e.g., `Skreens/{version}`) |
| Current Version | |
| Minimum Supported Version | |
| Update Mechanism | OTA, manual, etc. |

---

## 3. Event Types & Triggers

### Sports Events

Please confirm which event types your system can detect and trigger:

| Event Type | Supported? | Detection Method | Latency |
|------------|------------|------------------|---------|
| `TOUCHDOWN` | Yes/No | | |
| `FIELD_GOAL` | Yes/No | | |
| `HALFTIME` | Yes/No | | |
| `GOAL` (NHL/Soccer) | Yes/No | | |
| `HOME_RUN` | Yes/No | | |
| `THREE_POINTER` | Yes/No | | |
| `TIMEOUT` | Yes/No | | |
| `GAME_START` | Yes/No | | |
| `GAME_END` | Yes/No | | |
| `HIGHLIGHT` | Yes/No | | |
| Other: _______ | Yes/No | | |

### Event Payload Schema

Please provide your event payload format:

```json
{
  "event_type": "TOUCHDOWN",
  "event_data": {
    "sport": "NFL",
    "league": "NFL",
    "game_id": "string",
    "team": "KC",
    "player": "Mahomes",
    "quarter": 2,
    "time_remaining": "7:32",
    "score_home": 14,
    "score_away": 7
  }
}
```

### Timing Requirements

| Question | Your Answer |
|----------|-------------|
| Event-to-trigger latency | How quickly after an event do you need the ad? |
| Maximum acceptable API latency | What's your timeout for `get_contextual_ad`? |
| Buffer/preload support | Can you preload ads before events? |
| Fallback behavior | What happens if API call fails? |

---

## 4. Creative Requirements

### Supported Templates

Please confirm which templates you can render:

| Template | Supported? | Notes |
|----------|------------|-------|
| `lbar_squeeze_20` | Yes/No | |
| `lbar_squeeze_30` | Yes/No | |
| `lbar_overlay` | Yes/No | |
| `full_overlay` | Yes/No | |
| `lower_third` | Yes/No | |
| `corner_bug` | Yes/No | |

### Asset Requirements

| Asset Type | Max File Size | Formats Supported | Notes |
|------------|---------------|-------------------|-------|
| Logo | | PNG, SVG? | |
| Background Image | | JPG, PNG, WebP? | |
| Video | | MP4, WebM? | |
| QR Code | | PNG, SVG? | |
| Animation | | Lottie, GIF? | |

### Creative Specifications

| Specification | Value |
|---------------|-------|
| L-Bar dimensions | |
| Safe zone padding | |
| Text character limits | |
| Font requirements | |
| Color space | sRGB, P3? |
| Frame rate (video) | |
| Video codec | H.264, H.265? |

---

## 5. Event Tracking & Reporting

### Trackable Events

Please confirm which events you can track and report:

| Event Type | Can Track? | Measurement Method |
|------------|------------|-------------------|
| Impression | Yes/No | |
| Viewable Impression | Yes/No | |
| Duration Viewed | Yes/No | |
| QR Code Scan | Yes/No | |
| Video Quartiles | Yes/No | |
| Engagement | Yes/No | |

### Reporting Preferences

| Question | Your Answer |
|----------|-------------|
| Delivery Method | Real-time POST vs batch? |
| Batch Interval | If batching, how often? |
| Delivery Guarantee | At-least-once, exactly-once? |
| Retry Policy | How do you handle failed deliveries? |
| Offline Buffering | Can you buffer events when offline? |

### Viewability Measurement

| Question | Your Answer |
|----------|-------------|
| MRC Compliance | Do you follow MRC viewability standards? |
| In-view Percentage | How do you measure this for DOOH? |
| Dwell Time Measurement | How is audience dwell time measured? |

---

## 6. Infrastructure & SLA Requirements

### Expected Traffic

| Metric | Value |
|--------|-------|
| Number of screens | |
| Peak requests/second | |
| Average requests/minute | |
| Geographic distribution | |

### SLA Requirements

| Metric | Your Requirement |
|--------|------------------|
| API Availability | 99.9%? 99.95%? |
| Maximum Latency (p95) | |
| Error Rate Tolerance | |
| Maintenance Windows | Acceptable times? |

### Failover & Resilience

| Question | Your Answer |
|----------|-------------|
| Fallback Behavior | What do you show if API is down? |
| Caching | Do you cache ad decisions locally? |
| Cache TTL | How long are cached decisions valid? |
| Circuit Breaker | Do you implement circuit breaking? |

---

## 7. Content & Venue Information

### Content Metadata

Please provide your content identification schema:

```json
{
  "content_id": "nfl-kc-sf-2025",
  "content_type": "live_sports",
  "sport": "NFL",
  "league": "NFL",
  "home_team": "KC",
  "away_team": "SF",
  "broadcast_network": "ESPN",
  "content_rating": "G"
}
```

### Venue Information

| Question | Your Answer |
|----------|-------------|
| Venue ID Format | |
| Venue Types | Sports bars, stadiums, etc. |
| Venue Metadata Available | Address, capacity, type? |
| Geo-coordinates | Do you provide lat/long? |

---

## 8. Compliance & Legal

### Privacy & Consent

| Question | Your Answer |
|----------|-------------|
| CCPA Compliance | |
| GDPR Compliance | (if applicable) |
| Consent Collection | How do you collect/track consent? |
| Consent Signal Format | |
| Data Retention Policy | |

### Brand Safety

| Question | Your Answer |
|----------|-------------|
| Content Filtering | Do you filter content categories? |
| Advertiser Blocklists | Can you enforce blocklists? |
| Competitive Separation | Can you prevent competitor ads? |

---

## 9. Testing & Onboarding

### Testing Environment

| Question | Your Answer |
|----------|-------------|
| Test Devices Available | How many test screens? |
| Test Venue Location | |
| Testing Timeline | When can you begin testing? |
| QA Contact | |

### Integration Timeline

| Phase | Target Date |
|-------|-------------|
| Technical Kickoff | |
| Sandbox Integration | |
| UAT Testing | |
| Production Pilot | |
| Full Rollout | |

---

## 10. Additional Questions

Please provide any additional information about:

1. **Custom Requirements**: Any specific features not covered above?
2. **Known Limitations**: Technical constraints we should be aware of?
3. **Roadmap Items**: Upcoming features that might affect integration?
4. **Previous Integrations**: Experience with similar MCP/ad-serving integrations?

---

## Next Steps

1. **HyperMindZ** sends Clerk organization invite to Skreens
2. **Skreens** completes this requirements document
3. **Both teams** schedule technical kickoff and align on timeline
4. **Integration development** begins

---

## Contact Information

### HyperMindZ Team

| Role | Name | Email |
|------|------|-------|
| Technical Lead | | |
| Integration Engineer | | |
| Account Manager | | |

### Skreens Team

| Role | Name | Email |
|------|------|-------|
| Technical Lead | | |
| Integration Engineer | | |
| Account Manager | | |

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | Jan 2025 | HyperMindZ | Initial draft |
