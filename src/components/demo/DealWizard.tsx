"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Building2,
  MapPin,
  Users,
  Image,
  FileCheck,
  Tv,
  Plane,
  Dumbbell,
  ShoppingBag,
  Award,
  TrendingUp,
  Shield,
  Clock,
  Zap,
  Target,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  XCircle,
  DollarSign,
  Eye,
  Activity,
  Gauge,
  CalendarDays,
  Gavel,
  Sparkles,
  Info,
} from "lucide-react";

// Deal types and auction types
const DEAL_TYPES = [
  { id: "PMP", name: "Private Marketplace", description: "Invitation-only auction with floor price", color: "bg-purple-500" },
  { id: "PREFERRED", name: "Preferred Deal", description: "Fixed price, first look at inventory", color: "bg-blue-500" },
  { id: "PG", name: "Programmatic Guaranteed", description: "Reserved inventory at fixed price", color: "bg-green-500" },
];

const AUCTION_TYPES = [
  { id: "FIRST_PRICE", name: "First Price", description: "Winner pays their bid amount" },
  { id: "SECOND_PRICE", name: "Second Price", description: "Winner pays second-highest bid + $0.01" },
];

// Health status helper
function getDealHealthStatus(daysRemaining: number, winRate: number, qualityScore: number) {
  if (daysRemaining <= 7 || winRate < 10 || qualityScore < 50) {
    return { status: "critical", color: "text-red-500", bg: "bg-red-500/10", icon: XCircle };
  }
  if (daysRemaining <= 14 || winRate < 30 || qualityScore < 70) {
    return { status: "warning", color: "text-yellow-500", bg: "bg-yellow-500/10", icon: AlertTriangle };
  }
  return { status: "healthy", color: "text-green-500", bg: "bg-green-500/10", icon: CheckCircle };
}

// Performance estimation helper
function calculateEstimation(budget: number, floorCpm: number, selectedPackages: string[], packages: typeof supplyPackages) {
  const selected = packages.filter(p => selectedPackages.includes(p.id));
  if (selected.length === 0 || budget <= 0) {
    return null;
  }

  const avgWinRate = selected.reduce((sum, p) => sum + p.winRate, 0) / selected.length;
  const avgQualityScore = selected.reduce((sum, p) => sum + p.qualityScore, 0) / selected.length;
  const totalDailyImpressions = selected.reduce((sum, p) => sum + parseInt(p.impressions.replace('K', '')) * 1000, 0);

  const estimatedCpm = floorCpm * (1 + (avgWinRate / 100) * 0.3);
  const estimatedImpressions = Math.round((budget / estimatedCpm) * 1000);
  const estimatedSpend = budget * 0.85; // 85% delivery estimate
  const confidence = selected.length >= 2 ? "HIGH" : selected.length === 1 ? "MEDIUM" : "LOW";

  return {
    impressions: estimatedImpressions,
    spend: estimatedSpend,
    cpm: estimatedCpm,
    winRate: avgWinRate,
    qualityScore: avgQualityScore,
    dailyImpressions: totalDailyImpressions,
    confidence,
  };
}

// Match score semantic colors helper
function getMatchScoreSemantics(score: number) {
  if (score >= 80) return { color: "text-green-500", bg: "bg-green-500/10", border: "border-green-500/30", label: "Excellent" };
  if (score >= 60) return { color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/30", label: "Good" };
  if (score >= 40) return { color: "text-yellow-500", bg: "bg-yellow-500/10", border: "border-yellow-500/30", label: "Fair" };
  return { color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/30", label: "Low" };
}

interface DealWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const steps = [
  { id: 1, name: "Deal Info", icon: Building2 },
  { id: 2, name: "Supply", icon: MapPin },
  { id: 3, name: "Audience", icon: Users },
  { id: 4, name: "Creative", icon: Image },
  { id: 5, name: "Review", icon: FileCheck },
];

const supplyPackages = [
  {
    id: "sports-bar",
    name: "Sports Bar Premium",
    icon: Tv,
    venues: 342,
    screens: 1248,
    lbar: true,
    cpm: 6.0,
    impressions: "450K",
    matchScore: 94,
    rank: 1,
    qualityScore: 92,
    winRate: 78,
    capacity: 85,
    avgDwellTime: "45 min",
    lastValidated: "2 hours ago",
    dataSource: "Skreens API",
    matchReason: "High sports viewership • L-Bar enabled • Premium venue quality",
  },
  {
    id: "airport",
    name: "Airport High HHI",
    icon: Plane,
    venues: 89,
    screens: 523,
    lbar: true,
    cpm: 12.0,
    impressions: "280K",
    matchScore: 82,
    rank: 2,
    qualityScore: 88,
    winRate: 65,
    capacity: 92,
    avgDwellTime: "2.5 hours",
    lastValidated: "1 hour ago",
    dataSource: "Skreens API",
    matchReason: "High HHI audience • Extended dwell time • Business travelers",
  },
  {
    id: "fitness",
    name: "Fitness & Wellness",
    icon: Dumbbell,
    venues: 567,
    screens: 892,
    lbar: false,
    cpm: 4.5,
    impressions: "320K",
    matchScore: 58,
    rank: 3,
    qualityScore: 75,
    winRate: 82,
    capacity: 70,
    avgDwellTime: "55 min",
    lastValidated: "3 hours ago",
    dataSource: "Skreens API",
    matchReason: "Health-conscious audience • Good engagement • No L-Bar support",
  },
  {
    id: "retail",
    name: "Retail Shopping",
    icon: ShoppingBag,
    venues: 234,
    screens: 678,
    lbar: true,
    cpm: 5.0,
    impressions: "195K",
    matchScore: 45,
    rank: 4,
    qualityScore: 70,
    winRate: 55,
    capacity: 60,
    avgDwellTime: "25 min",
    lastValidated: "4 hours ago",
    dataSource: "Skreens API",
    matchReason: "Shopping intent audience • Lower sports affinity • L-Bar enabled",
  },
];

const audienceSegments = [
  {
    id: "high-hhi",
    name: "High HHI ($150K+)",
    reach: "2.4M",
    matchScore: 76,
    indexVsAvg: 142,
    dataFreshness: "Real-time",
    source: "First-party + Experian",
    description: "Premium household income segment with high purchasing power",
  },
  {
    id: "auto-intent",
    name: "Auto Intenders",
    reach: "4.1M",
    matchScore: 88,
    indexVsAvg: 189,
    dataFreshness: "24 hours",
    source: "AutoTrader + Polk",
    description: "Active auto shoppers showing purchase intent signals",
  },
  {
    id: "sports-fans",
    name: "Sports Fans 25-54",
    reach: "8.7M",
    matchScore: 95,
    indexVsAvg: 234,
    dataFreshness: "Real-time",
    source: "ESPN + Nielsen",
    description: "Engaged sports viewers in prime demographic",
  },
  {
    id: "fitness",
    name: "Fitness Enthusiasts",
    reach: "5.2M",
    matchScore: 62,
    indexVsAvg: 156,
    dataFreshness: "48 hours",
    source: "Peloton + MyFitnessPal",
    description: "Health-conscious consumers with active lifestyle",
  },
  {
    id: "business-travel",
    name: "Business Travelers",
    reach: "3.8M",
    matchScore: 71,
    indexVsAvg: 178,
    dataFreshness: "Real-time",
    source: "Concur + United MileagePlus",
    description: "Frequent business travelers with premium brand affinity",
  },
];

const creativeTemplates = [
  { id: "lbar-20", name: "L-Bar Standard (20%)", type: "L-Bar" },
  { id: "lbar-30", name: "L-Bar Squeeze (30%)", type: "L-Bar" },
  { id: "overlay", name: "Full Overlay", type: "Overlay" },
  { id: "banner", name: "Quick Banner", type: "Banner" },
];

const contextualTriggers = [
  { id: "touchdown", name: "TOUCHDOWN", sports: ["NFL", "College Football"] },
  { id: "goal", name: "GOAL", sports: ["NBA", "NHL", "MLS"] },
  { id: "halftime", name: "HALFTIME", sports: ["All Sports"] },
];

export function DealWizard({ open, onOpenChange }: DealWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [dealInfo, setDealInfo] = useState({
    name: "",
    advertiser: "",
    budget: "",
    startDate: "",
    endDate: "",
    floorCpm: "8.00",
    dealType: "PMP",
    auctionType: "FIRST_PRICE",
  });
  const [selectedPackages, setSelectedPackages] = useState<string[]>([]);
  const [selectedSegments, setSelectedSegments] = useState<string[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>([]);
  const [useAndLogic, setUseAndLogic] = useState(true);
  const [expandedPackage, setExpandedPackage] = useState<string | null>(null);
  const [expandedSegment, setExpandedSegment] = useState<string | null>(null);

  const nextStep = () => {
    if (currentStep < 5) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const togglePackage = (id: string) => {
    setSelectedPackages((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const toggleSegment = (id: string) => {
    setSelectedSegments((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const toggleTrigger = (id: string) => {
    setSelectedTriggers((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const calculateReach = () => {
    const baseReach = selectedSegments.length * 2.5;
    return useAndLogic ? baseReach * 0.4 : baseReach * 1.2;
  };

  const calculateTotalScreens = () => {
    return supplyPackages
      .filter((p) => selectedPackages.includes(p.id))
      .reduce((sum, p) => sum + p.screens, 0);
  };

  const handleSubmit = () => {
    // Simulate deal creation
    console.log("Creating deal:", {
      dealInfo,
      selectedPackages,
      selectedSegments,
      selectedTemplate,
      selectedTriggers,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Create New PMP Deal
          </DialogTitle>
        </DialogHeader>

        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-6 px-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;

            return (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <motion.div
                    animate={{ scale: isActive ? 1.1 : 1 }}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                      isCompleted || isActive
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <Icon className="h-5 w-5" />
                    )}
                  </motion.div>
                  <span
                    className={`text-xs mt-1 ${isActive ? "font-semibold text-foreground" : "text-muted-foreground"}`}
                  >
                    {step.name}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-16 h-0.5 mx-2 transition-colors ${currentStep > step.id ? "bg-primary" : "bg-muted"}`}
                  />
                )}
              </div>
            );
          })}
        </div>

        <Progress value={(currentStep / 5) * 100} className="mb-6" />

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="min-h-[300px]"
          >
            {/* Step 1: Deal Info */}
            {currentStep === 1 && (
              <div className="space-y-6">
                {/* Deal Type Selection */}
                <div>
                  <label className="text-sm font-medium flex items-center gap-2 mb-3">
                    <Gavel className="h-4 w-4" />
                    Deal Type
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {DEAL_TYPES.map((type) => (
                      <div
                        key={type.id}
                        onClick={() => setDealInfo({ ...dealInfo, dealType: type.id })}
                        className={`p-3 rounded-lg border cursor-pointer transition-all ${
                          dealInfo.dealType === type.id
                            ? "ring-2 ring-primary border-primary"
                            : "hover:border-primary/50"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <div className={`w-2 h-2 rounded-full ${type.color}`} />
                          <span className="font-medium text-sm">{type.name}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{type.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Auction Type - only for PMP */}
                {dealInfo.dealType === "PMP" && (
                  <div>
                    <label className="text-sm font-medium flex items-center gap-2 mb-3">
                      <Activity className="h-4 w-4" />
                      Auction Type
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {AUCTION_TYPES.map((type) => (
                        <div
                          key={type.id}
                          onClick={() => setDealInfo({ ...dealInfo, auctionType: type.id })}
                          className={`p-3 rounded-lg border cursor-pointer transition-all ${
                            dealInfo.auctionType === type.id
                              ? "ring-2 ring-primary border-primary"
                              : "hover:border-primary/50"
                          }`}
                        >
                          <span className="font-medium text-sm">{type.name}</span>
                          <p className="text-xs text-muted-foreground mt-1">{type.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Deal Name</label>
                    <Input
                      placeholder="e.g., Ford F-150 Sports Package"
                      value={dealInfo.name}
                      onChange={(e) =>
                        setDealInfo({ ...dealInfo, name: e.target.value })
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Advertiser</label>
                    <Input
                      placeholder="e.g., Ford Motor Company"
                      value={dealInfo.advertiser}
                      onChange={(e) =>
                        setDealInfo({ ...dealInfo, advertiser: e.target.value })
                      }
                      className="mt-1"
                    />
                  </div>
                </div>

                {/* Financial & Timeline */}
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <label className="text-sm font-medium flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />
                      Budget
                    </label>
                    <Input
                      placeholder="50000"
                      value={dealInfo.budget}
                      onChange={(e) =>
                        setDealInfo({ ...dealInfo, budget: e.target.value })
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />
                      Floor CPM
                    </label>
                    <Input
                      placeholder="8.00"
                      value={dealInfo.floorCpm}
                      onChange={(e) =>
                        setDealInfo({ ...dealInfo, floorCpm: e.target.value })
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium flex items-center gap-1">
                      <CalendarDays className="h-3 w-3" />
                      Start Date
                    </label>
                    <Input
                      type="date"
                      value={dealInfo.startDate}
                      onChange={(e) =>
                        setDealInfo({ ...dealInfo, startDate: e.target.value })
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium flex items-center gap-1">
                      <CalendarDays className="h-3 w-3" />
                      End Date
                    </label>
                    <Input
                      type="date"
                      value={dealInfo.endDate}
                      onChange={(e) =>
                        setDealInfo({ ...dealInfo, endDate: e.target.value })
                      }
                      className="mt-1"
                    />
                  </div>
                </div>

                {/* Deal Type Info Banner */}
                <Card className={`${
                  dealInfo.dealType === "PMP" ? "bg-purple-500/10 border-purple-500/30" :
                  dealInfo.dealType === "PREFERRED" ? "bg-blue-500/10 border-blue-500/30" :
                  "bg-green-500/10 border-green-500/30"
                }`}>
                  <CardContent className="pt-4">
                    <div className="flex items-start gap-3">
                      <Info className={`h-5 w-5 mt-0.5 ${
                        dealInfo.dealType === "PMP" ? "text-purple-500" :
                        dealInfo.dealType === "PREFERRED" ? "text-blue-500" :
                        "text-green-500"
                      }`} />
                      <div>
                        <p className="text-sm font-medium">
                          {dealInfo.dealType === "PMP" && "Private Marketplace Deal"}
                          {dealInfo.dealType === "PREFERRED" && "Preferred Deal"}
                          {dealInfo.dealType === "PG" && "Programmatic Guaranteed Deal"}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {dealInfo.dealType === "PMP" && "Buyers compete in a private auction. Floor price ensures minimum CPM. Best for premium inventory with competitive bidding."}
                          {dealInfo.dealType === "PREFERRED" && "Fixed price negotiation with first-look access. Buyer gets priority before open auction. Best for guaranteed access at agreed rates."}
                          {dealInfo.dealType === "PG" && "Reserved inventory at a fixed price with guaranteed delivery. Best for brand campaigns requiring certainty."}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Step 2: Supply Selection */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Select supply packages for your deal
                  </p>
                  <Badge variant="outline" className="gap-1">
                    <Target className="h-3 w-3" />
                    AI-Ranked by relevance
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {supplyPackages.map((pkg) => {
                    const Icon = pkg.icon;
                    const isSelected = selectedPackages.includes(pkg.id);
                    const isExpanded = expandedPackage === pkg.id;
                    const scoreSemantics = getMatchScoreSemantics(pkg.matchScore);

                    return (
                      <Card
                        key={pkg.id}
                        className={`relative overflow-hidden transition-all ${isSelected ? "ring-2 ring-primary" : "hover:border-primary/50"} ${scoreSemantics.border}`}
                      >
                        {/* Rank Badge */}
                        <div className="absolute top-2 right-2 flex items-center gap-1">
                          <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${scoreSemantics.bg} ${scoreSemantics.color}`}>
                            <Award className="h-3 w-3" />
                            #{pkg.rank}
                          </div>
                        </div>

                        <CardContent className="pt-4">
                          <div
                            className="cursor-pointer"
                            onClick={() => togglePackage(pkg.id)}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`w-12 h-12 rounded-lg ${scoreSemantics.bg} flex items-center justify-center`}>
                                <Icon className={`h-6 w-6 ${scoreSemantics.color}`} />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-semibold">{pkg.name}</h4>
                                  {isSelected && (
                                    <Check className="h-4 w-4 text-primary" />
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  {pkg.venues} venues • {pkg.screens} screens
                                </p>

                                {/* Match Score Bar */}
                                <div className="mt-2 space-y-1">
                                  <div className="flex items-center justify-between text-xs">
                                    <span className="text-muted-foreground">Match Score</span>
                                    <span className={`font-semibold ${scoreSemantics.color}`}>
                                      {pkg.matchScore}%
                                    </span>
                                  </div>
                                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                                    <div
                                      className={`h-full rounded-full transition-all ${
                                        pkg.matchScore >= 80 ? "bg-green-500" :
                                        pkg.matchScore >= 60 ? "bg-blue-500" :
                                        pkg.matchScore >= 40 ? "bg-yellow-500" : "bg-red-500"
                                      }`}
                                      style={{ width: `${pkg.matchScore}%` }}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Match Reason */}
                            <p className="mt-2 text-xs text-muted-foreground italic">
                              {pkg.matchReason}
                            </p>

                            {/* Quick Stats */}
                            <div className="mt-3 flex items-center justify-between text-sm">
                              <span className="font-medium text-green-600">
                                ${pkg.cpm} CPM
                              </span>
                              <div className="flex items-center gap-2">
                                {pkg.lbar && (
                                  <Badge variant="secondary" className="text-xs bg-purple-500/10 text-purple-600 border-purple-500/30">
                                    L-Bar
                                  </Badge>
                                )}
                                <span className="text-muted-foreground">{pkg.impressions}/day</span>
                              </div>
                            </div>
                          </div>

                          {/* Expand/Collapse Toggle */}
                          <button
                            className="w-full mt-3 pt-3 border-t flex items-center justify-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedPackage(isExpanded ? null : pkg.id);
                            }}
                          >
                            {isExpanded ? (
                              <>Less details <ChevronUp className="h-3 w-3" /></>
                            ) : (
                              <>More details <ChevronDown className="h-3 w-3" /></>
                            )}
                          </button>

                          {/* Expanded Details */}
                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                              >
                                <div className="pt-3 space-y-3">
                                  {/* Quality Metrics Grid */}
                                  <div className="grid grid-cols-2 gap-2">
                                    <div className="p-2 rounded-lg bg-muted/50">
                                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                        <Shield className="h-3 w-3" />
                                        Quality Score
                                      </div>
                                      <p className="font-semibold text-sm">{pkg.qualityScore}%</p>
                                    </div>
                                    <div className="p-2 rounded-lg bg-muted/50">
                                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                        <TrendingUp className="h-3 w-3" />
                                        Win Rate
                                      </div>
                                      <p className="font-semibold text-sm">{pkg.winRate}%</p>
                                    </div>
                                    <div className="p-2 rounded-lg bg-muted/50">
                                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                        <BarChart3 className="h-3 w-3" />
                                        Capacity
                                      </div>
                                      <p className="font-semibold text-sm">{pkg.capacity}%</p>
                                    </div>
                                    <div className="p-2 rounded-lg bg-muted/50">
                                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                        <Clock className="h-3 w-3" />
                                        Avg Dwell
                                      </div>
                                      <p className="font-semibold text-sm">{pkg.avgDwellTime}</p>
                                    </div>
                                  </div>

                                  {/* Trust Cues */}
                                  <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                                    <span className="flex items-center gap-1">
                                      <Clock className="h-3 w-3" />
                                      Updated {pkg.lastValidated}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Zap className="h-3 w-3" />
                                      {pkg.dataSource}
                                    </span>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
                {selectedPackages.length > 0 && (
                  <div className="bg-muted rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Selected Supply</span>
                      <Badge variant="secondary">
                        {selectedPackages.length} package(s)
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Total Screens</p>
                        <p className="text-lg font-semibold">{calculateTotalScreens().toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Avg Match Score</p>
                        <p className="text-lg font-semibold text-green-600">
                          {Math.round(
                            supplyPackages
                              .filter(p => selectedPackages.includes(p.id))
                              .reduce((sum, p) => sum + p.matchScore, 0) / selectedPackages.length
                          )}%
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Est. Impressions</p>
                        <p className="text-lg font-semibold">
                          {supplyPackages
                            .filter(p => selectedPackages.includes(p.id))
                            .reduce((sum, p) => sum + parseInt(p.impressions.replace('K', '')) * 1000, 0)
                            .toLocaleString()}/day
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Audience */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-muted-foreground">
                      Define your target audience
                    </p>
                    <Badge variant="outline" className="gap-1">
                      <Target className="h-3 w-3" />
                      AI-Scored for relevance
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 bg-muted rounded-lg px-3 py-1.5">
                    <span className="text-sm text-muted-foreground">OR</span>
                    <Switch
                      checked={useAndLogic}
                      onCheckedChange={setUseAndLogic}
                    />
                    <span className="text-sm text-muted-foreground">AND</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {audienceSegments.map((segment) => {
                    const isSelected = selectedSegments.includes(segment.id);
                    const isExpanded = expandedSegment === segment.id;
                    const scoreSemantics = getMatchScoreSemantics(segment.matchScore);

                    return (
                      <Card
                        key={segment.id}
                        className={`relative overflow-hidden transition-all ${isSelected ? "ring-2 ring-primary" : "hover:border-primary/50"} ${scoreSemantics.border}`}
                      >
                        {/* Match Score Badge */}
                        <div className="absolute top-2 right-2">
                          <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${scoreSemantics.bg} ${scoreSemantics.color}`}>
                            {segment.matchScore}%
                          </div>
                        </div>

                        <CardContent className="pt-4 pb-2">
                          <div
                            className="cursor-pointer"
                            onClick={() => toggleSegment(segment.id)}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`w-10 h-10 rounded-lg ${scoreSemantics.bg} flex items-center justify-center`}>
                                <Users className={`h-5 w-5 ${scoreSemantics.color}`} />
                              </div>
                              <div className="flex-1 pr-12">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-semibold text-sm">{segment.name}</h4>
                                  {isSelected && (
                                    <Check className="h-4 w-4 text-primary" />
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                  {segment.description}
                                </p>

                                {/* Match Score Bar */}
                                <div className="mt-2 space-y-1">
                                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                                    <div
                                      className={`h-full rounded-full transition-all ${
                                        segment.matchScore >= 80 ? "bg-green-500" :
                                        segment.matchScore >= 60 ? "bg-blue-500" :
                                        segment.matchScore >= 40 ? "bg-yellow-500" : "bg-red-500"
                                      }`}
                                      style={{ width: `${segment.matchScore}%` }}
                                    />
                                  </div>
                                </div>

                                {/* Quick Stats */}
                                <div className="mt-2 flex items-center gap-3 text-xs">
                                  <span className="text-muted-foreground">
                                    Reach: <span className="font-medium text-foreground">{segment.reach} HH</span>
                                  </span>
                                  <span className={`font-medium ${segment.indexVsAvg > 150 ? 'text-green-600' : 'text-blue-600'}`}>
                                    {segment.indexVsAvg} Index
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Expand/Collapse Toggle */}
                          <button
                            className="w-full mt-2 pt-2 border-t flex items-center justify-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedSegment(isExpanded ? null : segment.id);
                            }}
                          >
                            {isExpanded ? (
                              <>Less details <ChevronUp className="h-3 w-3" /></>
                            ) : (
                              <>More details <ChevronDown className="h-3 w-3" /></>
                            )}
                          </button>

                          {/* Expanded Details */}
                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                              >
                                <div className="pt-2 space-y-2">
                                  {/* Data Details */}
                                  <div className="grid grid-cols-2 gap-2">
                                    <div className="p-2 rounded-lg bg-muted/50">
                                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                        <BarChart3 className="h-3 w-3" />
                                        Index vs Avg
                                      </div>
                                      <p className={`font-semibold text-sm ${segment.indexVsAvg > 150 ? 'text-green-600' : 'text-blue-600'}`}>
                                        {segment.indexVsAvg}
                                      </p>
                                    </div>
                                    <div className="p-2 rounded-lg bg-muted/50">
                                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                        <Clock className="h-3 w-3" />
                                        Data Freshness
                                      </div>
                                      <p className="font-semibold text-sm">{segment.dataFreshness}</p>
                                    </div>
                                  </div>

                                  {/* Trust Cues */}
                                  <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                                    <span className="flex items-center gap-1">
                                      <Shield className="h-3 w-3" />
                                      {segment.source}
                                    </span>
                                    <span className={`flex items-center gap-1 ${segment.dataFreshness === 'Real-time' ? 'text-green-600' : ''}`}>
                                      <Zap className="h-3 w-3" />
                                      {segment.dataFreshness}
                                    </span>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {selectedSegments.length > 0 && (
                  <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">
                            Combined Audience Reach
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Using {useAndLogic ? "AND" : "OR"} logic • {selectedSegments.length} segment(s) selected
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-primary">
                            {calculateReach().toFixed(1)}M HH
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Avg Match: {Math.round(
                              audienceSegments
                                .filter(s => selectedSegments.includes(s.id))
                                .reduce((sum, s) => sum + s.matchScore, 0) / selectedSegments.length
                            )}%
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* Step 4: Creative */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-3">Select Template</h4>
                  <div className="grid grid-cols-4 gap-3">
                    {creativeTemplates.map((template) => (
                      <div
                        key={template.id}
                        className={`p-3 rounded-lg border text-center cursor-pointer transition-all ${selectedTemplate === template.id ? "border-primary bg-primary/5" : "hover:border-primary/50"}`}
                        onClick={() => setSelectedTemplate(template.id)}
                      >
                        <div className="w-12 h-12 mx-auto mb-2 rounded bg-gradient-to-br from-purple-500 to-blue-500" />
                        <p className="text-sm font-medium">{template.name}</p>
                        <Badge variant="outline" className="mt-1 text-xs">
                          {template.type}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Contextual Triggers</h4>
                  <div className="space-y-2">
                    {contextualTriggers.map((trigger) => (
                      <div
                        key={trigger.id}
                        className={`p-3 rounded-lg border cursor-pointer transition-all ${selectedTriggers.includes(trigger.id) ? "border-primary bg-primary/5" : "hover:border-primary/50"}`}
                        onClick={() => toggleTrigger(trigger.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Badge>{trigger.name}</Badge>
                            <span className="text-sm text-muted-foreground">
                              {trigger.sports.join(", ")}
                            </span>
                          </div>
                          {selectedTriggers.includes(trigger.id) && (
                            <Check className="h-5 w-5 text-primary" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Review */}
            {currentStep === 5 && (() => {
              const budget = parseFloat(dealInfo.budget) || 0;
              const floorCpm = parseFloat(dealInfo.floorCpm) || 8;
              const estimation = calculateEstimation(budget, floorCpm, selectedPackages, supplyPackages);
              const daysRemaining = dealInfo.startDate && dealInfo.endDate
                ? Math.ceil((new Date(dealInfo.endDate).getTime() - new Date(dealInfo.startDate).getTime()) / (1000 * 60 * 60 * 24))
                : 30;
              const healthStatus = getDealHealthStatus(daysRemaining, estimation?.winRate || 50, estimation?.qualityScore || 70);
              const HealthIcon = healthStatus.icon;
              const dealTypeInfo = DEAL_TYPES.find(t => t.id === dealInfo.dealType);

              return (
                <div className="space-y-4">
                  {/* Deal Header with Type Badge and Health Status */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge className={`${dealTypeInfo?.color} text-white`}>
                        {dealTypeInfo?.name}
                      </Badge>
                      {dealInfo.dealType === "PMP" && (
                        <Badge variant="outline" className="text-xs">
                          {AUCTION_TYPES.find(a => a.id === dealInfo.auctionType)?.name}
                        </Badge>
                      )}
                    </div>
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${healthStatus.bg}`}>
                      <HealthIcon className={`h-4 w-4 ${healthStatus.color}`} />
                      <span className={`text-sm font-medium capitalize ${healthStatus.color}`}>
                        {healthStatus.status}
                      </span>
                    </div>
                  </div>

                  {/* Performance Estimation Engine */}
                  {estimation && (
                    <Card className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-emerald-500/30">
                      <CardContent className="pt-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Sparkles className="h-5 w-5 text-emerald-500" />
                          <span className="font-medium">AI Performance Estimation</span>
                          <Badge variant="outline" className={`text-xs ${
                            estimation.confidence === "HIGH" ? "border-green-500 text-green-500" :
                            estimation.confidence === "MEDIUM" ? "border-yellow-500 text-yellow-500" :
                            "border-red-500 text-red-500"
                          }`}>
                            {estimation.confidence} Confidence
                          </Badge>
                        </div>
                        <div className="grid grid-cols-4 gap-4">
                          <div className="text-center p-3 rounded-lg bg-background/50">
                            <Eye className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                            <p className="text-lg font-bold">{(estimation.impressions / 1000000).toFixed(2)}M</p>
                            <p className="text-xs text-muted-foreground">Est. Impressions</p>
                          </div>
                          <div className="text-center p-3 rounded-lg bg-background/50">
                            <DollarSign className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                            <p className="text-lg font-bold">${estimation.spend.toLocaleString()}</p>
                            <p className="text-xs text-muted-foreground">Est. Spend</p>
                          </div>
                          <div className="text-center p-3 rounded-lg bg-background/50">
                            <Gauge className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                            <p className="text-lg font-bold">${estimation.cpm.toFixed(2)}</p>
                            <p className="text-xs text-muted-foreground">Est. eCPM</p>
                          </div>
                          <div className="text-center p-3 rounded-lg bg-background/50">
                            <TrendingUp className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                            <p className="text-lg font-bold">{estimation.winRate.toFixed(0)}%</p>
                            <p className="text-xs text-muted-foreground">Est. Win Rate</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Quality Metrics Panel */}
                  <Card>
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Shield className="h-5 w-5 text-blue-500" />
                        <span className="font-medium">Quality Metrics</span>
                      </div>
                      <div className="grid grid-cols-4 gap-3">
                        <div className="p-3 rounded-lg bg-muted/50">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-muted-foreground">Viewability</span>
                            <span className="text-sm font-bold text-green-500">78%</span>
                          </div>
                          <Progress value={78} className="h-1" />
                          <p className="text-xs text-muted-foreground mt-1">vs 70% MRC</p>
                        </div>
                        <div className="p-3 rounded-lg bg-muted/50">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-muted-foreground">Brand Safety</span>
                            <span className="text-sm font-bold text-green-500">96%</span>
                          </div>
                          <Progress value={96} className="h-1" />
                          <p className="text-xs text-muted-foreground mt-1">0 blocked</p>
                        </div>
                        <div className="p-3 rounded-lg bg-muted/50">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-muted-foreground">IVT Rate</span>
                            <span className="text-sm font-bold text-green-500">1.2%</span>
                          </div>
                          <Progress value={100 - 1.2} className="h-1" />
                          <p className="text-xs text-muted-foreground mt-1">&lt;2% target</p>
                        </div>
                        <div className="p-3 rounded-lg bg-muted/50">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-muted-foreground">Quality Score</span>
                            <span className="text-sm font-bold text-green-500">{estimation?.qualityScore?.toFixed(0) || 85}</span>
                          </div>
                          <Progress value={estimation?.qualityScore || 85} className="h-1" />
                          <p className="text-xs text-muted-foreground mt-1">Excellent</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Deal Summary */}
                  <Card>
                    <CardContent className="pt-4 space-y-4">
                      <div className="grid grid-cols-4 gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground">Deal Name</p>
                          <p className="font-medium text-sm">{dealInfo.name || "Not set"}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Advertiser</p>
                          <p className="font-medium text-sm">{dealInfo.advertiser || "Not set"}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Budget</p>
                          <p className="font-medium text-sm">${budget.toLocaleString() || "Not set"}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Duration</p>
                          <p className="font-medium text-sm">{daysRemaining} days</p>
                        </div>
                      </div>

                      <div className="border-t pt-4">
                        <p className="text-xs text-muted-foreground mb-2">Supply Packages ({selectedPackages.length})</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedPackages.map((id) => {
                            const pkg = supplyPackages.find((p) => p.id === id);
                            return (
                              <Badge key={id} variant="secondary" className="gap-1">
                                {pkg?.name}
                                <span className="text-green-500">{pkg?.matchScore}%</span>
                              </Badge>
                            );
                          })}
                          {selectedPackages.length === 0 && (
                            <span className="text-muted-foreground text-sm">None selected</span>
                          )}
                        </div>
                      </div>

                      <div className="border-t pt-4">
                        <p className="text-xs text-muted-foreground mb-2">
                          Audience ({selectedSegments.length}) • {useAndLogic ? "AND" : "OR"} logic
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {selectedSegments.map((id) => {
                            const seg = audienceSegments.find((s) => s.id === id);
                            return (
                              <Badge key={id} variant="outline" className="gap-1">
                                {seg?.name}
                                <span className="text-blue-500">{seg?.matchScore}%</span>
                              </Badge>
                            );
                          })}
                          {selectedSegments.length === 0 && (
                            <span className="text-muted-foreground text-sm">None selected</span>
                          )}
                        </div>
                      </div>

                      <div className="border-t pt-4">
                        <p className="text-xs text-muted-foreground mb-2">Contextual Triggers</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedTriggers.map((id) => {
                            const trigger = contextualTriggers.find((t) => t.id === id);
                            return <Badge key={id}>{trigger?.name}</Badge>;
                          })}
                          {selectedTriggers.length === 0 && (
                            <span className="text-muted-foreground text-sm">None selected</span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Approval Status Preview */}
                  <Card className="bg-amber-500/10 border-amber-500/30">
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Clock className="h-5 w-5 text-amber-500" />
                          <div>
                            <p className="font-medium text-sm">Pending Approval</p>
                            <p className="text-xs text-muted-foreground">Deal will be sent for internal review</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="border-amber-500 text-amber-500">
                          SLA: 24 hours
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              );
            })()}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Button>

          {currentStep < 5 ? (
            <Button onClick={nextStep}>
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
              <Check className="h-4 w-4 mr-1" />
              Create Deal
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
