export const LIGHT = {
  bg:          '#f0f0f8',
  surface:     '#ffffff',
  surfaceAlt:  '#f5f5f5',
  text:        '#1a1a2e',
  textSub:     '#555555',
  textMuted:   '#999999',
  border:      '#dddddd',
  accent:      '#1a1a2e',
  accentText:  '#ffffff',
  tileBg:      '#ffffff',
  tileBorder:  '#4a4a8a',
  tileColor:   '#1a1a2e',
  success:     '#2e7d32',
  error:       '#c62828',
  urgent:      '#f44336',
} as const;

export const DARK = {
  bg:          '#0d1117',
  surface:     '#161b22',
  surfaceAlt:  '#0d1117',
  text:        '#e6edf3',
  textSub:     '#8b949e',
  textMuted:   '#6e7681',
  border:      '#30363d',
  accent:      '#58a6ff',
  accentText:  '#0d1117',
  tileBg:      '#21262d',
  tileBorder:  '#58a6ff',
  tileColor:   '#e6edf3',
  success:     '#3fb950',
  error:       '#f85149',
  urgent:      '#f85149',
} as const;

export type Theme = Record<keyof typeof LIGHT, string>;
