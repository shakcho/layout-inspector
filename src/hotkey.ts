const MODIFIER_KEYS = new Set(['cmd', 'meta', 'ctrl', 'shift', 'alt', 'option']);

export function parseHotkey(spec: string): (e: KeyboardEvent) => boolean {
  const parts = spec
    .toLowerCase()
    .split('+')
    .map((p) => p.trim())
    .filter(Boolean);
  const needMeta = parts.includes('cmd') || parts.includes('meta');
  const needCtrl = parts.includes('ctrl');
  const needShift = parts.includes('shift');
  const needAlt = parts.includes('alt') || parts.includes('option');
  const key = parts.find((p) => !MODIFIER_KEYS.has(p)) ?? '';

  return (e) =>
    e.key.toLowerCase() === key &&
    e.metaKey === needMeta &&
    e.ctrlKey === needCtrl &&
    e.shiftKey === needShift &&
    e.altKey === needAlt;
}
