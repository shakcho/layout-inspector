import type { CSSProperties } from 'react';
import { contrastLabel } from './colors';
import { hasAnyEdge } from './measure';
import { a11yStateChips } from './a11y';
import type { ElementInfo, LayoutInspectorFields } from './types';

const PALETTE = {
  bg: 'rgba(20, 20, 20, 0.96)',
  text: '#fff',
  dim: '#bbb',
  muted: '#999',
  faint: '#666',
  tag: '#ff79c6',
  selector: '#8be9fd',
  size: '#f1fa8c',
  label: '#bd93f9',
  state: '#8be9fd',
  pass: '#50fa7b',
  warn: '#f1fa8c',
  fail: '#ff5555',
};

const BUBBLE_STYLE: CSSProperties = {
  background: PALETTE.bg,
  color: PALETTE.text,
  padding: '8px 10px',
  borderRadius: 6,
  fontSize: 11,
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
  lineHeight: 1.5,
  boxShadow: '0 4px 18px rgba(0,0,0,0.35)',
  maxWidth: 320,
  pointerEvents: 'none',
};

function contrastColor(ratio: number): string {
  if (ratio >= 4.5) return PALETTE.pass;
  if (ratio >= 3) return PALETTE.warn;
  return PALETTE.fail;
}

function ColorSwatch({ color }: { color: string }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
      <span
        style={{
          width: 10,
          height: 10,
          background: color,
          border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: 2,
        }}
      />
      <span>{color}</span>
    </span>
  );
}

export function DefaultBubble({
  info,
  show,
  className,
  style,
}: {
  info: ElementInfo;
  show: Required<LayoutInspectorFields>;
  className: string;
  style: CSSProperties;
}) {
  const {
    tag,
    selector,
    rect,
    font,
    color,
    backgroundColor,
    contrastRatio: cr,
    padding,
    margin,
    a11y,
  } = info;
  const selectorSuffix = selector.startsWith(tag) ? selector.slice(tag.length) : selector;
  const showHeader = show.tag || show.selector;
  const showSpacing = show.spacing && (hasAnyEdge(padding) || hasAnyEdge(margin));
  const stateChips = show.a11yState ? a11yStateChips(a11y) : [];

  return (
    <div className={`layout-inspector__info ${className}`} style={{ ...BUBBLE_STYLE, ...style }}>
      {showHeader && (
        <div>
          {show.tag && <span style={{ color: PALETTE.tag }}>{tag}</span>}
          {show.selector && selectorSuffix && (
            <span style={{ color: PALETTE.selector }}>{selectorSuffix}</span>
          )}
        </div>
      )}

      {show.dimensions && (
        <div style={{ color: PALETTE.dim }}>
          {Math.round(rect.width)} × {Math.round(rect.height)}
        </div>
      )}

      {show.font && (
        <div>
          <span style={{ color: PALETTE.size }}>{font.size}</span>
          <span style={{ color: PALETTE.muted }}> · </span>
          <span style={{ fontFamily: `"${font.rendered}", ${font.family}` }}>{font.rendered}</span>
          <span style={{ color: PALETTE.muted }}> · </span>
          <span>{font.weight}</span>
        </div>
      )}

      {show.colors && (
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <ColorSwatch color={color} />
          <ColorSwatch color={backgroundColor} />
          {cr !== null && (
            <span style={{ color: contrastColor(cr) }}>
              {cr.toFixed(2)}:1 {contrastLabel(cr)}
            </span>
          )}
        </div>
      )}

      {showSpacing && (
        <div style={{ color: PALETTE.muted, fontSize: 10 }}>
          pad {padding.top} {padding.right} {padding.bottom} {padding.left} · mar {margin.top}{' '}
          {margin.right} {margin.bottom} {margin.left}
        </div>
      )}

      {show.role && a11y.role && (
        <div>
          <span style={{ color: PALETTE.label }}>role</span> <span>{a11y.role}</span>
          {!a11y.explicitRole && <span style={{ color: PALETTE.faint }}> (implicit)</span>}
        </div>
      )}

      {show.accessibleName && a11y.accessibleName && (
        <div>
          <span style={{ color: PALETTE.label }}>name</span>{' '}
          <span style={{ color: PALETTE.pass }}>&ldquo;{a11y.accessibleName}&rdquo;</span>
        </div>
      )}

      {stateChips.length > 0 && (
        <div style={{ color: PALETTE.state, fontSize: 10 }}>
          {stateChips.map((chip, i) => (
            <span key={chip}>
              {i > 0 && <span style={{ color: PALETTE.faint }}> · </span>}
              {chip}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
