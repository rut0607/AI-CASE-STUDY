# Cognitive Digital Twin — AI Academic Life Simulator & Advisor

A hybrid AI system integrating **6 distinct AI paradigms** into a unified academic intelligence platform with a professional React + Vite frontend.

---

## Project Structure

```
cdt-project/
├── frontend/               ← React + Vite frontend
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx       ← Overview & module cards
│   │   │   ├── Analyzer.jsx        ← Student input form
│   │   │   ├── Results.jsx         ← Full CDT analysis (6 tabs)
│   │   │   ├── WhatIf.jsx          ← What-if simulation charts
│   │   │   └── KnowledgeGraph.jsx  ← Interactive semantic network
│   │   ├── components/
│   │   │   └── Layout.jsx          ← Sidebar navigation
│   │   ├── store/
│   │   │   └── CDTContext.jsx      ← Global state
│   │   └── utils/
│   │       └── mockApi.js          ← Standalone mock (no backend needed)
│   └── package.json
├── backend/
│   ├── main.py             ← FastAPI server (wraps CDT.py)
│   └── requirements.txt
├── CDT.py                  ← Your original CDT notebook code
└── README.md
```

---

## AI Modules Covered

| Module | Technology | What it does |
|--------|-----------|-------------|
| **NLP** | TF-IDF, BoW, POS, N-grams | Skill extraction from resume text |
| **ML** | PyTorch Dual-Head MLP | Predict performance & burnout |
| **Knowledge Rep** | Semantic Network, Frames, FOL | Structured domain reasoning |
| **Search** | BFS, DFS, A*, Greedy | Optimal learning path generation |
| **Expert System** | Forward Chaining | Rule-based traceable advising |
| **Agent** | PERCEIVE-REASON-ACT | 8-week monitoring simulation |

---

## Setup & Running

### Option A — Frontend Only (no backend needed)
The frontend runs completely standalone with a built-in mock computation engine.

```bash
cd frontend
npm install
npm run dev
```
Open: http://localhost:5173

### Option B — With Python Backend (full CDT pipeline)

**1. Install backend dependencies:**
```bash
cd backend
pip install -r requirements.txt
```

**2. Also install CDT dependencies (from root):**
```bash
pip install torch torchvision --index-url https://download.pytorch.org/whl/cpu
pip install nltk networkx scikit-learn matplotlib seaborn pandas numpy fastapi uvicorn
```

**3. Start backend:**
```bash
cd backend
uvicorn main:app --reload --port 8000
```

**4. Start frontend (new terminal):**
```bash
cd frontend
npm install
npm run dev
```

The frontend auto-detects the backend — if `/api/analyze` responds, it uses the real CDT pipeline. Otherwise it falls back to the built-in mock.

---

## Features

### Dashboard
- System overview with module cards
- Stats: 6 AI modules, ~15K parameters, 10 expert rules, 16 features

### Analyzer
- Live-updating student profile preview with quick health assessment
- Sliders for all 16 input features across Academic, Wellbeing, and Goal categories
- Resume text input for NLP skill extraction

### Results (6 tabbed modules)
- **ML Predictions**: Performance & burnout probability bar charts + MLP architecture display
- **NLP Analysis**: TF-IDF vs BoW comparison, skill chips, tokenization pipeline
- **Expert System**: Forward chaining trace with all fired rules and advice
- **A* Roadmap**: Visual path + g/h/f expansion trace table + BFS/DFS comparison
- **FOL Reasoning**: First-order logic conclusions + knowledge graph skill inventory
- **Agent Monitor**: 8-week grade trajectory line chart + weekly alert cards

### What-If Simulator
- Vary any of 5 parameters across full range
- 3 simultaneous charts: Performance, Burnout Risk, Pass Probability
- Auto-computed "sweet spot" and optimization insights

### Knowledge Graph
- Interactive SVG semantic network (21 nodes, 32 edges)
- Click nodes to explore connections and properties
- Filter by subject/skill/career type
- FOL rule and Frame representation panel

---

## Design System

- **Theme**: Dark industrial-futuristic with amber/gold accent
- **Fonts**: Bebas Neue (display) + DM Sans (body) + Space Mono (code/data)
- **Colors**: `#f5c842` gold · `#4dd9e0` cyan · `#52d68a` green · `#e85454` red
- **Grid**: 48px background grid texture
