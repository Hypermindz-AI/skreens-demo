/**
 * 5 L-Bar Ad Concepts for Skreens Integration
 * These are returned randomly when Skreens requests an ad during events
 */

export interface LBarAd {
  id: string;
  advertiser: string;
  campaign: string;
  template: "lbar_squeeze_20" | "lbar_squeeze_30" | "lbar_overlay";
  duration_ms: number;
  assets: {
    headline: string;
    subheadline: string;
    cta: string;
    logo_url: string;
    background_url: string;
    background_color: string;
    text_color: string;
    accent_color: string;
    qr_code_url: string;
    qr_destination: string;
  };
  tracking: {
    impression_url: string;
    click_url: string;
  };
}

export const LBAR_CONCEPTS: LBarAd[] = [
  {
    id: "ford-f150-touchdown",
    advertiser: "Ford Motor Company",
    campaign: "F-150 Game Day",
    template: "lbar_squeeze_20",
    duration_ms: 15000,
    assets: {
      headline: "TOUCHDOWN DEAL!",
      subheadline: "Celebrate with $5,000 off F-150",
      cta: "Scan for Offer",
      logo_url: "/ads/ford-logo.png",
      background_url: "/ads/ford-f150-bg.jpg",
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
  },
  {
    id: "budweiser-celebration",
    advertiser: "Anheuser-Busch",
    campaign: "Budweiser Big Moments",
    template: "lbar_squeeze_30",
    duration_ms: 12000,
    assets: {
      headline: "THIS BUD'S FOR YOU!",
      subheadline: "Raise a cold one for that play",
      cta: "Find Near You",
      logo_url: "/ads/budweiser-logo.png",
      background_url: "/ads/budweiser-bg.jpg",
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
  },
  {
    id: "toyota-halftime",
    advertiser: "Toyota",
    campaign: "Tundra Halftime",
    template: "lbar_squeeze_20",
    duration_ms: 20000,
    assets: {
      headline: "HALFTIME DEAL",
      subheadline: "0% APR on 2025 Tundra",
      cta: "Build Yours",
      logo_url: "/ads/toyota-logo.png",
      background_url: "/ads/toyota-tundra-bg.jpg",
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
  },
  {
    id: "draftkings-live-odds",
    advertiser: "DraftKings",
    campaign: "Live In-Game Odds",
    template: "lbar_overlay",
    duration_ms: 10000,
    assets: {
      headline: "LIVE ODDS NOW!",
      subheadline: "Bet the next play",
      cta: "Get $200 Bonus",
      logo_url: "/ads/draftkings-logo.png",
      background_url: "/ads/draftkings-bg.jpg",
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
  },
  {
    id: "pepsi-refresh",
    advertiser: "PepsiCo",
    campaign: "Pepsi Zero Sugar",
    template: "lbar_squeeze_20",
    duration_ms: 15000,
    assets: {
      headline: "ZERO SUGAR. MAX TASTE.",
      subheadline: "The official drink of game day",
      cta: "Try Now",
      logo_url: "/ads/pepsi-logo.png",
      background_url: "/ads/pepsi-bg.jpg",
      background_color: "#004B93",
      text_color: "#FFFFFF",
      accent_color: "#E32934",
      qr_code_url: "/ads/qr-pepsi.png",
      qr_destination: "https://pepsi.com/zerosugartry",
    },
    tracking: {
      impression_url: "/api/track/impression?ad=pepsi-refresh",
      click_url: "/api/track/click?ad=pepsi-refresh",
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
