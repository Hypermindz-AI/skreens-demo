import { NextRequest, NextResponse } from "next/server";
import {
  getRandomLBarAd,
  getLBarAdById,
  getRandomLBarAdWithCriteria,
  getLBarAdsByOrientation,
  LBAR_CONCEPTS,
  type LBarOrientation,
  type AssetType,
  type LBarAd,
} from "@/lib/mcp/lbar-concepts";
import {
  resolveIdentity,
  getHouseholdProfile,
  getAvailableSegments,
} from "@/lib/mcp/identity-resolution";

/**
 * HyperMindZ MCP Server API
 *
 * JSON-RPC 2.0 endpoint for Skreens integration
 *
 * Methods:
 * - resolve_identity: Resolve device/IP to household identity
 * - get_contextual_ad: Get a contextual L-Bar ad based on event and household
 * - get_lbar_ad: Get an L-Bar ad for display during events (legacy)
 * - list_lbar_ads: List all available L-Bar ad concepts
 *
 * Authentication:
 * - API Key via Authorization header: "Bearer sk_live_xxxx"
 * - Or via X-API-Key header
 */

/**
 * Valid event types for contextual ad triggering
 */
export const VALID_EVENT_TYPES = [
  // Football (NFL/College)
  "TOUCHDOWN",
  "FIELD_GOAL",
  "SAFETY",
  "TWO_POINT_CONVERSION",
  "INTERCEPTION",
  "FUMBLE_RECOVERY",

  // Basketball (NBA/College)
  "THREE_POINTER",
  "SLAM_DUNK",
  "BUZZER_BEATER",
  "FREE_THROW",

  // Hockey (NHL)
  "GOAL",
  "POWER_PLAY_GOAL",
  "PENALTY_SHOT",

  // Baseball (MLB)
  "HOME_RUN",
  "GRAND_SLAM",
  "STRIKEOUT",
  "DOUBLE_PLAY",

  // Soccer (MLS/International)
  "SOCCER_GOAL",
  "PENALTY_KICK",
  "RED_CARD",

  // Generic events (all sports)
  "HALFTIME",
  "TIMEOUT",
  "GAME_START",
  "GAME_END",
  "QUARTER_END",
  "PERIOD_END",
  "REPLAY",
  "CHALLENGE",
  "COMMERCIAL_BREAK",

  // Fallback
  "GENERIC",
] as const;

export type EventType = (typeof VALID_EVENT_TYPES)[number];

/**
 * Direct event-to-ad mapping for specific football events
 * These events will always return the assigned ad
 */
const EVENT_AD_MAPPING: Partial<Record<EventType, string>> = {
  TOUCHDOWN: "draftkings-sportsbook",      // DraftKings (right-bottom)
  FIELD_GOAL: "daznbet-livebetting",       // DAZN Bet (right-bottom)
  SAFETY: "dazn-boxing",                   // DAZN Boxing (left-bottom)
  INTERCEPTION: "ubereats-delivery",       // UberEats (top-right)
};

/**
 * Ad-to-segment affinity mapping for contextual targeting
 * Higher scores = better match for that segment
 */
const AD_SEGMENT_AFFINITY: Record<string, Record<string, number>> = {
  "ubereats-delivery": {
    "delivery-users": 1.0,
    "young-professionals": 0.8,
    "sports-enthusiasts": 0.6,
  },
  "dazn-boxing": {
    "sports-enthusiasts": 1.0,
    "streaming-subscribers": 0.9,
    "young-professionals": 0.7,
  },
  "draftkings-sportsbook": {
    "sports-bettors": 1.0,
    "sports-enthusiasts": 0.9,
    "young-professionals": 0.6,
  },
  "daznbet-livebetting": {
    "sports-bettors": 1.0,
    "sports-enthusiasts": 0.8,
    "streaming-subscribers": 0.7,
  },
};

/**
 * Event-to-ad affinity mapping
 * Which ads perform best during specific events (fallback when no direct mapping)
 */
const EVENT_AD_AFFINITY: Record<string, string[]> = {
  "TOUCHDOWN": ["draftkings-sportsbook", "daznbet-livebetting"],
  "FIELD_GOAL": ["daznbet-livebetting", "draftkings-sportsbook"],
  "SAFETY": ["dazn-boxing", "ubereats-delivery"],
  "INTERCEPTION": ["ubereats-delivery", "dazn-boxing"],
  "HALFTIME": ["ubereats-delivery", "dazn-boxing"],
  "THREE_POINTER": ["draftkings-sportsbook", "daznbet-livebetting"],
  "GOAL": ["dazn-boxing", "draftkings-sportsbook"],
  "HOME_RUN": ["draftkings-sportsbook", "daznbet-livebetting"],
  "TIMEOUT": ["ubereats-delivery", "dazn-boxing"],
  "COMMERCIAL_BREAK": ["ubereats-delivery", "dazn-boxing"],
  "GENERIC": ["ubereats-delivery", "draftkings-sportsbook", "dazn-boxing", "daznbet-livebetting"],
};

interface ScoredAd {
  ad: LBarAd;
  totalScore: number;
  eventScore: number;
  segmentScore: number;
  matchedSegments: string[];
}

/**
 * Score and rank ads based on event context and household segments
 */
function scoreAdsForContext(
  eventType: EventType,
  householdSegments: string[],
  preferredOrientation?: LBarOrientation,
  preferredAssetType?: AssetType
): ScoredAd[] {
  const scoredAds: ScoredAd[] = [];

  for (const ad of LBAR_CONCEPTS) {
    // Filter by orientation if specified
    if (preferredOrientation && ad.orientation !== preferredOrientation) {
      continue;
    }

    // Filter by asset type if specified
    if (preferredAssetType && ad.assets.type !== preferredAssetType) {
      continue;
    }

    // Calculate event relevance score (0-1)
    let eventScore = 0;
    const eventAds = EVENT_AD_AFFINITY[eventType] || EVENT_AD_AFFINITY["GENERIC"];
    const eventIndex = eventAds.indexOf(ad.id);
    if (eventIndex !== -1) {
      eventScore = 1 - eventIndex * 0.2; // First ad gets 1.0, second 0.8, etc.
    }

    // Calculate segment relevance score (0-1)
    let segmentScore = 0;
    const matchedSegments: string[] = [];
    const adAffinities = AD_SEGMENT_AFFINITY[ad.id] || {};

    for (const segment of householdSegments) {
      if (adAffinities[segment]) {
        segmentScore += adAffinities[segment];
        matchedSegments.push(segment);
      }
    }

    // Normalize segment score
    if (matchedSegments.length > 0) {
      segmentScore = segmentScore / matchedSegments.length;
    }

    // Combined score: 60% event relevance, 40% segment relevance
    const totalScore = eventScore * 0.6 + segmentScore * 0.4;

    scoredAds.push({
      ad,
      totalScore,
      eventScore,
      segmentScore,
      matchedSegments,
    });
  }

  // Sort by total score descending
  scoredAds.sort((a, b) => b.totalScore - a.totalScore);

  return scoredAds;
}

// API Key validation
const VALID_API_KEYS = new Set([
  process.env.MCP_API_KEY_SKREENS,      // Primary Skreens key
  process.env.MCP_API_KEY_INTERNAL,      // Internal testing key
].filter(Boolean));

// Allow unauthenticated access in development
const REQUIRE_AUTH = process.env.NODE_ENV === "production";

function validateApiKey(request: NextRequest): { valid: boolean; error?: string } {
  if (!REQUIRE_AUTH) {
    return { valid: true };
  }

  // Check Authorization header (Bearer token)
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.slice(7);
    if (VALID_API_KEYS.has(token)) {
      return { valid: true };
    }
  }

  // Check X-API-Key header
  const apiKeyHeader = request.headers.get("x-api-key");
  if (apiKeyHeader && VALID_API_KEYS.has(apiKeyHeader)) {
    return { valid: true };
  }

  return {
    valid: false,
    error: "Invalid or missing API key. Use Authorization: Bearer <key> or X-API-Key header.",
  };
}

function unauthorizedResponse(message: string, id?: string | number | null) {
  return NextResponse.json(
    {
      jsonrpc: "2.0",
      error: { code: -32000, message },
      id: id || null,
    },
    { status: 401 }
  );
}

/**
 * GET /api/mcp - API info and health check (no auth required)
 */
export async function GET() {
  return NextResponse.json({
    name: "hypermindz-lbar-mcp",
    version: "2.0.0",
    description: "HyperMindZ MCP Server for Skreens L-Bar Ads with Identity Resolution",
    methods: [
      "resolve_identity",
      "get_contextual_ad",
      "get_lbar_ad",
      "list_lbar_ads",
    ],
    protocol: "JSON-RPC 2.0",
    valid_event_types: VALID_EVENT_TYPES,
    supported_orientations: ["top-right", "left-bottom", "top-left", "right-bottom"],
    supported_asset_types: ["image", "video"],
    available_segments: getAvailableSegments(),
    total_ads: LBAR_CONCEPTS.length,
  });
}

/**
 * POST /api/mcp - Handle MCP JSON-RPC requests
 *
 * Request format:
 * {
 *   "jsonrpc": "2.0",
 *   "method": "get_lbar_ad",
 *   "params": {
 *     "event_type": "TOUCHDOWN",
 *     "orientation": "top-right",
 *     "asset_type": "video"
 *   },
 *   "id": "1"
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Validate API key
    const authResult = validateApiKey(request);
    if (!authResult.valid) {
      return unauthorizedResponse(authResult.error || "Unauthorized");
    }

    const body = await request.json();

    // Handle JSON-RPC 2.0 request format
    const { method, params, id } = body;

    if (!method) {
      return NextResponse.json(
        {
          jsonrpc: "2.0",
          error: { code: -32600, message: "Invalid Request: method required" },
          id: id || null,
        },
        { status: 400 }
      );
    }

    let result;

    switch (method) {
      /**
       * resolve_identity - Resolve device/IP to household identity
       *
       * Parameters:
       * - device_id (required): Skreens device identifier
       * - ip (optional): IP address for probabilistic matching
       *
       * Returns household profile with segments for targeting
       */
      case "resolve_identity": {
        const { device_id, ip } = params || {};

        if (!device_id) {
          return NextResponse.json(
            {
              jsonrpc: "2.0",
              error: {
                code: -32602,
                message: "Invalid params: device_id is required",
              },
              id,
            },
            { status: 400 }
          );
        }

        const identityResult = resolveIdentity(device_id, ip);

        result = {
          success: identityResult.success,
          household_id: identityResult.household_id,
          profile: identityResult.profile,
          resolution: {
            method: identityResult.resolution_method,
            confidence: identityResult.match_confidence,
            data_sources: identityResult.data_sources,
          },
          request_context: {
            device_id,
            ip: ip || null,
            timestamp: new Date().toISOString(),
          },
        };
        break;
      }

      /**
       * get_contextual_ad - Get targeted L-Bar ad based on event and household
       *
       * Parameters:
       * - event_type (required): Event that triggered the ad request
       * - household_id (required): Household ID from resolve_identity
       * - orientation (optional): Preferred L-Bar orientation
       * - asset_type (optional): Preferred asset type (image/video)
       *
       * Returns best-matched ad based on household segments and event context
       */
      case "get_contextual_ad": {
        const { event_type, household_id, orientation, asset_type } = params || {};

        // Validate required parameters
        if (!event_type) {
          return NextResponse.json(
            {
              jsonrpc: "2.0",
              error: {
                code: -32602,
                message: `Invalid params: event_type is required. Valid values: ${VALID_EVENT_TYPES.join(", ")}`,
              },
              id,
            },
            { status: 400 }
          );
        }

        if (!household_id) {
          return NextResponse.json(
            {
              jsonrpc: "2.0",
              error: {
                code: -32602,
                message: "Invalid params: household_id is required. Call resolve_identity first.",
              },
              id,
            },
            { status: 400 }
          );
        }

        // Validate event_type
        const normalizedEventType = event_type.toUpperCase() as EventType;
        if (!VALID_EVENT_TYPES.includes(normalizedEventType)) {
          return NextResponse.json(
            {
              jsonrpc: "2.0",
              error: {
                code: -32602,
                message: `Invalid event_type: "${event_type}". Valid values: ${VALID_EVENT_TYPES.join(", ")}`,
              },
              id,
            },
            { status: 400 }
          );
        }

        // Get household profile
        const household = getHouseholdProfile(household_id);

        // Check for direct event-to-ad mapping first
        const directAdId = EVENT_AD_MAPPING[normalizedEventType];
        if (directAdId) {
          const directAd = getLBarAdById(directAdId);
          if (directAd) {
            result = {
              success: true,
              ad: directAd,
              targeting: {
                method: "direct_mapping",
                score: 100,
                matched_segments: household?.segments || [],
                event_relevance: 100,
                segment_relevance: 0,
              },
              request_context: {
                event_type: normalizedEventType,
                household_id,
                household_segments: household?.segments || [],
                timestamp: new Date().toISOString(),
              },
            };
            break;
          }
        }

        // Score and rank ads based on household segments and event context
        const scoredAds = scoreAdsForContext(
          normalizedEventType,
          household?.segments || [],
          orientation as LBarOrientation | undefined,
          asset_type as AssetType | undefined
        );

        if (scoredAds.length === 0) {
          // Fallback to random ad that matches the requested asset type
          const fallbackAd = getRandomLBarAdWithCriteria({
            orientation: orientation as LBarOrientation | undefined,
            assetType: asset_type as AssetType | undefined,
          }) || getRandomLBarAd(); // Only use unfiltered fallback if no match found

          result = {
            success: true,
            ad: fallbackAd,
            targeting: {
              method: "fallback",
              score: 0,
              matched_segments: [],
              event_relevance: 0,
            },
            request_context: {
              event_type: normalizedEventType,
              household_id,
              household_found: !!household,
              timestamp: new Date().toISOString(),
            },
          };
        } else {
          const bestMatch = scoredAds[0];
          result = {
            success: true,
            ad: bestMatch.ad,
            targeting: {
              method: "contextual",
              score: bestMatch.totalScore,
              matched_segments: bestMatch.matchedSegments,
              event_relevance: bestMatch.eventScore,
              segment_relevance: bestMatch.segmentScore,
            },
            request_context: {
              event_type: normalizedEventType,
              household_id,
              household_segments: household?.segments || [],
              timestamp: new Date().toISOString(),
            },
          };
        }
        break;
      }

      case "get_lbar_ad": {
        const {
          event_type,
          device_id,
          venue_id,
          ad_id,
          orientation,
          asset_type,
        } = params || {};

        let ad;

        // If specific ad_id requested, try to find it
        if (ad_id) {
          ad = getLBarAdById(ad_id);
        }

        // If no specific ad or not found, get random with criteria
        if (!ad) {
          ad = getRandomLBarAdWithCriteria({
            orientation: orientation as LBarOrientation | undefined,
            assetType: asset_type as AssetType | undefined,
          });
        }

        // Fallback to any random ad
        if (!ad) {
          ad = getRandomLBarAd();
        }

        result = {
          success: true,
          ad,
          request_context: {
            event_type: event_type || "GENERIC",
            device_id,
            venue_id,
            timestamp: new Date().toISOString(),
            filters_applied: {
              orientation: orientation || null,
              asset_type: asset_type || null,
            },
          },
        };
        break;
      }

      case "list_lbar_ads": {
        const { orientation, asset_type } = params || {};

        let ads = LBAR_CONCEPTS;

        // Apply filters if provided
        if (orientation) {
          ads = getLBarAdsByOrientation(orientation as LBarOrientation);
        }

        if (asset_type) {
          ads = ads.filter((ad) => ad.assets.type === asset_type);
        }

        result = {
          success: true,
          count: ads.length,
          filters_applied: {
            orientation: orientation || null,
            asset_type: asset_type || null,
          },
          ads: ads.map((ad) => ({
            id: ad.id,
            advertiser: ad.advertiser,
            campaign: ad.campaign,
            headline: ad.assets.headline,
            orientation: ad.orientation,
            asset_type: ad.assets.type,
            duration_ms: ad.duration_ms,
            content_area: ad.content_area,
          })),
        };
        break;
      }

      default:
        return NextResponse.json(
          {
            jsonrpc: "2.0",
            error: { code: -32601, message: `Method not found: ${method}` },
            id,
          },
          { status: 404 }
        );
    }

    return NextResponse.json({
      jsonrpc: "2.0",
      result,
      id,
    });
  } catch (error) {
    console.error("MCP API Error:", error);
    return NextResponse.json(
      {
        jsonrpc: "2.0",
        error: {
          code: -32603,
          message: "Internal error",
          data: error instanceof Error ? error.message : "Unknown error",
        },
        id: null,
      },
      { status: 500 }
    );
  }
}
