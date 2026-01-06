"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Upload, Play, Image as ImageIcon, Film, QrCode } from "lucide-react";

const creatives = [
  {
    id: "CR-001",
    name: "Ford F-150 Touchdown",
    advertiser: "Ford Motor Company",
    type: "L-Bar",
    format: "Video + QR",
    duration: "15s",
    status: "approved",
    impressions: "342K",
    thumbnail: "🚗",
  },
  {
    id: "CR-002",
    name: "Nike Basketball Highlight",
    advertiser: "Nike Inc.",
    type: "L-Bar",
    format: "Video + QR",
    duration: "15s",
    status: "approved",
    impressions: "198K",
    thumbnail: "👟",
  },
  {
    id: "CR-003",
    name: "Coca-Cola Celebration",
    advertiser: "The Coca-Cola Company",
    type: "L-Bar",
    format: "Video + QR",
    duration: "20s",
    status: "approved",
    impressions: "521K",
    thumbnail: "🥤",
  },
  {
    id: "CR-004",
    name: "Pizza Hut Game Day",
    advertiser: "Pizza Hut",
    type: "L-Bar",
    format: "Static + QR",
    duration: "15s",
    status: "pending",
    impressions: "0",
    thumbnail: "🍕",
  },
  {
    id: "CR-005",
    name: "State Farm Protection",
    advertiser: "State Farm",
    type: "Full Screen",
    format: "Video",
    duration: "30s",
    status: "approved",
    impressions: "234K",
    thumbnail: "🛡️",
  },
  {
    id: "CR-006",
    name: "Bud Light Cheers",
    advertiser: "Anheuser-Busch",
    type: "L-Bar",
    format: "Video + QR",
    duration: "15s",
    status: "rejected",
    impressions: "0",
    thumbnail: "🍺",
  },
];

export default function CreativesPage() {
  const [filter, setFilter] = useState("all");

  const filteredCreatives = creatives.filter((c) => {
    if (filter === "all") return true;
    return c.status === filter;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Creative Library</h1>
          <p className="text-muted-foreground">
            Manage and preview ad creatives for Skreens campaigns
          </p>
        </div>
        <Button>
          <Upload className="h-4 w-4 mr-2" />
          Upload Creative
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Film className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Creatives</p>
                <p className="text-2xl font-bold">24</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-500/10 rounded-lg">
                <Play className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold">18</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-500/10 rounded-lg">
                <ImageIcon className="h-6 w-6 text-yellow-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending Review</p>
                <p className="text-2xl font-bold">4</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <QrCode className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">With QR Code</p>
                <p className="text-2xl font-bold">16</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Tabs */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Creatives</CardTitle>
            <div className="flex gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search creatives..." className="pl-10 w-64" />
              </div>
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="grid">
            <TabsList className="mb-4">
              <TabsTrigger value="grid">Grid View</TabsTrigger>
              <TabsTrigger value="list">List View</TabsTrigger>
            </TabsList>
            <TabsContent value="grid">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCreatives.map((creative) => (
                  <Card key={creative.id} className="overflow-hidden">
                    <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <span className="text-6xl">{creative.thumbnail}</span>
                    </div>
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold">{creative.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {creative.advertiser}
                          </p>
                        </div>
                        <Badge
                          variant={
                            creative.status === "approved"
                              ? "default"
                              : creative.status === "pending"
                                ? "secondary"
                                : "destructive"
                          }
                          className={
                            creative.status === "approved"
                              ? "bg-green-100 text-green-800"
                              : creative.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                          }
                        >
                          {creative.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{creative.type}</span>
                        <span>•</span>
                        <span>{creative.format}</span>
                        <span>•</span>
                        <span>{creative.duration}</span>
                      </div>
                      {creative.impressions !== "0" && (
                        <p className="text-sm mt-2">
                          <span className="text-muted-foreground">Impressions:</span>{" "}
                          <span className="font-medium">{creative.impressions}</span>
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="list">
              <div className="space-y-2">
                {filteredCreatives.map((creative) => (
                  <div
                    key={creative.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-2xl">{creative.thumbnail}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold">{creative.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {creative.advertiser} • {creative.type} • {creative.duration}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge
                        variant={
                          creative.status === "approved"
                            ? "default"
                            : creative.status === "pending"
                              ? "secondary"
                              : "destructive"
                        }
                        className={
                          creative.status === "approved"
                            ? "bg-green-100 text-green-800"
                            : creative.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }
                      >
                        {creative.status}
                      </Badge>
                      <Button variant="outline" size="sm">
                        Preview
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
