"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Monitor, MapPin, Users, TrendingUp, Search, Filter } from "lucide-react";

const inventoryData = [
  {
    id: "SP-001",
    name: "Sports Bar Premium",
    type: "L-Bar",
    venues: 342,
    screens: 1248,
    avgImpressions: "450K/day",
    cpm: "$6.00",
    fillRate: 87,
    status: "active",
  },
  {
    id: "AP-002",
    name: "Airport High HHI",
    type: "L-Bar",
    venues: 89,
    screens: 523,
    avgImpressions: "280K/day",
    cpm: "$12.00",
    fillRate: 94,
    status: "active",
  },
  {
    id: "FW-003",
    name: "Fitness & Wellness",
    type: "Full Screen",
    venues: 567,
    screens: 892,
    avgImpressions: "320K/day",
    cpm: "$4.50",
    fillRate: 78,
    status: "active",
  },
  {
    id: "RS-004",
    name: "Retail Shopping",
    type: "L-Bar",
    venues: 234,
    screens: 678,
    avgImpressions: "195K/day",
    cpm: "$5.00",
    fillRate: 82,
    status: "active",
  },
  {
    id: "HC-005",
    name: "Healthcare Waiting",
    type: "Full Screen",
    venues: 156,
    screens: 312,
    avgImpressions: "89K/day",
    cpm: "$8.00",
    fillRate: 91,
    status: "active",
  },
  {
    id: "ED-006",
    name: "Education Campus",
    type: "L-Bar",
    venues: 78,
    screens: 245,
    avgImpressions: "156K/day",
    cpm: "$3.50",
    fillRate: 65,
    status: "paused",
  },
];

export default function InventoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Inventory Management</h1>
        <p className="text-muted-foreground">
          Manage Skreens supply packages and screen inventory
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Monitor className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Screens</p>
                <p className="text-2xl font-bold">3,898</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-500/10 rounded-lg">
                <MapPin className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Venues</p>
                <p className="text-2xl font-bold">1,466</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <Users className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Daily Reach</p>
                <p className="text-2xl font-bold">1.49M</p>
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
                <p className="text-sm text-muted-foreground">Avg Fill Rate</p>
                <p className="text-2xl font-bold">82.8%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Inventory Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Supply Packages</CardTitle>
          <Button>
            <Filter className="h-4 w-4 mr-2" />
            Add Package
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search packages..." className="pl-10" />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="lbar">L-Bar</SelectItem>
                <SelectItem value="fullscreen">Full Screen</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Package ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Venues</TableHead>
                <TableHead>Screens</TableHead>
                <TableHead>Avg Impressions</TableHead>
                <TableHead>CPM</TableHead>
                <TableHead>Fill Rate</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventoryData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-mono text-sm">{item.id}</TableCell>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>
                    <Badge variant={item.type === "L-Bar" ? "default" : "secondary"}>
                      {item.type}
                    </Badge>
                  </TableCell>
                  <TableCell>{item.venues}</TableCell>
                  <TableCell>{item.screens.toLocaleString()}</TableCell>
                  <TableCell>{item.avgImpressions}</TableCell>
                  <TableCell>{item.cpm}</TableCell>
                  <TableCell>
                    <div className="w-24">
                      <Progress value={item.fillRate} className="h-2" />
                      <span className="text-xs text-muted-foreground">
                        {item.fillRate}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={item.status === "active" ? "default" : "secondary"}
                      className={
                        item.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }
                    >
                      {item.status === "active" ? "Active" : "Paused"}
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
