import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { getTechById } from '../../data/techDatabase';
import { TechRecommendation } from '../../types';

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

function SavedTechCard({
  tech,
  onUnsave,
}: {
  tech: TechRecommendation;
  onUnsave: () => void;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-col gap-3">
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0 ${tech.logoColor ?? 'bg-orange-100 text-[#E8541A]'}`}>
          {tech.logoLetter ?? tech.name[0]}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs text-gray-400 uppercase tracking-wider font-medium leading-none mb-0.5">{tech.category}</p>
          <p className="font-bold text-gray-900 text-base leading-tight">{tech.name}</p>
        </div>
        {tech.website && (
          <a href={tech.website} target="_blank" rel="noopener noreferrer"
            className="text-gray-400 hover:text-[#1A2F2F] transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 3h7m0 0v7m0-7L10 14M5 5H4a1 1 0 00-1 1v14a1 1 0 001 1h14a1 1 0 001-1v-1" />
            </svg>
          </a>
        )}
      </div>

      <p className="text-sm text-gray-600 leading-snug flex-1">{tech.purpose}</p>

      {tech.advantages.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {tech.advantages.slice(0, 3).map((a, i) => (
            <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{a}</span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between pt-2 border-t border-gray-50">
        <PricingBadge tech={tech} />
        <button
          onClick={onUnsave}
          className="text-xs text-red-400 hover:text-red-600 transition-colors flex items-center gap-1 font-medium"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
          Remove
        </button>
      </div>
    </div>
  );
}

export default function SavedRecommendationsPage() {
  const { user, projects, updateProject } = useApp();

  // Gather all saved IDs from all projects
  const allSavedIds = React.useMemo(() => {
    const ids = new Set<string>();
    projects.forEach(p => p.savedRecommendations?.forEach(id => ids.add(id)));
    return [...ids];
  }, [projects]);

  const savedTools: TechRecommendation[] = React.useMemo(
    () => allSavedIds.map(id => getTechById(id)).filter(Boolean) as TechRecommendation[],
    [allSavedIds]
  );

  function handleUnsave(techId: string) {
    projects.forEach(p => {
      if (p.savedRecommendations?.includes(techId)) {
        updateProject(p.id, {
          savedRecommendations: p.savedRecommendations.filter(id => id !== techId),
        });
      }
    });
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-mono font-semibold tracking-widest text-[#1A2F2F]/40 uppercase mb-2">
          CURATED STACK
        </p>
        <h1 className="text-4xl font-bold text-[#1A2F2F] mb-1.5 tracking-tight">Saved recommendations</h1>
        <p className="text-[#1A2F2F]/60 text-sm">
          {savedTools.length > 0
            ? `${savedTools.length} saved tool${savedTools.length !== 1 ? 's' : ''} across your active projects`
            : 'Technologies you bookmark from advisor recommendations appear here.'}
        </p>
      </div>

      <div>
        {savedTools.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 21l-5-3-5 3V5a2 2 0 012-2h6a2 2 0 012 2v16z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-[#1A2F2F] mb-2">No saved tools yet</h2>
            <p className="text-gray-500 max-w-sm text-sm mb-6">
              Explore technologies and save the ones that fit your project. They'll show up here for quick access.
            </p>
            <div className="flex gap-3 flex-wrap justify-center">
              <Link
                to="/explore"
                className="bg-[#1A2F2F] text-white rounded-xl px-5 py-2.5 text-sm font-semibold hover:bg-[#243d3d] transition-colors"
              >
                Explore technologies
              </Link>
              <Link
                to="/advisor"
                className="bg-[#E8541A] text-white rounded-xl px-5 py-2.5 text-sm font-semibold hover:bg-[#d04a15] transition-colors"
              >
                Ask the advisor →
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {savedTools.map(tech => (
                <SavedTechCard
                  key={tech.id}
                  tech={tech}
                  onUnsave={() => handleUnsave(tech.id)}
                />
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link to="/explore"
                className="text-sm text-[#1A2F2F] hover:underline font-medium">
                + Explore more technologies
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
