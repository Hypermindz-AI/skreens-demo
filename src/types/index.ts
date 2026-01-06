// Demo types for Skreens + HyperMindZ integration demo

export interface Deal {
  id: string;
  name: string;
  advertiser: string;
  status: 'active' | 'paused' | 'completed';
  impressions: number;
  spend: number;
  ecpm: number;
  pacing: number;
}

export interface McpCall {
  id: string;
  method: string;
  timestamp: Date;
  latency: number;
  status: 'success' | 'error';
  request: object;
  response: object;
}

export interface SupplyPackage {
  id: string;
  name: string;
  icon: string;
  venues: number;
  screens: number;
  lbarEnabled: boolean;
  floorCpm: number;
  dailyImpressions: string;
}

export interface AudienceSegment {
  id: string;
  name: string;
  description: string;
  reach: number;
  selected?: boolean;
}

export interface Creative {
  id: string;
  name: string;
  advertiser: string;
  type: 'lbar' | 'overlay' | 'banner';
  thumbnail?: string;
}

export interface ContextualTrigger {
  event: 'TOUCHDOWN' | 'GOAL' | 'HALFTIME' | 'FIELD_GOAL' | 'INTERCEPTION';
  creative: Creative;
  template: string;
  sports: string[];
  active: boolean;
}

export interface DemoScenario {
  id: string;
  name: string;
  shortcut: string;
  description: string;
  action: () => void;
}

export interface MetricCard {
  label: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
}
