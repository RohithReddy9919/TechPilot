import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// ─── Compass Icon ───────────────────────────────────────────────────────────
const CompassIcon: React.FC<{ size?: number }> = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" fill="#E8541A" />
    <polygon points="12,4 14,12 12,20 10,12" fill="white" opacity="0.9" />
    <polygon points="4,12 12,10 20,12 12,14" fill="white" opacity="0.6" />
    <circle cx="12" cy="12" r="2" fill="white" />
  </svg>
);

// ─── Logo ────────────────────────────────────────────────────────────────────
const Logo: React.FC<{ dark?: boolean }> = ({ dark = false }) => (
  <div className="flex items-center gap-2 cursor-pointer select-none">
    <div className="w-8 h-8 rounded-full bg-[#1A2F2F] flex items-center justify-center flex-shrink-0">
      <CompassIcon size={20} />
    </div>
    <div>
      <div className={`font-bold text-sm leading-tight ${dark ? 'text-white' : 'text-[#1A2F2F]'}`}>
        TechPilot
      </div>
      <div className={`text-[9px] leading-none ${dark ? 'text-white/50' : 'text-[#1A2F2F]/40'}`}>
        by Rocky
      </div>
    </div>
  </div>
);

// ─── Navbar ──────────────────────────────────────────────────────────────────
const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-[#F5F3EE]/95 backdrop-blur-sm shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/">
          <Logo />
        </Link>

        {/* Center links */}
        <div className="hidden md:flex items-center gap-8">
          {[
            { label: 'Features', id: 'features' },
            { label: 'How it works', id: 'how-it-works' },
            { label: 'About', id: 'about' },
          ].map(({ label, id }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className="text-sm text-[#1A2F2F]/70 hover:text-[#1A2F2F] font-medium transition-colors"
            >
              {label}
            </button>
          ))}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="text-sm font-medium text-[#1A2F2F]/80 hover:text-[#1A2F2F] transition-colors px-3 py-2"
          >
            Log in
          </Link>
          <Link
            to="/signup"
            className="bg-[#1A2F2F] text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-[#243d3d] transition-colors flex items-center gap-1.5"
          >
            Get started <span>→</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

// ─── Dashboard Mockup Card matching image-1795181367259.jpeg ────────────────
const DashboardMockup: React.FC = () => (
  <div className="relative w-full max-w-lg">
    {/* Outer shadow glow */}
    <div className="absolute -inset-4 bg-[#1A2F2F]/20 rounded-3xl blur-2xl" />

    {/* Mockup Container */}
    <div className="relative bg-[#1A2F2F] text-white rounded-3xl p-6 shadow-2xl border border-white/10 overflow-hidden">
      {/* Top bar inside mockup */}
      <div className="flex items-center justify-between pb-5 border-b border-white/10 mb-5">
        <Logo dark />
        <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Live advisor</span>
        </div>
      </div>

      <div className="flex gap-5">
        {/* Mini sidebar inside mockup */}
        <div className="w-10 flex flex-col items-center gap-3 py-2 border-r border-white/10 pr-4">
          <div className="w-8 h-8 rounded-lg bg-[#E8541A] flex items-center justify-center text-white text-xs font-bold shadow-sm">
            RK
          </div>
          <div className="w-7 h-7 rounded-md bg-white/10 flex items-center justify-center text-white/70">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
            </svg>
          </div>
          <div className="w-7 h-7 rounded-md bg-white/5 flex items-center justify-center text-white/50">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
            </svg>
          </div>
          <div className="w-7 h-7 rounded-md bg-white/5 flex items-center justify-center text-white/50">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M12 2a3 3 0 00-3 3v6h6V5a3 3 0 00-3-3z" />
            </svg>
          </div>
        </div>

        {/* Mockup Body Content */}
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-mono tracking-widest text-[#4FD1C5] uppercase mb-1">
            YOUR PROJECT COMPASS
          </p>
          <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-1.5">
            <span>Good morning, Rocky</span>
            <span className="text-[#E8541A]">✦</span>
          </h3>

          <p className="text-xs text-white/60 mb-2">What are we building today?</p>
          <div className="bg-white/10 border border-white/15 rounded-xl px-4 py-2.5 flex items-center justify-between mb-5 text-xs text-white">
            <span className="truncate">An AI-powered attendance system</span>
            <span className="text-[#E8541A] font-bold ml-2">→</span>
          </div>

          {/* Two metric cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/[0.07] border border-white/10 rounded-xl p-3.5">
              <p className="text-[9px] font-mono tracking-wider text-white/50 uppercase mb-1">
                PROJECT MOMENTUM
              </p>
              <p className="text-2xl font-bold text-white mb-2">72%</p>
              <div className="w-full bg-white/10 rounded-full h-1 overflow-hidden">
                <div className="bg-[#E8541A] h-full w-[72%] rounded-full" />
              </div>
            </div>

            <div className="bg-white/[0.07] border border-white/10 rounded-xl p-3.5">
              <p className="text-[9px] font-mono tracking-wider text-white/50 uppercase mb-1">
                NEXT BEST ACTION
              </p>
              <p className="text-xs font-bold text-white mb-1 leading-snug">
                Define your users
              </p>
              <p className="text-[10px] text-white/40">Advisor: Just now</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// ─── Hero Section ────────────────────────────────────────────────────────────
const HeroSection: React.FC = () => (
  <section className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
    <div className="grid lg:grid-cols-2 gap-12 items-center">
      {/* Left text */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <span className="w-2 h-2 rounded-full bg-[#E8541A]" />
          <span className="text-xs font-mono font-bold tracking-widest text-[#E8541A] uppercase">
            ADAPTIVE TECHNOLOGY ADVISOR
          </span>
        </div>

        <h1 className="text-5xl lg:text-7xl font-bold leading-[1.08] mb-6 tracking-tight">
          <span className="text-[#1A2F2F]">Build smarter.</span>
          <br />
          <span className="text-[#E8541A]">Choose the right</span>
          <br />
          <span className="text-[#1A2F2F]">technology.</span>
        </h1>

        <p className="text-[#1A2F2F]/70 text-lg leading-relaxed mb-8 max-w-lg">
          Stop wasting time deciding which AI tools, frameworks and development methods to use. Tell TechPilot what you're building and receive personalized guidance for every stage.
        </p>

        <div className="flex items-center gap-5 mb-12">
          <Link
            to="/signup"
            className="bg-[#1A2F2F] text-white font-medium px-8 py-3.5 rounded-xl hover:bg-[#243d3d] transition-all flex items-center gap-2 shadow-sm text-base"
          >
            Get started <span>→</span>
          </Link>
          <button
            onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
            className="text-[#1A2F2F] font-semibold hover:text-[#E8541A] transition-colors flex items-center gap-1.5 text-base"
          >
            See how it works <span>&gt;</span>
          </button>
        </div>

        {/* Social proof matching image-1795181367259.jpeg */}
        <div className="flex items-center gap-3 text-sm text-[#1A2F2F]/60">
          <div className="flex -space-x-1.5">
            <span className="w-7 h-7 rounded-full bg-[#fbd5c3] text-[#E8541A] flex items-center justify-center font-bold text-[10px] border-2 border-[#F5F3EE]">
              RK
            </span>
            <span className="w-7 h-7 rounded-full bg-[#c6e3df] text-[#1A2F2F] flex items-center justify-center font-bold text-[10px] border-2 border-[#F5F3EE]">
              AM
            </span>
            <span className="w-7 h-7 rounded-full bg-[#dbeafe] text-[#2563eb] flex items-center justify-center font-bold text-[10px] border-2 border-[#F5F3EE]">
              JS
            </span>
          </div>
          <span className="text-xs text-gray-500 font-medium">Built for builders at every stage</span>
        </div>
      </div>

      {/* Right mockup */}
      <div className="flex justify-center lg:justify-end">
        <DashboardMockup />
      </div>
    </div>
  </section>
);

// ─── How It Works Section ─────────────────────────────────────────────────────
const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Tell us about your project',
      desc: 'Describe your project type, skill level, team size, and budget. Our onboarding wizard makes it effortless.',
      icon: '🎯',
    },
    {
      num: '02',
      title: 'Get AI-powered recommendations',
      desc: 'TechPilot analyzes your inputs and suggests the optimal tech stack from a curated database of 100+ tools.',
      icon: '🤖',
    },
    {
      num: '03',
      title: 'Build with confidence',
      desc: 'Compare tools side-by-side, save your stack, and get ongoing advice as your project evolves.',
      icon: '🚀',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <div className="text-[#E8541A] font-semibold text-sm uppercase tracking-widest mb-3">
            How It Works
          </div>
          <h2 className="text-4xl font-bold text-[#1A2F2F] mb-4">
            Three steps to your perfect stack
          </h2>
          <p className="text-[#1A2F2F]/60 max-w-lg mx-auto">
            From idea to implementation — TechPilot guides you every step of the way.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {steps.map(({ num, title, desc, icon }) => (
            <div
              key={num}
              className="bg-white rounded-2xl p-7 shadow-sm border border-[#1A2F2F]/5 relative overflow-hidden group hover:shadow-md transition-shadow"
            >
              <div className="absolute -top-4 -right-4 text-7xl font-black text-[#1A2F2F]/4 select-none group-hover:text-[#1A2F2F]/7 transition-colors">
                {num}
              </div>
              <div className="text-3xl mb-4">{icon}</div>
              <div className="text-[#E8541A] font-semibold text-xs uppercase tracking-widest mb-2">
                Step {num}
              </div>
              <h3 className="font-bold text-[#1A2F2F] text-lg mb-3">{title}</h3>
              <p className="text-[#1A2F2F]/60 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── Features Section ─────────────────────────────────────────────────────────
const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: '🧠',
      title: 'AI Tech Advisor',
      desc: 'Chat with our AI to get personalized technology recommendations based on your unique project needs.',
    },
    {
      icon: '📊',
      title: 'Tool Comparison',
      desc: 'Compare tools side-by-side across pricing, features, learning curve, and community support.',
    },
    {
      icon: '💡',
      title: 'Smart Filtering',
      desc: 'Filter by budget, tech category, skill level, and more to find exactly what you need.',
    },
    {
      icon: '🗂️',
      title: 'Project Management',
      desc: 'Track multiple projects with milestones and get context-aware tech advice for each stage.',
    },
    {
      icon: '📌',
      title: 'Save & Revisit',
      desc: 'Bookmark your favorite tech recommendations and revisit them any time.',
    },
    {
      icon: '🏗️',
      title: 'Stack Templates',
      desc: 'Start from proven templates for SaaS, mobile apps, e-commerce, and more.',
    },
  ];

  return (
    <section id="features" className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <div className="text-[#E8541A] font-semibold text-sm uppercase tracking-widest mb-3">
            Key Features
          </div>
          <h2 className="text-4xl font-bold text-[#1A2F2F] mb-4">
            Everything you need to choose wisely
          </h2>
          <p className="text-[#1A2F2F]/60 max-w-lg mx-auto">
            Powerful tools to help developers, indie hackers, and teams pick the right technologies.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map(({ icon, title, desc }) => (
            <div
              key={title}
              className="bg-white rounded-2xl p-6 border border-[#1A2F2F]/5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all group"
            >
              <div className="w-11 h-11 rounded-xl bg-[#F5F3EE] flex items-center justify-center text-xl mb-4 group-hover:bg-[#1A2F2F]/5 transition-colors">
                {icon}
              </div>
              <h3 className="font-bold text-[#1A2F2F] mb-2">{title}</h3>
              <p className="text-[#1A2F2F]/55 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── Example Recommendation Section ─────────────────────────────────────────
const ExampleSection: React.FC = () => (
  <section className="py-20 px-6 bg-white">
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-14">
        <div className="text-[#E8541A] font-semibold text-sm uppercase tracking-widest mb-3">
          Example Recommendation
        </div>
        <h2 className="text-4xl font-bold text-[#1A2F2F] mb-4">
          See TechPilot in action
        </h2>
        <p className="text-[#1A2F2F]/60 max-w-lg mx-auto">
          Here's what a recommendation looks like for a typical SaaS project.
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        {/* Chat message */}
        <div className="bg-[#F5F3EE] rounded-2xl p-5 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-full bg-[#E8541A] flex items-center justify-center text-white text-xs font-bold">
              U
            </div>
            <span className="text-xs font-semibold text-[#1A2F2F]/60">You</span>
          </div>
          <p className="text-[#1A2F2F] text-sm">
            I'm building a SaaS dashboard app. I know TypeScript, have a small budget, and want to ship fast. What stack should I use?
          </p>
        </div>

        {/* Advisor response */}
        <div className="bg-[#1A2F2F] rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-full bg-[#E8541A]/20 flex items-center justify-center">
              <CompassIcon size={14} />
            </div>
            <span className="text-xs font-semibold text-white/60">TechPilot AI</span>
          </div>
          <p className="text-white/80 text-sm mb-4">
            Great choice! For a TypeScript SaaS dashboard with speed and budget in mind, I recommend:
          </p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { name: 'React + Vite', role: 'Frontend', color: '#61DAFB', letter: 'R' },
              { name: 'Supabase', role: 'Backend + Auth + DB', color: '#3ECF8E', letter: 'S' },
              { name: 'Tailwind CSS', role: 'Styling', color: '#38BDF8', letter: 'T' },
              { name: 'Vercel', role: 'Deployment', color: 'white', letter: 'V' },
            ].map(({ name, role, color, letter }) => (
              <div key={name} className="bg-white/10 rounded-xl p-3 flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{ backgroundColor: color + '25', color }}
                >
                  {letter}
                </div>
                <div>
                  <div className="text-white font-semibold text-xs">{name}</div>
                  <div className="text-white/50 text-[10px]">{role}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-white/10">
            <span className="text-[#E8541A] text-xs font-medium">✓ Completely free tier</span>
            <span className="text-white/40 text-xs mx-2">•</span>
            <span className="text-white/60 text-xs">Ships in days, not weeks</span>
          </div>
        </div>
      </div>
    </div>
  </section>
);

// ─── Why TechPilot Section ───────────────────────────────────────────────────
const WhySection: React.FC = () => {
  const benefits = [
    { icon: '⏱️', title: 'Save 10+ hours', desc: 'No more research rabbit holes. Get curated recommendations instantly.' },
    { icon: '🎓', title: 'Learn as you go', desc: 'Understand why each tool fits your project, not just what to use.' },
    { icon: '💰', title: 'Budget-aware', desc: 'Filter by free, freemium, or paid tiers based on what you can afford.' },
    { icon: '🔄', title: 'Adapts with you', desc: 'As your project grows, TechPilot updates its recommendations accordingly.' },
  ];

  return (
    <section id="about" className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="text-[#E8541A] font-semibold text-sm uppercase tracking-widest mb-3">
              Why TechPilot
            </div>
            <h2 className="text-4xl font-bold text-[#1A2F2F] mb-5">
              Built for builders who value their time
            </h2>
            <p className="text-[#1A2F2F]/60 leading-relaxed mb-8">
              Whether you're an indie hacker launching your first app or a senior dev scoping a new
              project — TechPilot cuts through the noise so you can focus on building.
            </p>
            <Link
              to="/signup"
              className="bg-[#1A2F2F] text-white font-medium px-7 py-3.5 rounded-xl hover:bg-[#243d3d] transition-colors inline-flex items-center gap-2 shadow-lg shadow-[#1A2F2F]/20"
            >
              Start building smarter <span>→</span>
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {benefits.map(({ icon, title, desc }) => (
              <div
                key={title}
                className="bg-white rounded-2xl p-5 border border-[#1A2F2F]/5 shadow-sm"
              >
                <div className="text-2xl mb-3">{icon}</div>
                <h3 className="font-bold text-[#1A2F2F] text-sm mb-1.5">{title}</h3>
                <p className="text-[#1A2F2F]/55 text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// ─── CTA Banner ──────────────────────────────────────────────────────────────
const CTABanner: React.FC = () => (
  <section className="py-16 px-6">
    <div className="max-w-4xl mx-auto">
      <div className="bg-[#1A2F2F] rounded-3xl p-10 md:p-14 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#E8541A] rounded-full translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full -translate-x-1/3 translate-y-1/3" />
        </div>
        <div className="relative">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to build smarter?
          </h2>
          <p className="text-white/60 mb-8 max-w-md mx-auto">
            Join developers who use TechPilot to make confident tech decisions every day.
          </p>
          <Link
            to="/signup"
            className="bg-[#E8541A] text-white font-semibold px-8 py-4 rounded-xl hover:bg-[#d4481a] transition-colors inline-flex items-center gap-2 shadow-lg"
          >
            Get started for free <span>→</span>
          </Link>
        </div>
      </div>
    </div>
  </section>
);

// ─── Footer ──────────────────────────────────────────────────────────────────
const Footer: React.FC = () => (
  <footer className="border-t border-[#1A2F2F]/8 py-12 px-6">
    <div className="max-w-7xl mx-auto">
      <div className="grid md:grid-cols-4 gap-8 mb-10">
        <div className="md:col-span-2">
          <Logo />
          <p className="text-[#1A2F2F]/50 text-sm mt-3 max-w-xs leading-relaxed">
            Your AI-powered building compass. Choose the right technology for every project.
          </p>
        </div>
        <div>
          <div className="font-semibold text-[#1A2F2F] text-sm mb-3">Product</div>
          <div className="space-y-2">
            {['Features', 'How it works', 'Pricing', 'Changelog'].map(l => (
              <div key={l}>
                <a href="#" className="text-[#1A2F2F]/50 text-sm hover:text-[#1A2F2F] transition-colors">
                  {l}
                </a>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="font-semibold text-[#1A2F2F] text-sm mb-3">Company</div>
          <div className="space-y-2">
            {['About', 'Blog', 'Contact', 'Privacy Policy'].map(l => (
              <div key={l}>
                <a href="#" className="text-[#1A2F2F]/50 text-sm hover:text-[#1A2F2F] transition-colors">
                  {l}
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-[#1A2F2F]/8 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-[#1A2F2F]/40 text-xs">
          © 2024 TechPilot by Rocky. All rights reserved.
        </div>
        <div className="flex gap-4">
          {['Twitter', 'GitHub', 'LinkedIn'].map(s => (
            <a key={s} href="#" className="text-[#1A2F2F]/40 text-xs hover:text-[#1A2F2F] transition-colors">
              {s}
            </a>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

// ─── LandingPage (default export) ────────────────────────────────────────────
const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F5F3EE]">
      <Navbar />
      <HeroSection />
      <HowItWorksSection />
      <FeaturesSection />
      <ExampleSection />
      <WhySection />
      <CTABanner />
      <Footer />
    </div>
  );
};

export default LandingPage;
