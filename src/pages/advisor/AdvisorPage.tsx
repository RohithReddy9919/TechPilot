import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { getAdvisorResponse } from '../../services/advisorService';
import { AdvisorMessage, TechRecommendation } from '../../types';
import { v4 as uuidv4 } from 'uuid';

// ── Helpers ────────────────────────────────────────────────────────────────────

function PricingBadge({ tech }: { tech: TechRecommendation }) {
  const { status } = tech.pricing;
  const labels: Record<string, string> = {
    free: 'Free',
    freemium: 'Freemium',
    paid: 'Paid',
    verify: 'Verify pricing',
  };
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
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-col gap-2">
      <div className="flex items-start gap-3">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0 ${tech.logoColor ?? 'bg-orange-100 text-orange-500'}`}>
          {tech.logoLetter ?? tech.name[0]}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs text-gray-400 uppercase tracking-wider font-medium leading-none mb-0.5">{tech.category}</p>
          <p className="font-semibold text-gray-900 leading-tight">{tech.name}</p>
        </div>
      </div>
      <p className="text-sm text-gray-600 leading-snug">{tech.purpose}</p>
      <div className="flex items-center justify-between mt-auto pt-1">
        <PricingBadge tech={tech} />
        {tech.website && (
          <a href={tech.website} target="_blank" rel="noopener noreferrer"
            className="text-gray-400 hover:text-[#1A2F2F] transition-colors" title="Visit website">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 3h7m0 0v7m0-7L10 14M5 5H4a1 1 0 00-1 1v14a1 1 0 001 1h14a1 1 0 001-1v-1" />
            </svg>
          </a>
        )}
      </div>
    </div>
  );
}

function LoadingDots() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      {[0, 1, 2].map(i => (
        <span key={i}
          className="w-2 h-2 rounded-full bg-[#1A2F2F] animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  );
}

interface AdvisorResponseCardProps {
  message: AdvisorMessage;
}

function AdvisorResponseCard({ message }: AdvisorResponseCardProps) {
  // We store stringified JSON in content when role is advisor + has recommendations
  let parsed: { approach: string; reasoning: string; nextSteps: string[]; warnings?: string[] } | null = null;
  try {
    parsed = JSON.parse(message.content);
  } catch {
    parsed = null;
  }

  if (!parsed || !message.recommendations?.length) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 max-w-2xl">
        <p className="text-gray-700 text-sm">{message.content}</p>
        <p className="text-xs text-gray-400 mt-2">Demo mode · TechPilot AI</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 max-w-2xl w-full">
      {/* Approach heading */}
      <div className="mb-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#1A2F2F]/60 mb-1">Recommended Approach</p>
        <h3 className="text-lg font-bold text-[#1A2F2F]">{parsed.approach}</h3>
      </div>

      {/* Reasoning */}
      <p className="text-sm text-gray-600 leading-relaxed mb-4">{parsed.reasoning}</p>

      {/* Tech grid */}
      {message.recommendations && message.recommendations.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Recommended Tools</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {message.recommendations.map(tech => (
              <TechCard key={tech.id} tech={tech} />
            ))}
          </div>
        </div>
      )}

      {/* Next Steps */}
      {parsed.nextSteps?.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Next Steps</p>
          <ol className="space-y-1.5">
            {parsed.nextSteps.map((step, i) => (
              <li key={i} className="flex gap-2 text-sm text-gray-700">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#1A2F2F] text-white text-xs flex items-center justify-center font-bold">{i + 1}</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Warnings */}
      {parsed.warnings && parsed.warnings.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-3">
          {parsed.warnings.map((w, i) => (
            <p key={i} className="text-sm text-amber-800">⚠ {w}</p>
          ))}
        </div>
      )}

      <p className="text-xs text-gray-400">Demo mode · TechPilot AI · Recommendations are illustrative</p>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────

export default function AdvisorPage() {
  const { user, projects } = useApp();
  const [searchParams] = useSearchParams();
  const [messages, setMessages] = useState<AdvisorMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const hasAutoSubmitted = useRef(false);

  const selectedProject = projects.find(p => p.id === selectedProjectId) ?? null;

  // Auto-submit ?q= query on mount
  useEffect(() => {
    const q = searchParams.get('q');
    if (q && !hasAutoSubmitted.current) {
      hasAutoSubmitted.current = true;
      handleSubmit(q);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  async function handleSubmit(query?: string) {
    const text = (query ?? input).trim();
    if (!text || loading) return;

    const userMsg: AdvisorMessage = {
      id: uuidv4(),
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await getAdvisorResponse({
        userInput: text,
        user,
        project: selectedProject,
        budget: selectedProject?.budgetPreference ?? user?.budgetPreference,
      });

      const advisorMsg: AdvisorMessage = {
        id: uuidv4(),
        role: 'advisor',
        content: JSON.stringify({
          approach: res.approach,
          reasoning: res.reasoning,
          nextSteps: res.nextSteps,
          warnings: res.warnings,
        }),
        timestamp: new Date().toISOString(),
        recommendations: res.recommendations,
      };
      setMessages(prev => [...prev, advisorMsg]);
    } catch {
      const errMsg: AdvisorMessage = {
        id: uuidv4(),
        role: 'advisor',
        content: 'Something went wrong. Please try again.',
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 flex-shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-semibold tracking-widest text-[#1A2F2F]/40 uppercase">
              AI TECHNOLOGY ADVISOR
            </span>
            <span className="text-[10px] font-mono font-bold tracking-widest uppercase bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full border border-amber-200">
              DEMO MODE
            </span>
          </div>
          <h1 className="text-3xl font-bold text-[#1A2F2F] tracking-tight">AI Advisor</h1>
          <p className="text-sm text-[#1A2F2F]/60 mt-0.5">Describe what you want to build and get a personalized tech stack.</p>
        </div>
        {/* Project selector */}
        {projects.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 font-medium">Link project:</span>
            <select
              value={selectedProjectId}
              onChange={e => setSelectedProjectId(e.target.value)}
              className="bg-white border border-[#1A2F2F]/15 rounded-xl px-3 py-2 text-xs text-[#1A2F2F] font-medium focus:outline-none focus:ring-2 focus:ring-[#1A2F2F]/20 shadow-sm"
            >
              <option value="">General advice (No project)</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {messages.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center h-full text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-[#1A2F2F] flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-[#1A2F2F] mb-2">Ask TechPilot</h2>
            <p className="text-gray-500 max-w-sm text-sm">Describe your project idea and get a recommended tech stack tailored to your skill level and budget.</p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {[
                'Build a SaaS app with AI features',
                'Create a portfolio website',
                'Build a mobile app MVP',
              ].map(s => (
                <button key={s} onClick={() => setInput(s)}
                  className="text-sm border border-gray-300 rounded-full px-4 py-1.5 text-gray-600 hover:border-[#1A2F2F] hover:text-[#1A2F2F] transition-colors bg-white">
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'user' ? (
              <div className="bg-[#1A2F2F] text-white rounded-2xl rounded-tr-sm px-4 py-3 max-w-md text-sm shadow-sm">
                {msg.content}
              </div>
            ) : (
              <AdvisorResponseCard message={msg} />
            )}
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-white rounded-2xl rounded-tl-sm shadow-sm border border-gray-100">
              <LoadingDots />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div className="bg-white border-t border-gray-200 px-4 py-4 flex-shrink-0">
        <div className="flex gap-3 items-end max-w-3xl mx-auto">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={2}
            placeholder="Describe what you want to build..."
            className="flex-1 resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1A2F2F]/20 focus:border-[#1A2F2F]"
            disabled={loading}
          />
          <button
            onClick={() => handleSubmit()}
            disabled={!input.trim() || loading}
            className="bg-[#E8541A] hover:bg-[#d04a15] text-white rounded-xl px-5 py-3 text-sm font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
          >
            Ask TechPilot →
          </button>
        </div>
        <p className="text-center text-xs text-gray-400 mt-2">Press Enter to send · Shift+Enter for new line · Demo mode</p>
      </div>
    </div>
  );
}
