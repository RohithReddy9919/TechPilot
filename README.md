# TechPilot – An Adaptive AI Technology Advisor

> **Developed by Rocky Technologies**  
> *Tagline:* Your AI advisor for choosing how to build and what to use.  
> *Core message:* Tell us what you're building. We'll figure out how to build it and what to use.

---

## 🧭 Overview

**TechPilot** is an intelligent, adaptive technology advisor that helps developers, designers, and startup builders decide which technologies, AI tools, development environments, and workflows are best suited for their projects.

Rather than being a static directory of AI tools, TechPilot understands:
- The project objective and development stage
- The current task or roadblock
- The developer's skill level and language preferences
- Budget constraints (free-only, mostly free, limited paid, or no restriction)
- Existing subscriptions (avoiding redundant paid recommendations)

---

## 🎨 Visual Identity & Design System

Recreated faithfully from Rocky Technologies' design references:
- **Background:** Warm cream / off-white (`#F5F3EE`)
- **Primary Surfaces & Sidebar:** Deep dark teal (`#1A2F2F`)
- **Accent Color:** Vibrant soft orange (`#E8541A`)
- **Secondary Accents:** Soft mint (`#EAF4F3`) & Cyan (`#4FD1C5`)
- **Typography:** Modern clean sans-serif (`Inter`) with monospace uppercase tracking labels
- **Surface Elevation:** White rounded cards (`rounded-2xl`) with subtle borders and shadows

---

## 🚀 Features Implemented

### 1. Landing Page
- Sticky header with logo, navigation anchors, Login, and "Get started →" CTA
- Hero section matching reference screenshots with:
  - `• ADAPTIVE TECHNOLOGY ADVISOR` badge
  - Big headline: *"Build smarter. Choose the right technology."*
  - Dual CTAs: *"Get started →"* and *"See how it works >"*
  - Social proof with user avatars: *"Built for builders at every stage"*
  - Interactive **Dashboard Mockup Preview card** in deep dark teal with active metrics (`72% Project Momentum`, `Next Best Action`, `Live advisor`)
- How It Works (3 structured steps)
- Core Features Grid
- Curated Starting Tech Stack Showcase
- Why TechPilot comparison
- Professional footer with Rocky Technologies copyright

### 2. Authentication (Split Layout)
- **Login Page (`/login`):** Split layout with dark teal branded left panel and cream form on the right.
- **Signup Page (`/signup`):** Full name, email, and password registration with client validation and mobile-responsive stacked view.
- **Demo Mode Authentication:** Instant one-click demo login pre-configured with `you@example.com` (persisted in browser storage).

### 3. User Onboarding Wizard (`/onboarding`)
- **Step 1:** Technical skill level (Beginner → Expert) + multi-select programming languages
- **Step 2:** Preferred development workflow (Traditional, AI-assisted, Vibe coding, Low-code, No-code, Hybrid) + team size
- **Step 3:** Budget preference (Free only, Mostly free, Limited paid, No restriction) + active subscriptions to exclude redundant costs
- **Step 4:** Confirmation & automatic workspace transition

### 4. Main Dashboard (`/dashboard`)
- Date display (`MONDAY, 14 OCTOBER 2025` format)
- Personalized greeting: *"Welcome back, Rocky ✦"*
- **ASK TECHPILOT Card:** Deep teal prompt card with contextual input and *"Ask TechPilot →"* CTA
- **Recent Projects:** Pre-seeded with design-reference projects:
  - *College Event Hub* (Planning, 2/6 milestones)
  - *Smart Direction Finder* (Planning, 2/6 milestones)
  - *AI Attendance System* (In progress, 2/6 milestones)
- **Quick Actions:** Shortcuts to AI Advisor, Explore Technologies, Tool Comparisons, and Project Creation

### 5. AI Technology Advisor (`/advisor`)
- Interactive advisor interface with instant response generation
- Clear **DEMO MODE** status indicator
- Supports URL parameter auto-querying (e.g. `/advisor?q=...`)
- Link to specific projects for project-contextual advice
- Structured recommendations output:
  1. Recommended Approach (e.g., *Free-Stack Full-Stack Web App*)
  2. Reasoning and architectural trade-offs
  3. Recommended tool cards with badges, category, and direct links
  4. Suggested Next Steps numbered action list
  5. Potential compatibility warnings

### 6. Technology Recommendation Engine & Explorer (`/explore`)
- **Personalized Starting Stack Banner (`#EAF4F3`):** Filterable by *Best free*, *Affordable*, and *Best overall*
- Starting stack featured from screenshots: **Figma** (UI/UX), **React** (Frontend), **FastAPI** (Backend), **MongoDB** (Database)
- Categorized database covering 25+ modern tools (Supabase, Next.js, Cursor, Claude, Vercel, Tailwind CSS, TypeScript, Railway, etc.)
- Real-time search and category filtering chips

### 7. Tool Comparison (`/compare`)
- Select 2 to 4 tools for side-by-side comparative analysis
- Detailed matrix: Category, Purpose, Free Tier details, Pricing, Advantages (+), Limitations (−), Best Use Case
- Contextual *"Which is better for me?"* recommendation tailored to the active user's budget

### 8. Project Workspace & Detail (`/projects` & `/projects/:id`)
- Visual card grid matching reference screenshots with orange milestone progress bars
- Realistic 6-stage milestone tracker (Idea → Planning → Design → Development → Testing → Deployment)
- Inline editable current focus task
- Dedicated project advisor chat tab with project-specific memory
- Selected and rejected technology logs

### 9. Settings & Profile (`/settings`)
- Profile information management
- Technical skill level & preferred languages editor
- Budget preference & active subscription toggles
- Account security & demo state reset

### 10. Help & Support (`/help`)
- Interactive FAQ addressing advisor logic, demo vs live modes, and budget controls
- Rocky Technologies direct feedback and contact form

---

## 🛠 Tech Stack

- **Framework:** React 18 with TypeScript
- **Bundler:** Vite 5
- **Styling:** Tailwind CSS 3 with custom color tokens (`cream`, `teal`, `orange`)
- **Icons:** Lucide React
- **Routing:** React Router v6
- **Persistence:** High-reliability browser LocalStorage layer with automatic demo data seeding

---

## 💻 Quick Start & Running Locally

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or pnpm

### 1. Install dependencies
```bash
npm install
```

### 2. Start the development server
```bash
npm run dev
```
Open your browser at: **`http://localhost:5173`**

### 3. Build for production
```bash
npm run build
```

### 4. Preview production build
```bash
npm run preview
```

---

## 🔑 Demo Login Credentials

For quick evaluation without signup:
- **Email:** `you@example.com`
- **Password:** `password123` *(or any 6+ character password)*

Or simply click **"Prefill Demo Credentials"** on the login page.

---

## 🔌 Optional External Backend / Supabase Setup

TechPilot operates out of the box in **Demo Mode** with persistent browser storage. To connect a Supabase backend:

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Fill in your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   VITE_AI_API_KEY=your-gemini-or-claude-api-key
   ```
3. Run the schema migrations provided in `supabase_schema.sql` in your Supabase SQL Editor.

---

© Rocky Technologies. All rights reserved.
