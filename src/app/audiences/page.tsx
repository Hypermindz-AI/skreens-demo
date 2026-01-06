"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Plus, Users, Target, TrendingUp, Layers } from "lucide-react";

const audienceSegments = [
  {
    id: "AUD-001",
    name: "Sports Enthusiasts",
    description: "Users who frequently visit sports bars and watch live games",
    size: "2.4M",
    matchRate: 78,
    source: "1st Party",
    category: "Behavioral",
    status: "active",
  },
  {
    id: "AUD-002",
    name: "High Income HH",
    description: "Households with $150K+ annual income",
    size: "890K",
    matchRate: 65,
    source: "3rd Party",
    category: "Demographic",
    status: "active",
  },
  {
    id: "AUD-003",
    name: "Auto Intenders",
    description: "Users showing intent to purchase a vehicle in next 6 months",
    size: "1.2M",
    matchRate: 72,
    source: "3rd Party",
    category: "Intent",
    status: "active",
  },
  {
    id: "AUD-004",
    name: "Fast Food Frequent",
    description: "Users who visit QSR locations 3+ times per week",
    size: "3.1M",
    matchRate: 85,
    source: "1st Party",
    category: "Behavioral",
    status: "active",
  },
  {
    id: "AUD-005",
    name: "Fitness Active",
    description: "Regular gym visitors and fitness app users",
    size: "1.8M",
    matchRate: 71,
    source: "1st Party",
    category: "Behavioral",
    status: "active",
  },
  {
    id: "AUD-006",
    name: "Business Travelers",
    description: "Frequent flyers visiting airports 4+ times/month",
    size: "450K",
    matchRate: 88,
    source: "1st Party",
    category: "Behavioral",
    status: "active",
  },
  {
    id: "AUD-007",
    name: "Millennials 25-34",
    description: "Age-based demographic segment",
    size: "5.2M",
    matchRate: 92,
    source: "1st Party",
    category: "Demographic",
    status: "active",
  },
  {
    id: "AUD-008",
    name: "Insurance Shoppers",
    description: "Users researching insurance products",
    size: "780K",
    matchRate: 58,
    source: "3rd Party",
    category: "Intent",
    status: "paused",
  },
];

export default function AudiencesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Audience Segments</h1>
          <p className="text-muted-foreground">
            Manage audience targeting segments for Skreens campaigns
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Segment
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Reach</p>
                <p className="text-2xl font-bold">15.8M</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-500/10 rounded-lg">
                <Target className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Segments</p>
                <p className="text-2xl font-bold">7</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <TrendingUp className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Match Rate</p>
                <p className="text-2xl font-bold">76.1%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-500/10 rounded-lg">
                <Layers className="h-6 w-6 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Data Sources</p>
                <p className="text-2xl font-bold">4</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Segments Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>All Segments</CardTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search segments..." className="pl-10 w-64" />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Segment</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Match Rate</TableHead>
                <TableHead>Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {audienceSegments.map((segment) => (
                <TableRow key={segment.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{segment.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {segment.description}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        segment.category === "Behavioral"
                          ? "border-blue-200 bg-blue-50 text-blue-700"
                          : segment.category === "Demographic"
                            ? "border-purple-200 bg-purple-50 text-purple-700"
                            : "border-green-200 bg-green-50 text-green-700"
                      }
                    >
                      {segment.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={segment.source === "1st Party" ? "default" : "secondary"}>
                      {segment.source}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{segment.size}</TableCell>
                  <TableCell>
                    <div className="w-24">
                      <Progress value={segment.matchRate} className="h-2" />
                      <span className="text-xs text-muted-foreground">
                        {segment.matchRate}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={segment.status === "active" ? "default" : "secondary"}
                      className={
                        segment.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }
                    >
                      {segment.status === "active" ? "Active" : "Paused"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      Edit
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
