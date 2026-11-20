import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Project } from '../../types';
import { Plus, FolderOpen, ChevronRight } from 'lucide-react';
import CreateProjectModal from '../../components/projects/CreateProjectModal';

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

function getStageLabel(stage: string) {
  return stage.charAt(0).toUpperCase() + stage.slice(1);
}

function getStageDotTailwind(stage: string) {
  const map: Record<string, string> = {
    idea: 'text-purple-600',
    planning: 'text-orange-600',
    design: 'text-blue-600',
    development: 'text-green-600',
    testing: 'text-yellow-600',
    deployment: 'text-teal-600',
  };
  return map[stage] ?? 'text-gray-500';
}

function ProjectCard({ project }: { project: Project }) {
  const pct = project.totalMilestones
    ? Math.round((project.completedMilestones / project.totalMilestones) * 100)
    : 0;

  const displayStage = project.stage === 'development' ? 'In progress' : project.stage.charAt(0).toUpperCase() + project.stage.slice(1);

  return (
    <Link
      to={`/projects/${project.id}`}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-6 flex flex-col justify-between min-h-[190px] group relative cursor-pointer"
    >
      <div>
        {/* Stage badge */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full flex-shrink-0 bg-[#E8541A]" />
            <span className="text-xs font-medium text-gray-600">
              {displayStage}
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#E8541A] transition-colors" />
        </div>

        {/* Name & description */}
        <h3 className="text-xl font-bold text-[#1A2F2F] mb-2 leading-tight">
          {project.name}
        </h3>
        {project.description ? (
          <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">{project.description}</p>
        ) : (
          <p className="text-sm text-gray-300 italic">No description yet.</p>
        )}
      </div>

      {/* Milestones + progress bar on right */}
      <div className="flex items-center justify-between pt-4 mt-2">
        <span className="text-xs text-gray-400 font-mono">
          {project.completedMilestones}/{project.totalMilestones} milestones
        </span>
        <div className="w-16 bg-gray-100 rounded-full h-1 overflow-hidden">
          <div
            className="bg-[#E8541A] h-full rounded-full transition-all"
            style={{ width: `${Math.max(pct, 15)}%` }}
          />
        </div>
      </div>
    </Link>
  );
}

function EmptyState({ onNewProject }: { onNewProject: () => void }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
      <div className="w-20 h-20 rounded-2xl bg-[#1A2F2F]/5 flex items-center justify-center mb-6">
        <FolderOpen className="w-10 h-10 text-[#1A2F2F]/30" />
      </div>
      <h3 className="text-2xl font-bold text-[#1A2F2F] mb-2">No projects yet</h3>
      <p className="text-gray-500 mb-8 max-w-sm leading-relaxed">
        Every great product starts with an idea. Create your first project and let TechPilot
        help you choose the right technologies.
      </p>
      <button
        onClick={onNewProject}
        className="flex items-center gap-2 bg-[#E8541A] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[#d14916] transition-colors text-sm"
      >
        <Plus className="w-4 h-4" />
        Create your first project
      </button>
    </div>
  );
}

export default function ProjectsPage() {
  const { projects } = useApp();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-2">
            Workspace
          </p>
          <h1 className="text-3xl font-bold text-[#1A2F2F] mb-1">My projects</h1>
          <p className="text-gray-500">Every idea has a next step. Keep yours in view.</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 bg-[#1A2F2F] text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-[#243d3d] transition-colors text-sm"
        >
          <Plus className="w-4 h-4" />
          New project
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.length === 0 ? (
          <EmptyState onNewProject={() => setModalOpen(true)} />
        ) : (
          <>
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
            {/* Add project card */}
            <button
              onClick={() => setModalOpen(true)}
              className="border-2 border-dashed border-gray-200 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 hover:border-[#E8541A] hover:bg-orange-50/50 transition-all group min-h-[200px]"
            >
              <div className="w-12 h-12 rounded-xl bg-gray-100 group-hover:bg-[#E8541A] flex items-center justify-center transition-colors">
                <Plus className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors" />
              </div>
              <span className="text-sm font-semibold text-gray-400 group-hover:text-[#E8541A] transition-colors">
                New project
              </span>
            </button>
          </>
        )}
      </div>

      <CreateProjectModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
