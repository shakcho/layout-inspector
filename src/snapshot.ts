import { contrastRatio } from './colors';
import {
  borderEdges,
  buildSelector,
  getEffectiveBackground,
  getRenderedFont,
  spacingEdges,
} from './measure';
import { buildA11y } from './a11y';
import type { ElementInfo } from './types';

export function buildInfo(el: Element): ElementInfo {
  const style = getComputedStyle(el);
  const color = style.color;
  const backgroundColor = getEffectiveBackground(el);
  return {
    element: el,
    tag: el.tagName.toLowerCase(),
    selector: buildSelector(el),
    rect: el.getBoundingClientRect(),
    font: {
      family: style.fontFamily,
      rendered: getRenderedFont(style.fontFamily, style.fontSize, style.fontWeight),
      size: style.fontSize,
      weight: style.fontWeight,
      lineHeight: style.lineHeight,
    },
    color,
    backgroundColor,
    contrastRatio: contrastRatio(color, backgroundColor),
    padding: spacingEdges(style, 'padding'),
    margin: spacingEdges(style, 'margin'),
    border: borderEdges(style),
    a11y: buildA11y(el),
  };
}
