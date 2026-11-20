import { TechRecommendation, UserProfile, Project, BudgetPreference } from '../types';
import { TECH_DATABASE } from '../data/techDatabase';

export interface AdvisorQuery {
  userInput: string;
  user?: UserProfile | null;
  project?: Project | null;
  budget?: BudgetPreference;
}

export interface AdvisorResponse {
  approach: string;
  reasoning: string;
  recommendations: TechRecommendation[];
  nextSteps: string[];
  warnings?: string[];
  isDemo: boolean;
}

function matchBudget(tech: TechRecommendation, budget: BudgetPreference): boolean {
  if (budget === 'no-restriction') return true;
  if (budget === 'free') return tech.pricing.hasFree && tech.pricing.status === 'free';
  if (budget === 'mostly-free') return tech.pricing.hasFree;
  if (budget === 'limited-paid') return true;
  return true;
}

function pickTechForStack(query: string, budget: BudgetPreference): TechRecommendation[] {
  const q = query.toLowerCase();
  const result: TechRecommendation[] = [];
  const picked = new Set<string>();

  function pick(id: string) {
    const t = TECH_DATABASE.find(x => x.id === id);
    if (t && !picked.has(id) && matchBudget(t, budget)) {
      result.push(t);
      picked.add(id);
    }
  }

  // Design
  if (q.includes('design') || q.includes('ui') || q.includes('prototype')) {
    pick('figma');
    if (budget === 'free') pick('penpot');
  }

  // Frontend
  if (q.includes('web') || q.includes('app') || q.includes('frontend') || q.includes('react') || q.includes('next')) {
    pick('react');
    if (q.includes('seo') || q.includes('marketing') || q.includes('blog')) pick('nextjs');
    pick('tailwindcss');
    pick('typescript');
    pick('vite');
  }

  // Mobile
  if (q.includes('mobile') || q.includes('app') || q.includes('ios') || q.includes('android')) {
    pick('react');
    pick('typescript');
  }

  // Backend
  if (q.includes('backend') || q.includes('api') || q.includes('server') || q.includes('database') || q.includes('auth')) {
    if (q.includes('python') || q.includes('fast')) {
      pick('fastapi');
    }
    pick('supabase');
    if (budget === 'no-restriction') pick('firebase');
  }

  // Database
  if (q.includes('database') || q.includes('data') || q.includes('store')) {
    pick('postgresql');
    if (q.includes('nosql') || q.includes('flexible')) pick('mongodb');
  }

  // AI features
  if (q.includes('ai') || q.includes('chatbot') || q.includes('intelligence') || q.includes('ml')) {
    pick('claude');
    pick('chatgpt');
    if (budget !== 'free') pick('gemini');
  }

  // Vibe coding / no-code
  if (q.includes('quick') || q.includes('prototype') || q.includes('mvp') || q.includes('fast')) {
    pick('replit');
  }

  // AI coding assistant
  pick('cursor');

  // Deployment
  pick('vercel');
  if (budget === 'free') pick('netlify');

  // Version control (always)
  pick('github');

  // If nothing picked, provide a default stack
  if (result.length < 3) {
    ['react', 'tailwindcss', 'supabase', 'vercel', 'github'].forEach(pick);
  }

  return result.slice(0, 8);
}

function generateApproachText(query: string, budget: BudgetPreference, user?: UserProfile | null): string {
  const q = query.toLowerCase();
  const skill = user?.skillLevel || 'intermediate';

  if (q.includes('no-code') || q.includes('nocode') || skill === 'beginner') {
    return 'No-Code / Low-Code First Approach';
  }
  if (q.includes('vibe') || q.includes('quick') || q.includes('prototype')) {
    return 'AI-Assisted Rapid Prototyping';
  }
  if (q.includes('production') || q.includes('scalable') || skill === 'expert') {
    return 'Full-Stack Production Approach';
  }
  if (budget === 'free') {
    return 'Free-Stack Development Approach';
  }
  return 'AI-Assisted Modern Web Stack';
}

function generateReasoning(query: string, recs: TechRecommendation[], budget: BudgetPreference, user?: UserProfile | null): string {
  const categories = [...new Set(recs.map(r => r.category))];
  const freeCount = recs.filter(r => r.pricing.hasFree).length;
  const budgetNote = budget === 'free'
    ? 'All recommendations are free or open source, matching your zero-budget requirement.'
    : budget === 'mostly-free'
    ? `${freeCount} of ${recs.length} recommended tools have free tiers, minimizing your costs.`
    : 'Tools selected for best value and fit regardless of cost.';

  return `Based on your project description, I've selected tools across ${categories.join(', ')} that work well together. ${budgetNote} This stack is chosen for compatibility, community support, and your ${user?.skillLevel || 'current'} skill level.`;
}

function generateNextSteps(query: string, recs: TechRecommendation[]): string[] {
  const steps = [
    'Set up your development environment and install the recommended tools',
    'Create a new repository on GitHub to track your project',
  ];

  if (recs.some(r => r.category === 'UI/UX Design')) {
    steps.push('Start with wireframes in Figma before writing any code');
  }
  if (recs.some(r => r.id === 'supabase')) {
    steps.push('Create a Supabase project and configure your database schema');
  }
  if (recs.some(r => r.id === 'react')) {
    steps.push('Initialize a Vite + React + TypeScript project');
  }
  if (recs.some(r => r.id === 'vercel')) {
    steps.push('Connect your GitHub repo to Vercel for automatic deployments');
  }
  steps.push('Ask TechPilot about any specific challenge you encounter as you build');

  return steps.slice(0, 5);
}

export async function getAdvisorResponse(query: AdvisorQuery): Promise<AdvisorResponse> {
  // Simulate async call
  await new Promise(resolve => setTimeout(resolve, 1200));

  const budget = query.budget || query.user?.budgetPreference || query.project?.budgetPreference || 'mostly-free';
  const recommendations = pickTechForStack(query.userInput, budget);
  const approach = generateApproachText(query.userInput, budget, query.user);
  const reasoning = generateReasoning(query.userInput, recommendations, budget, query.user);
  const nextSteps = generateNextSteps(query.userInput, recommendations);

  const warnings: string[] = [];
  if (query.project?.selectedTechnologies?.length) {
    const conflict = recommendations.find(r =>
      query.project?.rejectedTechnologies?.includes(r.id)
    );
    if (conflict) warnings.push(`Note: ${conflict.name} was previously excluded from this project. I've included an alternative recommendation instead.`);
  }

  return {
    approach,
    reasoning,
    recommendations,
    nextSteps,
    warnings: warnings.length > 0 ? warnings : undefined,
    isDemo: true,
  };
}
