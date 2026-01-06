"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  ChevronUp,
  ChevronDown,
  RotateCcw,
  Settings,
  Tv,
  FileText,
  Activity,
  BarChart3,
  Video,
  Keyboard,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

interface DemoScenario {
  id: string;
  name: string;
  shortcut: string;
  icon: React.ReactNode;
  route?: string;
  action?: () => void;
}

export function DemoController() {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);
  const [lbarDuration, setLbarDuration] = useState([15]);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const scenarios: DemoScenario[] = [
    {
      id: "lbar",
      name: "L-Bar Demo",
      shortcut: "T",
      icon: <Tv className="h-4 w-4" />,
      route: "/lbar-demo",
    },
    {
      id: "deal",
      name: "Deal Wizard",
      shortcut: "D",
      icon: <FileText className="h-4 w-4" />,
      route: "/deals",
    },
    {
      id: "mcp",
      name: "MCP Monitor",
      shortcut: "M",
      icon: <Activity className="h-4 w-4" />,
      route: "/mcp-monitor",
    },
    {
      id: "dashboard",
      name: "Dashboard",
      shortcut: "Q",
      icon: <BarChart3 className="h-4 w-4" />,
      route: "/",
    },
  ];

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      const key = e.key.toUpperCase();

      switch (key) {
        case "T":
          router.push("/lbar-demo");
          break;
        case "D":
          router.push("/deals");
          break;
        case "M":
          router.push("/mcp-monitor");
          break;
        case "Q":
          router.push("/");
          break;
        case "R":
          // Reset - reload current page
          window.location.reload();
          break;
        case "H":
          setShowShortcuts((prev) => !prev);
          break;
        case "ESCAPE":
          setIsExpanded(false);
          setShowShortcuts(false);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router]);

  // Recording timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const runScenario = (scenario: DemoScenario) => {
    if (scenario.route) {
      router.push(scenario.route);
    }
    if (scenario.action) {
      scenario.action();
    }
  };

  return (
    <>
      {/* Keyboard Shortcuts Overlay */}
      <AnimatePresence>
        {showShortcuts && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center"
            onClick={() => setShowShortcuts(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-card rounded-xl p-8 max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Keyboard className="h-5 w-5" />
                Keyboard Shortcuts
              </h2>
              <div className="space-y-3">
                {scenarios.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between"
                  >
                    <span className="flex items-center gap-2">
                      {s.icon}
                      {s.name}
                    </span>
                    <Badge variant="outline" className="font-mono">
                      {s.shortcut}
                    </Badge>
                  </div>
                ))}
                <div className="border-t pt-3 mt-3">
                  <div className="flex items-center justify-between">
                    <span>Reset Demo</span>
                    <Badge variant="outline" className="font-mono">
                      R
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span>Show/Hide Shortcuts</span>
                    <Badge variant="outline" className="font-mono">
                      H
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span>Close Panel</span>
                    <Badge variant="outline" className="font-mono">
                      ESC
                    </Badge>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Demo Controller Panel */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-4 right-4 z-40"
      >
        <div className="bg-card border rounded-xl shadow-lg overflow-hidden w-72">
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 py-3 bg-muted cursor-pointer"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <div className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span className="font-semibold text-sm">Demo Controller</span>
            </div>
            <div className="flex items-center gap-2">
              {isRecording && (
                <Badge variant="destructive" className="animate-pulse text-xs">
                  REC {formatTime(elapsedTime)}
                </Badge>
              )}
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronUp className="h-4 w-4" />
              )}
            </div>
          </div>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: "auto" }}
                exit={{ height: 0 }}
                className="overflow-hidden"
              >
                <div className="p-4 space-y-4">
                  {/* Scenario Buttons */}
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Scenarios
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {scenarios.map((scenario) => (
                        <Button
                          key={scenario.id}
                          variant={
                            pathname === scenario.route ? "default" : "outline"
                          }
                          size="sm"
                          className="justify-start"
                          onClick={() => runScenario(scenario)}
                        >
                          {scenario.icon}
                          <span className="ml-1 text-xs">{scenario.name}</span>
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Settings */}
                  <div className="space-y-3 border-t pt-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">L-Bar Duration</span>
                      <span className="text-sm font-medium">
                        {lbarDuration[0]}s
                      </span>
                    </div>
                    <Slider
                      value={lbarDuration}
                      onValueChange={setLbarDuration}
                      min={5}
                      max={30}
                      step={5}
                      className="w-full"
                    />

                    <div className="flex items-center justify-between">
                      <span className="text-sm">Auto-play</span>
                      <Switch checked={autoPlay} onCheckedChange={setAutoPlay} />
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm flex items-center gap-1">
                        <Video className="h-3 w-3" />
                        Recording Mode
                      </span>
                      <Switch
                        checked={isRecording}
                        onCheckedChange={(checked) => {
                          setIsRecording(checked);
                          if (!checked) setElapsedTime(0);
                        }}
                      />
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex gap-2 border-t pt-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => setShowShortcuts(true)}
                    >
                      <Keyboard className="h-3 w-3 mr-1" />
                      Shortcuts
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => window.location.reload()}
                    >
                      <RotateCcw className="h-3 w-3 mr-1" />
                      Reset
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </>
  );
}
