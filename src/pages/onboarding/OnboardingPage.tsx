import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { SkillLevel, DevApproach, BudgetPreference, TeamType } from '../../types';

// ─── Types ────────────────────────────────────────────────────────────────────
interface OnboardingState {
  skillLevel: SkillLevel;
  preferredLanguages: string[];
  preferredApproach: DevApproach;
  teamType: TeamType;
  budgetPreference: BudgetPreference;
  existingSubscriptions: string[];
  projectInterests: string[];
  deadline: string;
}

// ─── Compass Icon ─────────────────────────────────────────────────────────────
const CompassIcon: React.FC<{ size?: number }> = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" fill="#E8541A" />
    <polygon points="12,4 14,12 12,20 10,12" fill="white" opacity="0.9" />
    <polygon points="4,12 12,10 20,12 12,14" fill="white" opacity="0.6" />
    <circle cx="12" cy="12" r="2" fill="white" />
  </svg>
);

// ─── Step Progress Indicator ──────────────────────────────────────────────────
const StepProgress: React.FC<{ current: number; total: number; labels: string[] }> = ({
  current,
  total,
  labels,
}) => (
  <div className="flex items-center gap-0 mb-10">
    {Array.from({ length: total }).map((_, i) => {
      const stepNum = i + 1;
      const isComplete = stepNum < current;
      const isActive = stepNum === current;

      return (
        <React.Fragment key={stepNum}>
          <div className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                isComplete
                  ? 'bg-[#1A2F2F] text-white'
                  : isActive
                  ? 'bg-[#E8541A] text-white'
                  : 'bg-[#1A2F2F]/10 text-[#1A2F2F]/40'
              }`}
            >
              {isComplete ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                stepNum
              )}
            </div>
            <div
              className={`text-[9px] font-medium mt-1 max-w-[60px] text-center hidden sm:block ${
                isActive ? 'text-[#E8541A]' : isComplete ? 'text-[#1A2F2F]/70' : 'text-[#1A2F2F]/30'
              }`}
            >
              {labels[i]}
            </div>
          </div>
          {i < total - 1 && (
            <div
              className={`flex-1 h-0.5 mx-1 transition-all ${
                isComplete ? 'bg-[#1A2F2F]' : 'bg-[#1A2F2F]/10'
              }`}
            />
          )}
        </React.Fragment>
      );
    })}
  </div>
);

// ─── Skill Card ───────────────────────────────────────────────────────────────
interface SelectCardProps {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}

const SelectCard: React.FC<SelectCardProps> = ({ selected, onClick, children, className = '' }) => (
  <button
    type="button"
    onClick={onClick}
    className={`border-2 rounded-2xl p-4 text-left transition-all w-full ${
      selected
        ? 'border-[#1A2F2F] bg-[#1A2F2F]/5'
        : 'border-[#1A2F2F]/10 bg-white hover:border-[#1A2F2F]/30'
    } ${className}`}
  >
    {children}
  </button>
);

// ─── Checkbox Tag ─────────────────────────────────────────────────────────────
const CheckTag: React.FC<{
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}> = ({ label, checked, onChange }) => (
  <button
    type="button"
    onClick={() => onChange(!checked)}
    className={`px-4 py-2 rounded-xl text-sm font-medium border-2 transition-all ${
      checked
        ? 'bg-[#1A2F2F] text-white border-[#1A2F2F]'
        : 'bg-white text-[#1A2F2F]/70 border-[#1A2F2F]/10 hover:border-[#1A2F2F]/30'
    }`}
  >
    {label}
  </button>
);

// ─── Step 1: Skill Level + Languages ─────────────────────────────────────────
const Step1: React.FC<{
  data: OnboardingState;
  onChange: (updates: Partial<OnboardingState>) => void;
}> = ({ data, onChange }) => {
  const skillLevels: { value: SkillLevel; label: string; desc: string; emoji: string }[] = [
    { value: 'beginner', label: 'Beginner', desc: "I'm learning the ropes", emoji: '🌱' },
    { value: 'intermediate', label: 'Intermediate', desc: "I've built a few projects", emoji: '🌿' },
    { value: 'advanced', label: 'Advanced', desc: 'I build production apps', emoji: '🌲' },
    { value: 'expert', label: 'Expert', desc: 'I architect systems', emoji: '🏔️' },
  ];

  const languages = [
    'JavaScript', 'TypeScript', 'Python', 'Go', 'Rust',
    'Java', 'C#', 'PHP', 'Ruby', 'Swift', 'Kotlin', 'Dart',
  ];

  const toggleLanguage = (lang: string) => {
    const current = data.preferredLanguages;
    if (current.includes(lang)) {
      onChange({ preferredLanguages: current.filter(l => l !== lang) });
    } else {
      onChange({ preferredLanguages: [...current, lang] });
    }
  };

  return (
    <div>
      <div className="mb-7">
        <h3 className="text-lg font-bold text-[#1A2F2F] mb-1">What's your skill level?</h3>
        <p className="text-sm text-[#1A2F2F]/50">This helps us tailor recommendations to your experience.</p>
      </div>
      <div className="grid grid-cols-2 gap-3 mb-8">
        {skillLevels.map(({ value, label, desc, emoji }) => (
          <SelectCard
            key={value}
            selected={data.skillLevel === value}
            onClick={() => onChange({ skillLevel: value })}
          >
            <div className="text-xl mb-1.5">{emoji}</div>
            <div className="font-semibold text-[#1A2F2F] text-sm">{label}</div>
            <div className="text-[#1A2F2F]/50 text-xs mt-0.5">{desc}</div>
          </SelectCard>
        ))}
      </div>

      <div>
        <h3 className="text-lg font-bold text-[#1A2F2F] mb-1">Preferred languages</h3>
        <p className="text-sm text-[#1A2F2F]/50 mb-4">Select all that apply — we'll recommend compatible tools.</p>
        <div className="flex flex-wrap gap-2">
          {languages.map(lang => (
            <CheckTag
              key={lang}
              label={lang}
              checked={data.preferredLanguages.includes(lang)}
              onChange={() => toggleLanguage(lang)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── Step 2: Dev Approach + Team ──────────────────────────────────────────────
const Step2: React.FC<{
  data: OnboardingState;
  onChange: (updates: Partial<OnboardingState>) => void;
}> = ({ data, onChange }) => {
  const approaches: { value: DevApproach; label: string; desc: string; emoji: string }[] = [
    { value: 'traditional', label: 'Traditional', desc: 'Write every line by hand', emoji: '⌨️' },
    { value: 'ai-assisted', label: 'AI-Assisted', desc: 'AI helps me code faster', emoji: '🤖' },
    { value: 'vibe-coding', label: 'Vibe Coding', desc: 'AI writes most of the code', emoji: '✨' },
    { value: 'no-code', label: 'No-Code', desc: 'Visual builders only', emoji: '🧩' },
    { value: 'low-code', label: 'Low-Code', desc: 'Minimal coding required', emoji: '🔧' },
    { value: 'hybrid', label: 'Hybrid', desc: 'Mix of approaches', emoji: '🔀' },
  ];

  const teams: { value: TeamType; label: string; desc: string; emoji: string }[] = [
    { value: 'individual', label: 'Solo', desc: 'Just me', emoji: '👤' },
    { value: 'small-team', label: 'Small Team', desc: '2–10 people', emoji: '👥' },
    { value: 'large-team', label: 'Large Team', desc: '10+ people', emoji: '🏢' },
  ];

  return (
    <div>
      <div className="mb-7">
        <h3 className="text-lg font-bold text-[#1A2F2F] mb-1">How do you prefer to build?</h3>
        <p className="text-sm text-[#1A2F2F]/50">Your approach shapes which tools we recommend.</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
        {approaches.map(({ value, label, desc, emoji }) => (
          <SelectCard
            key={value}
            selected={data.preferredApproach === value}
            onClick={() => onChange({ preferredApproach: value })}
          >
            <div className="text-xl mb-1.5">{emoji}</div>
            <div className="font-semibold text-[#1A2F2F] text-sm">{label}</div>
            <div className="text-[#1A2F2F]/50 text-xs mt-0.5">{desc}</div>
          </SelectCard>
        ))}
      </div>

      <div>
        <h3 className="text-lg font-bold text-[#1A2F2F] mb-1">Team size</h3>
        <p className="text-sm text-[#1A2F2F]/50 mb-4">Influences collaboration tool recommendations.</p>
        <div className="grid grid-cols-3 gap-3">
          {teams.map(({ value, label, desc, emoji }) => (
            <SelectCard
              key={value}
              selected={data.teamType === value}
              onClick={() => onChange({ teamType: value })}
            >
              <div className="text-xl mb-1.5">{emoji}</div>
              <div className="font-semibold text-[#1A2F2F] text-sm">{label}</div>
              <div className="text-[#1A2F2F]/50 text-xs mt-0.5">{desc}</div>
            </SelectCard>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── Step 3: Budget + Subscriptions ──────────────────────────────────────────
const Step3: React.FC<{
  data: OnboardingState;
  onChange: (updates: Partial<OnboardingState>) => void;
}> = ({ data, onChange }) => {
  const budgets: { value: BudgetPreference; label: string; desc: string; emoji: string; color: string }[] = [
    { value: 'free', label: 'Completely Free', desc: 'Open-source and free tiers only', emoji: '🆓', color: '#22C55E' },
    { value: 'mostly-free', label: 'Mostly Free', desc: 'Free with optional paid upgrades', emoji: '💚', color: '#86EFAC' },
    { value: 'limited-paid', label: 'Limited Paid', desc: 'Some paid tools are OK', emoji: '💛', color: '#FDE047' },
    { value: 'no-restriction', label: 'No Restriction', desc: 'Best tools regardless of cost', emoji: '💎', color: '#818CF8' },
  ];

  const subscriptions = [
    'GitHub', 'GitHub Copilot', 'ChatGPT Plus', 'Claude Pro',
    'Figma', 'Notion', 'Linear', 'Vercel Pro', 'AWS', 'Google Cloud',
    'Azure', 'Supabase', 'PlanetScale', 'Railway',
  ];

  const toggleSub = (sub: string) => {
    const current = data.existingSubscriptions;
    if (current.includes(sub)) {
      onChange({ existingSubscriptions: current.filter(s => s !== sub) });
    } else {
      onChange({ existingSubscriptions: [...current, sub] });
    }
  };

  return (
    <div>
      <div className="mb-7">
        <h3 className="text-lg font-bold text-[#1A2F2F] mb-1">What's your budget?</h3>
        <p className="text-sm text-[#1A2F2F]/50">We'll filter recommendations to match your spending comfort.</p>
      </div>
      <div className="grid grid-cols-2 gap-3 mb-8">
        {budgets.map(({ value, label, desc, emoji, color }) => (
          <SelectCard
            key={value}
            selected={data.budgetPreference === value}
            onClick={() => onChange({ budgetPreference: value })}
          >
            <div className="text-xl mb-1.5">{emoji}</div>
            <div className="font-semibold text-[#1A2F2F] text-sm">{label}</div>
            <div className="text-[#1A2F2F]/50 text-xs mt-0.5">{desc}</div>
            {data.budgetPreference === value && (
              <div
                className="mt-2 h-1 rounded-full"
                style={{ backgroundColor: color }}
              />
            )}
          </SelectCard>
        ))}
      </div>

      <div>
        <h3 className="text-lg font-bold text-[#1A2F2F] mb-1">Existing subscriptions</h3>
        <p className="text-sm text-[#1A2F2F]/50 mb-4">Select tools you already pay for — we'll build on them.</p>
        <div className="flex flex-wrap gap-2">
          {subscriptions.map(sub => (
            <CheckTag
              key={sub}
              label={sub}
              checked={data.existingSubscriptions.includes(sub)}
              onChange={() => toggleSub(sub)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── Step 4: Completion Screen ────────────────────────────────────────────────
const Step4: React.FC<{ data: OnboardingState; onComplete: () => void; isLoading: boolean }> = ({
  data,
  onComplete,
  isLoading,
}) => (
  <div className="text-center py-4">
    <div className="w-20 h-20 rounded-full bg-[#1A2F2F] flex items-center justify-center mx-auto mb-6">
      <CompassIcon size={44} />
    </div>
    <h2 className="text-2xl font-bold text-[#1A2F2F] mb-3">You're all set! 🎉</h2>
    <p className="text-[#1A2F2F]/60 text-sm max-w-sm mx-auto mb-8">
      TechPilot has everything it needs to give you personalized tech recommendations.
      Let's build something great.
    </p>

    {/* Summary */}
    <div className="bg-white rounded-2xl p-5 text-left mb-8 border border-[#1A2F2F]/5">
      <div className="text-xs font-semibold text-[#1A2F2F]/40 uppercase tracking-widest mb-4">Your profile</div>
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'Skill Level', value: data.skillLevel.charAt(0).toUpperCase() + data.skillLevel.slice(1) },
          { label: 'Approach', value: data.preferredApproach.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) },
          { label: 'Team', value: data.teamType === 'individual' ? 'Solo' : data.teamType === 'small-team' ? 'Small Team' : 'Large Team' },
          {
            label: 'Budget',
            value: data.budgetPreference === 'free' ? 'Free only'
              : data.budgetPreference === 'mostly-free' ? 'Mostly free'
              : data.budgetPreference === 'limited-paid' ? 'Limited paid'
              : 'No restriction',
          },
        ].map(({ label, value }) => (
          <div key={label} className="bg-[#F5F3EE] rounded-xl p-3">
            <div className="text-[10px] text-[#1A2F2F]/40 uppercase tracking-wider mb-0.5">{label}</div>
            <div className="text-sm font-semibold text-[#1A2F2F]">{value}</div>
          </div>
        ))}
      </div>
      {data.preferredLanguages.length > 0 && (
        <div className="mt-3">
          <div className="text-[10px] text-[#1A2F2F]/40 uppercase tracking-wider mb-2">Languages</div>
          <div className="flex flex-wrap gap-1.5">
            {data.preferredLanguages.map(l => (
              <span key={l} className="bg-[#1A2F2F] text-white text-[10px] px-2 py-0.5 rounded-full">
                {l}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>

    <button
      onClick={onComplete}
      disabled={isLoading}
      className="w-full bg-[#E8541A] text-white font-semibold py-4 rounded-xl hover:bg-[#d4481a] disabled:opacity-60 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 text-base"
    >
      {isLoading ? (
        <>
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          Taking you to your dashboard…
        </>
      ) : (
        <>Launch my dashboard 🚀</>
      )}
    </button>
  </div>
);

// ─── OnboardingPage (default export) ─────────────────────────────────────────
const OnboardingPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isCompleting, setIsCompleting] = useState(false);
  const [data, setData] = useState<OnboardingState>({
    skillLevel: 'intermediate',
    preferredLanguages: [],
    preferredApproach: 'ai-assisted',
    teamType: 'individual',
    budgetPreference: 'mostly-free',
    existingSubscriptions: [],
    projectInterests: [],
    deadline: '',
  });

  const { completeOnboarding } = useApp();
  const navigate = useNavigate();

  const TOTAL_STEPS = 4;
  const stepLabels = ['Skills', 'Approach', 'Budget', 'Done'];

  const handleChange = (updates: Partial<OnboardingState>) => {
    setData(prev => ({ ...prev, ...updates }));
  };

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(s => s + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(s => s - 1);
    }
  };

  const handleComplete = async () => {
    setIsCompleting(true);
    completeOnboarding({
      skillLevel: data.skillLevel,
      preferredLanguages: data.preferredLanguages,
      preferredApproach: data.preferredApproach,
      teamType: data.teamType,
      budgetPreference: data.budgetPreference,
      existingSubscriptions: data.existingSubscriptions,
      projectInterests: data.projectInterests,
    });
    // Small delay for UX effect
    await new Promise(r => setTimeout(r, 600));
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#F5F3EE] flex flex-col">
      {/* Header */}
      <div className="bg-[#1A2F2F] py-5 px-6">
        <div className="max-w-2xl mx-auto flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#E8541A]/20 flex items-center justify-center">
            <CompassIcon size={18} />
          </div>
          <div>
            <div className="font-bold text-white text-sm">TechPilot</div>
            <div className="text-[9px] text-white/30">by Rocky</div>
          </div>
          <div className="ml-auto text-white/40 text-xs">
            Step {currentStep} of {TOTAL_STEPS}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-start justify-center px-6 py-10">
        <div className="w-full max-w-2xl">
          {/* Top label */}
          <div className="text-center mb-6">
            <div className="text-[#E8541A] text-xs font-semibold uppercase tracking-widest mb-1">
              {currentStep < TOTAL_STEPS ? 'Quick Setup' : "You're Ready!"}
            </div>
            {currentStep < TOTAL_STEPS && (
              <h1 className="text-2xl font-bold text-[#1A2F2F]">
                Let's personalize TechPilot for you
              </h1>
            )}
          </div>

          {/* Step progress */}
          <StepProgress current={currentStep} total={TOTAL_STEPS} labels={stepLabels} />

          {/* Step card */}
          <div className="bg-white rounded-3xl shadow-sm border border-[#1A2F2F]/5 p-7">
            {currentStep === 1 && <Step1 data={data} onChange={handleChange} />}
            {currentStep === 2 && <Step2 data={data} onChange={handleChange} />}
            {currentStep === 3 && <Step3 data={data} onChange={handleChange} />}
            {currentStep === 4 && (
              <Step4 data={data} onComplete={handleComplete} isLoading={isCompleting} />
            )}

            {/* Navigation buttons (not shown on step 4 — it has its own CTA) */}
            {currentStep < TOTAL_STEPS && (
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-[#1A2F2F]/8">
                <button
                  onClick={handleBack}
                  disabled={currentStep === 1}
                  className="flex items-center gap-1.5 text-sm font-medium text-[#1A2F2F]/50 hover:text-[#1A2F2F] disabled:opacity-0 disabled:pointer-events-none transition-all"
                >
                  ← Back
                </button>

                <div className="flex items-center gap-2">
                  {/* Dot indicators */}
                  {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
                    <div
                      key={i}
                      className={`rounded-full transition-all ${
                        i + 1 === currentStep
                          ? 'w-6 h-2 bg-[#E8541A]'
                          : i + 1 < currentStep
                          ? 'w-2 h-2 bg-[#1A2F2F]'
                          : 'w-2 h-2 bg-[#1A2F2F]/15'
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={handleNext}
                  className="bg-[#1A2F2F] text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-[#243d3d] transition-colors flex items-center gap-1.5 text-sm"
                >
                  {currentStep === TOTAL_STEPS - 1 ? 'Review →' : 'Continue →'}
                </button>
              </div>
            )}
          </div>

          {/* Skip option */}
          {currentStep < TOTAL_STEPS && (
            <div className="text-center mt-5">
              <button
                onClick={() => navigate('/dashboard')}
                className="text-xs text-[#1A2F2F]/35 hover:text-[#1A2F2F]/60 transition-colors"
              >
                Skip for now — I'll set this up later
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
