import React from 'react';
import { Outlet } from 'react-router-dom';

interface PublicLayoutProps {
  children?: React.ReactNode;
}

export function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F3EE' }}>
      {children ?? <Outlet />}
    </div>
  );
}

export default PublicLayout;
