import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { ReactNode } from 'react';

// Lazy imports for code-splitting
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import OnboardingPage from './pages/onboarding/OnboardingPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import ProjectsPage from './pages/projects/ProjectsPage';
import ProjectDetailPage from './pages/projects/ProjectDetailPage';
import AdvisorPage from './pages/advisor/AdvisorPage';
import ExplorePage from './pages/explore/ExplorePage';
import ComparePage from './pages/compare/ComparePage';
import SavedRecommendationsPage from './pages/saved/SavedRecommendationsPage';
import HistoryPage from './pages/history/HistoryPage';
import SettingsPage from './pages/settings/SettingsPage';
import HelpPage from './pages/help/HelpPage';
import AppLayout from './components/layout/AppLayout';

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isLoggedIn, isLoading, user } = useApp();
  if (isLoading) return <div className="min-h-screen bg-cream-100 flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-900" /></div>;
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  if (!user?.onboardingComplete) return <Navigate to="/onboarding" replace />;
  return <>{children}</>;
}

function PublicOnlyRoute({ children }: { children: ReactNode }) {
  const { isLoggedIn, isLoading, user } = useApp();
  if (isLoading) return <div className="min-h-screen bg-cream-100 flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-900" /></div>;
  if (isLoggedIn && user?.onboardingComplete) return <Navigate to="/dashboard" replace />;
  if (isLoggedIn && !user?.onboardingComplete) return <Navigate to="/onboarding" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<PublicOnlyRoute><LoginPage /></PublicOnlyRoute>} />
      <Route path="/signup" element={<PublicOnlyRoute><SignupPage /></PublicOnlyRoute>} />
      <Route path="/onboarding" element={<OnboardingPage />} />

      {/* Protected app routes */}
      <Route path="/dashboard" element={<ProtectedRoute><AppLayout><DashboardPage /></AppLayout></ProtectedRoute>} />
      <Route path="/projects" element={<ProtectedRoute><AppLayout><ProjectsPage /></AppLayout></ProtectedRoute>} />
      <Route path="/projects/:id" element={<ProtectedRoute><AppLayout><ProjectDetailPage /></AppLayout></ProtectedRoute>} />
      <Route path="/advisor" element={<ProtectedRoute><AppLayout><AdvisorPage /></AppLayout></ProtectedRoute>} />
      <Route path="/explore" element={<ProtectedRoute><AppLayout><ExplorePage /></AppLayout></ProtectedRoute>} />
      <Route path="/compare" element={<ProtectedRoute><AppLayout><ComparePage /></AppLayout></ProtectedRoute>} />
      <Route path="/saved" element={<ProtectedRoute><AppLayout><SavedRecommendationsPage /></AppLayout></ProtectedRoute>} />
      <Route path="/history" element={<ProtectedRoute><AppLayout><HistoryPage /></AppLayout></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><AppLayout><SettingsPage /></AppLayout></ProtectedRoute>} />
      <Route path="/help" element={<ProtectedRoute><AppLayout><HelpPage /></AppLayout></ProtectedRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;
