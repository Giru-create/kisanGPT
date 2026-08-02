"use client";

import React, { useState } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

export interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="h-screen flex flex-col bg-background text-foreground antialiased selection:bg-primary/20 selection:text-primary overflow-hidden">
      {/* Fixed Top Header */}
      <Header onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} />

      {/* Body: Sidebar + Scrollable Content */}
      <div className="flex flex-1 min-h-0">
        {/* Sticky Sidebar */}
        <Sidebar isCollapsed={sidebarCollapsed} />

        {/* Scrollable Main Content */}
        <main
          id="main-content"
          tabIndex={-1}
          className="flex-1 overflow-y-auto focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          {children}
        </main>
      </div>
    </div>
  );
};
