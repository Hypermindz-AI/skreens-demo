"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Settings,
  Key,
  Bell,
  Shield,
  Webhook,
  Database,
  RefreshCw,
  CheckCircle2,
} from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Configure your Skreens integration and platform settings
        </p>
      </div>

      {/* API Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            API Configuration
          </CardTitle>
          <CardDescription>
            Manage your MCP API credentials and endpoints
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">API Key</label>
              <div className="flex gap-2">
                <Input
                  type="password"
                  value="sk_live_••••••••••••••••••••••••"
                  readOnly
                  className="font-mono"
                />
                <Button variant="outline">Reveal</Button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">API Secret</label>
              <div className="flex gap-2">
                <Input
                  type="password"
                  value="••••••••••••••••••••••••••••••••"
                  readOnly
                  className="font-mono"
                />
                <Button variant="outline">Reveal</Button>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">MCP Endpoint URL</label>
            <Input
              value="wss://mcp.skreens.com/v1/hypermindz"
              readOnly
              className="font-mono"
            />
          </div>
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium text-green-800">Connection Active</p>
                <p className="text-sm text-green-600">Last ping: 23ms ago</p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Test Connection
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Webhook Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Webhook className="h-5 w-5" />
            Webhook Settings
          </CardTitle>
          <CardDescription>
            Configure event notifications and callbacks
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Webhook URL</label>
            <Input
              placeholder="https://your-server.com/webhooks/skreens"
              className="font-mono"
            />
          </div>
          <div className="space-y-3">
            <p className="text-sm font-medium">Event Subscriptions</p>
            <div className="space-y-2">
              {[
                { event: "impression.delivered", description: "When an ad impression is served" },
                { event: "creative.approved", description: "When a creative passes review" },
                { event: "deal.activated", description: "When a deal goes live" },
                { event: "budget.exhausted", description: "When deal budget is fully spent" },
              ].map((item) => (
                <div key={item.event} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-mono text-sm">{item.event}</p>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Preferences
          </CardTitle>
          <CardDescription>
            Choose how you want to receive alerts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { title: "Email Notifications", description: "Receive daily summary emails", enabled: true },
              { title: "Pacing Alerts", description: "Alert when deals are off-pace", enabled: true },
              { title: "Budget Warnings", description: "Notify at 80% budget consumption", enabled: true },
              { title: "Creative Rejections", description: "Alert when creatives are rejected", enabled: false },
              { title: "API Errors", description: "Notify on integration issues", enabled: true },
            ].map((item) => (
              <div key={item.title} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{item.title}</p>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
                <Switch defaultChecked={item.enabled} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Data & Privacy */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Data & Privacy
          </CardTitle>
          <CardDescription>
            Manage data retention and privacy settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Data Retention Period</p>
              <p className="text-sm text-muted-foreground">How long to keep historical data</p>
            </div>
            <Badge variant="secondary">90 Days</Badge>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">MAID Data Processing</p>
              <p className="text-sm text-muted-foreground">Enable mobile advertising ID matching</p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Cross-Device Matching</p>
              <p className="text-sm text-muted-foreground">Link household devices for targeting</p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">GDPR Compliance Mode</p>
              <p className="text-sm text-muted-foreground">Enable enhanced privacy controls</p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      {/* Integration Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Integration Status
          </CardTitle>
          <CardDescription>
            Connected services and data sources
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { name: "Skreens MCP", status: "connected", lastSync: "Just now" },
              { name: "HyperMindZ AI Studio", status: "connected", lastSync: "2 mins ago" },
              { name: "Audience Data Provider", status: "connected", lastSync: "15 mins ago" },
              { name: "Creative Asset CDN", status: "connected", lastSync: "1 hour ago" },
              { name: "Analytics Pipeline", status: "syncing", lastSync: "In progress..." },
            ].map((service) => (
              <div key={service.name} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      service.status === "connected"
                        ? "bg-green-500"
                        : service.status === "syncing"
                          ? "bg-yellow-500 animate-pulse"
                          : "bg-red-500"
                    }`}
                  />
                  <div>
                    <p className="font-medium">{service.name}</p>
                    <p className="text-sm text-muted-foreground">Last sync: {service.lastSync}</p>
                  </div>
                </div>
                <Badge
                  variant={service.status === "connected" ? "default" : "secondary"}
                  className={
                    service.status === "connected"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }
                >
                  {service.status === "connected" ? "Connected" : "Syncing"}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button size="lg">
          <Settings className="h-4 w-4 mr-2" />
          Save Settings
        </Button>
      </div>
    </div>
  );
}
