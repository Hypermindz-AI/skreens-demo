import { NextRequest, NextResponse } from "next/server";
import {
  getRandomLBarAd,
  getLBarAdById,
  LBAR_CONCEPTS,
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
  });
}

/**
 * POST /api/mcp - Handle MCP JSON-RPC requests
 *
 * Request format:
 * {
 *   "jsonrpc": "2.0",
 *   "method": "get_lbar_ad",
 *   "params": { "event_type": "TOUCHDOWN" },
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
        const { event_type, device_id, venue_id, ad_id } = params || {};

        let ad;
        if (ad_id) {
          ad = getLBarAdById(ad_id);
        }
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
          },
        };
        break;
      }

      case "list_lbar_ads": {
        result = {
          success: true,
          count: LBAR_CONCEPTS.length,
          ads: LBAR_CONCEPTS.map((ad) => ({
            id: ad.id,
            advertiser: ad.advertiser,
            campaign: ad.campaign,
            headline: ad.assets.headline,
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
