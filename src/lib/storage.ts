// Local storage persistence layer for demo mode
import { UserProfile, Project } from '../types';

const KEYS = {
  USER: 'techpilot_user',
  PROJECTS: 'techpilot_projects',
  SESSION: 'techpilot_session',
};

export const storage = {
  getUser: (): UserProfile | null => {
    try {
      const data = localStorage.getItem(KEYS.USER);
      return data ? JSON.parse(data) : null;
    } catch { return null; }
  },

  setUser: (user: UserProfile): void => {
    localStorage.setItem(KEYS.USER, JSON.stringify(user));
  },

  clearUser: (): void => {
    localStorage.removeItem(KEYS.USER);
    localStorage.removeItem(KEYS.SESSION);
  },

  getProjects: (): Project[] => {
    try {
      const data = localStorage.getItem(KEYS.PROJECTS);
      return data ? JSON.parse(data) : [];
    } catch { return []; }
  },

  setProjects: (projects: Project[]): void => {
    localStorage.setItem(KEYS.PROJECTS, JSON.stringify(projects));
  },

  getSession: (): { isLoggedIn: boolean } | null => {
    try {
      const data = localStorage.getItem(KEYS.SESSION);
      return data ? JSON.parse(data) : null;
    } catch { return null; }
  },

  setSession: (session: { isLoggedIn: boolean }): void => {
    localStorage.setItem(KEYS.SESSION, JSON.stringify(session));
  },

  clearAll: (): void => {
    Object.values(KEYS).forEach(key => localStorage.removeItem(key));
  },
};
