import { useState, useEffect } from 'react'
import type { Activity } from './activities'

function BreathingGame({ duration, inhaleTime, exhaleTime, onComplete }: any) {
    const [timeLeft, setTimeLeft] = useState(duration)
    const [phase, setPhase] = useState('Inhale')
    const [scaleClass, setScaleClass] = useState('')

    useEffect(() => {
        if (timeLeft <= 0) {
            onComplete()
            return
        }
        const timer = setInterval(() => setTimeLeft((t: number) => t - 1), 1000)
        return () => clearInterval(timer)
    }, [timeLeft, onComplete])

    useEffect(() => {
        const startTimeout = setTimeout(() => {
            setScaleClass('inhale')
        }, 100)

        const pattern = setInterval(() => {
            setPhase(p => {
                const next = p === 'Inhale' ? 'Exhale' : 'Inhale'
                setScaleClass(next.toLowerCase())
                return next
            })
        }, inhaleTime * 1000)

        return () => {
            clearTimeout(startTimeout)
            clearInterval(pattern)
        }
    }, [inhaleTime, exhaleTime])

    const m = Math.floor(timeLeft / 60)
    const s = (timeLeft % 60).toString().padStart(2, '0')

    return (
        <div className="mechanic-container">
            <div className={`breathing-circle ${scaleClass}`} style={{ transitionDuration: `${phase === 'Inhale' ? inhaleTime : exhaleTime}s` }}>
                <span className="phase-text">{phase}</span>
            </div>
            <div className="timer-text">{timeLeft > 0 ? `${m}:${s}` : 'Done'}</div>
        </div>
    )
}

function PromptGame({ prompts, onComplete }: any) {
    const [idx, setIdx] = useState(0)

    return (
        <div className="mechanic-container">
            <p className="prompt-text" style={{ fontSize: '1.25rem', margin: '2rem 0', minHeight: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {prompts[idx]}
            </p>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                {idx > 0 && <button className="primary-btn" style={{ marginTop: 0, width: 'auto' }} onClick={() => setIdx(idx - 1)}>Back</button>}
                {idx < prompts.length - 1 ? (
                    <button className="primary-btn" style={{ marginTop: 0, width: 'auto' }} onClick={() => setIdx(idx + 1)}>Next</button>
                ) : (
                    <button className="primary-btn" style={{ marginTop: 0, width: 'auto', background: 'rgba(120,255,150,0.2)', color: '#aaffaa', borderColor: '#aaffaa' }} onClick={onComplete}>Finish</button>
                )}
            </div>
        </div>
    )
}

function TappingGame({ targetTaps, onComplete }: any) {
    const [taps, setTaps] = useState(0)
    const [pulsing, setPulsing] = useState(false)

    useEffect(() => {
        const interval = setInterval(() => {
            setPulsing(true)
            setTimeout(() => setPulsing(false), 800)
        }, 2000)
        return () => clearInterval(interval)
    }, [])

    const handleTap = () => {
        if (pulsing) {
            const newTaps = taps + 1
            setTaps(newTaps)
            if (newTaps >= targetTaps) onComplete()
        }
    }

    return (
        <div className="mechanic-container">
            <p className="game-instruction" style={{ marginBottom: '0' }}>Tap the circle when it expands.</p>
            <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)', marginBottom: '3rem' }}>Taps: {taps} / {targetTaps}</p>
            <button
                onClick={handleTap}
                className="tap-circle"
                style={{
                    width: '120px', height: '120px', borderRadius: '50%', border: 'none',
                    background: pulsing ? 'rgba(159, 168, 255, 0.4)' : 'rgba(159, 168, 255, 0.1)',
                    transform: pulsing ? 'scale(1.2)' : 'scale(1)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white'
                }}
            >
                TAP
            </button>
        </div>
    )
}

function JournalGame({ prompt, onComplete }: any) {
    const [text, setText] = useState('')

    return (
        <div className="mechanic-container" style={{ width: '100%' }}>
            <p style={{ marginBottom: '1rem', fontWeight: 500 }}>{prompt}</p>
            <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="Type here..."
                rows={4}
                style={{
                    width: '100%', padding: '1rem', borderRadius: '12px',
                    background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.2)',
                    color: 'white', resize: 'none', marginBottom: '1.5rem', fontFamily: 'inherit'
                }}
            />
            <button className="primary-btn" style={{ marginTop: 0 }} onClick={onComplete} disabled={text.length < 5}>
                Submit & Release
            </button>
        </div>
    )
}

function FocusGame({ duration, onComplete }: any) {
    const [timeLeft, setTimeLeft] = useState(duration)

    useEffect(() => {
        if (timeLeft <= 0) {
            onComplete()
            return
        }
        const timer = setInterval(() => setTimeLeft((t: number) => t - 1), 1000)
        return () => clearInterval(timer)
    }, [timeLeft, onComplete])

    return (
        <div className="mechanic-container">
            <p className="game-instruction">Track the glowing dot with your eyes.</p>
            <div className="focus-track" style={{ width: '100%', height: '150px', position: 'relative', overflow: 'hidden', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <div className="focus-dot" style={{
                    width: '20px', height: '20px', borderRadius: '50%',
                    background: '#9fa8ff', boxShadow: '0 0 15px #9fa8ff',
                    position: 'absolute', top: '50%',
                    animation: 'focusMove 4s infinite alternate ease-in-out'
                }} />
            </div>
            <div className="timer-text" style={{ marginTop: '2rem' }}>{timeLeft}s</div>
        </div>
    )
}


export function ActivityContainer({ activity, onClose }: { activity: Activity, onClose: () => void }) {
    const [isDone, setIsDone] = useState(false)

    // Render the correct mechanic based on activity ID
    const renderMechanic = () => {
        switch (activity.id) {
            // Breathing Mechanics
            case 'mindfulness-90':
                return <BreathingGame duration={90} inhaleTime={4} exhaleTime={4} onComplete={() => setIsDone(true)} />
            case 'coherent-breath-3':
                return <BreathingGame duration={180} inhaleTime={5} exhaleTime={5} onComplete={() => setIsDone(true)} />
            case 'dark-meditation':
                return <BreathingGame duration={120} inhaleTime={6} exhaleTime={6} onComplete={() => setIsDone(true)} />

            // Tap Mechanics
            case 'pulse-match':
            case 'rhythm-runner':
            case 'blink-counter':
                return <TappingGame targetTaps={10} onComplete={() => setIsDone(true)} />

            // Input Mechanics
            case 'journal-flash':
                return <JournalGame prompt="Write 2 short, neutral sentences about what is stressing you right now." onComplete={() => setIsDone(true)} />

            // Focus Tracking
            case 'focus-lock':
            case 'distance-gaze':
                return <FocusGame duration={60} onComplete={() => setIsDone(true)} />

            // Prompts mechanics (default/fallback for many)
            case 'threat-reframe':
                return <PromptGame onComplete={() => setIsDone(true)} prompts={[
                    "Acknowledge the stressor.",
                    "Is this a true emergency, or just uncomfortable?",
                    "What is one small step you can take?",
                    "Release the tension in your jaw."
                ]} />
            case 'stretch-seq':
                return <PromptGame onComplete={() => setIsDone(true)} prompts={[
                    "Gently rotate your neck clockwise.",
                    "Rotate your neck counter-clockwise.",
                    "Roll your shoulders backwards 5 times.",
                    "Take a deep breath and let it out."
                ]} />
            case 'micro-walk':
            case 'micro-walk-spinal':
                return <PromptGame onComplete={() => setIsDone(true)} prompts={[
                    "Stand up from your current space.",
                    "Walk consistently for the next 3 minutes.",
                    "Notice your breathing as you move."
                ]} />
            case 'body-scan':
                return <PromptGame onComplete={() => setIsDone(true)} prompts={[
                    "Focus your attention on your toes.",
                    "Move awareness to your calves.",
                    "Feel the tension in your thighs, and release it.",
                    "Notice your stomach.",
                    "Relax your chest and shoulders.",
                    "Unclench your jaw."
                ]} />
            case 'grounding-54321':
                return <PromptGame onComplete={() => setIsDone(true)} prompts={[
                    "Look around and name 5 things you can see.",
                    "Name 4 things you can physically feel.",
                    "Name 3 things you can hear right now.",
                    "Name 2 things you can smell.",
                    "Name 1 thing you can taste."
                ]} />
            case 'posture-check':
                return <PromptGame onComplete={() => setIsDone(true)} prompts={[
                    "Sit up straight.",
                    "Drop your shoulders away from your ears.",
                    "Unclench your jaw.",
                    "Rest your hands softly in your lap."
                ]} />
            case 'cold-reset':
                return <PromptGame onComplete={() => setIsDone(true)} prompts={[
                    "Go to a sink and get cold water.",
                    "Splash it on your face.",
                    "Hold a cold towel to your neck for 10 seconds."
                ]} />

            default:
                // Catch all if I missed any
                return <BreathingGame duration={60} inhaleTime={4} exhaleTime={4} onComplete={() => setIsDone(true)} />
        }
    }

    // Dynamic overlay styling based on activity
    const isDark = activity.id === 'dark-meditation'
    const overlayBg = isDark ? 'rgba(0, 0, 0, 0.98)' : 'rgba(5, 5, 10, 0.95)'

    return (
        <div className="game-overlay" style={{ background: overlayBg }}>
            <div className="game-container">
                <button className="close-game-btn" onClick={onClose}>✕</button>
                <h2>{activity.title}</h2>
                <p className="game-instruction">{activity.blurb}</p>

                {!isDone ? (
                    renderMechanic()
                ) : (
                    <div className="mechanic-container">
                        <h3 style={{ color: '#aaffaa', marginBottom: '1rem' }}>Session Complete!</h3>
                        <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '2rem' }}>You have successfully completed the regulation activity.</p>
                        <button className="primary-btn" onClick={onClose}>Return to Brain Viewer</button>
                    </div>
                )}
            </div>
        </div>
    )
}
