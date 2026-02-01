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
  // For images
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
  // Example 1: UberEats style - Top-Right (Image)
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
      image_url: "/ads/examples/ubereats-lbar-topright.png",
      headline: "GET ALMOST ANYTHING. DELIVERED.",
      cta: "ORDER NOW",
      logo_url: "/ads/examples/ubereats-lbar-topright.png",
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

  // Example 2: Lavazza style - Left-Bottom (Video)
  {
    id: "lavazza-tabli",
    advertiser: "Lavazza",
    campaign: "Lavazza Tablì",
    orientation: "left-bottom",
    dimensions: {
      left_bar_width: 22,
      bottom_bar_height: 15,
    },
    duration_ms: 10000,
    assets: {
      type: "video",
      video_url: "/ads/examples/lavazza-poster.png",
      poster_url: "/ads/examples/lavazza-poster.png",
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
      position: "top-right",
      width_percent: 78,
      height_percent: 85,
    },
  },

  // Example 3: Ford Touchdown - Top-Right (Image)
  {
    id: "ford-f150-touchdown",
    advertiser: "Ford Motor Company",
    campaign: "F-150 Game Day",
    orientation: "top-right",
    dimensions: {
      top_bar_height: 10,
      right_bar_width: 25,
    },
    duration_ms: 15000,
    assets: {
      type: "image",
      image_url: "/ads/ford-f150-lbar.png",
      headline: "TOUCHDOWN DEAL!",
      subheadline: "Celebrate with $5,000 off F-150",
      cta: "Scan for Offer",
      logo_url: "/ads/ford-logo.png",
      background_color: "#00274D",
      text_color: "#FFFFFF",
      accent_color: "#F5B400",
      qr_code_url: "/ads/qr-ford.png",
      qr_destination: "https://ford.com/f150-promo",
    },
    tracking: {
      impression_url: "/api/track/impression?ad=ford-f150-touchdown",
      click_url: "/api/track/click?ad=ford-f150-touchdown",
    },
    content_area: {
      position: "bottom-left",
      width_percent: 75,
      height_percent: 90,
    },
  },

  // Example 4: Budweiser - Left-Bottom (Video)
  {
    id: "budweiser-celebration",
    advertiser: "Anheuser-Busch",
    campaign: "Budweiser Big Moments",
    orientation: "left-bottom",
    dimensions: {
      left_bar_width: 20,
      bottom_bar_height: 12,
    },
    duration_ms: 12000,
    assets: {
      type: "video",
      video_url: "/ads/budweiser-poster.png",
      poster_url: "/ads/budweiser-poster.png",
      headline: "THIS BUD'S FOR YOU!",
      subheadline: "Raise a cold one for that play",
      cta: "Find Near You",
      logo_url: "/ads/budweiser-logo.png",
      background_color: "#C8102E",
      text_color: "#FFFFFF",
      accent_color: "#FFD700",
      qr_code_url: "/ads/qr-budweiser.png",
      qr_destination: "https://budweiser.com/find",
    },
    tracking: {
      impression_url: "/api/track/impression?ad=budweiser-celebration",
      click_url: "/api/track/click?ad=budweiser-celebration",
    },
    content_area: {
      position: "top-right",
      width_percent: 80,
      height_percent: 88,
    },
  },

  // Example 5: DraftKings - Top-Left (Image)
  {
    id: "draftkings-live-odds",
    advertiser: "DraftKings",
    campaign: "Live In-Game Odds",
    orientation: "top-left",
    dimensions: {
      top_bar_height: 8,
      left_bar_width: 18,
    },
    duration_ms: 10000,
    assets: {
      type: "image",
      image_url: "/ads/draftkings-lbar.png",
      headline: "LIVE ODDS NOW!",
      subheadline: "Bet the next play",
      cta: "Get $200 Bonus",
      logo_url: "/ads/draftkings-logo.png",
      background_color: "#0D0D0D",
      text_color: "#FFFFFF",
      accent_color: "#53D337",
      qr_code_url: "/ads/qr-draftkings.png",
      qr_destination: "https://draftkings.com/promo",
    },
    tracking: {
      impression_url: "/api/track/impression?ad=draftkings-live-odds",
      click_url: "/api/track/click?ad=draftkings-live-odds",
    },
    content_area: {
      position: "bottom-right",
      width_percent: 82,
      height_percent: 92,
    },
  },

  // Example 6: Pepsi - Right-Bottom (Image)
  {
    id: "pepsi-zero-refresh",
    advertiser: "PepsiCo",
    campaign: "Pepsi Zero Sugar",
    orientation: "right-bottom",
    dimensions: {
      right_bar_width: 22,
      bottom_bar_height: 10,
    },
    duration_ms: 15000,
    assets: {
      type: "image",
      image_url: "/ads/pepsi-lbar.png",
      headline: "ZERO SUGAR. MAX TASTE.",
      subheadline: "The official drink of game day",
      cta: "Try Now",
      logo_url: "/ads/pepsi-logo.png",
      background_color: "#004B93",
      text_color: "#FFFFFF",
      accent_color: "#E32934",
      qr_code_url: "/ads/qr-pepsi.png",
      qr_destination: "https://pepsi.com/zerosugartry",
    },
    tracking: {
      impression_url: "/api/track/impression?ad=pepsi-zero-refresh",
      click_url: "/api/track/click?ad=pepsi-zero-refresh",
    },
    content_area: {
      position: "top-left",
      width_percent: 78,
      height_percent: 90,
    },
  },

  // Example 7: Toyota Halftime - Top-Right (Video)
  {
    id: "toyota-halftime",
    advertiser: "Toyota",
    campaign: "Tundra Halftime",
    orientation: "top-right",
    dimensions: {
      top_bar_height: 12,
      right_bar_width: 28,
    },
    duration_ms: 20000,
    assets: {
      type: "video",
      video_url: "/ads/toyota-poster.png",
      poster_url: "/ads/toyota-poster.png",
      headline: "HALFTIME DEAL",
      subheadline: "0% APR on 2025 Tundra",
      cta: "Build Yours",
      logo_url: "/ads/toyota-logo.png",
      background_color: "#1A1A1A",
      text_color: "#FFFFFF",
      accent_color: "#EB0A1E",
      qr_code_url: "/ads/qr-toyota.png",
      qr_destination: "https://toyota.com/tundra",
    },
    tracking: {
      impression_url: "/api/track/impression?ad=toyota-halftime",
      click_url: "/api/track/click?ad=toyota-halftime",
    },
    content_area: {
      position: "bottom-left",
      width_percent: 72,
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
