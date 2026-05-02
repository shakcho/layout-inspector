import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import type { ElementInfo, LayoutInspectorColors } from './types';

export function BoxModelLayers({
  info,
  colors,
}: {
  info: ElementInfo;
  colors: Required<LayoutInspectorColors>;
}) {
  const { rect, padding, margin, border } = info;

  const marginLayer = {
    left: rect.left - margin.left,
    top: rect.top - margin.top,
    width: rect.width + margin.left + margin.right,
    height: rect.height + margin.top + margin.bottom,
  };
  const borderLayer = {
    left: rect.left,
    top: rect.top,
    width: rect.width,
    height: rect.height,
  };
  const paddingLayer = {
    left: rect.left + border.left,
    top: rect.top + border.top,
    width: Math.max(0, rect.width - border.left - border.right),
    height: Math.max(0, rect.height - border.top - border.bottom),
  };
  const contentLayer = {
    left: rect.left + border.left + padding.left,
    top: rect.top + border.top + padding.top,
    width: Math.max(0, rect.width - border.left - border.right - padding.left - padding.right),
    height: Math.max(0, rect.height - border.top - border.bottom - padding.top - padding.bottom),
  };

  const base: CSSProperties = { position: 'fixed', pointerEvents: 'none' };
  return (
    <>
      <div style={{ ...base, ...marginLayer, background: colors.margin }} />
      <div style={{ ...base, ...borderLayer, background: colors.border }} />
      <div style={{ ...base, ...paddingLayer, background: colors.padding }} />
      <div style={{ ...base, ...contentLayer, background: colors.content }} />
    </>
  );
}

export function BubbleAnchor({
  rect,
  zIndex,
  children,
}: {
  rect: DOMRect;
  zIndex: number;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ left: number; top: number } | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    const bubble = ref.current.getBoundingClientRect();
    const gap = 8;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // Prefer below the element, else above, else clamped into the viewport.
    let top = rect.bottom + gap;
    if (top + bubble.height > vh) top = rect.top - bubble.height - gap;
    if (top < 0) top = Math.min(vh - bubble.height - gap, Math.max(gap, rect.bottom + gap));

    let left = rect.left;
    left = Math.min(left, vw - bubble.width - gap);
    left = Math.max(gap, left);

    setPos({ left, top });
  }, [rect.left, rect.top, rect.right, rect.bottom, rect.width, rect.height]);

  return (
    <div
      ref={ref}
      style={{
        position: 'fixed',
        left: pos?.left ?? rect.left,
        top: pos?.top ?? rect.bottom + 8,
        visibility: pos ? 'visible' : 'hidden',
        pointerEvents: 'none',
        zIndex: zIndex + 1,
      }}
    >
      {children}
    </div>
  );
}
