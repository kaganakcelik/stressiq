import { useMemo, useState } from 'react'
import './App.css'
import { BrainViewer } from './BrainViewer'
import type { BrainRegion, Activity } from './activities'
import { ACTIVITIES_BY_REGION } from './activities'

function prettyRegion(r: BrainRegion) {
  return r.charAt(0) + r.slice(1).toLowerCase()
}

function App() {
  const [selectedRegion, setSelectedRegion] = useState<BrainRegion | null>(null)

  const activities: Activity[] = useMemo(() => {
    if (!selectedRegion) return []
    return ACTIVITIES_BY_REGION[selectedRegion] ?? []
  }, [selectedRegion])

  return (
    <div className="app-root">
      <main className="app-main">
        <BrainViewer onSelectRegion={setSelectedRegion} />

        {/* Side panel */}
        <aside className={`side-panel ${selectedRegion ? 'open' : ''}`}>
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
                      onClick={() => {
                        // Later: route to mini-game / launch modal
                        alert(`Start: ${a.title}`)
                      }}
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
    </div>
  )
}

export default App
