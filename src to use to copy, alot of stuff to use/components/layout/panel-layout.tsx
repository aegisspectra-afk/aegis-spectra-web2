'use client';

import { useState } from 'react';
import { Sidebar } from './sidebar';
import { TopBar } from './topbar';
import { Footer } from './footer';

interface PanelLayoutProps {
  children: React.ReactNode;
  userRole: string;
  subscriptionPlan: string;
  hideSidebar?: boolean;
}

export function PanelLayout({ children, userRole, subscriptionPlan, hideSidebar = false }: PanelLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(256); // px; dynamic with Sidebar state
  const toggleSidebar = () => setSidebarOpen((v) => !v);


  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      {!hideSidebar && (
        <Sidebar
          userRole={userRole}
          subscriptionPlan={subscriptionPlan}
          isOpen={sidebarOpen}
          onToggle={toggleSidebar}
          onWidthChange={(w:number)=>setSidebarWidth(w)}
        />
      )}

      {/* Main Content */}
      <div style={hideSidebar ? undefined : { paddingLeft: sidebarWidth }}>
        {/* Top Bar */}
        <TopBar 
          onMenuClick={toggleSidebar}
          userRole={userRole}
          subscriptionPlan={subscriptionPlan}
          showNav={hideSidebar}
        />

        {/* Page Content */}
        <main className="flex-1">
          {children}
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}