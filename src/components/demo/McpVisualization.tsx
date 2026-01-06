"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ArrowRight,
  Play,
  CheckCircle,
  Clock,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

interface McpCallLog {
  id: string;
  method: string;
  timestamp: Date;
  latency: number;
  status: "success" | "error";
  request: object;
  response: object;
}

const sampleCalls = [
  {
    method: "resolve_identity",
    request: {
      jsonrpc: "2.0",
      method: "resolve_identity",
      params: {
        device_id: "skreens-venue-342-screen-7",
        ip_address: "192.168.1.45",
        user_agent: "Skreens/3.2.1",
      },
      id: 1,
    },
    response: {
      jsonrpc: "2.0",
      result: {
        household_id: "HH-8847291",
        segments: ["sports_fan", "high_hhi", "auto_intender"],
        consent_status: "opted_in",
        match_confidence: 0.94,
      },
      id: 1,
    },
  },
  {
    method: "get_contextual_ad",
    request: {
      jsonrpc: "2.0",
      method: "get_contextual_ad",
      params: {
        event_type: "TOUCHDOWN",
        content_id: "nfl-kc-sf-2024",
        household_id: "HH-8847291",
        screen_capabilities: {
          lbar_supported: true,
          max_width_percent: 30,
        },
      },
      id: 2,
    },
    response: {
      jsonrpc: "2.0",
      result: {
        creative_id: "ford-f150-sports-2024",
        advertiser: "Ford Motor Company",
        template: "lbar_squeeze_20",
        duration_ms: 15000,
        assets: {
          headline: "TOUCHDOWN DEAL!",
          cta: "Scan for $5,000 off",
          qr_url: "https://ford.com/f150-promo",
        },
        tracking: {
          impression_url: "https://track.hypermindz.com/imp/...",
          click_url: "https://track.hypermindz.com/clk/...",
        },
      },
      id: 2,
    },
  },
  {
    method: "post_ad_events",
    request: {
      jsonrpc: "2.0",
      method: "post_ad_events",
      params: {
        events: [
          {
            type: "impression",
            creative_id: "ford-f150-sports-2024",
            timestamp: "2024-01-15T14:32:45.123Z",
            duration_viewed_ms: 15000,
          },
          {
            type: "qr_scan",
            creative_id: "ford-f150-sports-2024",
            timestamp: "2024-01-15T14:32:52.456Z",
          },
        ],
      },
      id: 3,
    },
    response: {
      jsonrpc: "2.0",
      result: {
        events_processed: 2,
        status: "success",
      },
      id: 3,
    },
  },
];

export function McpVisualization() {
  const [callLogs, setCallLogs] = useState<McpCallLog[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [currentRequest, setCurrentRequest] = useState<string>("");
  const [currentResponse, setCurrentResponse] = useState<string>("");
  const [activeLatency, setActiveLatency] = useState<number | null>(null);
  const [expandedLogs, setExpandedLogs] = useState<Set<string>>(new Set());
  const requestRef = useRef<HTMLPreElement>(null);
  const responseRef = useRef<HTMLPreElement>(null);

  const typeText = async (
    text: string,
    setter: (val: string) => void,
    speed: number = 5
  ) => {
    for (let i = 0; i <= text.length; i++) {
      setter(text.substring(0, i));
      await new Promise((r) => setTimeout(r, speed));
    }
  };

  const simulateCall = async (callIndex: number) => {
    const call = sampleCalls[callIndex];
    const latency = 20 + Math.random() * 40;

    // Clear previous
    setCurrentRequest("");
    setCurrentResponse("");
    setActiveLatency(null);

    // Type request
    const requestStr = JSON.stringify(call.request, null, 2);
    await typeText(requestStr, setCurrentRequest);

    // Simulate network delay
    setActiveLatency(Math.round(latency));
    await new Promise((r) => setTimeout(r, latency * 10));

    // Type response
    const responseStr = JSON.stringify(call.response, null, 2);
    await typeText(responseStr, setCurrentResponse);

    // Add to log
    const logEntry: McpCallLog = {
      id: Date.now().toString(),
      method: call.method,
      timestamp: new Date(),
      latency: Math.round(latency),
      status: "success",
      request: call.request,
      response: call.response,
    };
    setCallLogs((prev) => [logEntry, ...prev.slice(0, 19)]);
  };

  const runFullFlow = async () => {
    setIsSimulating(true);
    for (let i = 0; i < sampleCalls.length; i++) {
      await simulateCall(i);
      await new Promise((r) => setTimeout(r, 500));
    }
    setIsSimulating(false);
  };

  const toggleLogExpanded = (id: string) => {
    setExpandedLogs((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const highlightJson = (json: string) => {
    return json
      .replace(/"([^"]+)":/g, '<span class="text-blue-400">"$1"</span>:')
      .replace(/: "([^"]+)"/g, ': <span class="text-green-400">"$1"</span>')
      .replace(/: (\d+\.?\d*)/g, ': <span class="text-yellow-400">$1</span>')
      .replace(/: (true|false)/g, ': <span class="text-purple-400">$1</span>');
  };

  return (
    <div className="space-y-6">
      {/* Control Bar */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">MCP API Visualization</h2>
          <p className="text-muted-foreground">
            Real-time view of Skreens ↔ HyperMindZ communication
          </p>
        </div>
        <Button
          onClick={runFullFlow}
          disabled={isSimulating}
          className="gap-2"
        >
          <Play className="h-4 w-4" />
          {isSimulating ? "Simulating..." : "Run Demo Flow"}
        </Button>
      </div>

      {/* Main Visualization */}
      <div className="grid grid-cols-[1fr_100px_1fr] gap-4 items-start">
        {/* Request Panel */}
        <Card className="bg-slate-900 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Badge variant="outline" className="bg-blue-500/20 text-blue-300">
                REQUEST
              </Badge>
              Skreens → HyperMindZ
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-80">
              <pre
                ref={requestRef}
                className="text-xs font-mono whitespace-pre-wrap"
                dangerouslySetInnerHTML={{
                  __html: highlightJson(currentRequest) || '<span class="text-gray-500">Waiting for request...</span>',
                }}
              />
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Arrow with Latency */}
        <div className="flex flex-col items-center justify-center h-80 pt-12">
          <AnimatePresence>
            {activeLatency && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex flex-col items-center gap-2"
              >
                <motion.div
                  animate={{ x: [0, 10, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                >
                  <ArrowRight className="h-8 w-8 text-primary" />
                </motion.div>
                <Badge variant="secondary" className="text-xs">
                  <Clock className="h-3 w-3 mr-1" />
                  {activeLatency}ms
                </Badge>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Response Panel */}
        <Card className="bg-slate-900 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Badge variant="outline" className="bg-green-500/20 text-green-300">
                RESPONSE
              </Badge>
              HyperMindZ → Skreens
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-80">
              <pre
                ref={responseRef}
                className="text-xs font-mono whitespace-pre-wrap"
                dangerouslySetInnerHTML={{
                  __html: highlightJson(currentResponse) || '<span class="text-gray-500">Waiting for response...</span>',
                }}
              />
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Activity Log */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Activity Log</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-64">
            <div className="space-y-2">
              {callLogs.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No API calls yet. Click &quot;Run Demo Flow&quot; to start.
                </p>
              ) : (
                callLogs.map((log) => (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border rounded-lg overflow-hidden"
                  >
                    <div
                      className="flex items-center justify-between p-3 cursor-pointer hover:bg-muted/50"
                      onClick={() => toggleLogExpanded(log.id)}
                    >
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <Badge variant="outline" className="font-mono text-xs">
                          {log.method}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {log.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{log.latency}ms</Badge>
                        {expandedLogs.has(log.id) ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </div>
                    </div>
                    <AnimatePresence>
                      {expandedLogs.has(log.id) && (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: "auto" }}
                          exit={{ height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="grid grid-cols-2 gap-2 p-3 bg-muted/30">
                            <div>
                              <p className="text-xs font-medium mb-1">Request</p>
                              <pre className="text-xs bg-slate-900 text-white p-2 rounded overflow-auto max-h-40">
                                {JSON.stringify(log.request, null, 2)}
                              </pre>
                            </div>
                            <div>
                              <p className="text-xs font-medium mb-1">Response</p>
                              <pre className="text-xs bg-slate-900 text-white p-2 rounded overflow-auto max-h-40">
                                {JSON.stringify(log.response, null, 2)}
                              </pre>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
