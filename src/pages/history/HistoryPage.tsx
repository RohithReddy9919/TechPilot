import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { AdvisorMessage, TechRecommendation } from '../../types';

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

interface ConversationEntry {
  projectId: string;
  projectName: string;
  messages: AdvisorMessage[];
  date: string;
}

function PricingBadge({ status }: { status: string }) {
  const labels: Record<string, string> = { free: 'Free', freemium: 'Freemium', paid: 'Paid', verify: 'Verify' };
  const colors: Record<string, string> = {
    free: 'bg-green-100 text-green-700',
    freemium: 'bg-blue-100 text-blue-700',
    paid: 'bg-amber-100 text-amber-700',
    verify: 'bg-gray-100 text-gray-600',
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${colors[status] ?? colors.verify}`}>
      {labels[status] ?? status}
    </span>
  );
}

function MiniTechCard({ tech }: { tech: TechRecommendation }) {
  return (
    <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
      <div className={`w-6 h-6 rounded flex items-center justify-center font-bold text-xs flex-shrink-0 ${tech.logoColor ?? 'bg-orange-100 text-orange-500'}`}>
        {tech.logoLetter ?? tech.name[0]}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold text-gray-800 truncate">{tech.name}</p>
        <p className="text-xs text-gray-400 truncate">{tech.category}</p>
      </div>
      <PricingBadge status={tech.pricing.status} />
    </div>
  );
}

function ConversationDetail({ entry }: { entry: ConversationEntry }) {
  return (
    <div className="space-y-4 mt-4 border-t border-gray-100 pt-4">
      {entry.messages.map(msg => {
        if (msg.role === 'user') {
          return (
            <div key={msg.id} className="flex justify-end">
              <div className="bg-[#1A2F2F] text-white rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-sm text-sm shadow-sm">
                {msg.content}
              </div>
            </div>
          );
        }
        // Advisor message
        let parsed: { approach?: string; reasoning?: string; nextSteps?: string[] } = {};
        try { parsed = JSON.parse(msg.content); } catch { /* plain text */ }
        return (
          <div key={msg.id} className="flex justify-start">
            <div className="bg-white rounded-2xl rounded-tl-sm border border-gray-100 shadow-sm p-4 max-w-xl w-full">
              {parsed.approach ? (
                <>
                  <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">Recommended Approach</p>
                  <p className="font-bold text-[#1A2F2F] mb-2">{parsed.approach}</p>
                  {parsed.reasoning && <p className="text-sm text-gray-600 mb-3">{parsed.reasoning}</p>}
                  {msg.recommendations && msg.recommendations.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                      {msg.recommendations.map(tech => <MiniTechCard key={tech.id} tech={tech} />)}
                    </div>
                  )}
                  {parsed.nextSteps && parsed.nextSteps.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Next Steps</p>
                      <ol className="space-y-1">
                        {parsed.nextSteps.map((s, i) => (
                          <li key={i} className="text-xs text-gray-600 flex gap-1.5">
                            <span className="font-bold text-[#1A2F2F]">{i + 1}.</span>{s}
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-sm text-gray-700">{msg.content}</p>
              )}
              <p className="text-xs text-gray-400 mt-2">{formatTime(msg.timestamp)}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function HistoryPage() {
  const { projects } = useApp();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Flatten all advisor conversations from all projects
  const conversations: ConversationEntry[] = projects
    .filter(p => p.advisorHistory && p.advisorHistory.length > 0)
    .map(p => ({
      projectId: p.id,
      projectName: p.name,
      messages: p.advisorHistory,
      date: p.advisorHistory[0]?.timestamp ?? p.updatedAt,
    }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-mono font-semibold tracking-widest text-[#1A2F2F]/40 uppercase mb-2">
          ADVISOR LOG
        </p>
        <h1 className="text-4xl font-bold text-[#1A2F2F] mb-1.5 tracking-tight">Advisor history</h1>
        <p className="text-[#1A2F2F]/60 text-sm">Review your past technology advisory sessions and decisions.</p>
      </div>

      <div>
        {conversations.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-3 3-3-3z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-[#1A2F2F] mb-2">No history yet</h2>
            <p className="text-gray-500 max-w-sm text-sm mb-6">
              Your conversations with the AI advisor will appear here once you've asked it something.
            </p>
            <Link
              to="/advisor"
              className="bg-[#E8541A] text-white rounded-xl px-6 py-2.5 text-sm font-semibold hover:bg-[#d04a15] transition-colors"
            >
              Ask the advisor →
            </Link>
          </div>
        ) : (
          <div className="max-w-2xl space-y-4">
            {conversations.map(entry => {
              const userMessages = entry.messages.filter(m => m.role === 'user');
              const recCount = entry.messages.reduce((acc, m) => acc + (m.recommendations?.length ?? 0), 0);
              const isExpanded = expandedId === entry.projectId;
              const preview = userMessages[0]?.content ?? 'Conversation';

              return (
                <div key={entry.projectId} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <button
                    className="w-full px-5 py-4 flex items-start gap-4 text-left hover:bg-gray-50/50 transition-colors"
                    onClick={() => setExpandedId(isExpanded ? null : entry.projectId)}
                  >
                    {/* Timeline dot */}
                    <div className="flex flex-col items-center pt-1">
                      <div className="w-3 h-3 rounded-full bg-[#1A2F2F] flex-shrink-0" />
                      {isExpanded && <div className="w-0.5 bg-gray-200 flex-1 mt-1 min-h-[20px]" />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-semibold text-gray-400">{formatDate(entry.date)}</span>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{entry.projectName}</span>
                        {recCount > 0 && (
                          <span className="text-xs bg-[#E8541A]/10 text-[#E8541A] px-2 py-0.5 rounded-full">
                            {recCount} tool{recCount !== 1 ? 's' : ''} recommended
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-medium text-[#1A2F2F] mt-1 truncate">{preview}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {userMessages.length} question{userMessages.length !== 1 ? 's' : ''} · {entry.messages.length} messages
                      </p>
                    </div>

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`w-4 h-4 text-gray-400 flex-shrink-0 mt-1 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {isExpanded && (
                    <div className="px-5 pb-5">
                      <ConversationDetail entry={entry} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
