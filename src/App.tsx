import { useMemo, useState } from 'react'
import './App.css'
import { BrainViewer, REGION_KEYS } from './BrainViewer'
import { ActivityContainer } from './ActivityContainer'
import { LandingPage } from './LandingPage'
import type { BrainRegion, Activity } from './activities'
import { ACTIVITIES_BY_REGION } from './activities'
// @ts-expect-error - index.js is a plain JS file
import { calculate_neuro_interface_values } from './index'

function prettyRegion(r: BrainRegion) {
  return r.charAt(0) + r.slice(1).toLowerCase()
}

function App() {
  const [showLanding, setShowLanding] = useState(true)
  const [selectedRegion, setSelectedRegion] = useState<BrainRegion | null>(null)
  const [activeGame, setActiveGame] = useState<Activity | null>(null)
  const [colorIndices, setColorIndices] = useState<number[]>(() => {
    const college_stress = {
      rmssd: 15,
      sdnn: 25,
      resp_rate: 28,
      spo2: 95,
      heart_rate: 115
    };

    const high_respiratory = {
      rmssd: 10,
      sdnn: 18,
      resp_rate: 42,
      spo2: 94,
      heart_rate: 165
    };

    const normal = {
      rmssd: 50,
      sdnn: 65,
      resp_rate: 14,
      spo2: 98,
      heart_rate: 65
    };
    const results = calculate_neuro_interface_values(college_stress);
    return [
      results.Temporal,
      results.Cerebellum,
      results.Frontal,
      results.Parietal,
      results.Occipital,
      results.Global_S
    ];
  })

  const handleGameComplete = () => {
    if (!selectedRegion) return
    const regionIdx = REGION_KEYS.indexOf(selectedRegion as any)
    if (regionIdx !== -1) {
      const newIndices = [...colorIndices]
      newIndices[regionIdx] = Math.max(0, newIndices[regionIdx] - 0.4)
      setColorIndices(newIndices)
    }
  }

  const activities: Activity[] = useMemo(() => {
    if (!selectedRegion) return []
    return ACTIVITIES_BY_REGION[selectedRegion] ?? []
  }, [selectedRegion])

  return (
    <div className="app-root">
      {showLanding ? (
        <LandingPage onScanComplete={() => setShowLanding(false)} />
      ) : (
        <main className="app-main">
          <div style={{ display: activeGame ? 'none' : 'block', width: '100%', height: '100%' }}>
            <BrainViewer
              onSelectRegion={setSelectedRegion}
              showLabels={!activeGame}
              colorIndices={colorIndices}
            />
          </div>

          {activeGame && (
            <ActivityContainer
              activity={activeGame}
              onClose={() => {
                handleGameComplete()
                setActiveGame(null)
              }}
            />
          )}

          {/* Side panel */}
          <aside className={`side-panel ${selectedRegion && !activeGame ? 'open' : ''}`}>
            <div className="side-panel-header">
              <div>
                <h2>{selectedRegion ? prettyRegion(selectedRegion) : 'Region'}</h2>
                <p>Activities for this region</p>
              </div>
              <button
                className="icon-btn"
                onClick={() => setSelectedRegion(null)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="side-panel-content">
              {!selectedRegion ? (
                <div className="empty-state">
                  Click a label on the brain to see activities.
                </div>
              ) : (
                <ul className="activity-list">
                  {activities.map((a) => (
                    <li key={a.id} className="activity-card">
                      <div className="activity-top">
                        <div>
                          <h3>{a.title}</h3>
                          <p>{a.blurb}</p>
                          {a.goalMetric ? (
                            <span className="metric-chip">{a.goalMetric}</span>
                          ) : null}
                        </div>
                      </div>
                      <button
                        className="primary-btn"
                        onClick={() => setActiveGame(a)}
                      >
                        Let’s go
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </aside>
        </main>
      )}
    </div>
  )
}

export default App
