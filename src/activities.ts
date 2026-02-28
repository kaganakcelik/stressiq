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
  ],

  CEREBELLUM: [
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
      blurb: 'Quick walk to normalize arousal.',
      goalMetric: 'LF/HF normalizes',
    },
  ],

  FRONTAL: [
    {
      id: 'mindfulness-90',
      title: 'Mindfulness Reset',
      blurb: '12-second focus to restore regulation.',
      goalMetric: 'HF ↑, SampEn ↑',
    },
    {
      id: 'focus-lock',
      title: 'Focus Lock',
      blurb: 'Track a slow object for 15 seconds.',
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
      id: 'posture-check',
      title: 'Posture Check',
      blurb: 'Reset posture and jaw/shoulders.',
      goalMetric: 'HR ↓',
    },
  ],

  OCCIPITAL: [
    {
      id: 'distance-gaze',
      title: 'Distance Gaze',
      blurb: 'Look far away for 15 seconds to reduce visual load.',
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
      title: 'Coherent Breathing',
      blurb: 'The global reset: inhale 5, exhale 5.',
      goalMetric: 'HF ↑, RMSSD ↑',
    },
    {
      id: 'micro-walk-spinal',
      title: 'Micro Walk Reset',
      blurb: 'Brief movement to improve global stress score.',
      goalMetric: 'LF/HF normalizes',
    },
    {
      id: 'cold-reset',
      title: 'Cold Reset',
      blurb: 'Short cold splash prompt for rapid downshift.',
      goalMetric: 'HR ↓',
    },
  ],
}
