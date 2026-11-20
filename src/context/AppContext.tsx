import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile, Project } from '../types';
import { storage } from '../lib/storage';
import { v4 as uuidv4 } from 'uuid';

interface AppContextType {
  user: UserProfile | null;
  projects: Project[];
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (fullName: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUser: (updates: Partial<UserProfile>) => void;
  createProject: (data: Partial<Project>) => Project;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  getProject: (id: string) => Project | undefined;
  completeOnboarding: (data: Partial<UserProfile>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const DEFAULT_DEMO_USER: UserProfile = {
  id: 'demo-rocky',
  fullName: 'Rocky Sharma',
  email: 'you@example.com',
  skillLevel: 'intermediate',
  preferredLanguages: ['TypeScript', 'Python', 'React'],
  preferredApproach: 'ai-assisted',
  budgetPreference: 'free',
  existingSubscriptions: ['GitHub', 'Figma'],
  teamType: 'individual',
  projectInterests: ['Web Development', 'AI Tools', 'Mobile'],
  createdAt: '2025-10-14T08:00:00Z',
  onboardingComplete: true,
};

const DEFAULT_DEMO_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    userId: 'demo-rocky',
    name: 'College Event Hub',
    description: 'One place to discover, register and manage campus events.',
    stage: 'planning',
    currentTask: 'Finalizing database schema and event registration flow',
    deadline: '2026-12-15',
    milestones: [
      { id: 'm1', title: 'Scope & requirements', completed: true, stage: 'idea' },
      { id: 'm2', title: 'UI Wireframes & Figma', completed: true, stage: 'design' },
      { id: 'm3', title: 'Database & Auth setup', completed: false, stage: 'development' },
      { id: 'm4', title: 'Event discovery feed', completed: false, stage: 'development' },
      { id: 'm5', title: 'QR ticketing & check-in', completed: false, stage: 'testing' },
      { id: 'm6', title: 'Production release', completed: false, stage: 'deployment' },
    ],
    selectedTechnologies: ['react', 'tailwindcss', 'fastapi', 'postgresql', 'figma'],
    rejectedTechnologies: [],
    budgetPreference: 'free',
    teamType: 'individual',
    advisorHistory: [
      {
        id: 'msg-1',
        role: 'user',
        content: 'I want to build a college event discovery and registration platform with QR check-ins on a student budget.',
        timestamp: '2025-10-14T10:30:00Z',
      },
      {
        id: 'msg-2',
        role: 'advisor',
        content: JSON.stringify({
          approach: 'Free-Stack Full-Stack Web App',
          reasoning: 'Because this is a campus app with student organizers and a zero-budget preference, using React + Tailwind with a FastAPI backend and PostgreSQL provides rapid delivery, high performance for event surges, and zero hosting costs on free tiers.',
          nextSteps: [
            'Design the event card and ticket pass in Figma',
            'Initialize Vite + React project with Tailwind CSS',
            'Set up Supabase or free Postgres for relational event & registration tables',
            'Generate QR codes using lightweight client-side library',
          ],
        }),
        timestamp: '2025-10-14T10:31:00Z',
      },
    ],
    savedRecommendations: ['react', 'fastapi', 'figma', 'postgresql'],
    createdAt: '2025-10-10T09:00:00Z',
    updatedAt: '2025-10-14T10:35:00Z',
    completedMilestones: 2,
    totalMilestones: 6,
  },
  {
    id: 'proj-2',
    userId: 'demo-rocky',
    name: 'Smart Direction Finder',
    description: 'A location-aware campus guide for new students.',
    stage: 'planning',
    currentTask: 'Integrating campus building coordinates & offline routing',
    deadline: '2027-01-20',
    milestones: [
      { id: 'm2-1', title: 'Campus map indexing', completed: true, stage: 'idea' },
      { id: 'm2-2', title: 'Interactive map prototype', completed: true, stage: 'design' },
      { id: 'm2-3', title: 'Turn-by-turn routing logic', completed: false, stage: 'development' },
      { id: 'm2-4', title: 'Accessibility pathways', completed: false, stage: 'development' },
      { id: 'm2-5', title: 'GPS accuracy field testing', completed: false, stage: 'testing' },
      { id: 'm2-6', title: 'Campus orientation launch', completed: false, stage: 'deployment' },
    ],
    selectedTechnologies: ['react', 'typescript', 'tailwindcss'],
    rejectedTechnologies: [],
    budgetPreference: 'mostly-free',
    teamType: 'small-team',
    advisorHistory: [],
    savedRecommendations: ['react', 'typescript'],
    createdAt: '2025-10-11T11:00:00Z',
    updatedAt: '2025-10-13T14:20:00Z',
    completedMilestones: 2,
    totalMilestones: 6,
  },
  {
    id: 'proj-3',
    userId: 'demo-rocky',
    name: 'AI Attendance System',
    description: 'QR-based attendance with faculty insights and student records.',
    stage: 'development',
    currentTask: 'Dynamic QR rotation to prevent proxy attendance',
    deadline: '2026-11-30',
    milestones: [
      { id: 'm3-1', title: 'System architecture definition', completed: true, stage: 'idea' },
      { id: 'm3-2', title: 'Faculty dashboard UX', completed: true, stage: 'design' },
      { id: 'm3-3', title: 'Time-expiring QR generator', completed: false, stage: 'development' },
      { id: 'm3-4', title: 'Fraud detection heuristics', completed: false, stage: 'development' },
      { id: 'm3-5', title: 'Classroom pilot test', completed: false, stage: 'testing' },
      { id: 'm3-6', title: 'Campus roll-out', completed: false, stage: 'deployment' },
    ],
    selectedTechnologies: ['react', 'fastapi', 'postgresql', 'cursor'],
    rejectedTechnologies: [],
    budgetPreference: 'free',
    teamType: 'individual',
    advisorHistory: [],
    savedRecommendations: ['react', 'fastapi', 'postgresql', 'cursor'],
    createdAt: '2025-10-12T08:30:00Z',
    updatedAt: '2025-10-14T11:00:00Z',
    completedMilestones: 2,
    totalMilestones: 6,
  },
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let savedUser = storage.getUser();
    let savedProjects = storage.getProjects();

    // Auto-seed demo data if clean storage
    if (!savedUser) {
      savedUser = DEFAULT_DEMO_USER;
      savedProjects = DEFAULT_DEMO_PROJECTS;
      storage.setUser(savedUser);
      storage.setProjects(savedProjects);
    }

    const session = storage.getSession();
    if (session?.isLoggedIn) {
      setUser(savedUser);
      setProjects(savedProjects);
      setIsLoggedIn(true);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    if (!email || !password) return { success: false, error: 'Email and password are required.' };
    if (password.length < 6) return { success: false, error: 'Password must be at least 6 characters.' };

    const normEmail = email.toLowerCase().trim();
    let savedUser = storage.getUser();

    // If logging in as demo user or matches saved user
    if (normEmail === 'you@example.com' || (savedUser && savedUser.email.toLowerCase() === normEmail)) {
      if (!savedUser) {
        savedUser = DEFAULT_DEMO_USER;
        storage.setUser(savedUser);
        storage.setProjects(DEFAULT_DEMO_PROJECTS);
      }
      setUser(savedUser);
      setProjects(storage.getProjects());
      setIsLoggedIn(true);
      storage.setSession({ isLoggedIn: true });
      return { success: true };
    }

    if (!savedUser) {
      return { success: false, error: 'No account found. Please sign up first or use you@example.com for demo.' };
    }
    return { success: false, error: 'Incorrect email or password.' };
  };

  const signup = async (fullName: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    if (!fullName.trim()) return { success: false, error: 'Full name is required.' };
    if (!email.includes('@')) return { success: false, error: 'Please enter a valid email address.' };
    if (password.length < 6) return { success: false, error: 'Password must be at least 6 characters.' };

    const existing = storage.getUser();
    if (existing && existing.email === email) {
      return { success: false, error: 'An account with this email already exists.' };
    }

    const newUser: UserProfile = {
      id: uuidv4(),
      fullName: fullName.trim(),
      email: email.toLowerCase().trim(),
      skillLevel: 'intermediate',
      preferredLanguages: [],
      preferredApproach: 'ai-assisted',
      budgetPreference: 'mostly-free',
      existingSubscriptions: [],
      teamType: 'individual',
      projectInterests: [],
      createdAt: new Date().toISOString(),
      onboardingComplete: false,
    };

    storage.setUser(newUser);
    storage.setProjects([]);
    storage.setSession({ isLoggedIn: true });
    setUser(newUser);
    setProjects([]);
    setIsLoggedIn(true);
    return { success: true };
  };

  const logout = () => {
    storage.clearUser();
    setUser(null);
    setProjects([]);
    setIsLoggedIn(false);
  };

  const updateUser = (updates: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);
    storage.setUser(updated);
  };

  const completeOnboarding = (data: Partial<UserProfile>) => {
    updateUser({ ...data, onboardingComplete: true });
  };

  const createProject = (data: Partial<Project>): Project => {
    const project: Project = {
      id: uuidv4(),
      userId: user?.id || '',
      name: data.name || 'New Project',
      description: data.description || '',
      stage: data.stage || 'idea',
      currentTask: data.currentTask || '',
      deadline: data.deadline,
      milestones: data.milestones || [
        { id: uuidv4(), title: 'Define project scope', completed: false, stage: 'idea' },
        { id: uuidv4(), title: 'Create wireframes', completed: false, stage: 'design' },
        { id: uuidv4(), title: 'Set up project structure', completed: false, stage: 'development' },
        { id: uuidv4(), title: 'Build core features', completed: false, stage: 'development' },
        { id: uuidv4(), title: 'Testing and QA', completed: false, stage: 'testing' },
        { id: uuidv4(), title: 'Deploy to production', completed: false, stage: 'deployment' },
      ],
      selectedTechnologies: data.selectedTechnologies || [],
      rejectedTechnologies: data.rejectedTechnologies || [],
      budgetPreference: data.budgetPreference || user?.budgetPreference || 'mostly-free',
      teamType: data.teamType || user?.teamType || 'individual',
      advisorHistory: [],
      savedRecommendations: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      completedMilestones: 0,
      totalMilestones: 6,
    };
    const updated = [...projects, project];
    setProjects(updated);
    storage.setProjects(updated);
    return project;
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    const updated = projects.map(p =>
      p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
    );
    setProjects(updated);
    storage.setProjects(updated);
  };

  const deleteProject = (id: string) => {
    const updated = projects.filter(p => p.id !== id);
    setProjects(updated);
    storage.setProjects(updated);
  };

  const getProject = (id: string) => projects.find(p => p.id === id);

  return (
    <AppContext.Provider value={{
      user, projects, isLoggedIn, isLoading,
      login, signup, logout, updateUser,
      createProject, updateProject, deleteProject, getProject,
      completeOnboarding,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
