// Core types for TechPilot

export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';
export type BudgetPreference = 'free' | 'mostly-free' | 'limited-paid' | 'no-restriction';
export type DevApproach = 'traditional' | 'ai-assisted' | 'vibe-coding' | 'no-code' | 'low-code' | 'hybrid';
export type ProjectStage = 'idea' | 'planning' | 'design' | 'development' | 'testing' | 'deployment';
export type TeamType = 'individual' | 'small-team' | 'large-team';

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  avatar?: string;
  skillLevel: SkillLevel;
  preferredLanguages: string[];
  preferredApproach: DevApproach;
  budgetPreference: BudgetPreference;
  existingSubscriptions: string[];
  teamType: TeamType;
  projectInterests: string[];
  createdAt: string;
  onboardingComplete: boolean;
}

export interface Project {
  id: string;
  userId: string;
  name: string;
  description: string;
  stage: ProjectStage;
  currentTask: string;
  deadline?: string;
  milestones: Milestone[];
  selectedTechnologies: string[];
  rejectedTechnologies: string[];
  budgetPreference: BudgetPreference;
  teamType: TeamType;
  advisorHistory: AdvisorMessage[];
  savedRecommendations: string[];
  createdAt: string;
  updatedAt: string;
  completedMilestones: number;
  totalMilestones: number;
}

export interface Milestone {
  id: string;
  title: string;
  completed: boolean;
  stage: ProjectStage;
}

export interface AdvisorMessage {
  id: string;
  role: 'user' | 'advisor';
  content: string;
  timestamp: string;
  recommendations?: TechRecommendation[];
}

export interface TechRecommendation {
  id: string;
  name: string;
  category: TechCategory;
  purpose: string;
  bestUseCase: string;
  advantages: string[];
  limitations: string[];
  pricing: PricingInfo;
  alternatives: string[];
  website?: string;
  logoLetter?: string;
  logoColor?: string;
}

export type TechCategory =
  | 'UI/UX Design'
  | 'Frontend'
  | 'Backend'
  | 'Database'
  | 'Authentication'
  | 'AI Assistant'
  | 'Vibe Coding'
  | 'Deployment'
  | 'Testing'
  | 'Project Management'
  | 'Version Control'
  | 'Mobile';

export interface PricingInfo {
  hasFree: boolean;
  freeDetails?: string;
  paidTiers?: string;
  status: 'free' | 'freemium' | 'paid' | 'verify';
}

export interface ComparisonItem {
  tool: TechRecommendation;
  selected: boolean;
}

export interface OnboardingData {
  skillLevel: SkillLevel;
  preferredLanguages: string[];
  preferredApproach: DevApproach;
  budgetPreference: BudgetPreference;
  existingSubscriptions: string[];
  teamType: TeamType;
  projectInterests: string[];
  deadline: string;
}
