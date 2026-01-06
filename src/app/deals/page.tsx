"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DealWizard } from "@/components/demo/DealWizard";
import { Plus, Search, Eye } from "lucide-react";

const deals = [
  {
    id: "1",
    name: "Ford F-150 Sports Package",
    advertiser: "Ford Motor Company",
    status: "active",
    impressions: 342891,
    spend: 2891.24,
    ecpm: 8.43,
    pacing: 85,
  },
  {
    id: "2",
    name: "Nike Basketball Live Events",
    advertiser: "Nike Inc.",
    status: "active",
    impressions: 198432,
    spend: 1984.32,
    ecpm: 10.0,
    pacing: 102,
  },
  {
    id: "3",
    name: "Coca-Cola Touchdown Moments",
    advertiser: "The Coca-Cola Company",
    status: "active",
    impressions: 521091,
    spend: 4168.73,
    ecpm: 8.0,
    pacing: 98,
  },
  {
    id: "4",
    name: "Bud Light Game Day",
    advertiser: "Anheuser-Busch",
    status: "paused",
    impressions: 89234,
    spend: 712.87,
    ecpm: 7.99,
    pacing: 45,
  },
  {
    id: "5",
    name: "State Farm Halftime Heroes",
    advertiser: "State Farm",
    status: "active",
    impressions: 234567,
    spend: 1876.54,
    ecpm: 8.0,
    pacing: 94,
  },
];

export default function DealsPage() {
  const [wizardOpen, setWizardOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredDeals = deals.filter((deal) => {
    const matchesSearch =
      deal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deal.advertiser.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || deal.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Deal Management</h1>
          <p className="text-muted-foreground">
            Create and manage PMP deals for Skreens inventory
          </p>
        </div>
        <Button onClick={() => setWizardOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create New Deal
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Deals</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search deals..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Deal Name</TableHead>
                <TableHead>Advertiser</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Impressions</TableHead>
                <TableHead className="text-right">Spend</TableHead>
                <TableHead className="text-right">eCPM</TableHead>
                <TableHead>Pacing</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDeals.map((deal) => (
                <TableRow key={deal.id}>
                  <TableCell className="font-medium">{deal.name}</TableCell>
                  <TableCell>{deal.advertiser}</TableCell>
                  <TableCell>
                    <Badge
                      variant={deal.status === "active" ? "default" : "secondary"}
                      className={
                        deal.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }
                    >
                      {deal.status.charAt(0).toUpperCase() + deal.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {deal.impressions.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    ${deal.spend.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell className="text-right">
                    ${deal.ecpm.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <div className="w-28">
                      <Progress
                        value={Math.min(deal.pacing, 100)}
                        className="h-2"
                      />
                      <span
                        className={`text-xs ${
                          deal.pacing >= 95
                            ? "text-green-600"
                            : deal.pacing >= 80
                              ? "text-yellow-600"
                              : "text-red-600"
                        }`}
                      >
                        {deal.pacing}%
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

      <DealWizard open={wizardOpen} onOpenChange={setWizardOpen} />
    </div>
  );
}
