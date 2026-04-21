// Mock API that computes CDT analysis results locally
// This allows the frontend to work standalone without the Python backend

export function analyzeMock(form) {
  const s = form

  // ---- Performance label ----
  const score = (s.cgpa / 10) * 0.4 + (s.exam_score / 100) * 0.35 + (s.attendance / 100) * 0.25
  let performanceLabel, perfProbs
  if (score >= 0.80) {
    performanceLabel = 'Excellent'
    perfProbs = { 'At-Risk': 0.03, Average: 0.07, Good: 0.15, Excellent: 0.75 }
  } else if (score >= 0.65) {
    performanceLabel = 'Good'
    perfProbs = { 'At-Risk': 0.05, Average: 0.15, Good: 0.65, Excellent: 0.15 }
  } else if (score >= 0.50) {
    performanceLabel = 'Average'
    perfProbs = { 'At-Risk': 0.15, Average: 0.60, Good: 0.18, Excellent: 0.07 }
  } else {
    performanceLabel = 'At-Risk'
    perfProbs = { 'At-Risk': 0.70, Average: 0.20, Good: 0.07, Excellent: 0.03 }
  }

  // ---- Burnout risk ----
  let burnoutScore = 0
  if (s.study_hours_per_week > 50) burnoutScore += 2
  else if (s.study_hours_per_week > 35) burnoutScore += 1
  if (s.sleep_hours < 5) burnoutScore += 2
  else if (s.sleep_hours < 6) burnoutScore += 1
  if (s.mental_health_score < 4) burnoutScore += 2
  else if (s.mental_health_score < 6) burnoutScore += 1
  if (s.extracurricular === 2 && s.study_hours_per_week > 40) burnoutScore += 1

  let burnoutLabel, burnoutProbs
  if (burnoutScore >= 4) {
    burnoutLabel = 'High'
    burnoutProbs = { Low: 0.05, Medium: 0.20, High: 0.75 }
  } else if (burnoutScore >= 2) {
    burnoutLabel = 'Medium'
    burnoutProbs = { Low: 0.20, Medium: 0.60, High: 0.20 }
  } else {
    burnoutLabel = 'Low'
    burnoutProbs = { Low: 0.75, Medium: 0.20, High: 0.05 }
  }

  // ---- Pass probability ----
  const raw = (s.exam_score / 100) * 0.5 + (s.attendance / 100) * 0.3 + (s.assignment_score / 100) * 0.2
  const passProb = Math.min(Math.max(raw, 0), 1).toFixed(3)

  // ---- NLP: skill extraction ----
  const SKILL_POOL = ['Python', 'Machine Learning', 'Data Analysis', 'SQL', 'Java',
    'Deep Learning', 'NLP', 'Computer Vision', 'Statistics', 'R',
    'TensorFlow', 'PyTorch', 'Hadoop', 'Spark', 'Tableau',
    'Project Management', 'Communication', 'Leadership', 'Teamwork',
    'Research', 'C++', 'Web Development', 'Cloud Computing', 'Docker']
  const textLower = s.resume_text.toLowerCase()
  const extractedSkills = SKILL_POOL.filter(sk => textLower.includes(sk.toLowerCase()))

  // Token count approximation
  const tokens = s.resume_text.toLowerCase()
    .replace(/[^a-z\s]/g, '').split(/\s+/).filter(t => t.length > 2)
  const stopwords = new Set(['and', 'the', 'for', 'with', 'from', 'that', 'have',
    'this', 'are', 'been', 'has', 'not', 'but', 'they', 'their', 'also', 'can'])
  const filteredTokens = tokens.filter(t => !stopwords.has(t))

  // TF-IDF simulation
  const freq = {}
  filteredTokens.forEach(t => { freq[t] = (freq[t] || 0) + 1 })
  const topTFIDF = Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([word, count]) => ({ word, bow: count, tfidf: parseFloat((count * 0.3 + Math.random() * 0.2).toFixed(4)) }))

  const bigrams = []
  for (let i = 0; i < Math.min(filteredTokens.length - 1, 5); i++) {
    bigrams.push(`${filteredTokens[i]} ${filteredTokens[i + 1]}`)
  }
  const trigrams = []
  for (let i = 0; i < Math.min(filteredTokens.length - 2, 3); i++) {
    trigrams.push(`${filteredTokens[i]} ${filteredTokens[i + 1]} ${filteredTokens[i + 2]}`)
  }

  // ---- FOL conclusions ----
  const fol_conclusions = []
  if (s.cgpa < 6.0) fol_conclusions.push({
    rule: 'R1: ∀x [CGPA(x) < 6.0 → AcademicRisk(x)]',
    conclusion: 'ACADEMIC_RISK_HIGH',
    explanation: `CGPA=${s.cgpa} is below threshold 6.0`
  })
  if (s.attendance < 75) fol_conclusions.push({
    rule: 'R2: ∀x [Attendance(x) < 75 → FailRisk(x)]',
    conclusion: 'FAIL_RISK',
    explanation: `Attendance=${s.attendance}% is below safe threshold 75%`
  })
  if (s.study_hours_per_week > 50 && s.sleep_hours < 5) fol_conclusions.push({
    rule: 'R5: ∀x [StudyHours(x)>50 ∧ Sleep(x)<5 → BurnoutRisk(x)]',
    conclusion: 'BURNOUT_IMMINENT',
    explanation: `Extreme study load (${s.study_hours_per_week}h/wk) with insufficient sleep (${s.sleep_hours}h/night)`
  })

  // Career skill requirements
  const CAREER_SKILLS = {
    'Data Scientist': ['Python', 'SQL', 'Statistics'],
    'ML Engineer': ['Python', 'PyTorch', 'Deep Learning'],
    'AI Researcher': ['Python', 'Research', 'NLP'],
    'Software Engineer': ['Python', 'C++', 'Data Analysis'],
    'Data Analyst': ['SQL', 'Statistics', 'Tableau'],
  }
  const careerSkills = CAREER_SKILLS[s.goal] || []
  const skillGaps = careerSkills.filter(sk => !extractedSkills.includes(sk))

  // ---- A* roadmap ----
  const CAREER_PATHS = {
    'Data Scientist': ['Start', 'Mathematics', 'Statistics', 'Machine Learning', 'Data Scientist Goal'],
    'ML Engineer': ['Start', 'Mathematics', 'Programming', 'Data Structures', 'Algorithms', 'Machine Learning', 'Deep Learning', 'ML Engineer Goal'],
    'AI Researcher': ['Start', 'Mathematics', 'Statistics', 'Machine Learning', 'NLP', 'AI Researcher Goal'],
    'Software Engineer': ['Start', 'Programming', 'Data Structures', 'Algorithms', 'Software Engineer Goal'],
    'Data Analyst': ['Start', 'Programming', 'Databases', 'Data Analyst Goal'],
  }
  const roadmapPath = CAREER_PATHS[s.goal] || CAREER_PATHS['Data Scientist']
  const roadmapCost = (roadmapPath.length * 0.65).toFixed(2)

  // BFS / DFS paths
  const bfsPath = roadmapPath.slice(0, -1).concat(['Data Scientist Goal'])
  const dfsPath = ['Start', 'Mathematics', 'Linear Algebra', 'Machine Learning', s.goal + ' Goal'].filter((_, i, a) => a.indexOf(_) === i)

  // A* trace
  const astarTrace = roadmapPath.slice(0, -1).map((node, i) => ({
    node,
    g: parseFloat((i * 0.65).toFixed(3)),
    h: parseFloat(((roadmapPath.length - i) * 0.5).toFixed(3)),
    f: parseFloat(((i * 0.65) + ((roadmapPath.length - i) * 0.5)).toFixed(3)),
  }))

  // ---- Expert system ----
  const expertRules = []
  if (s.cgpa < 5.0) expertRules.push({
    id: 'R01', name: 'Critical CGPA Alert', conclusion: 'CRITICAL_ACADEMIC_RISK',
    conditions: [{ key: 'cgpa', op: '<', threshold: 5.0, actual: s.cgpa, passed: true }],
    advice: 'CGPA is critically low. Immediate academic intervention required. Meet your advisor, enroll in tutoring, and reduce extracurricular load.'
  })
  if (s.cgpa < 6.5 && s.cgpa >= 5.0) expertRules.push({
    id: 'R02', name: 'Below-Average CGPA', conclusion: 'ACADEMIC_RISK_MODERATE',
    conditions: [{ key: 'cgpa', op: '<', threshold: 6.5, actual: s.cgpa, passed: true }],
    advice: 'CGPA is below average. Focus on core subjects and increase study hours.'
  })
  if (s.attendance < 75) expertRules.push({
    id: 'R03', name: 'Low Attendance Warning', conclusion: 'ATTENDANCE_RISK',
    conditions: [{ key: 'attendance', op: '<', threshold: 75, actual: s.attendance, passed: true }],
    advice: `Attendance ${s.attendance}% is below 75%. You may be barred from exams. Attend all remaining classes.`
  })
  if (s.study_hours_per_week > 55 && s.sleep_hours < 5.5) expertRules.push({
    id: 'R04', name: 'Burnout Risk — Overworking', conclusion: 'BURNOUT_HIGH',
    conditions: [
      { key: 'study_hours', op: '>', threshold: 55, actual: s.study_hours_per_week, passed: true },
      { key: 'sleep_hours', op: '<', threshold: 5.5, actual: s.sleep_hours, passed: true }
    ],
    advice: 'You are studying excessively with too little sleep. Reduce study load to 40-45h/week. Sleep 7-8h. Use Pomodoro technique.'
  })
  if (s.mental_health_score < 4.0) expertRules.push({
    id: 'R05', name: 'Mental Health Alert', conclusion: 'MENTAL_HEALTH_RISK',
    conditions: [{ key: 'mental_health_score', op: '<', threshold: 4, actual: s.mental_health_score, passed: true }],
    advice: 'Mental health score is low. Please reach out to the campus counseling center. Prioritize wellbeing.'
  })
  if (s.cgpa >= 8.0 && s.attendance >= 85) expertRules.push({
    id: 'R06', name: 'Strong Academic Track', conclusion: 'ON_TRACK_EXCELLENCE',
    conditions: [
      { key: 'cgpa', op: '>=', threshold: 8, actual: s.cgpa, passed: true },
      { key: 'attendance', op: '>=', threshold: 85, actual: s.attendance, passed: true }
    ],
    advice: 'Excellent performance! Consider applying for research internships, publishing papers, or competitive scholarships.'
  })
  if (s.sleep_hours < 5.0) expertRules.push({
    id: 'R10', name: 'Sleep Deprivation', conclusion: 'SLEEP_DEPRIVED',
    conditions: [{ key: 'sleep_hours', op: '<', threshold: 5, actual: s.sleep_hours, passed: true }],
    advice: 'Chronic sleep deprivation impairs memory and cognition. Prioritize 7-8 hours of sleep. Academic performance will improve.'
  })
  if (s.cgpa >= 7.0 && s.study_hours_per_week >= 20) expertRules.push({
    id: 'R09', name: 'Career Goal Alignment', conclusion: 'CAREER_READY_TRACK',
    conditions: [
      { key: 'cgpa', op: '>=', threshold: 7, actual: s.cgpa, passed: true },
      { key: 'study_hours', op: '>=', threshold: 20, actual: s.study_hours_per_week, passed: true }
    ],
    advice: 'Good CGPA and study commitment. Start building a portfolio, practice interview questions, and apply for internships.'
  })
  if (s.library_visits < 2 && s.online_course_hours < 1 && s.peer_study_sessions < 1) expertRules.push({
    id: 'R07', name: 'Low Engagement', conclusion: 'LOW_ENGAGEMENT',
    conditions: [],
    advice: 'Low academic engagement detected. Join study groups, use online platforms (Coursera, edX), and visit the library weekly.'
  })

  // ---- Agent simulation (8 weeks) ----
  const baseGrade = s.exam_score / 100
  const agent_weeks = Array.from({ length: 8 }, (_, i) => {
    const noise = (Math.random() - 0.5) * 0.1
    const trend = i < 3 ? -0.02 * i : 0.015 * (i - 3)
    const grade = Math.min(1, Math.max(0.2, baseGrade + trend + noise))
    return {
      week: i + 1,
      grade: parseFloat(grade.toFixed(3)),
      attendance: Math.min(100, Math.max(40, s.attendance + (Math.random() - 0.5) * 10 + (i < 3 ? -i : i) * 1.5)),
      alerts: i === 3 ? ['GRADE_DEVIATION', 'ATTENDANCE_DECLINE'] : i === 2 ? ['STUDY_HOURS_DECLINE'] : [],
    }
  })

  return {
    student: s.name,
    student_id: 'UI_STU001',
    input: s,
    nlp: {
      extracted_skills: extractedSkills,
      token_count: filteredTokens.length,
      tokens_sample: filteredTokens.slice(0, 12),
      bigrams,
      trigrams,
      bow_tfidf: topTFIDF,
      clean_text: filteredTokens.join(' ').slice(0, 120) + '...',
    },
    ml: {
      performance_prediction: performanceLabel,
      performance_probabilities: perfProbs,
      burnout_prediction: burnoutLabel,
      burnout_probabilities: burnoutProbs,
      pass_probability: parseFloat(passProb),
    },
    fol: {
      conclusions: fol_conclusions,
      rules_fired: fol_conclusions.length,
    },
    roadmap: {
      path: roadmapPath,
      total_cost: parseFloat(roadmapCost),
      steps: roadmapPath.length,
      bfs_path: bfsPath,
      dfs_path: dfsPath,
      astar_trace: astarTrace,
    },
    expert: {
      rules_fired: expertRules.length,
      rules: expertRules,
      conclusions: expertRules.map(r => r.conclusion),
      advice: expertRules.map(r => r.advice),
    },
    knowledge_graph: {
      career_required_skills: careerSkills,
      student_has: extractedSkills,
      skill_gaps: skillGaps,
    },
    agent: {
      weeks: agent_weeks,
    }
  }
}
