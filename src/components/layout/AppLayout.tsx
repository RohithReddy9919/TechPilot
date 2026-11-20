import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { useApp } from '../../context/AppContext';

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

function useBreadcrumb(pathname: string): { workspace: string; page: string } {
  const segments = pathname.split('/').filter(Boolean);
  const pageMap: Record<string, string> = {
    dashboard: 'Overview',
    projects: 'My projects',
    advisor: 'AI advisor',
    explore: 'Explore technologies',
    saved: 'Saved recommendations',
    history: 'History',
    settings: 'Settings',
    help: 'Help & support',
    onboarding: 'Onboarding',
  };
  const page = pageMap[segments[0]] ?? 'Overview';
  return { workspace: 'Workspace', page };
}

interface AppLayoutProps {
  children?: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { user } = useApp();
  const location = useLocation();
  const { workspace, page } = useBreadcrumb(location.pathname);

  const initials = user?.fullName
    ? user.fullName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U';

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#F5F3EE' }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main content — offset by sidebar width */}
      <div className="flex-1 ml-60 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-[#F5F3EE]/90 backdrop-blur-sm px-8 h-16 flex items-center justify-between">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs font-mono">
            <span className="text-[#1A2F2F]/60 font-medium">Workspace</span>
            <span className="text-[#1A2F2F]/30">&gt;</span>
            <span className="text-[#1A2F2F] font-semibold">Personal</span>
          </nav>

          {/* Right: search + avatar */}
          <div className="flex items-center gap-4">
            <button
              className="text-[#1A2F2F]/50 hover:text-[#1A2F2F] transition-colors p-2 rounded-lg hover:bg-[#1A2F2F]/5 cursor-pointer"
              aria-label="Search"
            >
              <SearchIcon />
            </button>

            {/* User avatar + name matching screenshot */}
            <div
              className="flex items-center gap-2.5 cursor-pointer select-none"
              title={user?.fullName}
            >
              <div className="w-8 h-8 rounded-lg bg-[#E8541A] flex items-center justify-center shadow-sm">
                <span className="text-white text-xs font-bold">{initials}</span>
              </div>
              <span className="text-sm font-semibold text-[#1A2F2F]">
                {user?.fullName?.split(' ')[0] ?? 'Rocky'}
              </span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 px-8 py-8">
          {children ?? <Outlet />}
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
