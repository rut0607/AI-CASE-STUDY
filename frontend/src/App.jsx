import React, { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Analyzer from './pages/Analyzer'
import Results from './pages/Results'
import WhatIf from './pages/WhatIf'
import KnowledgeGraph from './pages/KnowledgeGraph'
import { CDTContext } from './store/CDTContext'

export default function App() {
  const [analysisResult, setAnalysisResult] = useState(null)
  const [studentInput, setStudentInput] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  return (
    <CDTContext.Provider value={{
      analysisResult, setAnalysisResult,
      studentInput, setStudentInput,
      isAnalyzing, setIsAnalyzing
    }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="analyze" element={<Analyzer />} />
            <Route path="results" element={<Results />} />
            <Route path="whatif" element={<WhatIf />} />
            <Route path="knowledge" element={<KnowledgeGraph />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </CDTContext.Provider>
  )
}
