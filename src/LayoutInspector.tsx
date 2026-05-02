import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { DEFAULT_COLORS, DEFAULT_FIELDS, IGNORE_ATTR } from './constants';
import { DefaultBubble } from './DefaultBubble';
import { BoxModelLayers, BubbleAnchor } from './overlay';
import { parseHotkey } from './hotkey';
import { buildInfo } from './snapshot';
import type { ElementInfo, LayoutInspectorProps } from './types';

/**
 * DevTools-style layout inspector. When active, hovering an element draws a
 * box-model overlay and a floating info bubble (tag, selector, font, WCAG
 * contrast, ARIA role, accessible name, and a11y state). Click to select.
 *
 * Use uncontrolled mode (`defaultActive` + `behavior.hotkey`) for ad-hoc
 * inspection, or controlled mode (`active` + `on.activeChange`) to wire it
 * into your own toggle UI.
 *
 * @example
 * ```tsx
 * <LayoutInspector
 *   defaultActive
 *   behavior={{ hotkey: 'cmd+shift+c' }}
 *   on={{ select: (el, info) => console.log(info) }}
 * />
 * ```
 */
export function LayoutInspector({
  active: activeProp,
  defaultActive = false,
  on,
  behavior,
  highlight,
  bubble,
  zIndex = 2147483647,
  className = '',
  style = {},
}: LayoutInspectorProps) {
  const { activeChange: onActiveChange, select: onSelect, hover: onHover } = on ?? {};
  const { hotkey, ignoreSelector, exitOnSelect = true, exitOnEscape = true } = behavior ?? {};
  const { boxModel = true, outline, colors } = highlight ?? {};
  const { enabled: showBubble = true, fields, render: renderBubble } = bubble ?? {};

  const isControlled = activeProp !== undefined;
  const [uncontrolledActive, setUncontrolledActive] = useState(defaultActive);
  const active = isControlled ? activeProp : uncontrolledActive;

  const setActive = useCallback(
    (next: boolean) => {
      if (!isControlled) setUncontrolledActive(next);
      onActiveChange?.(next);
    },
    [isControlled, onActiveChange]
  );

  const [info, setInfo] = useState<ElementInfo | null>(null);
  const currentElRef = useRef<Element | null>(null);
  const onHoverRef = useRef(onHover);
  useEffect(() => {
    onHoverRef.current = onHover;
  });

  const overlayColors = { ...DEFAULT_COLORS, ...colors };
  const showOutline = outline ?? !boxModel;
  const show = { ...DEFAULT_FIELDS, ...fields };

  const isIgnored = useCallback(
    (el: Element | null): boolean => {
      if (!el) return true;
      if (el.closest(`[${IGNORE_ATTR}]`)) return true;
      if (ignoreSelector) {
        try {
          if (el.closest(ignoreSelector)) return true;
        } catch {
          // invalid selector — silently ignore
        }
      }
      return false;
    },
    [ignoreSelector]
  );

  const updateFromElement = useCallback(
    (el: Element | null) => {
      if (!el || isIgnored(el)) {
        if (currentElRef.current !== null) {
          currentElRef.current = null;
          setInfo(null);
          onHoverRef.current?.(null, null);
        }
        return;
      }
      const next = buildInfo(el);
      currentElRef.current = el;
      setInfo(next);
      onHoverRef.current?.(el, next);
    },
    [isIgnored]
  );

  // Hover tracking — also re-measure on scroll/resize so the overlay stays glued.
  useEffect(() => {
    if (!active) {
      currentElRef.current = null;
      // Clear stale info so re-activating doesn't briefly flash the previous element.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setInfo(null);
      return;
    }

    const onPointerMove = (e: PointerEvent) => {
      updateFromElement(document.elementFromPoint(e.clientX, e.clientY));
    };
    const remeasure = () => {
      const el = currentElRef.current;
      if (el?.isConnected) setInfo(buildInfo(el));
    };

    document.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('scroll', remeasure, { passive: true, capture: true });
    window.addEventListener('resize', remeasure);
    return () => {
      document.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('scroll', remeasure, { capture: true } as EventListenerOptions);
      window.removeEventListener('resize', remeasure);
    };
  }, [active, updateFromElement]);

  // Click to select.
  useEffect(() => {
    if (!active) return;
    const onClick = (e: MouseEvent) => {
      const target = document.elementFromPoint(e.clientX, e.clientY);
      if (!target || isIgnored(target)) return;
      e.preventDefault();
      e.stopPropagation();
      onSelect?.(target, buildInfo(target));
      if (exitOnSelect) setActive(false);
    };
    document.addEventListener('click', onClick, { capture: true });
    return () =>
      document.removeEventListener('click', onClick, { capture: true } as EventListenerOptions);
  }, [active, exitOnSelect, isIgnored, onSelect, setActive]);

  // Escape to exit.
  useEffect(() => {
    if (!active || !exitOnEscape) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setActive(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active, exitOnEscape, setActive]);

  // Hotkey toggle.
  useEffect(() => {
    if (!hotkey) return;
    const match = parseHotkey(hotkey);
    const onKey = (e: KeyboardEvent) => {
      if (match(e)) {
        e.preventDefault();
        setActive(!active);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [hotkey, active, setActive]);

  if (!active || typeof document === 'undefined') return null;

  const overlay = (
    <div
      data-layout-inspector-ignore=""
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex,
        cursor: 'crosshair',
      }}
    >
      {info && boxModel && <BoxModelLayers info={info} colors={overlayColors} />}

      {info && showOutline && !boxModel && (
        <div
          style={{
            position: 'fixed',
            left: info.rect.left,
            top: info.rect.top,
            width: info.rect.width,
            height: info.rect.height,
            outline: `2px solid ${overlayColors.outline}`,
            outlineOffset: -1,
            pointerEvents: 'none',
          }}
        />
      )}

      {info && showBubble && (
        <BubbleAnchor rect={info.rect} zIndex={zIndex}>
          {renderBubble ? (
            renderBubble(info)
          ) : (
            <DefaultBubble info={info} show={show} className={className} style={style} />
          )}
        </BubbleAnchor>
      )}
    </div>
  );

  return createPortal(overlay, document.body);
}

export default LayoutInspector;
