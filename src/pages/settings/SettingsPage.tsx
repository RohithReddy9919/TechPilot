import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { SkillLevel, BudgetPreference, DevApproach } from '../../types';
import { TECH_DATABASE } from '../../data/techDatabase';

type Tab = 'profile' | 'preferences' | 'subscriptions' | 'account';

const LANGUAGES = ['JavaScript', 'TypeScript', 'Python', 'Go', 'Rust', 'Java', 'C#', 'PHP', 'Ruby', 'Swift', 'Kotlin'];

const SKILL_LEVELS: { value: SkillLevel; label: string; desc: string }[] = [
  { value: 'beginner', label: 'Beginner', desc: 'Just starting out' },
  { value: 'intermediate', label: 'Intermediate', desc: '1–3 years experience' },
  { value: 'advanced', label: 'Advanced', desc: '3–7 years experience' },
  { value: 'expert', label: 'Expert', desc: '7+ years, deep expertise' },
];

const DEV_APPROACHES: { value: DevApproach; label: string }[] = [
  { value: 'traditional', label: 'Traditional coding' },
  { value: 'ai-assisted', label: 'AI-assisted' },
  { value: 'vibe-coding', label: 'Vibe coding' },
  { value: 'no-code', label: 'No-code' },
  { value: 'low-code', label: 'Low-code' },
  { value: 'hybrid', label: 'Hybrid' },
];

const BUDGET_OPTIONS: { value: BudgetPreference; label: string; desc: string }[] = [
  { value: 'free', label: 'Free only', desc: 'Only recommend free & open-source tools' },
  { value: 'mostly-free', label: 'Mostly free', desc: 'Prefer free, some paid okay' },
  { value: 'limited-paid', label: 'Limited paid', desc: 'Happy to pay for essential tools' },
  { value: 'no-restriction', label: 'No restriction', desc: 'Best tools regardless of cost' },
];

// Subscribable tools (freemium / paid tools from DB)
const SUBSCRIBABLE_TOOLS = TECH_DATABASE.filter(t => t.pricing.status !== 'free');

export default function SettingsPage() {
  const { user, updateUser, logout } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('profile');

  // Profile state
  const [fullName, setFullName] = useState(user?.fullName ?? '');
  const [profileSaved, setProfileSaved] = useState(false);

  // Preferences state
  const [skillLevel, setSkillLevel] = useState<SkillLevel>(user?.skillLevel ?? 'intermediate');
  const [preferredLanguages, setPreferredLanguages] = useState<string[]>(user?.preferredLanguages ?? []);
  const [devApproach, setDevApproach] = useState<DevApproach>(user?.preferredApproach ?? 'ai-assisted');
  const [budgetPreference, setBudgetPreference] = useState<BudgetPreference>(user?.budgetPreference ?? 'mostly-free');
  const [prefSaved, setPrefSaved] = useState(false);

  // Subscriptions state
  const [subscriptions, setSubscriptions] = useState<string[]>(user?.existingSubscriptions ?? []);
  const [subSaved, setSubSaved] = useState(false);

  useEffect(() => {
    if (user) {
      setFullName(user.fullName);
      setSkillLevel(user.skillLevel);
      setPreferredLanguages(user.preferredLanguages ?? []);
      setDevApproach(user.preferredApproach);
      setBudgetPreference(user.budgetPreference);
      setSubscriptions(user.existingSubscriptions ?? []);
    }
  }, [user]);

  function toggleLanguage(lang: string) {
    setPreferredLanguages(prev =>
      prev.includes(lang) ? prev.filter(l => l !== lang) : [...prev, lang]
    );
  }

  function toggleSubscription(id: string) {
    setSubscriptions(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  }

  function saveProfile() {
    updateUser({ fullName });
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2000);
  }

  function savePreferences() {
    updateUser({
      skillLevel,
      preferredLanguages,
      preferredApproach: devApproach,
      budgetPreference,
    });
    setPrefSaved(true);
    setTimeout(() => setPrefSaved(false), 2000);
  }

  function saveSubscriptions() {
    updateUser({ existingSubscriptions: subscriptions });
    setSubSaved(true);
    setTimeout(() => setSubSaved(false), 2000);
  }

  function handleLogout() {
    logout();
    navigate('/');
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: 'profile', label: 'Profile' },
    { key: 'preferences', label: 'Preferences' },
    { key: 'subscriptions', label: 'Subscriptions' },
    { key: 'account', label: 'Account' },
  ];

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-mono font-semibold tracking-widest text-[#1A2F2F]/40 uppercase mb-2">
          PREFERENCES &amp; ACCOUNT
        </p>
        <h1 className="text-4xl font-bold text-[#1A2F2F] mb-1.5 tracking-tight">Settings</h1>
        <p className="text-[#1A2F2F]/60 text-sm">Configure your developer profile, technical skills, and budget preferences.</p>
      </div>

      <div>
        <div className="max-w-2xl">
          {/* Tab bar */}
          <div className="flex gap-1 bg-white rounded-xl p-1 shadow-sm border border-gray-100 mb-6">
            {tabs.map(t => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === t.key
                    ? 'bg-[#1A2F2F] text-white'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Profile tab */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
              <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
                <div className="w-14 h-14 rounded-full bg-[#E8541A] flex items-center justify-center text-white font-bold text-xl">
                  {(user?.fullName?.[0] ?? '?').toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-[#1A2F2F] text-lg">{user?.fullName}</p>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A2F2F]/20"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email address</label>
                <input
                  type="email"
                  value={user?.email ?? ''}
                  readOnly
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 text-gray-400 cursor-not-allowed"
                />
                <p className="text-xs text-gray-400 mt-1">Email cannot be changed in demo mode</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Member since</label>
                <p className="text-sm text-gray-600">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'}
                </p>
              </div>

              <button
                onClick={saveProfile}
                className="bg-[#1A2F2F] hover:bg-[#243d3d] text-white rounded-xl px-6 py-2.5 text-sm font-semibold transition-colors"
              >
                {profileSaved ? '✓ Saved' : 'Save profile'}
              </button>
            </div>
          )}

          {/* Preferences tab */}
          {activeTab === 'preferences' && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
              {/* Skill level */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Skill level</label>
                <div className="grid grid-cols-2 gap-2">
                  {SKILL_LEVELS.map(sl => (
                    <button
                      key={sl.value}
                      onClick={() => setSkillLevel(sl.value)}
                      className={`flex flex-col items-start p-3 rounded-xl border text-left transition-colors ${
                        skillLevel === sl.value
                          ? 'border-[#1A2F2F] bg-[#1A2F2F]/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className={`text-sm font-semibold ${skillLevel === sl.value ? 'text-[#1A2F2F]' : 'text-gray-700'}`}>{sl.label}</span>
                      <span className="text-xs text-gray-400 mt-0.5">{sl.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Preferred languages */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Preferred languages</label>
                <div className="flex flex-wrap gap-2">
                  {LANGUAGES.map(lang => (
                    <button
                      key={lang}
                      onClick={() => toggleLanguage(lang)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                        preferredLanguages.includes(lang)
                          ? 'bg-[#1A2F2F] text-white border-[#1A2F2F]'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-[#1A2F2F]'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dev approach */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Development approach</label>
                <div className="grid grid-cols-2 gap-2">
                  {DEV_APPROACHES.map(da => (
                    <button
                      key={da.value}
                      onClick={() => setDevApproach(da.value)}
                      className={`py-2 px-3 rounded-xl border text-sm font-medium text-left transition-colors ${
                        devApproach === da.value
                          ? 'border-[#1A2F2F] bg-[#1A2F2F]/5 text-[#1A2F2F]'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      {da.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Budget preference */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Budget preference</label>
                <div className="space-y-2">
                  {BUDGET_OPTIONS.map(bo => (
                    <button
                      key={bo.value}
                      onClick={() => setBudgetPreference(bo.value)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-colors ${
                        budgetPreference === bo.value
                          ? 'border-[#1A2F2F] bg-[#1A2F2F]/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        budgetPreference === bo.value ? 'border-[#1A2F2F]' : 'border-gray-300'
                      }`}>
                        {budgetPreference === bo.value && <div className="w-2 h-2 rounded-full bg-[#1A2F2F]" />}
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${budgetPreference === bo.value ? 'text-[#1A2F2F]' : 'text-gray-700'}`}>{bo.label}</p>
                        <p className="text-xs text-gray-400">{bo.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={savePreferences}
                className="bg-[#1A2F2F] hover:bg-[#243d3d] text-white rounded-xl px-6 py-2.5 text-sm font-semibold transition-colors"
              >
                {prefSaved ? '✓ Saved' : 'Save preferences'}
              </button>
            </div>
          )}

          {/* Subscriptions tab */}
          {activeTab === 'subscriptions' && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-1">Existing subscriptions</p>
                <p className="text-xs text-gray-400">These tools are excluded from cost calculations since you already pay for them.</p>
              </div>
              <div className="space-y-2">
                {SUBSCRIBABLE_TOOLS.map(tool => (
                  <label key={tool.id} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={subscriptions.includes(tool.id)}
                      onChange={() => toggleSubscription(tool.id)}
                      className="w-4 h-4 accent-[#1A2F2F] rounded"
                    />
                    <div className={`w-7 h-7 rounded flex items-center justify-center font-bold text-xs ${tool.logoColor ?? 'bg-orange-100 text-orange-500'}`}>
                      {tool.logoLetter ?? tool.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800">{tool.name}</p>
                      <p className="text-xs text-gray-400 truncate">{tool.category} · {tool.pricing.paidTiers ?? tool.pricing.freeDetails}</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      tool.pricing.status === 'freemium' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {tool.pricing.status}
                    </span>
                  </label>
                ))}
              </div>
              {subscriptions.length > 0 && (
                <div className="bg-[#E8F4F4] rounded-xl p-3">
                  <p className="text-sm text-[#1A2F2F] font-medium">
                    {subscriptions.length} active subscription{subscriptions.length !== 1 ? 's' : ''}
                  </p>
                  <p className="text-xs text-[#1A2F2F]/60 mt-0.5">These tools will be marked as "already paying" in recommendations.</p>
                </div>
              )}
              <button
                onClick={saveSubscriptions}
                className="bg-[#1A2F2F] hover:bg-[#243d3d] text-white rounded-xl px-6 py-2.5 text-sm font-semibold transition-colors"
              >
                {subSaved ? '✓ Saved' : 'Save subscriptions'}
              </button>
            </div>
          )}

          {/* Account tab */}
          {activeTab === 'account' && (
            <div className="space-y-4">
              {/* Demo mode info */}
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
                <div className="flex items-start gap-3">
                  <span className="text-xl">⚠️</span>
                  <div>
                    <p className="font-semibold text-amber-900 mb-1">Demo Mode Active</p>
                    <p className="text-sm text-amber-800 leading-relaxed">
                      TechPilot is running in demo mode. All data is stored locally in your browser and no real authentication is used. AI recommendations are generated by a local algorithm, not a live AI service.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-0.5">Account information</p>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>
                <div className="border-t border-gray-100 pt-4">
                  <p className="text-sm font-semibold text-gray-700 mb-1">Data storage</p>
                  <p className="text-sm text-gray-500">Your data is stored in your browser's local storage. Clearing browser data will reset the app.</p>
                </div>
                <div className="border-t border-gray-100 pt-4">
                  <p className="text-sm font-semibold text-red-600 mb-2">Danger zone</p>
                  <button
                    onClick={handleLogout}
                    className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl px-5 py-2.5 text-sm font-semibold transition-colors"
                  >
                    Log out
                  </button>
                  <p className="text-xs text-gray-400 mt-2">You'll be redirected to the landing page.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
