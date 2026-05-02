import type { ComponentMeta } from './types';

const basic = `import { useState } from 'react';
import { LayoutInspector } from 'layout-inspector';

function App() {
  const [active, setActive] = useState(false);

  return (
    <>
      <button
        data-layout-inspector-ignore
        onClick={() => setActive((a) => !a)}
      >
        {active ? 'Stop inspecting' : 'Inspect element'}
      </button>

      <LayoutInspector
        active={active}
        behavior={{ hotkey: 'cmd+shift+c' }}
        on={{
          activeChange: setActive,
          select: (el, info) => console.log('selected', el, info),
        }}
      />
    </>
  );
}`;

const configurable = `// Minimal — just a single outline, no info bubble:
<LayoutInspector
  highlight={{ boxModel: false }}
  bubble={{ enabled: false }}
/>

// Rich default (everything on):
<LayoutInspector />

// Granular — pick the fields you want in the bubble:
<LayoutInspector
  bubble={{
    fields: {
      tag: true,
      selector: true,
      dimensions: true,
      font: true,
      colors: true,
      spacing: false,      // hide padding/margin row
      role: true,
      accessibleName: true,
      a11yState: false,    // hide tabindex / expanded / pressed …
    },
  }}
/>

// Take over the bubble entirely:
<LayoutInspector
  bubble={{
    render: (info) => (
      <MyDesignTokenCard
        color={info.color}
        bg={info.backgroundColor}
        contrast={info.contrastRatio}
      />
    ),
  }}
/>`;

const types = `interface LayoutInspectorProps {
  active?: boolean;            // controlled
  defaultActive?: boolean;     // uncontrolled (default false)

  on?: LayoutInspectorEvents;
  behavior?: LayoutInspectorBehavior;
  highlight?: LayoutInspectorHighlight;
  bubble?: LayoutInspectorBubble;

  zIndex?: number;             // default 2147483647
  className?: string;
  style?: CSSProperties;
}

interface LayoutInspectorEvents {
  activeChange?: (active: boolean) => void;
  select?: (element: Element, info: ElementInfo) => void;
  hover?: (element: Element | null, info: ElementInfo | null) => void;
}

interface LayoutInspectorBehavior {
  hotkey?: string;             // e.g. 'cmd+shift+c'
  ignoreSelector?: string;     // CSS selector to skip
  exitOnSelect?: boolean;      // default true
  exitOnEscape?: boolean;      // default true
}

interface LayoutInspectorHighlight {
  boxModel?: boolean;          // default true — 4-layer DevTools model
  outline?: boolean;           // defaults to !boxModel
  colors?: LayoutInspectorColors;
}

interface LayoutInspectorColors {
  margin?: string;
  border?: string;
  padding?: string;
  content?: string;
  outline?: string;
}

interface LayoutInspectorBubble {
  enabled?: boolean;           // default true
  fields?: LayoutInspectorFields;
  render?: (info: ElementInfo) => ReactNode;  // escape hatch
}

interface LayoutInspectorFields {
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

interface ElementInfo {
  element: Element;
  tag: string;                 // 'button'
  selector: string;            // 'button.btn[data-testid="x"]'
  rect: DOMRect;
  font: {
    family: string;            // declared font-family list
    rendered: string;          // first family the browser actually has loaded
    size: string;
    weight: string;
    lineHeight: string;
  };
  color: string;               // computed text color
  backgroundColor: string;     // walks ancestors for first opaque bg
  contrastRatio: number | null;
  padding: BoxEdges;
  margin: BoxEdges;
  border: BoxEdges;
  a11y: A11yInfo;
}

interface BoxEdges {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

interface A11yInfo {
  role: string | null;         // explicit attr or implicit from tag
  explicitRole: boolean;
  accessibleName: string | null;
  ariaLabel: string | null;
  ariaLabelledBy: string | null;
  ariaDescribedBy: string | null;
  tabIndex: number | null;
  focusable: boolean;
  disabled: boolean;
  hidden: boolean;
  expanded: boolean | null;
  pressed: boolean | 'mixed' | null;
  checked: boolean | 'mixed' | null;
  selected: boolean | null;
}`;

export const layoutInspectorMeta: ComponentMeta = {
  key: 'layoutInspector',
  slug: 'layout-inspector',
  title: 'LayoutInspector',
  tagline:
    'A Chrome-DevTools-style layout inspector for design QA. Hover any element to see its tag, selector, dimensions, typography, effective colors with WCAG contrast, and box model — plus a full a11y snapshot. Click to select, Escape or a hotkey to exit.',
  metaDescription:
    'LayoutInspector — a Chrome-DevTools-style layout inspector for React. Hover to see tag, selector, font, WCAG contrast, ARIA role, accessible name, and a11y state. Click to select.',
  apiRows: [
    {
      prop: 'active',
      typeHtml: '<code>boolean</code>',
      defaultHtml: '—',
      descriptionHtml: 'Controlled active state. Omit for uncontrolled.',
    },
    {
      prop: 'defaultActive',
      typeHtml: '<code>boolean</code>',
      defaultHtml: '<code>false</code>',
      descriptionHtml: 'Uncontrolled initial active state.',
    },
    {
      prop: 'on',
      typeHtml: '<code>LayoutInspectorEvents</code>',
      defaultHtml: '—',
      descriptionHtml:
        'Event callbacks: <code>activeChange</code>, <code>select</code>, <code>hover</code>. See <a href="#examples">Types</a> for the full shape.',
    },
    {
      prop: 'behavior',
      typeHtml: '<code>LayoutInspectorBehavior</code>',
      defaultHtml: '—',
      descriptionHtml:
        'Hotkey, ignore selector, and exit-on-select / exit-on-escape toggles. See <a href="#examples">Types</a>.',
    },
    {
      prop: 'highlight',
      typeHtml: '<code>LayoutInspectorHighlight</code>',
      defaultHtml: '—',
      descriptionHtml:
        'Box-model layers vs. single outline, plus per-layer color overrides. See <a href="#examples">Types</a>.',
    },
    {
      prop: 'bubble',
      typeHtml: '<code>LayoutInspectorBubble</code>',
      defaultHtml: '—',
      descriptionHtml:
        'Info-bubble visibility, per-field toggles, and a full <code>render</code> escape hatch. See <a href="#examples">Types</a>.',
    },
    {
      prop: 'zIndex',
      typeHtml: '<code>number</code>',
      defaultHtml: '<code>2147483647</code>',
      descriptionHtml: 'z-index for the overlay and bubble.',
    },
    {
      prop: 'className',
      typeHtml: '<code>string</code>',
      defaultHtml: "<code>''</code>",
      descriptionHtml: 'CSS class added to the default bubble wrapper.',
    },
    {
      prop: 'style',
      typeHtml: '<code>CSSProperties</code>',
      defaultHtml: '<code>{}</code>',
      descriptionHtml: 'Inline styles merged with the default bubble wrapper.',
    },
  ],
  apiFootnoteHtml:
    'Overlay elements carry <code>data-layout-inspector-ignore</code>, so the inspector never highlights itself. Add this attribute to your own UI (toolbar buttons, the toggle that controls the inspector, etc.) to exempt it from selection.',
  codeExamples: [
    { label: 'Basic Usage', code: basic },
    { label: 'Configurable', code: configurable },
  ],
  typesCode: types,
};
