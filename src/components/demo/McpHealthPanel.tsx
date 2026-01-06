"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { Activity } from "lucide-react";

interface McpMethod {
  name: string;
  calls: number;
  avgLatency: number;
  successRate: number;
}

const initialMethods: McpMethod[] = [
  { name: "get_ad_decision", calls: 1247, avgLatency: 42, successRate: 99.8 },
  { name: "get_contextual_ad", calls: 342, avgLatency: 38, successRate: 100 },
  { name: "resolve_identity", calls: 1589, avgLatency: 28, successRate: 99.9 },
  { name: "post_ad_events", calls: 1247, avgLatency: 15, successRate: 100 },
  { name: "sync_supply_packages", calls: 23, avgLatency: 156, successRate: 100 },
];

export function McpHealthPanel() {
  const [methods, setMethods] = useState(initialMethods);
  const [isConnected] = useState(true);
  const [lastHeartbeat, setLastHeartbeat] = useState(2);

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMethods((prev) =>
        prev.map((m) => ({
          ...m,
          calls: m.calls + Math.floor(Math.random() * 3),
          avgLatency: Math.max(10, m.avgLatency + (Math.random() - 0.5) * 4),
        }))
      );
      setLastHeartbeat((prev) => (prev >= 10 ? 0 : prev + 1));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold">
          MCP Integration Health
        </CardTitle>
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className={`h-2.5 w-2.5 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`}
          />
          <span
            className={`text-sm font-medium ${isConnected ? "text-green-600" : "text-red-600"}`}
          >
            {isConnected ? "Connected" : "Disconnected"}
          </span>
          <Badge variant="outline" className="text-xs">
            {lastHeartbeat}s ago
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {methods.map((method, index) => (
            <motion.div
              key={method.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-muted/50 rounded-lg p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <Activity className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs font-mono text-muted-foreground truncate">
                  {method.name}
                </span>
              </div>
              <p className="text-2xl font-bold">{method.calls.toLocaleString()}</p>
              <div className="mt-2 space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Avg: {method.avgLatency.toFixed(0)}ms</span>
                  <span
                    className={
                      method.successRate >= 99.5
                        ? "text-green-600"
                        : "text-yellow-600"
                    }
                  >
                    {method.successRate}%
                  </span>
                </div>
                <Progress
                  value={method.successRate}
                  className="h-1"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
