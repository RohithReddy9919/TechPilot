import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { ProjectStage, BudgetPreference, Milestone } from '../../types';
import { getAdvisorResponse } from '../../services/advisorService';
import {
  ChevronRight,
  Pencil,
  Check,
  X,
  Send,
  Trash2,
  CheckSquare,
  Square,
  Bot,
  User,
  Plus,
} from 'lucide-react';

// ─── Helpers ─────────────────────────────────────────────────────────────────

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

function getStageBadgeBg(stage: string) {
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

const STAGES: { value: ProjectStage; label: string }[] = [
  { value: 'idea', label: 'Idea' },
  { value: 'planning', label: 'Planning' },
  { value: 'design', label: 'Design' },
  { value: 'development', label: 'Development' },
  { value: 'testing', label: 'Testing' },
  { value: 'deployment', label: 'Deployment' },
];

const BUDGETS: { value: BudgetPreference; label: string }[] = [
  { value: 'free', label: 'Completely Free' },
  { value: 'mostly-free', label: 'Mostly Free' },
  { value: 'limited-paid', label: 'Limited Paid' },
  { value: 'no-restriction', label: 'No Restriction' },
];

type TabId = 'overview' | 'advisor' | 'technologies' | 'settings';

const TABS: { id: TabId; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'advisor', label: 'Advisor' },
  { id: 'technologies', label: 'Technologies' },
  { id: 'settings', label: 'Settings' },
];

// ─── Tab: Overview ─────────────────────────────────────────────────────────

function OverviewTab({
  projectId,
}: {
  projectId: string;
}) {
  const { getProject, updateProject } = useApp();
  const project = getProject(projectId)!;
  const [editingTask, setEditingTask] = useState(false);
  const [taskDraft, setTaskDraft] = useState(project.currentTask);

  function toggleMilestone(id: string) {
    const updated = project.milestones.map((m) =>
      m.id === id ? { ...m, completed: !m.completed } : m
    );
    const completedCount = updated.filter((m) => m.completed).length;
    updateProject(projectId, {
      milestones: updated,
      completedMilestones: completedCount,
    });
  }

  function saveTask() {
    updateProject(projectId, { currentTask: taskDraft });
    setEditingTask(false);
  }

  function addMilestone() {
    const title = prompt('Milestone title:');
    if (!title?.trim()) return;
    const newMs: Milestone = {
      id: crypto.randomUUID(),
      title: title.trim(),
      completed: false,
      stage: project.stage,
    };
    const updated = [...project.milestones, newMs];
    updateProject(projectId, {
      milestones: updated,
      totalMilestones: updated.length,
    });
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Milestones */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-[#1A2F2F]">Milestones</h3>
          <button
            onClick={addMilestone}
            className="text-xs text-[#E8541A] font-semibold flex items-center gap-1 hover:underline"
          >
            <Plus className="w-3 h-3" /> Add
          </button>
        </div>
        {project.milestones.length === 0 ? (
          <p className="text-sm text-gray-400 italic">No milestones yet. Add one to track progress.</p>
        ) : (
          <ul className="space-y-2">
            {project.milestones.map((m) => (
              <li key={m.id}>
                <button
                  onClick={() => toggleMilestone(m.id)}
                  className="flex items-center gap-3 w-full text-left group"
                >
                  {m.completed ? (
                    <CheckSquare className="w-5 h-5 text-[#1A2F2F] flex-shrink-0" />
                  ) : (
                    <Square className="w-5 h-5 text-gray-300 group-hover:text-[#1A2F2F] flex-shrink-0 transition-colors" />
                  )}
                  <span
                    className={`text-sm ${
                      m.completed ? 'line-through text-gray-400' : 'text-[#1A2F2F]'
                    }`}
                  >
                    {m.title}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1.5">
            <span>{project.completedMilestones}/{project.totalMilestones} complete</span>
            <span>
              {project.totalMilestones
                ? Math.round((project.completedMilestones / project.totalMilestones) * 100)
                : 0}%
            </span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5">
            <div
              className="bg-[#E8541A] h-1.5 rounded-full transition-all"
              style={{
                width: `${
                  project.totalMilestones
                    ? (project.completedMilestones / project.totalMilestones) * 100
                    : 0
                }%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="bg-white rounded-2xl shadow-sm p-6 space-y-5">
        {/* Current task */}
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
            Current focus
          </label>
          {editingTask ? (
            <div className="flex gap-2">
              <input
                autoFocus
                value={taskDraft}
                onChange={(e) => setTaskDraft(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') saveTask(); if (e.key === 'Escape') setEditingTask(false); }}
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A2F2F]"
                placeholder="What are you working on?"
              />
              <button onClick={saveTask} className="p-2 text-[#1A2F2F] hover:bg-gray-100 rounded-lg">
                <Check className="w-4 h-4" />
              </button>
              <button onClick={() => { setEditingTask(false); setTaskDraft(project.currentTask); }} className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div
              onClick={() => { setEditingTask(true); setTaskDraft(project.currentTask); }}
              className="flex items-center justify-between cursor-pointer p-3 rounded-lg border border-dashed border-gray-200 hover:border-[#1A2F2F] transition-colors group"
            >
              <span className={`text-sm ${project.currentTask ? 'text-[#1A2F2F]' : 'text-gray-400 italic'}`}>
                {project.currentTask || 'Click to set current focus...'}
              </span>
              <Pencil className="w-3.5 h-3.5 text-gray-300 group-hover:text-[#1A2F2F] transition-colors" />
            </div>
          )}
        </div>

        {/* Deadline */}
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
            Deadline
          </label>
          <p className="text-sm text-[#1A2F2F]">
            {project.deadline
              ? new Date(project.deadline).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })
              : <span className="text-gray-400 italic">No deadline set</span>}
          </p>
        </div>

        {/* Budget */}
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
            Budget preference
          </label>
          <span className="inline-flex items-center gap-1.5 bg-[#1A2F2F]/5 text-[#1A2F2F] text-xs font-semibold px-3 py-1.5 rounded-lg capitalize">
            {project.budgetPreference.replace(/-/g, ' ')}
          </span>
        </div>

        {/* Stage */}
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
            Stage
          </label>
          <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg capitalize ${getStageBadgeBg(project.stage)}`}>
            <span className={`w-2 h-2 rounded-full ${getStageDotColor(project.stage)}`} />
            {project.stage}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Tab: Advisor ───────────────────────────────────────────────────────────

function AdvisorBubble({ msg }: { msg: { id: string; role: 'user' | 'advisor'; content: string } }) {
  let parsed: any = null;
  if (msg.role === 'advisor') {
    try {
      parsed = JSON.parse(msg.content);
    } catch {
      parsed = null;
    }
  }

  if (parsed && parsed.approach) {
    return (
      <div className="bg-[#F5F3EE] text-[#1A2F2F] rounded-2xl rounded-tl-sm p-4 max-w-[85%] text-sm space-y-2.5 border border-gray-200/50">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#E8541A] font-bold">
            Recommended Approach
          </span>
          <p className="font-bold text-base text-[#1A2F2F]">{parsed.approach}</p>
        </div>
        <p className="text-xs text-gray-700 leading-relaxed">{parsed.reasoning}</p>
        {parsed.nextSteps?.length > 0 && (
          <div className="pt-2 border-t border-gray-200/60">
            <span className="text-[10px] font-mono uppercase tracking-wider text-gray-500 font-bold block mb-1">
              Suggested Next Steps
            </span>
            <ul className="space-y-1">
              {parsed.nextSteps.map((s: string, idx: number) => (
                <li key={idx} className="text-xs text-gray-700 flex gap-1.5">
                  <span className="text-[#E8541A] font-bold">{idx + 1}.</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
        msg.role === 'user'
          ? 'bg-[#1A2F2F] text-white rounded-tr-sm'
          : 'bg-[#F5F3EE] text-[#1A2F2F] rounded-tl-sm'
      }`}
    >
      {msg.content}
    </div>
  );
}

function AdvisorTab({ projectId }: { projectId: string }) {
  const { getProject, updateProject, user } = useApp();
  const project = getProject(projectId)!;
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [project.advisorHistory.length, loading]);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const userMsg = {
      id: crypto.randomUUID(),
      role: 'user' as const,
      content: text,
      timestamp: new Date().toISOString(),
    };

    const newHistory = [...project.advisorHistory, userMsg];
    updateProject(projectId, { advisorHistory: newHistory });
    setInput('');
    setLoading(true);

    try {
      const res = await getAdvisorResponse({
        userInput: text,
        project,
        user,
      });

      const advisorMsg = {
        id: crypto.randomUUID(),
        role: 'advisor' as const,
        content: JSON.stringify({
          approach: res.approach,
          reasoning: res.reasoning,
          nextSteps: res.nextSteps,
          warnings: res.warnings,
        }),
        timestamp: new Date().toISOString(),
        recommendations: res.recommendations,
      };

      const newSelected = [
        ...new Set([...project.selectedTechnologies, ...res.recommendations.map(r => r.id)]),
      ];

      updateProject(projectId, {
        advisorHistory: [...newHistory, advisorMsg],
        selectedTechnologies: newSelected,
      });
    } catch {
      const errMsg = {
        id: crypto.randomUUID(),
        role: 'advisor' as const,
        content: 'I had trouble processing that request. Please try again.',
        timestamp: new Date().toISOString(),
      };
      updateProject(projectId, {
        advisorHistory: [...newHistory, errMsg],
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm flex flex-col h-[520px]">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {project.advisorHistory.length === 0 && (
          <div className="text-center py-16">
            <Bot className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-400 text-sm">
              Ask TechPilot about technologies, architecture decisions, or best practices for this project.
            </p>
          </div>
        )}
        {project.advisorHistory.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            <div
              className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${
                msg.role === 'user' ? 'bg-[#E8541A]' : 'bg-[#1A2F2F]'
              }`}
            >
              {msg.role === 'user' ? (
                <User className="w-4 h-4 text-white" />
              ) : (
                <Bot className="w-4 h-4 text-white" />
              )}
            </div>
            <AdvisorBubble msg={msg} />
          </div>
        ))}
        {loading && (
          <div className="flex gap-3 items-center">
            <div className="w-8 h-8 rounded-full bg-[#1A2F2F] flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-[#F5F3EE] rounded-2xl px-4 py-2.5 text-xs text-gray-500 flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[#1A2F2F] animate-bounce" />
              <div className="w-2 h-2 rounded-full bg-[#1A2F2F] animate-bounce [animation-delay:0.2s]" />
              <div className="w-2 h-2 rounded-full bg-[#1A2F2F] animate-bounce [animation-delay:0.4s]" />
              <span className="ml-1 text-[11px] font-mono">Analyzing project context...</span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-100 p-4">
        <form onSubmit={sendMessage} className="flex gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            placeholder="Ask about technologies, architecture, or next steps..."
            className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A2F2F] transition-shadow disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="bg-[#1A2F2F] text-white px-4 py-2.5 rounded-xl font-semibold hover:bg-[#243d3d] disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-2 text-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Tab: Technologies ──────────────────────────────────────────────────────

function TechnologiesTab({ projectId }: { projectId: string }) {
  const { getProject } = useApp();
  const project = getProject(projectId)!;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Selected */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h3 className="font-bold text-[#1A2F2F] mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500" />
          Selected technologies
        </h3>
        {project.selectedTechnologies.length === 0 ? (
          <p className="text-sm text-gray-400 italic">
            No technologies selected yet. Use the AI Advisor to get recommendations.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {project.selectedTechnologies.map((tech) => (
              <span
                key={tech}
                className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 border border-green-200 text-xs font-semibold px-3 py-1.5 rounded-lg"
              >
                <Check className="w-3 h-3" />
                {tech}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Rejected */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h3 className="font-bold text-[#1A2F2F] mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-400" />
          Not a fit
        </h3>
        {project.rejectedTechnologies.length === 0 ? (
          <p className="text-sm text-gray-400 italic">No technologies ruled out yet.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {project.rejectedTechnologies.map((tech) => (
              <span
                key={tech}
                className="inline-flex items-center gap-1.5 bg-red-50 text-red-600 border border-red-200 text-xs font-semibold px-3 py-1.5 rounded-lg line-through"
              >
                {tech}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Tab: Settings ──────────────────────────────────────────────────────────

function SettingsTab({ projectId }: { projectId: string }) {
  const { getProject, updateProject, deleteProject } = useApp();
  const navigate = useNavigate();
  const project = getProject(projectId)!;

  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(project.description);
  const [stage, setStage] = useState<ProjectStage>(project.stage);
  const [deadline, setDeadline] = useState(project.deadline ?? '');
  const [saved, setSaved] = useState(false);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    updateProject(projectId, {
      name: name.trim(),
      description: description.trim(),
      stage,
      deadline: deadline || undefined,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleDelete() {
    if (window.confirm(`Delete "${project.name}"? This cannot be undone.`)) {
      deleteProject(projectId);
      navigate('/projects');
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      {/* Edit form */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h3 className="font-bold text-[#1A2F2F] mb-5">Project settings</h3>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-[#1A2F2F] mb-1.5">Project name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A2F2F]"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#1A2F2F] mb-1.5">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A2F2F] resize-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#1A2F2F] mb-1.5">Stage</label>
              <select
                value={stage}
                onChange={(e) => setStage(e.target.value as ProjectStage)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A2F2F] bg-white"
              >
                {STAGES.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#1A2F2F] mb-1.5">Deadline</label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A2F2F]"
              />
            </div>
          </div>
          <button
            type="submit"
            className="bg-[#1A2F2F] text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#243d3d] transition-colors"
          >
            {saved ? '✓ Saved!' : 'Save changes'}
          </button>
        </form>
      </div>

      {/* Danger zone */}
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-red-100">
        <h3 className="font-bold text-red-600 mb-2">Danger zone</h3>
        <p className="text-sm text-gray-500 mb-4">
          Permanently delete this project and all its data. This action cannot be undone.
        </p>
        <button
          onClick={handleDelete}
          className="flex items-center gap-2 bg-red-50 text-red-600 border border-red-200 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-red-100 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          Delete project
        </button>
      </div>
    </div>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────────

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { getProject } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [editingHeader, setEditingHeader] = useState(false);

  const project = id ? getProject(id) : undefined;

  if (!project) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500 mb-4">Project not found.</p>
        <Link to="/projects" className="text-[#E8541A] font-semibold hover:underline">
          ← Back to projects
        </Link>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link to="/projects" className="hover:text-[#1A2F2F] transition-colors font-medium">
          My projects
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-[#1A2F2F] font-semibold truncate max-w-xs">{project.name}</span>
      </nav>

      {/* Project header */}
      <div className="mb-8">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-[#1A2F2F] truncate">{project.name}</h1>
              <span
                className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full capitalize flex-shrink-0 ${getStageBadgeBg(
                  project.stage
                )}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${getStageDotColor(project.stage)}`} />
                {project.stage}
              </span>
            </div>
            {project.description ? (
              <p className="text-gray-500 leading-relaxed">{project.description}</p>
            ) : (
              <p className="text-gray-300 italic text-sm">No description. Add one in Settings.</p>
            )}
          </div>
          <button
            onClick={() => setActiveTab('settings')}
            className="flex items-center gap-2 border border-gray-200 text-gray-600 px-4 py-2 rounded-xl text-sm font-semibold hover:border-[#1A2F2F] hover:text-[#1A2F2F] transition-colors flex-shrink-0"
          >
            <Pencil className="w-3.5 h-3.5" />
            Edit
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white rounded-xl p-1 shadow-sm mb-6 w-fit">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === tab.id
                ? 'bg-[#1A2F2F] text-white shadow-sm'
                : 'text-gray-500 hover:text-[#1A2F2F]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div>
        {activeTab === 'overview' && <OverviewTab projectId={project.id} />}
        {activeTab === 'advisor' && <AdvisorTab projectId={project.id} />}
        {activeTab === 'technologies' && <TechnologiesTab projectId={project.id} />}
        {activeTab === 'settings' && <SettingsTab projectId={project.id} />}
      </div>
    </div>
  );
}
