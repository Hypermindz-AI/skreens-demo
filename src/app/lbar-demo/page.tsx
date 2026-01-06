"use client";

import { LBarDemo } from "@/components/demo/LBarDemo";

export default function LBarDemoPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">L-Bar Contextual Ad Demo</h1>
        <p className="text-muted-foreground">
          Real-time contextual ad triggers during live sports events
        </p>
      </div>
      <LBarDemo />
    </div>
  );
}
