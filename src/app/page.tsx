"use client";

import { MetricCard } from "@/components/demo/MetricCard";
import { McpHealthPanel } from "@/components/demo/McpHealthPanel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { AlertTriangle, TrendingUp, Eye, Tv, Play } from "lucide-react";
import Link from "next/link";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

const impressionData = [
  { hour: "6am", impressions: 45000, events: 12 },
  { hour: "8am", impressions: 89000, events: 23 },
  { hour: "10am", impressions: 124000, events: 45 },
  { hour: "12pm", impressions: 156000, events: 67 },
  { hour: "2pm", impressions: 189000, events: 89 },
  { hour: "4pm", impressions: 234000, events: 134 },
  { hour: "6pm", impressions: 312000, events: 178 },
  { hour: "8pm", impressions: 287000, events: 156 },
];

const activeDeals = [
  {
    name: "Ford F-150 Sports Package",
    advertiser: "Ford Motor Company",
    status: "active",
    impressions: "342,891",
    spend: "$2,891.24",
    pacing: 85,
    pacingStatus: "behind",
  },
  {
    name: "Nike Basketball Live Events",
    advertiser: "Nike Inc.",
    status: "active",
    impressions: "198,432",
    spend: "$1,984.32",
    pacing: 102,
    pacingStatus: "on-track",
  },
  {
    name: "Coca-Cola Touchdown Moments",
    advertiser: "The Coca-Cola Company",
    status: "active",
    impressions: "521,091",
    spend: "$4,168.73",
    pacing: 98,
    pacingStatus: "on-track",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Campaign Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor your Skreens campaigns in real-time
          </p>
        </div>
        <Link href="/lbar-demo">
          <Button size="lg" className="gap-2">
            <Tv className="h-5 w-5" />
            Launch L-Bar Demo
            <Play className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      {/* L-Bar Demo Banner */}
      <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-primary/20">
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/20 rounded-lg">
                <Tv className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">L-Bar Contextual Advertising Demo</h3>
                <p className="text-muted-foreground">
                  Experience real-time contextual ad triggers during live sports events
                </p>
              </div>
            </div>
            <Link href="/lbar-demo">
              <Button variant="default" size="lg" className="gap-2">
                <Play className="h-4 w-4" />
                Try Demo
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Alert */}
      <Alert variant="destructive" className="bg-yellow-50 border-yellow-200">
        <AlertTriangle className="h-4 w-4 text-yellow-600" />
        <AlertTitle className="text-yellow-800">Pacing Alert</AlertTitle>
        <AlertDescription className="text-yellow-700">
          Deal &quot;Ford F-150 Sports Package&quot; is pacing 15% behind target.
          Consider increasing bid or expanding targeting.
        </AlertDescription>
      </Alert>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Today's Impressions"
          value="1,247,893"
          change="12.5% vs yesterday"
          changeType="positive"
        />
        <MetricCard
          label="Active Deals"
          value="23"
          change="3 new this week"
          changeType="positive"
        />
        <MetricCard
          label="Avg eCPM"
          value="$8.42"
          change="+$0.23 vs last week"
          changeType="positive"
        />
        <MetricCard
          label="Fill Rate"
          value="94.2%"
          change="-1.2% vs yesterday"
          changeType="negative"
        />
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Real-time Impression Delivery
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={impressionData}>
              <defs>
                <linearGradient id="colorImpressions" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground))" opacity={0.2} />
              <XAxis
                dataKey="hour"
                stroke="currentColor"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tick={{ fill: "currentColor" }}
                className="text-muted-foreground"
              />
              <YAxis
                stroke="currentColor"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `${v / 1000}K`}
                tick={{ fill: "currentColor" }}
                className="text-muted-foreground"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  color: "hsl(var(--foreground))",
                }}
                formatter={(value) => [typeof value === 'number' ? value.toLocaleString() : value, "Impressions"]}
              />
              <Area
                type="monotone"
                dataKey="impressions"
                stroke="#22c55e"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorImpressions)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* MCP Health Panel */}
      <McpHealthPanel />

      {/* Active Deals Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Active Deals</CardTitle>
          <Button size="sm">View All</Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Deal Name</TableHead>
                <TableHead>Advertiser</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Impressions</TableHead>
                <TableHead>Spend</TableHead>
                <TableHead>Pacing</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activeDeals.map((deal) => (
                <TableRow key={deal.name}>
                  <TableCell className="font-medium">{deal.name}</TableCell>
                  <TableCell>{deal.advertiser}</TableCell>
                  <TableCell>
                    <Badge
                      variant={deal.status === "active" ? "default" : "secondary"}
                      className="bg-green-100 text-green-800"
                    >
                      Active
                    </Badge>
                  </TableCell>
                  <TableCell>{deal.impressions}</TableCell>
                  <TableCell>{deal.spend}</TableCell>
                  <TableCell>
                    <div className="w-32">
                      <Progress
                        value={Math.min(deal.pacing, 100)}
                        className="h-2"
                      />
                      <span
                        className={`text-xs ${deal.pacingStatus === "on-track" ? "text-green-600" : "text-yellow-600"}`}
                      >
                        {deal.pacing}% - {deal.pacingStatus === "on-track" ? "On Track" : "Behind"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
