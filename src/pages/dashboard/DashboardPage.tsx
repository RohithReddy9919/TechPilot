import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Project } from '../../types';
import CreateProjectModal from '../../components/projects/CreateProjectModal';
import {
  Sparkles,
  Plus,
  ArrowRight,
  Zap,
  Compass,
  GitCompare,
  FolderOpen,
  ChevronRight,
} from 'lucide-react';

function formatDate() {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function getStageBadgeColor(stage: string) {
  const map: Record<string, string> = {
    idea: 'bg-purple-100 text-purple-700',
    planning: 'bg-orange-100 text-orange-700',
    design: 'bg-blue-100 text-blue-700',
    development: 'bg-green-100 text-green-700',
    testing: 'bg-yellow-100 text-yellow-700',
    deployment: 'bg-teal-100 text-teal-700',
  };
  return map[stage] ?? 'bg-gray-100 text-gray-600';
}

function getStageDotColor(stage: string) {
  const map: Record<string, string> = {
    idea: 'bg-purple-500',
    planning: 'bg-orange-500',
    design: 'bg-blue-500',
    development: 'bg-green-500',
    testing: 'bg-yellow-500',
    deployment: 'bg-teal-500',
  };
  return map[stage] ?? 'bg-gray-400';
}

function RecentProjectCard({ project }: { project: Project }) {
  const pct = project.totalMilestones
    ? Math.round((project.completedMilestones / project.totalMilestones) * 100)
    : 0;

  return (
    <Link
      to={`/projects/${project.id}`}
      className="flex items-center justify-between p-3 rounded-lg hover:bg-[#F5F3EE] transition-colors group"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${getStageDotColor(project.stage)}`} />
          <span className="text-xs font-medium text-gray-500 capitalize">{project.stage}</span>
        </div>
        <p className="text-sm font-semibold text-[#1A2F2F] truncate">{project.name}</p>
        <div className="flex items-center gap-2 mt-1.5">
          <div className="flex-1 bg-gray-200 rounded-full h-1">
            <div
              className="bg-[#E8541A] h-1 rounded-full transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="text-xs text-gray-400 flex-shrink-0">
            {project.completedMilestones}/{project.totalMilestones}
          </span>
        </div>
      </div>
      <ChevronRight className="w-4 h-4 text-gray-400 ml-3 group-hover:text-[#E8541A] transition-colors" />
    </Link>
  );
}

export default function DashboardPage() {
  const { user, projects } = useApp();
  const navigate = useNavigate();
  const [question, setQuestion] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const firstName = user?.fullName?.split(' ')[0] ?? 'there';
  const recentProjects = [...projects].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  ).slice(0, 3);

  function handleAsk(e: React.FormEvent) {
    e.preventDefault();
    if (!question.trim()) return;
    navigate(`/advisor?q=${encodeURIComponent(question.trim())}`);
  }

  function handleNewProject() {
    setModalOpen(true);
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-xs font-mono tracking-widest text-[#1A2F2F]/40 uppercase mb-2">
            {formatDate()}
          </p>
          <h1 className="text-3xl font-bold text-[#1A2F2F] mb-1 flex items-center gap-2">
            <span>Welcome back, {firstName}</span>
            <span className="text-[#E8541A]">✦</span>
          </h1>
          <p className="text-[#1A2F2F]/60 text-sm">Your next clear decision is closer than you think.</p>
        </div>
        <button
          onClick={handleNewProject}
          className="flex items-center gap-2 bg-[#1A2F2F] text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-[#243d3d] transition-colors text-sm shadow-sm"
        >
          <Plus className="w-4 h-4" />
          + New project
        </button>
      </div>

      {/* ASK TECHPILOT card */}
      <div className="bg-[#1A2F2F] rounded-2xl p-8 mb-8 relative overflow-hidden shadow-sm">
        <div className="flex flex-col md:flex-row gap-8 relative items-center">
          {/* Left */}
          <div className="flex-1">
            <span className="inline-block text-xs font-mono font-semibold tracking-widest text-[#4FD1C5] uppercase mb-4">
              ASK TECHPILOT
            </span>
            <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">
              What are we building today?
            </h2>
            <p className="text-white/60 text-sm leading-relaxed max-w-sm">
              Describe your idea, current task or roadblock. We'll help you find the next right move.
            </p>
          </div>

          {/* Right */}
          <form onSubmit={handleAsk} className="flex-1 w-full flex flex-col gap-3">
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              rows={4}
              placeholder="Describe your project or what you want to accomplish..."
              className="w-full bg-white/[0.07] text-white placeholder-white/30 rounded-xl p-4 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-[#4FD1C5] border border-white/10"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleAsk(e as any);
              }}
            />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-[#4FD1C5]">
                <span>✦</span>
                <span>Context-aware guidance</span>
              </div>
              <button
                type="submit"
                className="flex items-center gap-2 bg-[#E8541A] text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-[#d14916] transition-colors text-sm shadow-sm"
              >
                Ask TechPilot
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Bottom two-column grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent projects */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-[#1A2F2F]">Recent projects</h3>
            <Link
              to="/projects"
              className="text-xs text-[#E8541A] font-semibold hover:underline flex items-center gap-1"
            >
              View all <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          {recentProjects.length === 0 ? (
            <div className="text-center py-8">
              <FolderOpen className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm mb-4">No projects yet.</p>
              <button
                onClick={handleNewProject}
                className="text-[#E8541A] font-semibold text-sm hover:underline"
              >
                Create your first project →
              </button>
            </div>
          ) : (
            <div className="space-y-1">
              {recentProjects.map((p) => (
                <RecentProjectCard key={p.id} project={p} />
              ))}
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="font-bold text-[#1A2F2F] mb-4">Quick actions</h3>
          <div className="space-y-3">
            <Link
              to="/advisor"
              className="flex items-center gap-4 p-3 rounded-xl border border-gray-100 hover:border-[#1A2F2F] hover:shadow-sm transition-all group"
            >
              <div className="w-9 h-9 rounded-lg bg-[#1A2F2F]/10 flex items-center justify-center group-hover:bg-[#1A2F2F] transition-colors">
                <Sparkles className="w-4 h-4 text-[#1A2F2F] group-hover:text-white transition-colors" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#1A2F2F]">AI Advisor</p>
                <p className="text-xs text-gray-400">Get tech recommendations</p>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-300 ml-auto group-hover:text-[#E8541A] transition-colors" />
            </Link>

            <Link
              to="/explore"
              className="flex items-center gap-4 p-3 rounded-xl border border-gray-100 hover:border-[#1A2F2F] hover:shadow-sm transition-all group"
            >
              <div className="w-9 h-9 rounded-lg bg-[#1A2F2F]/10 flex items-center justify-center group-hover:bg-[#1A2F2F] transition-colors">
                <Compass className="w-4 h-4 text-[#1A2F2F] group-hover:text-white transition-colors" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#1A2F2F]">Explore Technologies</p>
                <p className="text-xs text-gray-400">Browse our tech database</p>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-300 ml-auto group-hover:text-[#E8541A] transition-colors" />
            </Link>

            <Link
              to="/compare"
              className="flex items-center gap-4 p-3 rounded-xl border border-gray-100 hover:border-[#1A2F2F] hover:shadow-sm transition-all group"
            >
              <div className="w-9 h-9 rounded-lg bg-[#1A2F2F]/10 flex items-center justify-center group-hover:bg-[#1A2F2F] transition-colors">
                <GitCompare className="w-4 h-4 text-[#1A2F2F] group-hover:text-white transition-colors" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#1A2F2F]">Compare Tools</p>
                <p className="text-xs text-gray-400">Side-by-side comparison</p>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-300 ml-auto group-hover:text-[#E8541A] transition-colors" />
            </Link>

            <button
              onClick={handleNewProject}
              className="w-full flex items-center gap-4 p-3 rounded-xl border border-dashed border-gray-300 hover:border-[#E8541A] hover:shadow-sm transition-all group text-left"
            >
              <div className="w-9 h-9 rounded-lg bg-orange-50 flex items-center justify-center group-hover:bg-[#E8541A] transition-colors">
                <Zap className="w-4 h-4 text-[#E8541A] group-hover:text-white transition-colors" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#1A2F2F]">New project</p>
                <p className="text-xs text-gray-400">Start a fresh idea</p>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-300 ml-auto group-hover:text-[#E8541A] transition-colors" />
            </button>
          </div>
        </div>
      </div>

      <CreateProjectModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
