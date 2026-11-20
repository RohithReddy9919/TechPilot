import { useState, FormEvent } from 'react';
import { HelpCircle, BookOpen, MessageSquare, ExternalLink, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FAQItem {
  q: string;
  a: string;
}

const FAQS: FAQItem[] = [
  {
    q: 'How does TechPilot determine the best technology stack?',
    a: 'TechPilot analyzes your specific requirements: project objective, current development phase, developer experience level, team composition, and budget constraints. Rather than defaulting to the most hyped or expensive tools, it optimizes for compatibility, velocity, and maintenance overhead.',
  },
  {
    q: 'What is Demo Mode vs Live AI Mode?',
    a: 'In Demo Mode, TechPilot operates completely client-side with full browser persistence, using contextual heuristics and curated technology profiles. When connected to a backend LLM with an API key, TechPilot dynamically reasons through custom edge cases and multi-turn architectural questions.',
  },
  {
    q: 'How does Adaptive Project Memory work?',
    a: 'Every time you discuss architectural choices or milestone progress with the AI advisor within a project workspace, TechPilot updates the project record. When you return days later, it immediately recalls selected technologies, eliminated alternatives, and your current bottleneck without repeating questions.',
  },
  {
    q: 'Can TechPilot prevent recommending tools I already pay for?',
    a: 'Yes. In your Settings under Subscriptions, check off the tools and platforms you already subscribe to (e.g., GitHub Copilot, ChatGPT Plus, Figma Pro). TechPilot will prioritize utilizing your active subscriptions before suggesting any paid additions.',
  },
  {
    q: 'Can I export my technology decisions and milestones?',
    a: 'Yes, your project overview, milestones, and selected technologies are persisted locally and can be referenced anytime. We are also adding direct export to Markdown and GitHub repository templates in future updates.',
  },
];

export default function HelpPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [sent, setSent] = useState(false);

  function handleSubmitContact(e: FormEvent) {
    e.preventDefault();
    if (!contactMessage.trim()) return;
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setContactSubject('');
      setContactMessage('');
    }, 4000);
  }

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <p className="text-xs font-mono font-semibold tracking-widest text-[#1A2F2F]/40 uppercase mb-2">
          RESOURCES &amp; SUPPORT
        </p>
        <h1 className="text-4xl font-bold text-[#1A2F2F] mb-1.5 tracking-tight">Help &amp; Support</h1>
        <p className="text-[#1A2F2F]/60 text-sm">
          Everything you need to get the most out of TechPilot by Rocky Technologies.
        </p>
      </div>

      {/* Quick Access Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Link
          to="/advisor"
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-[#E8541A]/10 text-[#E8541A] flex items-center justify-center mb-4 group-hover:bg-[#E8541A] group-hover:text-white transition-colors">
            <MessageSquare size={20} />
          </div>
          <h3 className="font-bold text-[#1A2F2F] text-base mb-1">AI Advisor Guide</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            Learn how to prompt the advisor to get maximum architectural precision for your project.
          </p>
        </Link>

        <Link
          to="/explore"
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-[#1A2F2F]/10 text-[#1A2F2F] flex items-center justify-center mb-4 group-hover:bg-[#1A2F2F] group-hover:text-white transition-colors">
            <BookOpen size={20} />
          </div>
          <h3 className="font-bold text-[#1A2F2F] text-base mb-1">Toolkit Directory</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            Explore verified advantages, drawbacks, and real-world costs of popular modern tools.
          </p>
        </Link>

        <Link
          to="/compare"
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
            <HelpCircle size={20} />
          </div>
          <h3 className="font-bold text-[#1A2F2F] text-base mb-1">Tool Comparisons</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            Compare alternatives head-to-head with contextual trade-off evaluations.
          </p>
        </Link>
      </div>

      {/* Frequently Asked Questions */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7">
        <h2 className="text-xl font-bold text-[#1A2F2F] mb-6 flex items-center gap-2">
          <span>Frequently Asked Questions</span>
        </h2>
        <div className="divide-y divide-gray-100">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={idx} className="py-4">
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between text-left font-semibold text-[#1A2F2F] hover:text-[#E8541A] transition-colors"
                >
                  <span className="text-sm">{faq.q}</span>
                  {isOpen ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                </button>
                {isOpen && (
                  <p className="mt-3 text-xs text-gray-600 leading-relaxed pr-6">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Support Message Form */}
      <div className="bg-[#1A2F2F] text-white rounded-2xl p-8 relative overflow-hidden shadow-sm">
        <div className="max-w-xl">
          <p className="text-xs font-mono tracking-widest text-[#4FD1C5] uppercase mb-2">
            ROCKY TECHNOLOGIES SUPPORT
          </p>
          <h2 className="text-2xl font-bold text-white mb-2">Have a question or feedback?</h2>
          <p className="text-white/60 text-xs mb-6 leading-relaxed">
            Send us a message and our product engineering team will review it.
          </p>

          {sent ? (
            <div className="bg-emerald-500/15 border border-emerald-400/30 rounded-xl p-4 flex items-center gap-3 text-emerald-300 text-sm">
              <CheckCircle size={20} className="flex-shrink-0" />
              <span>Thank you! Your feedback has been recorded successfully.</span>
            </div>
          ) : (
            <form onSubmit={handleSubmitContact} className="space-y-4">
              <div>
                <input
                  type="text"
                  value={contactSubject}
                  onChange={e => setContactSubject(e.target.value)}
                  placeholder="Subject or project name"
                  className="w-full bg-white/10 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-[#4FD1C5]"
                  required
                />
              </div>
              <div>
                <textarea
                  value={contactMessage}
                  onChange={e => setContactMessage(e.target.value)}
                  placeholder="Describe your inquiry or suggestion..."
                  rows={3}
                  className="w-full bg-white/10 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-[#4FD1C5] resize-none"
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-[#E8541A] text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-[#d14916] transition-colors text-xs flex items-center gap-1.5"
              >
                Send message <ExternalLink size={12} />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
