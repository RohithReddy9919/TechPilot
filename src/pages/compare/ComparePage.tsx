import React, { useState, useMemo } from 'react';
import { TECH_DATABASE } from '../../data/techDatabase';
import { TechRecommendation } from '../../types';
import { useApp } from '../../context/AppContext';

const MAX_COMPARE = 4;

function PricingBadge({ status }: { status: string }) {
  const labels: Record<string, string> = { free: 'Free', freemium: 'Freemium', paid: 'Paid', verify: 'Verify' };
  const colors: Record<string, string> = {
    free: 'bg-green-100 text-green-700',
    freemium: 'bg-blue-100 text-blue-700',
    paid: 'bg-amber-100 text-amber-700',
    verify: 'bg-gray-100 text-gray-600',
  };
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${colors[status] ?? colors.verify}`}>
      {labels[status] ?? status}
    </span>
  );
}

const ROW_HEADERS = [
  { key: 'category', label: 'Category' },
  { key: 'purpose', label: 'Purpose' },
  { key: 'freeTier', label: 'Free Tier' },
  { key: 'pricing', label: 'Pricing' },
  { key: 'advantages', label: 'Advantages' },
  { key: 'limitations', label: 'Limitations' },
  { key: 'bestFor', label: 'Best For' },
];

function getCellValue(tech: TechRecommendation, key: string): React.ReactNode {
  switch (key) {
    case 'category':
      return <span className="text-xs font-semibold uppercase tracking-wide text-[#1A2F2F]">{tech.category}</span>;
    case 'purpose':
      return <span className="text-sm text-gray-700">{tech.purpose}</span>;
    case 'freeTier':
      return tech.pricing.hasFree
        ? <span className="text-sm text-green-700">✓ {tech.pricing.freeDetails ?? 'Free tier available'}</span>
        : <span className="text-sm text-gray-400">✗ No free tier</span>;
    case 'pricing':
      return <PricingBadge status={tech.pricing.status} />;
    case 'advantages':
      return (
        <ul className="space-y-0.5">
          {tech.advantages.map((a, i) => (
            <li key={i} className="text-xs text-gray-700 flex gap-1"><span className="text-green-500 flex-shrink-0">+</span>{a}</li>
          ))}
        </ul>
      );
    case 'limitations':
      return (
        <ul className="space-y-0.5">
          {tech.limitations.map((l, i) => (
            <li key={i} className="text-xs text-gray-600 flex gap-1"><span className="text-red-400 flex-shrink-0">−</span>{l}</li>
          ))}
        </ul>
      );
    case 'bestFor':
      return <span className="text-sm text-gray-700 italic">{tech.bestUseCase}</span>;
    default:
      return null;
  }
}

export default function ComparePage() {
  const { user } = useApp();
  const [selected, setSelected] = useState<TechRecommendation[]>([]);
  const [selectorQuery, setSelectorQuery] = useState('');

  const filteredTools = useMemo(() => {
    const q = selectorQuery.toLowerCase();
    return TECH_DATABASE.filter(t =>
      t.name.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q) ||
      t.purpose.toLowerCase().includes(q)
    );
  }, [selectorQuery]);

  function toggleTool(tech: TechRecommendation) {
    setSelected(prev => {
      const isSelected = prev.some(t => t.id === tech.id);
      if (isSelected) return prev.filter(t => t.id !== tech.id);
      if (prev.length >= MAX_COMPARE) return prev; // max reached
      return [...prev, tech];
    });
  }

  function isSelected(id: string) {
    return selected.some(t => t.id === id);
  }

  // Contextual recommendation
  const recommendation = useMemo(() => {
    if (selected.length < 2) return null;
    const budget = user?.budgetPreference ?? 'mostly-free';
    const freeOnes = selected.filter(t => t.pricing.hasFree);
    const best = budget === 'free'
      ? selected.filter(t => t.pricing.status === 'free')[0] ?? freeOnes[0]
      : selected[0];
    if (!best) return null;
    return {
      name: best.name,
      reason: budget === 'free'
        ? `${best.name} is the best free option in this comparison.`
        : `${best.name} is a strong choice for your skill level and project needs.`,
    };
  }, [selected, user]);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-mono font-semibold tracking-widest text-[#1A2F2F]/40 uppercase mb-2">
          TOOL COMPARISON
        </p>
        <h1 className="text-4xl font-bold text-[#1A2F2F] mb-1.5 tracking-tight">Compare tools</h1>
        <p className="text-[#1A2F2F]/60 text-sm">Select 2–{MAX_COMPARE} tools to compare side by side with trade-offs and recommendations.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Selector panel */}
        <div className="lg:w-72 flex-shrink-0">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sticky top-6">
            <div className="flex items-center justify-between mb-3">
              <p className="font-semibold text-[#1A2F2F] text-sm">Select tools</p>
              {selected.length > 0 && (
                <button onClick={() => setSelected([])}
                  className="text-xs text-[#E8541A] hover:underline">Clear all</button>
              )}
            </div>
            <input
              type="text"
              value={selectorQuery}
              onChange={e => setSelectorQuery(e.target.value)}
              placeholder="Search tools..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-[#1A2F2F]/20"
            />
            <div className="space-y-1 max-h-[60vh] overflow-y-auto pr-1">
              {filteredTools.map(tech => {
                const sel = isSelected(tech.id);
                const disabled = !sel && selected.length >= MAX_COMPARE;
                return (
                  <button
                    key={tech.id}
                    onClick={() => !disabled && toggleTool(tech)}
                    disabled={disabled}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-colors ${
                      sel
                        ? 'bg-[#1A2F2F] text-white'
                        : disabled
                        ? 'opacity-40 cursor-not-allowed bg-gray-50'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <div className={`w-7 h-7 rounded flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                      sel ? 'bg-white/20 text-white' : (tech.logoColor ?? 'bg-orange-100 text-orange-500')
                    }`}>
                      {tech.logoLetter ?? tech.name[0]}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={`text-sm font-medium truncate ${sel ? 'text-white' : 'text-gray-800'}`}>{tech.name}</p>
                      <p className={`text-xs truncate ${sel ? 'text-white/70' : 'text-gray-400'}`}>{tech.category}</p>
                    </div>
                    {sel && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-gray-400 mt-3 text-center">{selected.length}/{MAX_COMPARE} selected</p>
          </div>
        </div>

        {/* Comparison area */}
        <div className="flex-1 min-w-0">
          {selected.length < 2 ? (
            <div className="flex flex-col items-center justify-center h-64 bg-white rounded-2xl border border-dashed border-gray-200 text-center p-6">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6M9 11h6M9 15h4M6 3h12a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V5a2 2 0 012-2z" />
                </svg>
              </div>
              <p className="text-gray-600 font-medium">Select at least 2 tools</p>
              <p className="text-sm text-gray-400 mt-1">Pick tools from the list on the left to start comparing</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Comparison table */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="text-left p-4 w-32 text-xs font-semibold uppercase tracking-wider text-gray-400 bg-gray-50">Feature</th>
                        {selected.map((tech, i) => (
                          <th key={tech.id} className="p-4 text-left min-w-[200px]">
                            <div className="flex items-center gap-2">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${tech.logoColor ?? 'bg-orange-100 text-orange-500'}`}>
                                {tech.logoLetter ?? tech.name[0]}
                              </div>
                              <div>
                                <p className="font-bold text-[#1A2F2F] text-sm">{tech.name}</p>
                                <p className="text-xs text-gray-400">{tech.category}</p>
                              </div>
                              <button onClick={() => toggleTool(tech)}
                                className="ml-auto text-gray-300 hover:text-red-400 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {ROW_HEADERS.map((row, ri) => (
                        <tr key={row.key} className={ri % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                          <td className="p-4 text-xs font-semibold uppercase tracking-wider text-gray-400 align-top bg-gray-50 border-r border-gray-100 whitespace-nowrap">
                            {row.label}
                          </td>
                          {selected.map(tech => (
                            <td key={tech.id} className="p-4 align-top border-r border-gray-50 last:border-0">
                              {getCellValue(tech, row.key)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Recommendation */}
              {recommendation && (
                <div className="bg-[#1A2F2F] rounded-2xl p-5">
                  <p className="text-xs font-bold tracking-widest uppercase text-white/60 mb-2">Which is better for me?</p>
                  <h3 className="text-white font-bold text-lg mb-1">{recommendation.name} is recommended</h3>
                  <p className="text-white/80 text-sm">{recommendation.reason}</p>
                  <p className="text-white/50 text-xs mt-3">Based on your profile preferences · Demo mode</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
