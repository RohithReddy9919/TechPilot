import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Logo } from '../ui/Logo';
import { useApp } from '../../context/AppContext';

interface NavItem {
  label: string;
  to: string;
  icon: React.ReactNode;
}

function GridIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
    </svg>
  );
}
function FolderIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
    </svg>
  );
}
function BotIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M12 2a3 3 0 00-3 3v6h6V5a3 3 0 00-3-3z" />
      <circle cx="8.5" cy="16.5" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="15.5" cy="16.5" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}
function CompassIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  );
}
function BookmarkIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
    </svg>
  );
}
function ClockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
function SettingsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
  );
}
function HelpIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}
function LogOutIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

const mainNavItems: NavItem[] = [
  { label: 'Overview', to: '/dashboard', icon: <GridIcon /> },
  { label: 'My projects', to: '/projects', icon: <FolderIcon /> },
  { label: 'AI advisor', to: '/advisor', icon: <BotIcon /> },
  { label: 'Explore technologies', to: '/explore', icon: <CompassIcon /> },
  { label: 'Saved recommendations', to: '/saved', icon: <BookmarkIcon /> },
  { label: 'History', to: '/history', icon: <ClockIcon /> },
];

const bottomNavItems: NavItem[] = [
  { label: 'Settings', to: '/settings', icon: <SettingsIcon /> },
  { label: 'Help & support', to: '/help', icon: <HelpIcon /> },
];

function SideNavLink({ item }: { item: NavItem }) {
  return (
    <NavLink
      to={item.to}
      end={item.to === '/dashboard'}
      className={({ isActive }) =>
        [
          'flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer',
          isActive
            ? 'text-white bg-white/15'
            : 'text-white/60 hover:text-white hover:bg-white/10',
        ].join(' ')
      }
    >
      {item.icon}
      <span>{item.label}</span>
    </NavLink>
  );
}

export function Sidebar() {
  const { user, logout } = useApp();
  const navigate = useNavigate();

  const initials = user?.fullName
    ? user.fullName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside
      className="fixed left-0 top-0 h-screen w-60 flex flex-col z-30"
      style={{ backgroundColor: '#1A2F2F' }}
    >
      {/* Logo */}
      <div className="px-5 pt-6 pb-5">
        <Logo size="md" dark />
      </div>

      {/* User info matching screenshot */}
      <div className="px-5 pb-5">
        <div
          onClick={() => navigate('/settings')}
          className="flex items-center justify-between group cursor-pointer hover:bg-white/5 p-1 rounded-lg transition-colors"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-[#E8541A] flex items-center justify-center flex-shrink-0 shadow-sm">
              <span className="text-white text-xs font-bold">{initials}</span>
            </div>
            <div className="min-w-0">
              <p className="text-white text-sm font-semibold truncate">
                {user?.fullName?.split(' ')[0] ?? 'Rocky'}
              </p>
              <p className="text-white/40 text-[11px] truncate">Personal workspace</p>
            </div>
          </div>
          <svg className="w-4 h-4 text-white/30 group-hover:text-white transition-colors flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-5 border-t border-white/10 mb-3" />

      {/* Main nav */}
      <nav className="flex-1 overflow-y-auto px-3 space-y-0.5">
        {mainNavItems.map((item) => (
          <SideNavLink key={item.to} item={item} />
        ))}
      </nav>

      {/* Divider */}
      <div className="mx-5 border-t border-white/10 my-3" />

      {/* Bottom nav */}
      <nav className="px-3 space-y-0.5 pb-2">
        {bottomNavItems.map((item) => (
          <SideNavLink key={item.to} item={item} />
        ))}

        {/* Log out button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200 cursor-pointer"
        >
          <LogOutIcon />
          <span>Log out</span>
        </button>
      </nav>

      {/* Bottom padding */}
      <div className="pb-4" />
    </aside>
  );
}

export default Sidebar;
