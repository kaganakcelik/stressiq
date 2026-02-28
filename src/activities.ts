// src/activities.ts
export type BrainRegion =
  | 'TEMPORAL'
  | 'CEREBELLUM'
  | 'FRONTAL'
  | 'PARIETAL'
  | 'OCCIPITAL'
  | 'SPINAL'

export type Activity = {
  id: string
  title: string
  blurb: string
  goalMetric?: string // optional label like "HF ↑ / RMSSD ↑"
}

export const ACTIVITIES_BY_REGION: Record<BrainRegion, Activity[]> = {
  TEMPORAL: [
    {
      id: 'wire-stabilizer',
      title: 'Wire Stabilizer (Breathing Sync)',
      blurb: 'Match wires on inhale/exhale cues to shift toward calm.',
      goalMetric: 'HF ↑, RMSSD ↑',
    },
    {
      id: 'threat-reframe',
      title: 'Threat Reframe',
      blurb: 'Quick reframe prompts to reduce threat response.',
      goalMetric: 'HR ↓',
    },
    {
      id: 'pulse-match',
      title: 'Pulse Match',
      blurb: 'Tap to a slow rhythm to settle arousal.',
      goalMetric: 'HR ↓, RMSSD ↑',
    },
    {
      id: 'calm-audio',
      title: 'Calm Audio Scan',
      blurb: '2 minutes of guided calming audio + minimal visuals.',
      goalMetric: 'HR ↓',
    },
  ],

  CEREBELLUM: [
    {
      id: 'balance-beam',
      title: 'Balance Beam',
      blurb: 'Slow tilt/drag control game for smooth movement.',
      goalMetric: 'HR stabilizes',
    },
    {
      id: 'stretch-seq',
      title: 'Stretch Sequence',
      blurb: 'Short guided stretches with checkpoints.',
      goalMetric: 'HR ↓',
    },
    {
      id: 'rhythm-runner',
      title: 'Rhythm Runner',
      blurb: 'Match a calm cadence to regain rhythm.',
      goalMetric: 'HR stabilizes',
    },
    {
      id: 'micro-walk',
      title: 'Micro Walk',
      blurb: '3-minute walk prompt to normalize arousal.',
      goalMetric: 'LF/HF normalizes',
    },
  ],

  FRONTAL: [
    {
      id: 'mindfulness-90',
      title: 'Mindfulness 90',
      blurb: '90-second focus to restore regulation.',
      goalMetric: 'HF ↑, SampEn ↑',
    },
    {
      id: 'logic-restore',
      title: 'Logic Restore',
      blurb: 'Quick pattern puzzle to re-engage executive control.',
      goalMetric: 'SampEn ↑',
    },
    {
      id: 'focus-lock',
      title: 'Focus Lock',
      blurb: 'Track a slow object for 60 seconds.',
      goalMetric: 'HR stabilizes',
    },
    {
      id: 'journal-flash',
      title: 'Journal Flash',
      blurb: 'Type 2 neutral sentences about the stressor.',
      goalMetric: 'HR ↓',
    },
  ],

  PARIETAL: [
    {
      id: 'body-scan',
      title: 'Body Scan Tap',
      blurb: 'Tap through guided awareness prompts.',
      goalMetric: 'Resp ↓',
    },
    {
      id: 'grounding-54321',
      title: 'Grounding 5-4-3-2-1',
      blurb: 'Quick sensory grounding to reduce overload.',
      goalMetric: 'HR ↓',
    },
    {
      id: 'spatial-match',
      title: 'Spatial Match',
      blurb: 'Slow, low-stim alignment puzzle.',
      goalMetric: 'HR stabilizes',
    },
    {
      id: 'posture-check',
      title: 'Posture Check',
      blurb: 'Reset posture and jaw/shoulders.',
      goalMetric: 'HR ↓',
    },
  ],

  OCCIPITAL: [
    {
      id: 'screen-dim',
      title: 'Screen Dim Reset',
      blurb: 'Low-light mode + gentle breathing cue.',
      goalMetric: 'HR ↓',
    },
    {
      id: 'distance-gaze',
      title: 'Distance Gaze',
      blurb: 'Look far away for 30 seconds to reduce visual load.',
      goalMetric: 'HR ↓',
    },
    {
      id: 'blink-counter',
      title: 'Blink Counter',
      blurb: 'Guided blinking to reset eye strain.',
      goalMetric: 'HR ↓',
    },
    {
      id: 'dark-meditation',
      title: 'Dark Mode Meditation',
      blurb: 'Minimal screen + short breath guide.',
      goalMetric: 'HF ↑',
    },
  ],

  SPINAL: [
    {
      id: 'coherent-breath-3',
      title: '3-Min Coherent Breathing',
      blurb: 'The global reset: inhale 5, exhale 5.',
      goalMetric: 'HF ↑, RMSSD ↑',
    },
    {
      id: 'micro-walk-spinal',
      title: '3-Min Micro Walk',
      blurb: 'Movement to reduce global stress score.',
      goalMetric: 'LF/HF normalizes',
    },
    {
      id: 'guided-relax',
      title: 'Guided Relaxation',
      blurb: 'Quick downshift to calm the system.',
      goalMetric: 'HR ↓',
    },
    {
      id: 'cold-reset',
      title: 'Cold Reset',
      blurb: 'Short cold splash prompt for rapid downshift.',
      goalMetric: 'HR ↓',
    },
  ],
}
