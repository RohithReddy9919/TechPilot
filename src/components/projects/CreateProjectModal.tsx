import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { ProjectStage, BudgetPreference } from '../../types';
import { X } from 'lucide-react';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
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

export default function CreateProjectModal({ isOpen, onClose }: CreateProjectModalProps) {
  const { createProject, user } = useApp();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [stage, setStage] = useState<ProjectStage>('idea');
  const [currentTask, setCurrentTask] = useState('');
  const [deadline, setDeadline] = useState('');
  const [budget, setBudget] = useState<BudgetPreference>(user?.budgetPreference ?? 'mostly-free');
  const [nameError, setNameError] = useState('');

  if (!isOpen) return null;

  function handleBackdrop(e: React.MouseEvent) {
    if (e.target === e.currentTarget) onClose();
  }

  function handleClose() {
    setName('');
    setDescription('');
    setStage('idea');
    setCurrentTask('');
    setDeadline('');
    setBudget(user?.budgetPreference ?? 'mostly-free');
    setNameError('');
    onClose();
  }

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setNameError('Project name is required.');
      return;
    }
    setNameError('');

    const project = createProject({
      name: name.trim(),
      description: description.trim(),
      stage,
      currentTask: currentTask.trim(),
      deadline: deadline || undefined,
      budgetPreference: budget,
      teamType: user?.teamType ?? 'individual',
      milestones: [],
      selectedTechnologies: [],
      rejectedTechnologies: [],
      advisorHistory: [],
      savedRecommendations: [],
      completedMilestones: 0,
      totalMilestones: 6,
    });

    handleClose();
    navigate(`/projects/${project.id}`);
  }

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleBackdrop}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-[#1A2F2F]">New project</h2>
            <p className="text-sm text-gray-400 mt-0.5">Every idea has a next step.</p>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleCreate} className="p-6 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-[#1A2F2F] mb-1.5">
              Project name <span className="text-[#E8541A]">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); setNameError(''); }}
              placeholder="My awesome SaaS app"
              className={`w-full border rounded-xl px-4 py-2.5 text-sm text-[#1A2F2F] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1A2F2F] transition-shadow ${
                nameError ? 'border-red-400' : 'border-gray-200'
              }`}
              autoFocus
            />
            {nameError && <p className="text-xs text-red-500 mt-1">{nameError}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-[#1A2F2F] mb-1.5">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What are you building? A brief overview helps the AI advisor tailor recommendations."
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-[#1A2F2F] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1A2F2F] transition-shadow resize-none"
            />
          </div>

          {/* Stage + Budget row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#1A2F2F] mb-1.5">Stage</label>
              <select
                value={stage}
                onChange={(e) => setStage(e.target.value as ProjectStage)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-[#1A2F2F] focus:outline-none focus:ring-2 focus:ring-[#1A2F2F] bg-white"
              >
                {STAGES.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#1A2F2F] mb-1.5">Budget</label>
              <select
                value={budget}
                onChange={(e) => setBudget(e.target.value as BudgetPreference)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-[#1A2F2F] focus:outline-none focus:ring-2 focus:ring-[#1A2F2F] bg-white"
              >
                {BUDGETS.map((b) => (
                  <option key={b.value} value={b.value}>{b.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Current task */}
          <div>
            <label className="block text-sm font-semibold text-[#1A2F2F] mb-1.5">
              Current task / focus
            </label>
            <input
              type="text"
              value={currentTask}
              onChange={(e) => setCurrentTask(e.target.value)}
              placeholder="e.g. Choose authentication provider"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-[#1A2F2F] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1A2F2F] transition-shadow"
            />
          </div>

          {/* Deadline */}
          <div>
            <label className="block text-sm font-semibold text-[#1A2F2F] mb-1.5">
              Target deadline
            </label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-[#1A2F2F] focus:outline-none focus:ring-2 focus:ring-[#1A2F2F] transition-shadow"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 border border-gray-200 text-gray-600 rounded-xl py-2.5 text-sm font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-[#1A2F2F] text-white rounded-xl py-2.5 text-sm font-semibold hover:bg-[#243d3d] transition-colors"
            >
              Create project →
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
