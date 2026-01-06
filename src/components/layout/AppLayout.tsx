"use client";

import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { DemoController } from "@/components/demo/DemoController";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">{children}</main>
      </div>
      <DemoController />
    </div>
  );
}
