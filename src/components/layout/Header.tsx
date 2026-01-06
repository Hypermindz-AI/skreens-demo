"use client";

import { Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/theme-toggle";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-foreground">
            Hyper<span className="text-primary">MindZ</span>
          </span>
          <Badge variant="outline" className="ml-2 text-xs">
            Skreens Integration
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          <button className="relative p-2 hover:bg-accent rounded-full transition-colors">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-5 w-5 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
              3
            </span>
          </button>

          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
              MB
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
