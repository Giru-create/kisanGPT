"use client";

import React, { useState } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { Footer } from "./Footer";

export interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground antialiased selection:bg-primary/20 selection:text-primary">
      {/* Top Navigation Header */}
      <Header onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} />

      {/* Main Body Shell */}
      <div className="flex flex-1 overflow-hidden">
        {/* Collapsible Sidebar */}
        <Sidebar isCollapsed={sidebarCollapsed} />

        {/* Main Content Landmark Area */}
        <main
          id="main-content"
          tabIndex={-1}
          className="flex-1 overflow-y-auto outline-none focus:ring-0"
        >
          {children}
        </main>
      </div>

      {/* Site Footer */}
      <Footer />
    </div>
  );
};
