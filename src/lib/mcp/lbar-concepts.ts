/**
 * L-Bar Ad Concepts for Skreens Integration
 *
 * Supports multiple L-Bar orientations:
 * - top-right: Top bar + Right bar (content bottom-left)
 * - left-bottom: Left bar + Bottom bar (content top-right)
 * - top-left: Top bar + Left bar (content bottom-right)
 * - right-bottom: Right bar + Bottom bar (content top-left)
 *
 * Supports both image and video L-Bars
 */

export type LBarOrientation =
  | "top-right"      // UberEats style
  | "left-bottom"    // Lavazza style
  | "top-left"
  | "right-bottom";

export type AssetType = "image" | "video";

export interface LBarAssets {
  type: AssetType;
  // Skreens full-frame overlay (1920x1080 PNG with transparent content area)
  skreens_overlay_url?: string;
  // For images (component-based rendering)
  image_url?: string;
  // For videos
  video_url?: string;
  poster_url?: string;  // Video thumbnail/poster
  // Common
  headline: string;
  subheadline?: string;
  cta: string;
  logo_url: string;
  background_color: string;
  text_color: string;
  accent_color: string;
  qr_code_url?: string;
  qr_destination?: string;
}

export interface LBarDimensions {
  // Percentage of screen the L-Bar occupies
  top_bar_height?: number;      // e.g., 10 = 10% of screen height
  bottom_bar_height?: number;
  left_bar_width?: number;      // e.g., 20 = 20% of screen width
  right_bar_width?: number;
}

export interface LBarAd {
  id: string;
  advertiser: string;
  campaign: string;
  orientation: LBarOrientation;
  dimensions: LBarDimensions;
  duration_ms: number;
  assets: LBarAssets;
  tracking: {
    impression_url: string;
    click_url: string;
  };
  // Metadata
  content_area: {
    position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
    width_percent: number;
    height_percent: number;
  };
}

export const LBAR_CONCEPTS: LBarAd[] = [
  // UberEats - Top-Right (Image)
  {
    id: "ubereats-delivery",
    advertiser: "Uber Eats",
    campaign: "Game Day Delivery",
    orientation: "top-right",
    dimensions: {
      top_bar_height: 12,
      right_bar_width: 20,
    },
    duration_ms: 15000,
    assets: {
      type: "image",
      skreens_overlay_url: "/ads/skreens-format/ubereats-delivery.png",
      image_url: "/ads/skreens-format/ubereats-delivery.png",
      headline: "GET ALMOST ANYTHING. DELIVERED.",
      cta: "ORDER NOW",
      logo_url: "/ads/skreens-format/ubereats-delivery.png",
      background_color: "#FFFFFF",
      text_color: "#000000",
      accent_color: "#06C167",
      qr_code_url: "/ads/qr-ubereats.png",
      qr_destination: "https://ubereats.com/promo",
    },
    tracking: {
      impression_url: "/api/track/impression?ad=ubereats-delivery",
      click_url: "/api/track/click?ad=ubereats-delivery",
    },
    content_area: {
      position: "bottom-left",
      width_percent: 80,
      height_percent: 88,
    },
  },

  // DAZN Boxing - Left-Bottom (Image)
  {
    id: "dazn-boxing",
    advertiser: "DAZN",
    campaign: "Live Boxing",
    orientation: "left-bottom",
    dimensions: {
      left_bar_width: 20,
      bottom_bar_height: 12,
    },
    duration_ms: 15000,
    assets: {
      type: "image",
      skreens_overlay_url: "/ads/skreens-format/dazn-Lbar-bottomleft.png",
      image_url: "/ads/skreens-format/dazn-Lbar-bottomleft.png",
      headline: "LIVE BOXING",
      subheadline: "Stream the fight live",
      cta: "Watch Now",
      logo_url: "/ads/skreens-format/dazn-Lbar-bottomleft.png",
      background_color: "#0D0D0D",
      text_color: "#FFFFFF",
      accent_color: "#F5B400",
    },
    tracking: {
      impression_url: "/api/track/impression?ad=dazn-boxing",
      click_url: "/api/track/click?ad=dazn-boxing",
    },
    content_area: {
      position: "top-right",
      width_percent: 80,
      height_percent: 88,
    },
  },

  // DraftKings Sportsbook - Right-Bottom (Image)
  {
    id: "draftkings-sportsbook",
    advertiser: "DraftKings",
    campaign: "Sportsbook Live Betting",
    orientation: "right-bottom",
    dimensions: {
      right_bar_width: 20,
      bottom_bar_height: 12,
    },
    duration_ms: 15000,
    assets: {
      type: "image",
      skreens_overlay_url: "/ads/skreens-format/Draftkings_Lbar_bottomright.png",
      image_url: "/ads/skreens-format/Draftkings_Lbar_bottomright.png",
      headline: "LIVE BETTING",
      subheadline: "Bet the next play",
      cta: "Bet Now",
      logo_url: "/ads/skreens-format/Draftkings_Lbar_bottomright.png",
      background_color: "#0D0D0D",
      text_color: "#FFFFFF",
      accent_color: "#53D337",
    },
    tracking: {
      impression_url: "/api/track/impression?ad=draftkings-sportsbook",
      click_url: "/api/track/click?ad=draftkings-sportsbook",
    },
    content_area: {
      position: "top-left",
      width_percent: 80,
      height_percent: 88,
    },
  },

  // DAZN Bet - Right-Bottom (Image)
  {
    id: "daznbet-livebetting",
    advertiser: "DAZN Bet",
    campaign: "Live In-Game Betting",
    orientation: "right-bottom",
    dimensions: {
      right_bar_width: 20,
      bottom_bar_height: 12,
    },
    duration_ms: 15000,
    assets: {
      type: "image",
      skreens_overlay_url: "/ads/skreens-format/daznbet_Lbar_bottomright.png",
      image_url: "/ads/skreens-format/daznbet_Lbar_bottomright.png",
      headline: "DAZN BET",
      subheadline: "Live in-game betting",
      cta: "Place Bet",
      logo_url: "/ads/skreens-format/daznbet_Lbar_bottomright.png",
      background_color: "#0D0D0D",
      text_color: "#FFFFFF",
      accent_color: "#F5B400",
    },
    tracking: {
      impression_url: "/api/track/impression?ad=daznbet-livebetting",
      click_url: "/api/track/click?ad=daznbet-livebetting",
    },
    content_area: {
      position: "top-left",
      width_percent: 80,
      height_percent: 88,
    },
  },
];

/**
 * Get a random L-Bar ad from the available concepts
 */
export function getRandomLBarAd(): LBarAd {
  const randomIndex = Math.floor(Math.random() * LBAR_CONCEPTS.length);
  return LBAR_CONCEPTS[randomIndex];
}

/**
 * Get an L-Bar ad by ID
 */
export function getLBarAdById(id: string): LBarAd | undefined {
  return LBAR_CONCEPTS.find((ad) => ad.id === id);
}

/**
 * Get L-Bar ads by orientation
 */
export function getLBarAdsByOrientation(orientation: LBarOrientation): LBarAd[] {
  return LBAR_CONCEPTS.filter((ad) => ad.orientation === orientation);
}

/**
 * Get L-Bar ads by asset type (image or video)
 */
export function getLBarAdsByAssetType(assetType: AssetType): LBarAd[] {
  return LBAR_CONCEPTS.filter((ad) => ad.assets.type === assetType);
}

/**
 * Get a random L-Bar ad matching criteria
 */
export function getRandomLBarAdWithCriteria(options?: {
  orientation?: LBarOrientation;
  assetType?: AssetType;
}): LBarAd | null {
  let filtered = LBAR_CONCEPTS;

  if (options?.orientation) {
    filtered = filtered.filter((ad) => ad.orientation === options.orientation);
  }

  if (options?.assetType) {
    filtered = filtered.filter((ad) => ad.assets.type === options.assetType);
  }

  if (filtered.length === 0) {
    return null;
  }

  const randomIndex = Math.floor(Math.random() * filtered.length);
  return filtered[randomIndex];
}
