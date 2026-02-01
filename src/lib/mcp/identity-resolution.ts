/**
 * Identity Resolution Module for Skreens Integration
 *
 * Maps device identifiers to household profiles for targeted ad delivery.
 * This is a MOCK implementation - in production, this would connect to
 * HyperMindZ's identity graph and data providers.
 */

export interface HouseholdProfile {
  household_id: string;
  segments: string[];           // Audience segments this household belongs to
  demographics: {
    income_bracket?: string;    // e.g., "100k-150k"
    household_size?: number;
    presence_of_children?: boolean;
    home_ownership?: "owner" | "renter";
  };
  interests: string[];          // Interest categories
  sports_affinities: string[];  // Sports team/league affinities
  confidence_score: number;     // 0.0 - 1.0 match confidence
}

export interface IdentityResolutionResult {
  success: boolean;
  household_id: string | null;
  profile: HouseholdProfile | null;
  resolution_method: "deterministic" | "probabilistic" | "fallback";
  match_confidence: number;     // 0.0 - 1.0
  data_sources: string[];       // Which data providers contributed
}

// Mock household database (in production, this queries the identity graph)
const MOCK_HOUSEHOLDS: Record<string, HouseholdProfile> = {
  "hh_001": {
    household_id: "hh_001",
    segments: ["sports-enthusiasts", "premium-auto-intenders", "beer-drinkers"],
    demographics: {
      income_bracket: "100k-150k",
      household_size: 3,
      presence_of_children: true,
      home_ownership: "owner",
    },
    interests: ["football", "trucks", "grilling", "home-improvement"],
    sports_affinities: ["NFL", "Dallas Cowboys", "College Football"],
    confidence_score: 0.92,
  },
  "hh_002": {
    household_id: "hh_002",
    segments: ["health-conscious", "electric-vehicle-intenders", "coffee-lovers"],
    demographics: {
      income_bracket: "150k+",
      household_size: 2,
      presence_of_children: false,
      home_ownership: "owner",
    },
    interests: ["basketball", "fitness", "technology", "travel"],
    sports_affinities: ["NBA", "Golden State Warriors"],
    confidence_score: 0.88,
  },
  "hh_003": {
    household_id: "hh_003",
    segments: ["value-seekers", "fast-food-frequenters", "sports-bettors"],
    demographics: {
      income_bracket: "50k-75k",
      household_size: 4,
      presence_of_children: true,
      home_ownership: "renter",
    },
    interests: ["football", "baseball", "gaming", "movies"],
    sports_affinities: ["NFL", "MLB", "Chicago Bears"],
    confidence_score: 0.85,
  },
  "hh_004": {
    household_id: "hh_004",
    segments: ["luxury-shoppers", "fine-dining", "wine-enthusiasts"],
    demographics: {
      income_bracket: "200k+",
      household_size: 2,
      presence_of_children: false,
      home_ownership: "owner",
    },
    interests: ["golf", "tennis", "luxury-travel", "fine-arts"],
    sports_affinities: ["PGA", "Tennis", "Formula 1"],
    confidence_score: 0.91,
  },
  "hh_005": {
    household_id: "hh_005",
    segments: ["young-professionals", "streaming-subscribers", "delivery-users"],
    demographics: {
      income_bracket: "75k-100k",
      household_size: 1,
      presence_of_children: false,
      home_ownership: "renter",
    },
    interests: ["soccer", "esports", "craft-beer", "startups"],
    sports_affinities: ["MLS", "Premier League", "Esports"],
    confidence_score: 0.78,
  },
};

// Mock IP-to-household mapping (simulates IP-based resolution)
const IP_TO_HOUSEHOLD: Record<string, string> = {
  "192.168.1.100": "hh_001",
  "192.168.1.101": "hh_002",
  "10.0.0.50": "hh_003",
  "172.16.0.25": "hh_004",
  "192.168.86.1": "hh_005",
};

// Mock device-to-household mapping (simulates device graph)
const DEVICE_TO_HOUSEHOLD: Record<string, string> = {
  "skreens-venue-42-screen-1": "hh_001",
  "skreens-venue-42-screen-2": "hh_002",
  "skreens-airport-lax-gate-12": "hh_003",
  "skreens-bar-chicago-main": "hh_003",
  "skreens-gym-sf-lobby": "hh_002",
  "skreens-hotel-nyc-bar": "hh_004",
};

/**
 * Resolve device/IP to household identity
 *
 * Resolution priority:
 * 1. Deterministic: Exact device_id match in device graph
 * 2. Probabilistic: IP-based household inference
 * 3. Fallback: Generate anonymous household for new devices
 *
 * @param device_id - Skreens device identifier (required)
 * @param ip - IP address of the device (optional, improves matching)
 */
export function resolveIdentity(
  device_id: string,
  ip?: string
): IdentityResolutionResult {
  const dataSources: string[] = [];

  // 1. Try deterministic device graph match
  const deviceHouseholdId = DEVICE_TO_HOUSEHOLD[device_id];
  if (deviceHouseholdId && MOCK_HOUSEHOLDS[deviceHouseholdId]) {
    dataSources.push("device-graph");
    return {
      success: true,
      household_id: deviceHouseholdId,
      profile: MOCK_HOUSEHOLDS[deviceHouseholdId],
      resolution_method: "deterministic",
      match_confidence: 0.95,
      data_sources: dataSources,
    };
  }

  // 2. Try probabilistic IP-based resolution
  if (ip) {
    const ipHouseholdId = IP_TO_HOUSEHOLD[ip];
    if (ipHouseholdId && MOCK_HOUSEHOLDS[ipHouseholdId]) {
      dataSources.push("ip-intelligence");
      return {
        success: true,
        household_id: ipHouseholdId,
        profile: MOCK_HOUSEHOLDS[ipHouseholdId],
        resolution_method: "probabilistic",
        match_confidence: 0.72,
        data_sources: dataSources,
      };
    }
  }

  // 3. Fallback: Generate anonymous household based on device hash
  // In production, this might use location data or other signals
  const householdKeys = Object.keys(MOCK_HOUSEHOLDS);
  const hashIndex = Math.abs(hashCode(device_id)) % householdKeys.length;
  const fallbackHouseholdId = householdKeys[hashIndex];

  dataSources.push("fallback-inference");

  return {
    success: true,
    household_id: fallbackHouseholdId,
    profile: MOCK_HOUSEHOLDS[fallbackHouseholdId],
    resolution_method: "fallback",
    match_confidence: 0.45,
    data_sources: dataSources,
  };
}

/**
 * Get household profile by ID
 */
export function getHouseholdProfile(household_id: string): HouseholdProfile | null {
  return MOCK_HOUSEHOLDS[household_id] || null;
}

/**
 * List all available segments for documentation
 */
export function getAvailableSegments(): string[] {
  const segments = new Set<string>();
  Object.values(MOCK_HOUSEHOLDS).forEach((hh) => {
    hh.segments.forEach((seg) => segments.add(seg));
  });
  return Array.from(segments).sort();
}

/**
 * Simple hash function for consistent fallback assignment
 */
function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return hash;
}
