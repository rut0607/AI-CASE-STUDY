import React, { useState } from 'react'
import { Outlet, NavLink, useLocation } from 'react-router-dom'
import {
  Brain, LayoutDashboard, FlaskConical, BarChart3,
  GitBranch, Network, ChevronLeft, ChevronRight, Cpu
} from 'lucide-react'
import './Layout.css'

const NAV_ITEMS = [
  { to: '/', icon: LayoutDashboard, label: 'Overview', exact: true },
  { to: '/analyze', icon: FlaskConical, label: 'Analyze Student' },
  { to: '/results', icon: BarChart3, label: 'AI Results' },
  { to: '/whatif', icon: GitBranch, label: 'What-If Sim' },
  { to: '/knowledge', icon: Network, label: 'Knowledge Graph' },
]

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()

  return (
    <div className={`layout ${collapsed ? 'layout--collapsed' : ''}`}>
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar__header">
          <div className="sidebar__logo">
            <div className="logo-icon">
              <Brain size={20} />
            </div>
            {!collapsed && (
              <div className="logo-text">
                <span className="logo-title display-font">CDT</span>
                <span className="logo-sub">Cognitive Digital Twin</span>
              </div>
            )}
          </div>
          <button
            className="sidebar__toggle btn btn-ghost"
            onClick={() => setCollapsed(!collapsed)}
            title={collapsed ? 'Expand' : 'Collapse'}
          >
            {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>

        <div className="sidebar__status">
          <span className="status-dot active" />
          {!collapsed && <span className="status-text mono-font">SYSTEM ACTIVE</span>}
        </div>

        <nav className="sidebar__nav">
          {NAV_ITEMS.map(({ to, icon: Icon, label, exact }) => (
            <NavLink
              key={to}
              to={to}
              end={exact}
              className={({ isActive }) =>
                `nav-item ${isActive ? 'nav-item--active' : ''}`
              }
            >
              <Icon size={17} className="nav-icon" />
              {!collapsed && <span className="nav-label">{label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar__footer">
          {!collapsed && (
            <>
              <div className="footer-module-list">
                <p className="section-label">Modules</p>
                {['NLP · TF-IDF', 'MLP Neural Net', 'A* · BFS · DFS', 'Expert System', 'Agent Monitor', 'FOL Reasoning'].map(m => (
                  <div key={m} className="footer-module">
                    <Cpu size={10} />
                    <span>{m}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </aside>

      {/* Main content */}
      <main className="main-content">
        <div className="page-wrapper">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
