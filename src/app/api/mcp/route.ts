import { NextRequest, NextResponse } from "next/server";
import {
  getRandomLBarAd,
  getLBarAdById,
  getRandomLBarAdWithCriteria,
  getLBarAdsByOrientation,
  LBAR_CONCEPTS,
  type LBarOrientation,
  type AssetType,
} from "@/lib/mcp/lbar-concepts";

/**
 * HyperMindZ MCP Server API
 *
 * JSON-RPC 2.0 endpoint for Skreens integration
 *
 * Methods:
 * - get_lbar_ad: Get an L-Bar ad for display during events
 * - list_lbar_ads: List all available L-Bar ad concepts
 */

/**
 * GET /api/mcp - API info and health check
 */
export async function GET() {
  return NextResponse.json({
    name: "hypermindz-lbar-mcp",
    version: "1.0.0",
    description: "HyperMindZ MCP Server for Skreens L-Bar Ads",
    methods: ["get_lbar_ad", "list_lbar_ads"],
    protocol: "JSON-RPC 2.0",
    supported_orientations: ["top-right", "left-bottom", "top-left", "right-bottom"],
    supported_asset_types: ["image", "video"],
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
