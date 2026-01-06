"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, RotateCcw, Zap, Target, Shield, Timer } from "lucide-react";

interface LBarCreative {
  advertiser: string;
  headline: string;
  cta: string;
  bgGradient: string;
  logo: string;
}

const creatives: Record<string, LBarCreative> = {
  TOUCHDOWN: {
    advertiser: "Pizza Hut",
    headline: "TOUCHDOWN DEAL!",
    cta: "Order Now - 50% Off",
    bgGradient: "from-red-600 to-red-800",
    logo: "🍕",
  },
  FIELD_GOAL: {
    advertiser: "Bud Light",
    headline: "3 POINTS!",
    cta: "Celebrate with Bud Light",
    bgGradient: "from-blue-600 to-blue-800",
    logo: "🍺",
  },
  INTERCEPTION: {
    advertiser: "State Farm",
    headline: "GREAT SAVE!",
    cta: "Like a Good Neighbor",
    bgGradient: "from-red-500 to-red-700",
    logo: "🛡️",
  },
};

interface EventLogEntry {
  id: string;
  event: string;
  timestamp: Date;
  latency: number;
}

export function LBarDemo() {
  const [isLBarVisible, setIsLBarVisible] = useState(false);
  const [currentCreative, setCurrentCreative] = useState<LBarCreative | null>(null);
  const [countdown, setCountdown] = useState(0);
  const [eventLog, setEventLog] = useState<EventLogEntry[]>([]);
  const [score, setScore] = useState({ home: 14, away: 10 });
  const [quarter] = useState(2);
  const [gameTime] = useState("4:32");

  const triggerEvent = useCallback((eventType: keyof typeof creatives) => {
    const creative = creatives[eventType];
    const latency = 30 + Math.random() * 20;

    // Add to event log
    setEventLog((prev) => [
      {
        id: Date.now().toString(),
        event: eventType,
        timestamp: new Date(),
        latency: Math.round(latency),
      },
      ...prev.slice(0, 9),
    ]);

    // Update score for touchdown
    if (eventType === "TOUCHDOWN") {
      setScore((prev) => ({ ...prev, home: prev.home + 7 }));
    } else if (eventType === "FIELD_GOAL") {
      setScore((prev) => ({ ...prev, home: prev.home + 3 }));
    }

    // Show L-Bar
    setCurrentCreative(creative);
    setIsLBarVisible(true);
    setCountdown(15);
  }, []);

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && isLBarVisible) {
      // Use a timeout to avoid synchronous setState in effect
      const hideTimer = setTimeout(() => {
        setIsLBarVisible(false);
        setCurrentCreative(null);
      }, 0);
      return () => clearTimeout(hideTimer);
    }
  }, [countdown, isLBarVisible]);

  const resetDemo = () => {
    setIsLBarVisible(false);
    setCurrentCreative(null);
    setCountdown(0);
    setEventLog([]);
    setScore({ home: 14, away: 10 });
  };

  return (
    <div className="space-y-6">
      {/* Live Sports Simulation */}
      <Card className="overflow-hidden">
        <div className="relative bg-black aspect-video">
          {/* Main Video Area */}
          <motion.div
            animate={{ width: isLBarVisible ? "75%" : "100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute inset-y-0 left-0 bg-gradient-to-br from-green-800 to-green-900 flex items-center justify-center"
          >
            <div className="text-center text-white">
              <div className="text-6xl mb-4">🏈</div>
              <p className="text-xl font-semibold">Live Sports Stream</p>
              <p className="text-sm opacity-75 mt-2">NFL Sunday Football</p>
            </div>

            {/* Scoreboard Overlay */}
            <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm rounded-lg px-4 py-2 text-white">
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-bold">KC</span>
                  <span className="text-2xl font-bold text-yellow-400">
                    {score.home}
                  </span>
                </div>
                <div className="text-xs text-gray-400">
                  <div>Q{quarter}</div>
                  <div>{gameTime}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">{score.away}</span>
                  <span className="font-bold">SF</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* L-Bar Overlay */}
          <AnimatePresence>
            {isLBarVisible && currentCreative && (
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className={`absolute inset-y-0 right-0 w-1/4 bg-gradient-to-b ${currentCreative.bgGradient} flex flex-col items-center justify-center p-6 text-white`}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-6xl mb-4"
                >
                  {currentCreative.logo}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-center"
                >
                  <h3 className="text-lg font-bold mb-1">
                    {currentCreative.advertiser}
                  </h3>
                  <p className="text-xl font-extrabold mb-3">
                    {currentCreative.headline}
                  </p>
                  <p className="text-sm opacity-90 mb-4">{currentCreative.cta}</p>

                  {/* QR Code Placeholder */}
                  <div className="w-20 h-20 bg-white rounded-lg mx-auto mb-2 flex items-center justify-center">
                    <div className="grid grid-cols-4 gap-0.5 p-2">
                      {[1,0,1,1,0,1,0,0,1,1,0,1,0,0,1,1].map((fill, i) => (
                          <div
                            key={i}
                            className={`w-3 h-3 ${fill ? "bg-black" : "bg-white"}`}
                          />
                        ))}
                    </div>
                  </div>
                  <p className="text-xs opacity-75">Scan for offer</p>
                </motion.div>

                {/* Countdown */}
                <div className="absolute bottom-4 right-4 flex items-center gap-1 text-xs opacity-75">
                  <Timer className="h-3 w-3" />
                  {countdown}s
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Card>

      {/* Control Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Trigger Events
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              onClick={() => triggerEvent("TOUCHDOWN")}
              disabled={isLBarVisible}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              <Play className="h-4 w-4 mr-2" />
              Touchdown (T)
            </Button>
            <Button
              onClick={() => triggerEvent("FIELD_GOAL")}
              disabled={isLBarVisible}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              <Target className="h-4 w-4 mr-2" />
              Field Goal (G)
            </Button>
            <Button
              onClick={() => triggerEvent("INTERCEPTION")}
              disabled={isLBarVisible}
              className="w-full bg-red-600 hover:bg-red-700"
            >
              <Shield className="h-4 w-4 mr-2" />
              Interception (I)
            </Button>
            <Button
              onClick={resetDemo}
              variant="outline"
              className="w-full"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset Demo (R)
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Event Log</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              <AnimatePresence>
                {eventLog.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No events triggered yet
                  </p>
                ) : (
                  eventLog.map((entry) => (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex items-center justify-between p-2 bg-muted rounded-lg text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            entry.event === "TOUCHDOWN"
                              ? "default"
                              : entry.event === "FIELD_GOAL"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {entry.event}
                        </Badge>
                        <span className="text-muted-foreground">
                          {entry.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      <Badge variant="outline">{entry.latency}ms</Badge>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
