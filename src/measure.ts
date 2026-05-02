import { parseColor } from './colors';
import type { BoxEdges } from './types';

export function buildSelector(el: Element): string {
  const tag = el.tagName.toLowerCase();
  if (el.id) return `${tag}#${CSS.escape(el.id)}`;
  const testid = el.getAttribute('data-testid');
  if (testid) return `${tag}[data-testid="${testid}"]`;
  const classes = Array.from(el.classList).slice(0, 3);
  if (classes.length) return `${tag}.${classes.map((c) => CSS.escape(c)).join('.')}`;
  return tag;
}

export function spacingEdges(style: CSSStyleDeclaration, prop: 'padding' | 'margin'): BoxEdges {
  const px = (side: string) => parseFloat(style.getPropertyValue(`${prop}-${side}`)) || 0;
  return { top: px('top'), right: px('right'), bottom: px('bottom'), left: px('left') };
}

export function borderEdges(style: CSSStyleDeclaration): BoxEdges {
  return {
    top: parseFloat(style.borderTopWidth) || 0,
    right: parseFloat(style.borderRightWidth) || 0,
    bottom: parseFloat(style.borderBottomWidth) || 0,
    left: parseFloat(style.borderLeftWidth) || 0,
  };
}

export function getEffectiveBackground(el: Element): string {
  for (let cur: Element | null = el; cur; cur = cur.parentElement) {
    const bg = getComputedStyle(cur).backgroundColor;
    const parsed = parseColor(bg);
    if (parsed && parsed[3] > 0) return bg;
  }
  return 'rgb(255, 255, 255)';
}

export function hasAnyEdge(edges: BoxEdges): boolean {
  return !!(edges.top || edges.right || edges.bottom || edges.left);
}

function splitFontFamily(family: string): string[] {
  // Split on commas not inside quotes, then strip surrounding quotes.
  return family
    .split(/,(?=(?:[^"']*["'][^"']*["'])*[^"']*$)/)
    .map((f) => f.trim().replace(/^['"]|['"]$/g, ''))
    .filter(Boolean);
}

export function getRenderedFont(fontFamily: string, fontSize: string, fontWeight: string): string {
  const families = splitFontFamily(fontFamily);
  if (families.length === 0) return '';
  if (typeof document === 'undefined' || !('fonts' in document)) return families[0];
  const size = fontSize || '16px';
  const weight = fontWeight || '400';
  for (const family of families) {
    try {
      const spec = `${weight} ${size} "${family.replace(/"/g, '\\"')}"`;
      if (document.fonts.check(spec)) return family;
    } catch {
      // invalid spec — try the next family
    }
  }
  return families[0];
}
