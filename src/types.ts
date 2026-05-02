import type { ReactNode, CSSProperties } from 'react';

/** Pixel offsets for the four sides of a CSS box edge (padding/margin/border). */
export interface BoxEdges {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

/**
 * Snapshot of everything the inspector reads off an element. Passed to
 * `on.hover`, `on.select`, and `bubble.render`.
 */
export interface ElementInfo {
  element: Element;
  /** Lowercased tag name, e.g. `"button"`. */
  tag: string;
  /** A best-effort unique CSS selector — id, classes, data-attrs, or nth-of-type. */
  selector: string;
  /** Viewport-relative bounding box at the moment the snapshot was taken. */
  rect: DOMRect;
  font: {
    /** Computed `font-family` stack as authored. */
    family: string;
    /** First family in the stack the browser actually has loaded. */
    rendered: string;
    size: string;
    weight: string;
    lineHeight: string;
  };
  /** Computed text color (`rgb(...)` / `rgba(...)`). */
  color: string;
  /** Walks ancestors until a non-transparent background is found. */
  backgroundColor: string;
  /** WCAG ratio between `color` and `backgroundColor`; `null` if indeterminate. */
  contrastRatio: number | null;
  padding: BoxEdges;
  margin: BoxEdges;
  border: BoxEdges;
  a11y: A11yInfo;
}

/** Accessibility information derived from ARIA attributes and DOM state. */
export interface A11yInfo {
  /** Explicit `role` attribute, or an implicit role inferred from the tag. */
  role: string | null;
  /** True when `role` came from the attribute, not the tag. */
  explicitRole: boolean;
  /** `aria-labelledby` → `aria-label` → `alt` → `<label>` → text content. */
  accessibleName: string | null;
  ariaLabel: string | null;
  ariaLabelledBy: string | null;
  ariaDescribedBy: string | null;
  tabIndex: number | null;
  /** True if the element is in the tab order or has a tab-stop role. */
  focusable: boolean;
  disabled: boolean;
  /** `aria-hidden="true"` or `hidden` attribute. */
  hidden: boolean;
  /** `aria-expanded` value, or `null` if unset. */
  expanded: boolean | null;
  /** `aria-pressed` value, or `null` if unset. */
  pressed: boolean | 'mixed' | null;
  /** `aria-checked` value, or `null` if unset. */
  checked: boolean | 'mixed' | null;
  /** `aria-selected` value, or `null` if unset. */
  selected: boolean | null;
}

/** Colors used by the box-model overlay layers and the outline fallback. */
export interface LayoutInspectorColors {
  margin?: string;
  border?: string;
  padding?: string;
  content?: string;
  outline?: string;
}

/** Event callbacks fired as the user moves, clicks, or toggles the inspector. */
export interface LayoutInspectorEvents {
  /** Fires when the inspector is activated or deactivated. */
  activeChange?: (active: boolean) => void;
  /** Fires when the user clicks an element while the inspector is active. */
  select?: (element: Element, info: ElementInfo) => void;
  /** Fires on every pointer move; `null` when no eligible target is under the pointer. */
  hover?: (element: Element | null, info: ElementInfo | null) => void;
}

/** Activation / interaction settings. */
export interface LayoutInspectorBehavior {
  /** Keyboard shortcut to toggle active, e.g. `"cmd+shift+c"`. */
  hotkey?: string;
  /** CSS selector for elements the inspector should skip. */
  ignoreSelector?: string;
  /** Deactivate after a successful click-select. Default `true`. */
  exitOnSelect?: boolean;
  /** Deactivate when Escape is pressed. Default `true`. */
  exitOnEscape?: boolean;
}

/** Visual highlight (overlay) configuration. */
export interface LayoutInspectorHighlight {
  /** Render the 4-layer DevTools box model. Default `true`. */
  boxModel?: boolean;
  /** Render a single outline instead of box-model layers. Defaults to `!boxModel`. */
  outline?: boolean;
  colors?: LayoutInspectorColors;
}

/** Toggles for individual fields in the default info bubble. All default `true`. */
export interface LayoutInspectorFields {
  tag?: boolean;
  selector?: boolean;
  dimensions?: boolean;
  font?: boolean;
  colors?: boolean;
  spacing?: boolean;
  role?: boolean;
  accessibleName?: boolean;
  a11yState?: boolean;
}

/** Configuration for the floating info bubble that follows the pointer. */
export interface LayoutInspectorBubble {
  /** Show the bubble at all. Default `true`. */
  enabled?: boolean;
  fields?: LayoutInspectorFields;
  /** Escape hatch — replaces the default bubble content with custom JSX. */
  render?: (info: ElementInfo) => ReactNode;
}

/** Props for `<LayoutInspector />`. */
export interface LayoutInspectorProps {
  /** Controlled mode: when set, the parent owns the active state. */
  active?: boolean;
  /** Uncontrolled initial active state. Default `false`. */
  defaultActive?: boolean;
  on?: LayoutInspectorEvents;
  behavior?: LayoutInspectorBehavior;
  highlight?: LayoutInspectorHighlight;
  bubble?: LayoutInspectorBubble;
  /** z-index for the overlay portal. Default `2147483647` (max). */
  zIndex?: number;
  /** Extra class on the default bubble. */
  className?: string;
  /** Extra inline styles merged onto the default bubble. */
  style?: CSSProperties;
}
