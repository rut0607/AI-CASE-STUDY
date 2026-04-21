import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Brain, FlaskConical, Cpu, Network, GitBranch,
  Zap, ChevronRight, BookOpen, Target, Activity, Shield
} from 'lucide-react'
import './Dashboard.css'

const MODULE_CARDS = [
  {
    icon: BookOpen,
    label: 'NLP Module',
    title: 'Text Intelligence',
    desc: 'TF-IDF, BoW, POS tagging, N-gram extraction and skill detection from resume text.',
    color: 'cyan',
    tag: 'NLTK · sklearn',
  },
  {
    icon: Brain,
    label: 'ML Engine',
    title: 'Dual-Head MLP',
    desc: 'PyTorch neural network predicting academic performance and burnout risk simultaneously.',
    color: 'gold',
    tag: 'PyTorch · 4-class',
  },
  {
    icon: Network,
    label: 'Knowledge Rep',
    title: 'Semantic Network',
    desc: 'NetworkX knowledge graph with FOL reasoning, frames, and career skill mapping.',
    color: 'purple',
    tag: 'NetworkX · FOL',
  },
  {
    icon: GitBranch,
    label: 'Search Algorithms',
    title: 'A* Roadmap',
    desc: 'BFS, DFS, A* and Greedy Best-First for optimal academic learning path generation.',
    color: 'green',
    tag: 'A* · BFS · DFS',
  },
  {
    icon: Shield,
    label: 'Expert System',
    title: 'Rule Engine',
    desc: 'Forward chaining inference with 10 production rules and full explanation trace.',
    color: 'red',
    tag: 'Forward Chain',
  },
  {
    icon: Activity,
    label: 'Agent System',
    title: 'Monitor Agent',
    desc: 'Perceive-Reason-Act loop for autonomous weekly monitoring and intervention.',
    color: 'cyan',
    tag: 'PERCEIVE·REASON·ACT',
  },
]

const STATS = [
  { label: 'AI Modules', value: '6', sub: 'Integrated' },
  { label: 'ML Parameters', value: '~15K', sub: 'Neural Net' },
  { label: 'Expert Rules', value: '10', sub: 'Production' },
  { label: 'Features', value: '16', sub: 'Engineered' },
]

export default function Dashboard() {
  const navigate = useNavigate()

  return (
    <div className="dashboard animate-fade-in">
      {/* Hero */}
      <div className="dashboard__hero">
        <div className="hero-badge badge badge-gold">
          <Zap size={10} />
          HYBRID AI SYSTEM
        </div>
        <h1 className="hero-title display-font">
          COGNITIVE<br />DIGITAL TWIN
        </h1>
        <p className="hero-subtitle">
          A unified academic intelligence platform integrating symbolic &amp; sub-symbolic AI 
          to model, predict, reason and simulate student trajectories.
        </p>
        <div className="hero-actions">
          <button className="btn btn-primary" onClick={() => navigate('/analyze')}>
            <FlaskConical size={16} />
            Start Analysis
          </button>
          <button className="btn btn-ghost" onClick={() => navigate('/knowledge')}>
            <Network size={16} />
            Explore Knowledge Graph
          </button>
        </div>

        {/* Decorative grid lines */}
        <div className="hero-decoration" aria-hidden="true">
          <div className="deco-line deco-line--h" style={{ top: '30%' }} />
          <div className="deco-line deco-line--h" style={{ top: '70%' }} />
          <div className="deco-line deco-line--v" style={{ left: '20%' }} />
          <div className="deco-line deco-line--v" style={{ left: '80%' }} />
          <div className="deco-circle" />
        </div>
      </div>

      {/* Stats row */}
      <div className="dashboard__stats">
        {STATS.map((s, i) => (
          <div key={s.label} className={`stat-card animate-fade-up delay-${i + 1}`}>
            <div className="stat-value mono-font">{s.value}</div>
            <div className="stat-label">{s.label}</div>
            <div className="stat-sub text-muted">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Section header */}
      <div className="section-header">
        <p className="section-label">AI Modules</p>
        <h2 className="section-title">Six Paradigms, One Platform</h2>
        <p className="section-desc text-secondary">
          Each module handles a distinct AI task — together they form a complete reasoning &amp; prediction pipeline.
        </p>
      </div>

      {/* Module grid */}
      <div className="modules-grid">
        {MODULE_CARDS.map((mod, i) => {
          const Icon = mod.icon
          return (
            <div key={mod.label} className={`module-card animate-fade-up delay-${(i % 3) + 1}`}>
              <div className={`module-icon module-icon--${mod.color}`}>
                <Icon size={20} />
              </div>
              <div className="module-content">
                <div className="module-top">
                  <span className="module-label text-muted mono-font">{mod.label}</span>
                  <span className={`badge badge-${mod.color === 'gold' ? 'gold' : mod.color === 'cyan' ? 'cyan' : mod.color === 'green' ? 'green' : mod.color === 'red' ? 'red' : 'purple'}`}>
                    {mod.tag}
                  </span>
                </div>
                <h3 className="module-title">{mod.title}</h3>
                <p className="module-desc text-secondary">{mod.desc}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* CTA strip */}
      <div className="dashboard__cta">
        <div className="cta-content">
          <Cpu size={24} className="text-gold" />
          <div>
            <h3>Ready to analyze your student profile?</h3>
            <p className="text-secondary">Input academic metrics and get instant AI-powered insights across all 6 modules.</p>
          </div>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/analyze')}>
          Begin Analysis <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}
