import { useState, useEffect } from 'react'

interface LandingPageProps {
    onScanComplete: () => void
}

export function LandingPage({ onScanComplete }: LandingPageProps) {
    const [scanning, setScanning] = useState(false)
    const [progress, setProgress] = useState(0)
    const [done, setDone] = useState(false)

    useEffect(() => {
        if (!scanning) return
        if (progress >= 100) {
            setDone(true)
            setTimeout(onScanComplete, 700)
            return
        }
        const t = setTimeout(() => setProgress(p => Math.min(100, p + 2)), 300)
        return () => clearTimeout(t)
    }, [scanning, progress, onScanComplete])

    const handleStart = () => {
        if (!scanning) setScanning(true)
    }

    // Circumference of the circle (r=82 for 180px button)
    const circumference = 2 * Math.PI * 82
    const strokeDash = circumference - (circumference * progress) / 100

    return (
        <div style={{
            width: '100%',
            height: '100vh',
            background: '#05050a',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
            fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        }}>

            {/* Subtle radial glow in background */}
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '600px',
                height: '600px',
                background: 'radial-gradient(ellipse at center, rgba(84,160,255,0.06) 0%, transparent 70%)',
                pointerEvents: 'none',
            }} />

            {/* Connected pill badge at top */}
            <div style={{
                position: 'absolute',
                top: '32px',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '999px',
                padding: '6px 16px',
                fontSize: '13px',
                color: 'rgba(255,255,255,0.8)',
                backdropFilter: 'blur(8px)',
            }}>
                <span style={{
                    width: '8px', height: '8px', borderRadius: '50%',
                    background: '#1dd1a1',
                    boxShadow: '0 0 8px #1dd1a1',
                    display: 'inline-block',
                }} />
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1dd1a1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="4" />
                    <path d="M8 12h8M12 8v8" />
                </svg>
                Connected to Apple Watch
            </div>

            {/* Center content */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
                {/* Logo */}
                <h1 style={{ margin: 0, fontSize: '3rem', fontWeight: 700, letterSpacing: '-0.5px', color: 'white' }}>
                    Stress<span style={{ color: '#54a0ff' }}>IQ</span>
                </h1>

                {/* Tagline */}
                <p style={{
                    margin: 0,
                    maxWidth: '300px',
                    textAlign: 'center',
                    fontSize: '15px',
                    lineHeight: 1.6,
                    color: 'rgba(255,255,255,0.45)',
                }}>
                    Tap <strong style={{ color: 'rgba(255,255,255,0.75)', fontWeight: 600 }}>Start Scan</strong> to read your biomarkers via Apple Watch.
                    StressIQ analyzes respiratory rate, HRV, and more to identify stressed areas of the brain.
                </p>
            </div>

            {/* Scan button */}
            <button
                onClick={handleStart}
                disabled={scanning}
                style={{
                    position: 'relative',
                    width: '180px',
                    height: '180px',
                    borderRadius: '50%',
                    border: 'none',
                    background: 'transparent',
                    cursor: scanning ? 'default' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    outline: 'none',
                }}
            >
                {/* Static dark circle background */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '50%',
                    background: scanning
                        ? 'rgba(84,160,255,0.08)'
                        : 'rgba(255,255,255,0.06)',
                    border: scanning ? '1px solid rgba(84,160,255,0.25)' : '1px solid rgba(255,255,255,0.12)',
                    transition: 'all 0.4s ease',
                }} />

                {/* SVG progress ring */}
                {scanning && (
                    <svg
                        width="180" height="180"
                        style={{ position: 'absolute', inset: 0, transform: 'rotate(-90deg)' }}
                    >
                        {/* Track */}
                        <circle cx="90" cy="90" r="82" fill="none" stroke="rgba(84,160,255,0.1)" strokeWidth="4" />
                        {/* Progress */}
                        <circle
                            cx="90" cy="90" r="82"
                            fill="none"
                            stroke={done ? '#1dd1a1' : '#54a0ff'}
                            strokeWidth="4"
                            strokeLinecap="round"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDash}
                            style={{ transition: 'stroke-dashoffset 0.04s linear, stroke 0.4s ease' }}
                        />
                    </svg>
                )}

                {/* Label */}
                <span style={{
                    position: 'relative',
                    zIndex: 1,
                    fontSize: '18px',
                    fontWeight: 600,
                    color: done ? '#1dd1a1' : scanning ? '#54a0ff' : 'rgba(255,255,255,0.85)',
                    letterSpacing: '0.01em',
                    transition: 'color 0.3s ease',
                }}>
                    {done ? 'Done!' : scanning ? `${progress}%` : 'Start Scan'}
                </span>
            </button>

            {/* Scanning hint text */}
            {scanning && !done && (
                <p style={{
                    marginTop: '24px',
                    fontSize: '12px',
                    color: 'rgba(255,255,255,0.35)',
                    letterSpacing: '0.04em',
                    animation: 'fadeInUp 0.4s ease',
                }}>
                    Reading biometrics…
                </p>
            )}

            <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </div>
    )
}
