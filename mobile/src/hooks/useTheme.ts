import { useSettingsStore } from '../store/settingsStore';
import { LIGHT, DARK, type Theme } from '../lib/theme';

export function useTheme(): Theme {
  const darkMode = useSettingsStore((s) => s.darkMode);
  return darkMode ? DARK : LIGHT;
}
