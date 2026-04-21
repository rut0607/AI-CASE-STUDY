import React, { useState, useMemo } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts'
import { GitBranch, TrendingUp, Zap } from 'lucide-react'
import { useCDT } from '../store/CDTContext'
import { analyzeMock } from '../utils/mockApi'
import './WhatIf.css'

const PERF_MAP = { 'At-Risk': 0, Average: 1, Good: 2, Excellent: 3 }
const PERF_LABELS = ['At-Risk', 'Average', 'Good', 'Excellent']
const BURN_MAP = { Low: 0, Medium: 1, High: 2 }
const BURN_LABELS = ['Low', 'Medium', 'High']

const PERF_COLORS = ['#e85454', '#f5c842', '#4dd9e0', '#52d68a']
const BURN_COLORS = ['#52d68a', '#f5c842', '#e85454']

function simulate(base, param, value) {
  const s = { ...base, [param]: value }
  return analyzeMock(s)
}

const PARAMS = [
  { key: 'study_hours_per_week', label: 'Study Hours / Week', min: 5, max: 65, step: 5, unit: 'h' },
  { key: 'attendance', label: 'Attendance', min: 40, max: 100, step: 5, unit: '%' },
  { key: 'sleep_hours', label: 'Sleep Hours / Night', min: 4, max: 9, step: 0.5, unit: 'h' },
  { key: 'cgpa', label: 'CGPA', min: 2, max: 10, step: 0.5 },
  { key: 'mental_health_score', label: 'Mental Health Score', min: 1, max: 10, step: 0.5 },
]

const DEFAULT_STUDENT = {
  name: 'Demo Student', cgpa: 6.5, attendance: 75, study_hours_per_week: 25,
  assignment_score: 65, exam_score: 60, sleep_hours: 6.5, extracurricular: 1,
  mental_health_score: 6, library_visits: 3, online_course_hours: 2, peer_study_sessions: 2,
  semester: 4, goal: 'Data Scientist',
  resume_text: 'Experienced in Python and Machine Learning. SQL and Statistics.',
}

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-normal)', borderRadius: 6, padding: '10px 14px', fontSize: 12 }}>
        <p style={{ color: 'var(--text-muted)', marginBottom: 4 }}>{label}</p>
        {payload.map(p => (
          <p key={p.name} style={{ color: p.color }}>
            {p.name}: <strong>{PERF_LABELS[p.value] || BURN_LABELS[p.value] || p.value}</strong>
          </p>
        ))}
      </div>
    )
  }
  return null
}

export default function WhatIf() {
  const { studentInput } = useCDT()
  const base = studentInput || DEFAULT_STUDENT
  const [selectedParam, setSelectedParam] = useState(PARAMS[0].key)
  const param = PARAMS.find(p => p.key === selectedParam)

  const simData = useMemo(() => {
    const values = []
    for (let v = param.min; v <= param.max; v += param.step) {
      values.push(parseFloat(v.toFixed(2)))
    }
    return values.map(val => {
      const r = simulate(base, selectedParam, val)
      return {
        value: val,
        label: `${val}${param.unit || ''}`,
        perf: PERF_MAP[r.ml.performance_prediction] ?? 1,
        perfLabel: r.ml.performance_prediction,
        burn: BURN_MAP[r.ml.burnout_prediction] ?? 0,
        burnLabel: r.ml.burnout_prediction,
        passProb: parseFloat((r.ml.pass_probability * 100).toFixed(1)),
      }
    })
  }, [selectedParam, base])

  const currentVal = base[selectedParam]
  const currentSim = simulate(base, selectedParam, currentVal)

  return (
    <div className="whatif animate-fade-in">
      <div className="whatif__header">
        <div className="page-eyebrow">
          <GitBranch size={16} className="text-gold" />
          <span className="section-label">Simulation Module</span>
        </div>
        <h1 className="page-title">What-If Simulator</h1>
        <p className="page-desc text-secondary">
          Vary one student parameter and observe how the MLP model predictions change dynamically.
          Based on{' '}
          <span className="text-gold">{base.name}</span>'s profile.
        </p>
      </div>

      {/* Parameter selector */}
      <div className="param-selector card">
        <p className="section-label">Select Parameter to Vary</p>
        <div className="param-grid">
          {PARAMS.map(p => (
            <button
              key={p.key}
              className={`param-btn ${selectedParam === p.key ? 'param-btn--active' : ''}`}
              onClick={() => setSelectedParam(p.key)}
            >
              <span className="param-btn__label">{p.label}</span>
              <span className="param-btn__current mono-font">{base[p.key]}{p.unit || ''}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Current snapshot */}
      <div className="snapshot-row">
        <div className="snapshot-card card">
          <p className="section-label">Current Profile</p>
          <div className="snapshot-vals">
            <div>
              <div className="snapshot-big">{base[selectedParam]}{param.unit || ''}</div>
              <div className="snapshot-sub text-muted">{param.label}</div>
            </div>
            <div>
              <div className="snapshot-big" style={{ color: PERF_COLORS[PERF_MAP[currentSim.ml.performance_prediction]] }}>
                {currentSim.ml.performance_prediction}
              </div>
              <div className="snapshot-sub text-muted">Predicted Performance</div>
            </div>
            <div>
              <div className="snapshot-big" style={{ color: BURN_COLORS[BURN_MAP[currentSim.ml.burnout_prediction]] }}>
                {currentSim.ml.burnout_prediction}
              </div>
              <div className="snapshot-sub text-muted">Burnout Risk</div>
            </div>
            <div>
              <div className="snapshot-big text-cyan">{(currentSim.ml.pass_probability * 100).toFixed(0)}%</div>
              <div className="snapshot-sub text-muted">Pass Probability</div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="whatif-charts">
        <div className="card">
          <div className="chart-header">
            <p className="section-label">Performance vs {param.label}</p>
            <TrendingUp size={14} className="text-cyan" />
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={simData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="label" tick={{ fill: '#9098b0', fontSize: 10 }} interval={1} />
              <YAxis
                tick={{ fill: '#9098b0', fontSize: 10 }}
                domain={[0, 3]}
                ticks={[0, 1, 2, 3]}
                tickFormatter={v => PERF_LABELS[v] || v}
                width={72}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="perf"
                stroke="#f5c842"
                strokeWidth={2.5}
                dot={(props) => {
                  const { cx, cy, payload } = props
                  return <circle key={cx} cx={cx} cy={cy} r={5} fill={PERF_COLORS[payload.perf]} stroke="var(--bg-deep)" strokeWidth={2} />
                }}
                name="Performance"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div className="chart-header">
            <p className="section-label">Burnout Risk vs {param.label}</p>
            <Zap size={14} className="text-red" />
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={simData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="label" tick={{ fill: '#9098b0', fontSize: 10 }} interval={1} />
              <YAxis
                tick={{ fill: '#9098b0', fontSize: 10 }}
                domain={[0, 2]}
                ticks={[0, 1, 2]}
                tickFormatter={v => BURN_LABELS[v] || v}
                width={56}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="burn"
                stroke="#e85454"
                strokeWidth={2.5}
                dot={(props) => {
                  const { cx, cy, payload } = props
                  return <circle key={cx} cx={cx} cy={cy} r={5} fill={BURN_COLORS[payload.burn]} stroke="var(--bg-deep)" strokeWidth={2} />
                }}
                name="Burnout"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div className="chart-header">
            <p className="section-label">Pass Probability vs {param.label}</p>
            <TrendingUp size={14} className="text-green" />
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={simData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="label" tick={{ fill: '#9098b0', fontSize: 10 }} interval={1} />
              <YAxis tick={{ fill: '#9098b0', fontSize: 10 }} domain={[0, 100]} unit="%" />
              <Tooltip formatter={(v) => [`${v}%`, 'Pass Probability']} contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-normal)', fontSize: 12 }} />
              <Bar dataKey="passProb" radius={[4, 4, 0, 0]} name="Pass Prob">
                {simData.map((d, i) => (
                  <Cell key={i} fill={d.passProb >= 60 ? '#52d68a' : d.passProb >= 40 ? '#f5c842' : '#e85454'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Insights */}
      <div className="card insights-card">
        <p className="section-label">Simulation Insights</p>
        <div className="insights-grid">
          <div className="insight">
            <div className="insight-icon text-gold">📈</div>
            <div>
              <div className="insight-title">Optimal {param.label}</div>
              <div className="insight-desc text-secondary">
                {(() => {
                  const bestPerf = simData.reduce((best, d) => d.perf > best.perf ? d : best, simData[0])
                  return `Highest performance at ${bestPerf.label} — predicted ${bestPerf.perfLabel}`
                })()}
              </div>
            </div>
          </div>
          <div className="insight">
            <div className="insight-icon text-green">🛡️</div>
            <div>
              <div className="insight-title">Lowest Burnout Point</div>
              <div className="insight-desc text-secondary">
                {(() => {
                  const safest = simData.reduce((best, d) => d.burn < best.burn ? d : best, simData[0])
                  return `Lowest burnout at ${safest.label} — risk ${safest.burnLabel}`
                })()}
              </div>
            </div>
          </div>
          <div className="insight">
            <div className="insight-icon text-cyan">🎯</div>
            <div>
              <div className="insight-title">Sweet Spot</div>
              <div className="insight-desc text-secondary">
                {(() => {
                  const balanced = simData.reduce((best, d) => {
                    const score = d.perf * 2 - d.burn
                    const bestScore = best.perf * 2 - best.burn
                    return score > bestScore ? d : best
                  }, simData[0])
                  return `Best balance at ${balanced.label} — ${balanced.perfLabel} performance, ${balanced.burnLabel} burnout`
                })()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
