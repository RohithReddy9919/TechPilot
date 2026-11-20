import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { TECH_DATABASE, TECH_CATEGORIES } from '../../data/techDatabase';
import { TechRecommendation, TechCategory } from '../../types';

type BudgetFilter = 'best-free' | 'affordable' | 'best-overall';

function PricingBadge({ tech }: { tech: TechRecommendation }) {
  const { status } = tech.pricing;
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

function TechCard({ tech }: { tech: TechRecommendation }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col justify-between hover:shadow-md transition-shadow">
      <div>
        {/* Peach Letter Avatar */}
        <div className="w-11 h-11 rounded-xl bg-[#FDE8DD] text-[#E8541A] font-bold text-lg flex items-center justify-center mb-4 flex-shrink-0">
          {tech.logoLetter ?? tech.name[0]}
        </div>

        <p className="text-xs font-mono text-gray-400 uppercase tracking-wider mb-1">
          {tech.category}
        </p>

        <h3 className="font-bold text-[#1A2F2F] text-lg mb-1 leading-snug">
          {tech.name}
        </h3>

        <p className="text-sm text-gray-600 leading-relaxed mb-4">
          {tech.purpose}
        </p>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-gray-50">
        <PricingBadge tech={tech} />
        {tech.website && (
          <a
            href={tech.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-[#1A2F2F] transition-colors flex items-center gap-1 text-xs"
          >
            <span>Visit</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 3h7m0 0v7m0-7L10 14M5 5H4a1 1 0 00-1 1v14a1 1 0 001 1h14a1 1 0 001-1v-1" />
            </svg>
          </a>
        )}
      </div>
    </div>
  );
}

export default function ExplorePage() {
  const { user } = useApp();
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<TechCategory | 'All'>('All');
  const [budgetFilter, setBudgetFilter] = useState<BudgetFilter>('best-free');

  // Personalised stack: starting stack matching Screenshot 2026-11-20 190216.png
  const personalisedStack = useMemo(() => {
    const priorityIds = ['figma', 'react', 'fastapi', 'mongodb', 'typescript', 'tailwindcss', 'supabase', 'cursor'];
    const priority = priorityIds
      .map(id => TECH_DATABASE.find(t => t.id === id))
      .filter((t): t is TechRecommendation => t !== undefined);

    if (budgetFilter === 'best-free') {
      return priority.filter(t => t.pricing.hasFree || t.pricing.status === 'free');
    } else if (budgetFilter === 'affordable') {
      return priority.filter(t => t.pricing.hasFree);
    }
    return priority;
  }, [budgetFilter]);

  const filteredTools = useMemo(() => {
    let tools = TECH_DATABASE;

    // Category filter
    if (selectedCategory !== 'All') {
      tools = tools.filter(t => t.category === selectedCategory);
    }

    // Budget filter
    if (budgetFilter === 'best-free') {
      tools = tools.filter(t => t.pricing.status === 'free');
    } else if (budgetFilter === 'affordable') {
      tools = tools.filter(t => t.pricing.hasFree);
    }
    // 'best-overall' shows everything

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      tools = tools.filter(t =>
        t.name.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.purpose.toLowerCase().includes(q)
      );
    }

    return tools;
  }, [selectedCategory, budgetFilter, searchQuery]);

  const budgetButtons: { key: BudgetFilter; label: string }[] = [
    { key: 'best-free', label: 'Best free' },
    { key: 'affordable', label: 'Affordable' },
    { key: 'best-overall', label: 'Best overall' },
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header matching Screenshot 2026-11-20 190216.png */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-xs font-mono font-semibold tracking-widest text-[#1A2F2F]/40 uppercase mb-2">
            THE TOOLKIT
          </p>
          <h1 className="text-4xl font-bold text-[#1A2F2F] mb-1.5 tracking-tight">
            Explore technologies
          </h1>
          <p className="text-[#1A2F2F]/60 text-sm">
            Fewer tools. Better fit. Every suggestion has a reason.
          </p>
        </div>
        <button
          onClick={() => setSearchVisible(v => !v)}
          className="flex items-center gap-2 text-sm text-[#1A2F2F] hover:text-[#E8541A] font-medium transition-colors cursor-pointer py-2 px-3 rounded-lg hover:bg-[#1A2F2F]/5"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
          </svg>
          <span>Search tools</span>
        </button>
      </div>

      {searchVisible && (
        <div className="mb-6">
          <input
            autoFocus
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search tools by name, category, or purpose..."
            className="w-full bg-white border border-[#1A2F2F]/15 rounded-xl px-4 py-3 text-sm text-[#1A2F2F] placeholder-[#1A2F2F]/30 focus:outline-none focus:ring-2 focus:ring-[#1A2F2F]/20 shadow-sm"
          />
        </div>
      )}

      {/* Personalized Section matching Screenshot */}
      <div className="bg-[#EAF4F3] rounded-2xl p-7 mb-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <p className="text-xs font-mono font-semibold tracking-widest text-[#1A2F2F]/50 uppercase mb-1.5">
              PERSONALIZED FOR YOU
            </p>
            <h2 className="text-2xl font-bold text-[#1A2F2F] mb-1">
              A focused starting stack
            </h2>
            <p className="text-sm text-[#1A2F2F]/70">
              Based on a free budget and a preference for moving quickly.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {budgetButtons.map(b => (
              <button
                key={b.key}
                onClick={() => setBudgetFilter(b.key)}
                className={`px-4 py-2 rounded-lg font-mono text-xs font-medium transition-all ${
                  budgetFilter === b.key
                    ? 'bg-[#1A2F2F] text-white shadow-sm'
                    : 'bg-white/80 border border-gray-200 text-gray-700 hover:bg-white'
                }`}
              >
                {b.label}
              </button>
            ))}
          </div>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {personalisedStack.slice(0, 4).map(tech => (
            <TechCard key={tech.id} tech={tech} />
          ))}
        </div>
      </div>

        {/* Category chips */}
        <div>
          <p className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-3">Browse by category</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                selectedCategory === 'All'
                  ? 'bg-[#1A2F2F] text-white border-[#1A2F2F]'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-[#1A2F2F]'
              }`}
            >
              All
            </button>
            {TECH_CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                  selectedCategory === cat
                    ? 'bg-[#1A2F2F] text-white border-[#1A2F2F]'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-[#1A2F2F]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Tools grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500">
              {filteredTools.length} tool{filteredTools.length !== 1 ? 's' : ''}{selectedCategory !== 'All' ? ` in ${selectedCategory}` : ''}
            </p>
            {(selectedCategory !== 'All' || searchQuery) && (
              <button onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
                className="text-sm text-[#E8541A] hover:underline">Clear filters</button>
            )}
          </div>
          {filteredTools.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 mb-2">No tools match your filters.</p>
              <button onClick={() => { setSelectedCategory('All'); setSearchQuery(''); setBudgetFilter('best-overall'); }}
                className="text-[#E8541A] hover:underline text-sm">Reset all filters</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredTools.map(tech => (
                <TechCard key={tech.id} tech={tech} />
              ))}
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="bg-[#1A2F2F] rounded-2xl p-6 text-center">
          <h3 className="text-white font-bold text-lg mb-2">Not sure which tools to pick?</h3>
          <p className="text-white/70 text-sm mb-4">Let TechPilot's AI advisor recommend a personalised stack for your project.</p>
          <Link to="/advisor"
            className="inline-block bg-[#E8541A] hover:bg-[#d04a15] text-white rounded-xl px-6 py-2.5 text-sm font-semibold transition-colors">
            Ask the AI advisor →
          </Link>
        </div>
      </div>
  );
}
