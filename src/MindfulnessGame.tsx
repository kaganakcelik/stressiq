import { useState, useEffect } from 'react'

export function MindfulnessGame({ onClose, title }: { onClose: () => void, title: string }) {
    const [timeLeft, setTimeLeft] = useState(90)
    const [phase, setPhase] = useState('Inhale')
    const [scaleClass, setScaleClass] = useState('')

    useEffect(() => {
        if (timeLeft <= 0) return
        const timer = setInterval(() => {
            setTimeLeft(t => t - 1)
        }, 1000)
        return () => clearInterval(timer)
    }, [timeLeft])

    useEffect(() => {
        const startTimeout = setTimeout(() => {
            setScaleClass('inhale')
        }, 100)

        // 4s inhale, 4s exhale pattern
        const pattern = setInterval(() => {
            setPhase(p => {
                const next = p === 'Inhale' ? 'Exhale' : 'Inhale'
                setScaleClass(next.toLowerCase())
                return next
            })
        }, 4000)

        return () => {
            clearTimeout(startTimeout)
            clearInterval(pattern)
        }
    }, [])

    const minutes = Math.floor(timeLeft / 60)
    const seconds = (timeLeft % 60).toString().padStart(2, '0')

    return (
        <div className="game-overlay">
            <div className="game-container">
                <button className="close-game-btn" onClick={onClose}>✕</button>
                <h2>{title}</h2>
                <p className="game-instruction">Focus on your breathing to restore your regulatory control.</p>

                <div className={`breathing-circle ${scaleClass}`}>
                    <span className="phase-text">{phase}</span>
                </div>

                <div className="timer-text">
                    {timeLeft > 0 ? `${minutes}:${seconds}` : 'Session Complete!'}
                </div>

                {timeLeft <= 0 && (
                    <button className="primary-btn mt-4" onClick={onClose}>Return to Brain Viewer</button>
                )}
            </div>
        </div>
    )
}
