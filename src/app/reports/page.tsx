"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart3,
  Download,
  Calendar,
  TrendingUp,
  DollarSign,
  Eye,
  MousePointer,
} from "lucide-react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const performanceData = [
  { date: "Mon", impressions: 245000, spend: 1960, ctr: 0.42 },
  { date: "Tue", impressions: 312000, spend: 2496, ctr: 0.45 },
  { date: "Wed", impressions: 289000, spend: 2312, ctr: 0.38 },
  { date: "Thu", impressions: 356000, spend: 2848, ctr: 0.51 },
  { date: "Fri", impressions: 421000, spend: 3368, ctr: 0.48 },
  { date: "Sat", impressions: 534000, spend: 4272, ctr: 0.55 },
  { date: "Sun", impressions: 489000, spend: 3912, ctr: 0.52 },
];

const categoryData = [
  { name: "Sports Bars", value: 45, color: "#3b82f6" },
  { name: "Airports", value: 25, color: "#22c55e" },
  { name: "Fitness", value: 15, color: "#eab308" },
  { name: "Retail", value: 15, color: "#ef4444" },
];

const topDeals = [
  {
    name: "Ford F-150 Sports Package",
    impressions: "1.2M",
    spend: "$9,600",
    ctr: "0.48%",
    trend: "+12%",
  },
  {
    name: "Nike Basketball Live",
    impressions: "890K",
    spend: "$8,900",
    ctr: "0.52%",
    trend: "+8%",
  },
  {
    name: "Coca-Cola Touchdown",
    impressions: "1.5M",
    spend: "$12,000",
    ctr: "0.41%",
    trend: "+15%",
  },
  {
    name: "State Farm Halftime",
    impressions: "650K",
    spend: "$5,200",
    ctr: "0.38%",
    trend: "-3%",
  },
  {
    name: "Bud Light Game Day",
    impressions: "420K",
    spend: "$3,360",
    ctr: "0.45%",
    trend: "+5%",
  },
];

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Campaign Reports</h1>
          <p className="text-muted-foreground">
            Performance analytics and insights for Skreens campaigns
          </p>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="7d">
            <SelectTrigger className="w-40">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Date Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="90d">Last 90 Days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Eye className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Impressions</p>
                <p className="text-2xl font-bold">2.65M</p>
                <p className="text-xs text-green-600">+18% vs last week</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-500/10 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Spend</p>
                <p className="text-2xl font-bold">$21,168</p>
                <p className="text-xs text-green-600">+12% vs last week</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <MousePointer className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg CTR</p>
                <p className="text-2xl font-bold">0.47%</p>
                <p className="text-xs text-green-600">+0.05% vs last week</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-500/10 rounded-lg">
                <TrendingUp className="h-6 w-6 text-yellow-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg eCPM</p>
                <p className="text-2xl font-bold">$7.99</p>
                <p className="text-xs text-red-600">-$0.15 vs last week</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Daily Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" className="text-xs" />
                <YAxis className="text-xs" tickFormatter={(v) => `${v / 1000}K`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                  formatter={(value) => [typeof value === 'number' ? value.toLocaleString() : '0', "Impressions"]}
                />
                <Bar dataKey="impressions" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Impressions by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {categoryData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm">{item.name}</span>
                  <span className="text-sm text-muted-foreground ml-auto">
                    {item.value}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* CTR Trend */}
      <Card>
        <CardHeader>
          <CardTitle>CTR Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="date" className="text-xs" />
              <YAxis className="text-xs" tickFormatter={(v) => `${v}%`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
                formatter={(value) => [`${typeof value === 'number' ? value : 0}%`, "CTR"]}
              />
              <Line
                type="monotone"
                dataKey="ctr"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ fill: "hsl(var(--primary))" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top Performing Deals */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Deals</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Deal Name</TableHead>
                <TableHead>Impressions</TableHead>
                <TableHead>Spend</TableHead>
                <TableHead>CTR</TableHead>
                <TableHead>Trend</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topDeals.map((deal) => (
                <TableRow key={deal.name}>
                  <TableCell className="font-medium">{deal.name}</TableCell>
                  <TableCell>{deal.impressions}</TableCell>
                  <TableCell>{deal.spend}</TableCell>
                  <TableCell>{deal.ctr}</TableCell>
                  <TableCell>
                    <Badge
                      variant={deal.trend.startsWith("+") ? "default" : "destructive"}
                      className={
                        deal.trend.startsWith("+")
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }
                    >
                      {deal.trend}
                    </Badge>
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
