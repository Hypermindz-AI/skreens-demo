"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CheckCircle2,
  XCircle,
  Loader2,
  Zap,
  User,
  Tv,
  Play,
  RefreshCw,
  Key,
  Eye,
  EyeOff,
} from "lucide-react";

// Types
interface HouseholdProfile {
  household_id: string;
  segments: string[];
  demographics: {
    income_bracket?: string;
    household_size?: number;
    presence_of_children?: boolean;
    home_ownership?: string;
  };
  interests: string[];
  sports_affinities: string[];
  confidence_score: number;
}

interface IdentityResult {
  success: boolean;
  household_id: string | null;
  profile: HouseholdProfile | null;
  resolution: {
    method: string;
    confidence: number;
    data_sources: string[];
  };
}

interface LBarAd {
  id: string;
  advertiser: string;
  campaign: string;
  orientation: "top-right" | "left-bottom" | "top-left" | "right-bottom";
  dimensions: {
    top_bar_height?: number;
    bottom_bar_height?: number;
    left_bar_width?: number;
    right_bar_width?: number;
  };
  duration_ms: number;
  assets: {
    type: "image" | "video";
    image_url?: string;
    video_url?: string;
    poster_url?: string;
    headline: string;
    subheadline?: string;
    cta: string;
    logo_url: string;
    background_color: string;
    text_color: string;
    accent_color: string;
    qr_code_url?: string;
  };
  content_area: {
    position: string;
    width_percent: number;
    height_percent: number;
  };
}

interface AdResult {
  success: boolean;
  ad: LBarAd;
  targeting: {
    method: string;
    score: number;
    matched_segments: string[];
    event_relevance: number;
    segment_relevance: number;
  };
}

interface ServerInfo {
  name: string;
  version: string;
  valid_event_types: string[];
  available_segments: string[];
  total_ads: number;
}

// Event categories for organized display
const EVENT_CATEGORIES = {
  "Football": ["TOUCHDOWN", "FIELD_GOAL", "SAFETY", "INTERCEPTION"],
  "Basketball": ["THREE_POINTER", "SLAM_DUNK", "BUZZER_BEATER"],
  "Hockey/Soccer": ["GOAL", "POWER_PLAY_GOAL", "SOCCER_GOAL", "PENALTY_KICK"],
  "Baseball": ["HOME_RUN", "GRAND_SLAM", "STRIKEOUT"],
  "Generic": ["HALFTIME", "TIMEOUT", "GAME_START", "GAME_END", "COMMERCIAL_BREAK", "GENERIC"],
};

export default function TestClientPage() {
  // API Key state
  const [apiKey, setApiKey] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);

  // Connection state
  const [serverInfo, setServerInfo] = useState<ServerInfo | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  // Identity state
  const [deviceId, setDeviceId] = useState("skreens-venue-42-screen-1");
  const [ipAddress, setIpAddress] = useState("192.168.1.100");
  const [identityResult, setIdentityResult] = useState<IdentityResult | null>(null);
  const [isResolvingIdentity, setIsResolvingIdentity] = useState(false);

  // Ad state
  const [selectedOrientation, setSelectedOrientation] = useState<string>("any");
  const [selectedAssetType, setSelectedAssetType] = useState<string>("any");
  const [currentAd, setCurrentAd] = useState<LBarAd | null>(null);
  const [adResult, setAdResult] = useState<AdResult | null>(null);
  const [isRequestingAd, setIsRequestingAd] = useState(false);
  const [isDisplayingAd, setIsDisplayingAd] = useState(false);
  const [adCountdown, setAdCountdown] = useState(0);

  // Debug log
  const [logs, setLogs] = useState<Array<{ time: string; type: string; message: string }>>([]);

  const addLog = useCallback((type: string, message: string) => {
    const time = new Date().toLocaleTimeString();
    setLogs((prev) => [...prev.slice(-19), { time, type, message }]);
  }, []);

  // Build headers with optional API key
  const getHeaders = useCallback(() => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (apiKey.trim()) {
      headers["Authorization"] = `Bearer ${apiKey.trim()}`;
    }
    return headers;
  }, [apiKey]);

  // Connect to MCP server
  const connectToServer = async () => {
    setIsConnecting(true);
    addLog("info", "Connecting to MCP server...");

    try {
      const response = await fetch("/api/mcp");
      const data = await response.json();
      setServerInfo(data);
      setIsConnected(true);
      addLog("success", `Connected to ${data.name} v${data.version}`);
      addLog("info", `Available events: ${data.valid_event_types?.length || 0}`);
      addLog("info", `Available ads: ${data.total_ads}`);
    } catch (error) {
      addLog("error", `Connection failed: ${error}`);
      setIsConnected(false);
    } finally {
      setIsConnecting(false);
    }
  };

  // Resolve identity
  const resolveIdentity = async () => {
    setIsResolvingIdentity(true);
    addLog("info", `Resolving identity for device: ${deviceId}`);

    try {
      const response = await fetch("/api/mcp", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
          jsonrpc: "2.0",
          method: "resolve_identity",
          params: { device_id: deviceId, ip: ipAddress },
          id: crypto.randomUUID(),
        }),
      });

      const data = await response.json();

      if (data.error) {
        addLog("error", `Identity resolution failed: ${data.error.message}`);
        return;
      }

      setIdentityResult(data.result);
      addLog("success", `Resolved to household: ${data.result.household_id}`);
      addLog("info", `Segments: ${data.result.profile?.segments?.join(", ")}`);
      addLog("info", `Resolution method: ${data.result.resolution?.method} (${(data.result.resolution?.confidence * 100).toFixed(0)}% confidence)`);
    } catch (error) {
      addLog("error", `Identity resolution error: ${error}`);
    } finally {
      setIsResolvingIdentity(false);
    }
  };

  // Request contextual ad
  const requestAd = async (eventType: string) => {
    if (!identityResult?.household_id) {
      addLog("error", "No household_id - resolve identity first");
      return;
    }

    setIsRequestingAd(true);
    addLog("info", `Requesting ad for event: ${eventType}`);

    try {
      const params: Record<string, string> = {
        event_type: eventType,
        household_id: identityResult.household_id,
      };

      if (selectedOrientation !== "any") {
        params.orientation = selectedOrientation;
      }
      if (selectedAssetType !== "any") {
        params.asset_type = selectedAssetType;
      }

      const response = await fetch("/api/mcp", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
          jsonrpc: "2.0",
          method: "get_contextual_ad",
          params,
          id: crypto.randomUUID(),
        }),
      });

      const data = await response.json();

      if (data.error) {
        addLog("error", `Ad request failed: ${data.error.message}`);
        return;
      }

      setAdResult(data.result);
      setCurrentAd(data.result.ad);
      addLog("success", `Received ad: ${data.result.ad.id}`);
      addLog("info", `Advertiser: ${data.result.ad.advertiser}`);
      addLog("info", `Targeting score: ${(data.result.targeting?.score * 100).toFixed(0)}%`);
      addLog("info", `Matched segments: ${data.result.targeting?.matched_segments?.join(", ") || "none"}`);

      // Display the ad
      displayAd(data.result.ad);
    } catch (error) {
      addLog("error", `Ad request error: ${error}`);
    } finally {
      setIsRequestingAd(false);
    }
  };

  // Display the ad overlay
  const displayAd = (ad: LBarAd) => {
    setIsDisplayingAd(true);
    setAdCountdown(Math.ceil(ad.duration_ms / 1000));
    addLog("info", `Displaying ad for ${ad.duration_ms / 1000}s`);

    // Countdown timer
    const interval = setInterval(() => {
      setAdCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsDisplayingAd(false);
          setCurrentAd(null);
          addLog("info", "Ad display completed");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Close ad manually
  const closeAd = () => {
    setIsDisplayingAd(false);
    setCurrentAd(null);
    setAdCountdown(0);
    addLog("info", "Ad closed manually");
  };

  // Auto-connect on mount
  useEffect(() => {
    connectToServer();
  }, []);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">MCP Test Client</h1>
              <p className="text-muted-foreground">
                Test the HyperMindZ MCP integration for L-Bar ads
              </p>
            </div>
            <div className="flex items-center gap-2">
              {isConnected ? (
                <Badge variant="default" className="bg-green-600">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Connected
                </Badge>
              ) : (
                <Badge variant="destructive">
                  <XCircle className="h-3 w-3 mr-1" />
                  Disconnected
                </Badge>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={connectToServer}
                disabled={isConnecting}
              >
                {isConnecting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* API Key Input */}
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border">
            <Key className="h-4 w-4 text-muted-foreground" />
            <div className="flex-1 flex items-center gap-2">
              <Input
                type={showApiKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="API Key (optional in dev, required in production)"
                className="flex-1 h-8 font-mono text-sm"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowApiKey(!showApiKey)}
                className="h-8 w-8 p-0"
              >
                {showApiKey ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {apiKey && (
              <Badge variant="outline" className="text-xs">
                <Key className="h-3 w-3 mr-1" />
                Auth enabled
              </Badge>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Controls */}
          <div className="space-y-6">
            {/* Identity Resolution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  1. Resolve Identity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Device ID</label>
                  <Input
                    value={deviceId}
                    onChange={(e) => setDeviceId(e.target.value)}
                    placeholder="skreens-venue-42-screen-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">IP Address</label>
                  <Input
                    value={ipAddress}
                    onChange={(e) => setIpAddress(e.target.value)}
                    placeholder="192.168.1.100"
                  />
                </div>
                <Button
                  onClick={resolveIdentity}
                  disabled={!isConnected || isResolvingIdentity}
                  className="w-full"
                >
                  {isResolvingIdentity ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <User className="h-4 w-4 mr-2" />
                  )}
                  Resolve Identity
                </Button>

                {identityResult && (
                  <div className="mt-4 p-3 bg-muted rounded-lg space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Household ID:</span>
                      <span className="text-sm font-mono">{identityResult.household_id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Method:</span>
                      <Badge variant="outline">{identityResult.resolution?.method}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Confidence:</span>
                      <span className="text-sm">{(identityResult.resolution?.confidence * 100).toFixed(0)}%</span>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Segments:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {identityResult.profile?.segments?.map((seg) => (
                          <Badge key={seg} variant="secondary" className="text-xs">
                            {seg}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Ad Preferences */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tv className="h-5 w-5" />
                  2. Ad Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Orientation</label>
                  <Select value={selectedOrientation} onValueChange={setSelectedOrientation}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any</SelectItem>
                      <SelectItem value="top-right">Top-Right</SelectItem>
                      <SelectItem value="left-bottom">Left-Bottom</SelectItem>
                      <SelectItem value="top-left">Top-Left</SelectItem>
                      <SelectItem value="right-bottom">Right-Bottom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Asset Type</label>
                  <Select value={selectedAssetType} onValueChange={setSelectedAssetType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any</SelectItem>
                      <SelectItem value="image">Image</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Middle Column: Event Triggers */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  3. Trigger Event
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(EVENT_CATEGORIES).map(([category, events]) => (
                  <div key={category}>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">
                      {category}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {events.map((event) => (
                        <Button
                          key={event}
                          variant="outline"
                          size="sm"
                          onClick={() => requestAd(event)}
                          disabled={!identityResult?.household_id || isRequestingAd || isDisplayingAd}
                        >
                          {isRequestingAd ? (
                            <Loader2 className="h-3 w-3 animate-spin mr-1" />
                          ) : (
                            <Play className="h-3 w-3 mr-1" />
                          )}
                          {event}
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}

                {!identityResult?.household_id && (
                  <p className="text-sm text-amber-500">
                    ⚠️ Resolve identity first to trigger events
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Last Ad Result */}
            {adResult && (
              <Card>
                <CardHeader>
                  <CardTitle>Last Ad Response</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Ad ID:</span>
                    <span className="text-sm font-mono">{adResult.ad.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Advertiser:</span>
                    <span className="text-sm">{adResult.ad.advertiser}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Orientation:</span>
                    <Badge variant="outline">{adResult.ad.orientation}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Type:</span>
                    <Badge variant="outline">{adResult.ad.assets.type}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Score:</span>
                    <span className="text-sm font-bold text-green-500">
                      {(adResult.targeting.score * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Matched:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {adResult.targeting.matched_segments?.map((seg) => (
                        <Badge key={seg} variant="default" className="text-xs bg-green-600">
                          {seg}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column: Debug Log */}
          <Card>
            <CardHeader>
              <CardTitle>Debug Log</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[500px] overflow-y-auto font-mono text-xs space-y-1 bg-black/50 p-3 rounded-lg">
                {logs.map((log, i) => (
                  <div
                    key={i}
                    className={`${
                      log.type === "error"
                        ? "text-red-400"
                        : log.type === "success"
                        ? "text-green-400"
                        : "text-gray-400"
                    }`}
                  >
                    <span className="text-gray-500">[{log.time}]</span>{" "}
                    {log.message}
                  </div>
                ))}
                {logs.length === 0 && (
                  <div className="text-gray-500">Waiting for activity...</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* L-Bar Ad Overlay */}
      {isDisplayingAd && currentAd && (
        <LBarOverlay ad={currentAd} countdown={adCountdown} onClose={closeAd} />
      )}
    </div>
  );
}

// Logo Component with fallback
function AdLogo({
  logoUrl,
  advertiser,
  accentColor,
  size = "md"
}: {
  logoUrl?: string;
  advertiser: string;
  accentColor: string;
  size?: "sm" | "md" | "lg";
}) {
  const [imgError, setImgError] = useState(false);
  const sizeClasses = {
    sm: "w-10 h-10 text-lg",
    md: "w-12 h-12 text-xl",
    lg: "w-16 h-16 text-2xl",
  };

  if (logoUrl && !imgError) {
    return (
      <img
        src={logoUrl}
        alt={`${advertiser} logo`}
        className={`${size === "lg" ? "w-16 h-16" : size === "md" ? "w-12 h-12" : "w-10 h-10"} rounded-lg object-contain bg-white p-1`}
        onError={() => setImgError(true)}
      />
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} rounded-lg flex items-center justify-center`}
      style={{ backgroundColor: accentColor }}
    >
      <span className="text-white font-bold">{advertiser.charAt(0)}</span>
    </div>
  );
}

// L-Bar Overlay Component
function LBarOverlay({
  ad,
  countdown,
  onClose,
}: {
  ad: LBarAd;
  countdown: number;
  onClose: () => void;
}) {
  const { orientation, dimensions, assets } = ad;

  // Calculate positions based on orientation
  const getOverlayStyle = () => {
    const base: React.CSSProperties = {
      position: "fixed",
      zIndex: 1000,
      backgroundColor: assets.background_color,
      color: assets.text_color,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      padding: "1rem",
    };

    switch (orientation) {
      case "top-right":
        return {
          topBar: {
            ...base,
            top: 0,
            left: 0,
            right: 0,
            height: `${dimensions.top_bar_height}%`,
          },
          sideBar: {
            ...base,
            top: `${dimensions.top_bar_height}%`,
            right: 0,
            width: `${dimensions.right_bar_width}%`,
            bottom: 0,
          },
        };
      case "left-bottom":
        return {
          sideBar: {
            ...base,
            top: 0,
            left: 0,
            width: `${dimensions.left_bar_width}%`,
            bottom: `${dimensions.bottom_bar_height}%`,
          },
          bottomBar: {
            ...base,
            bottom: 0,
            left: 0,
            right: 0,
            height: `${dimensions.bottom_bar_height}%`,
          },
        };
      case "top-left":
        return {
          topBar: {
            ...base,
            top: 0,
            left: 0,
            right: 0,
            height: `${dimensions.top_bar_height}%`,
          },
          sideBar: {
            ...base,
            top: `${dimensions.top_bar_height}%`,
            left: 0,
            width: `${dimensions.left_bar_width}%`,
            bottom: 0,
          },
        };
      case "right-bottom":
        return {
          sideBar: {
            ...base,
            top: 0,
            right: 0,
            width: `${dimensions.right_bar_width}%`,
            bottom: `${dimensions.bottom_bar_height}%`,
          },
          bottomBar: {
            ...base,
            bottom: 0,
            left: 0,
            right: 0,
            height: `${dimensions.bottom_bar_height}%`,
          },
        };
      default:
        return { topBar: base, sideBar: base };
    }
  };

  const styles = getOverlayStyle();
  const hasTopBar = orientation === "top-right" || orientation === "top-left";
  const hasBottomBar = orientation === "left-bottom" || orientation === "right-bottom";

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 z-[999]"
        onClick={onClose}
      />

      {/* Top Bar */}
      {hasTopBar && styles.topBar && (
        <div style={styles.topBar}>
          <div className="flex items-center justify-between w-full max-w-4xl">
            <div className="flex items-center gap-4">
              <AdLogo
                logoUrl={assets.logo_url}
                advertiser={ad.advertiser}
                accentColor={assets.accent_color}
                size="md"
              />
              <div>
                <h2 className="text-xl font-bold">{assets.headline}</h2>
                {assets.subheadline && (
                  <p className="text-sm opacity-80">{assets.subheadline}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-4">
              {/* Display ad image in top bar if available */}
              {assets.type === "image" && assets.image_url && (
                <img
                  src={assets.image_url}
                  alt={ad.campaign}
                  className="h-full max-h-16 object-contain rounded"
                />
              )}
              <Button
                style={{
                  backgroundColor: assets.accent_color,
                  color: "#fff",
                }}
              >
                {assets.cta}
              </Button>
              <div className="text-sm opacity-60">{countdown}s</div>
            </div>
          </div>
        </div>
      )}

      {/* Side Bar */}
      {styles.sideBar && (
        <div style={styles.sideBar}>
          <div className="flex flex-col items-center gap-3 text-center overflow-hidden h-full justify-center">
            <AdLogo
              logoUrl={assets.logo_url}
              advertiser={ad.advertiser}
              accentColor={assets.accent_color}
              size="lg"
            />
            <h3 className="text-lg font-bold leading-tight">{assets.headline}</h3>
            {assets.subheadline && (
              <p className="text-xs opacity-80">{assets.subheadline}</p>
            )}

            {/* Display ad media in sidebar */}
            {assets.type === "image" && assets.image_url && (
              <img
                src={assets.image_url}
                alt={ad.campaign}
                className="max-w-full max-h-32 object-contain rounded"
              />
            )}
            {assets.type === "video" && assets.video_url && (
              <video
                src={assets.video_url}
                poster={assets.poster_url}
                autoPlay
                muted
                loop
                playsInline
                className="max-w-full max-h-32 object-contain rounded"
              />
            )}

            <Button
              size="sm"
              style={{
                backgroundColor: assets.accent_color,
                color: "#fff",
              }}
            >
              {assets.cta}
            </Button>

            {/* QR Code */}
            {assets.qr_code_url && (
              <img
                src={assets.qr_code_url}
                alt="Scan QR Code"
                className="w-16 h-16 bg-white rounded-lg p-1"
                onError={(e) => {
                  // Fallback to placeholder if QR code fails to load
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            )}
          </div>
        </div>
      )}

      {/* Bottom Bar */}
      {hasBottomBar && styles.bottomBar && (
        <div style={styles.bottomBar}>
          <div className="flex items-center justify-between w-full max-w-4xl">
            <div className="flex items-center gap-4">
              <AdLogo
                logoUrl={assets.logo_url}
                advertiser={ad.advertiser}
                accentColor={assets.accent_color}
                size="md"
              />
              <div>
                <h2 className="text-xl font-bold">{assets.headline}</h2>
                {assets.subheadline && (
                  <p className="text-sm opacity-80">{assets.subheadline}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-4">
              {/* Display ad media in bottom bar */}
              {assets.type === "image" && assets.image_url && (
                <img
                  src={assets.image_url}
                  alt={ad.campaign}
                  className="h-full max-h-16 object-contain rounded"
                />
              )}
              {assets.type === "video" && assets.video_url && (
                <video
                  src={assets.video_url}
                  poster={assets.poster_url}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="h-full max-h-16 object-contain rounded"
                />
              )}
              <Button
                style={{
                  backgroundColor: assets.accent_color,
                  color: "#fff",
                }}
              >
                {assets.cta}
              </Button>
              <div className="text-sm opacity-60">{countdown}s</div>
            </div>
          </div>
        </div>
      )}

      {/* Close button */}
      <button
        onClick={onClose}
        className="fixed top-4 right-4 z-[1001] bg-black/50 hover:bg-black/70 text-white rounded-full p-2"
      >
        <XCircle className="h-6 w-6" />
      </button>
    </>
  );
}
