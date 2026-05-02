import type { LayoutInspectorColors, LayoutInspectorFields } from './types';

export const IGNORE_ATTR = 'data-layout-inspector-ignore';

export const DEFAULT_COLORS: Required<LayoutInspectorColors> = {
  margin: 'rgba(246, 178, 107, 0.55)',
  border: 'rgba(255, 229, 153, 0.55)',
  padding: 'rgba(147, 196, 125, 0.55)',
  content: 'rgba(111, 168, 220, 0.55)',
  outline: 'rgba(75, 145, 230, 0.95)',
};

export const DEFAULT_FIELDS: Required<LayoutInspectorFields> = {
  tag: true,
  selector: true,
  dimensions: true,
  font: true,
  colors: true,
  spacing: true,
  role: true,
  accessibleName: true,
  a11yState: true,
};
