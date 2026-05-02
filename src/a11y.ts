import type { A11yInfo } from './types';

const IMPLICIT_ROLES: Record<string, string> = {
  AREA: 'link',
  ARTICLE: 'article',
  ASIDE: 'complementary',
  BUTTON: 'button',
  DATALIST: 'listbox',
  DIALOG: 'dialog',
  FIGURE: 'figure',
  FOOTER: 'contentinfo',
  FORM: 'form',
  H1: 'heading',
  H2: 'heading',
  H3: 'heading',
  H4: 'heading',
  H5: 'heading',
  H6: 'heading',
  HEADER: 'banner',
  HR: 'separator',
  IMG: 'img',
  LI: 'listitem',
  MAIN: 'main',
  NAV: 'navigation',
  OL: 'list',
  OPTION: 'option',
  OUTPUT: 'status',
  PROGRESS: 'progressbar',
  SECTION: 'region',
  SELECT: 'combobox',
  SUMMARY: 'button',
  TABLE: 'table',
  TBODY: 'rowgroup',
  TD: 'cell',
  TEXTAREA: 'textbox',
  TFOOT: 'rowgroup',
  TH: 'columnheader',
  THEAD: 'rowgroup',
  TR: 'row',
  UL: 'list',
};

const INPUT_TYPE_ROLES: Record<string, string | null> = {
  checkbox: 'checkbox',
  radio: 'radio',
  range: 'slider',
  search: 'searchbox',
  button: 'button',
  submit: 'button',
  reset: 'button',
  image: 'button',
  hidden: null,
};

const NAMED_TAGS = /^(BUTTON|A|SUMMARY|H[1-6])$/;

function getImplicitRole(el: Element): string | null {
  const tag = el.tagName;
  if (tag === 'A') return el.hasAttribute('href') ? 'link' : null;
  if (tag === 'IMG' && el.getAttribute('alt') === '') return 'presentation';
  if (tag === 'INPUT') {
    const type = ((el as HTMLInputElement).type || 'text').toLowerCase();
    return type in INPUT_TYPE_ROLES ? INPUT_TYPE_ROLES[type] : 'textbox';
  }
  return IMPLICIT_ROLES[tag] ?? null;
}

function resolveIdRefs(root: Document, idref: string | null): string | null {
  if (!idref) return null;
  const names = idref
    .split(/\s+/)
    .filter(Boolean)
    .map((id) => root.getElementById(id)?.textContent?.trim())
    .filter((t): t is string => Boolean(t));
  return names.length ? names.join(' ') : null;
}

function getAccessibleName(el: Element): string | null {
  const doc = el.ownerDocument || document;

  const labelledBy = resolveIdRefs(doc, el.getAttribute('aria-labelledby'));
  if (labelledBy) return labelledBy;

  const ariaLabel = el.getAttribute('aria-label');
  if (ariaLabel) return ariaLabel.trim();

  const tag = el.tagName;
  if (tag === 'IMG') {
    const alt = el.getAttribute('alt');
    if (alt !== null) return alt;
  }

  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') {
    const input = el as HTMLInputElement;
    if (input.id) {
      const label = doc.querySelector(`label[for="${CSS.escape(input.id)}"]`);
      if (label?.textContent) return label.textContent.trim();
    }
    const parentLabel = el.closest('label');
    if (parentLabel?.textContent) return parentLabel.textContent.trim();
    const placeholder = input.getAttribute('placeholder');
    if (placeholder) return placeholder;
  }

  if (NAMED_TAGS.test(tag)) {
    const text = el.textContent?.trim();
    if (text) return text.length > 80 ? text.slice(0, 77) + '…' : text;
  }

  return null;
}

function isFocusable(el: Element): boolean {
  const tabIndexAttr = el.getAttribute('tabindex');
  if (tabIndexAttr !== null) return parseInt(tabIndexAttr, 10) >= 0;

  const disabled = (el as HTMLInputElement).disabled || el.getAttribute('aria-disabled') === 'true';
  if (disabled) return false;

  const tag = el.tagName;
  if (tag === 'A' || tag === 'AREA') return el.hasAttribute('href');
  if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA' || tag === 'BUTTON') return true;
  return el.getAttribute('contenteditable') === 'true';
}

function parseTristate(value: string | null): boolean | 'mixed' | null {
  if (value === 'mixed') return 'mixed';
  if (value === 'true') return true;
  if (value === 'false') return false;
  return null;
}

function parseBoolAttr(value: string | null): boolean | null {
  if (value === 'true') return true;
  if (value === 'false') return false;
  return null;
}

function getCheckedState(el: Element): boolean | 'mixed' | null {
  const aria = parseTristate(el.getAttribute('aria-checked'));
  if (aria !== null) return aria;
  if (el.tagName === 'INPUT') {
    const type = ((el as HTMLInputElement).type || '').toLowerCase();
    if (type === 'checkbox' || type === 'radio') return (el as HTMLInputElement).checked;
  }
  return null;
}

export function buildA11y(el: Element): A11yInfo {
  const explicit = el.getAttribute('role');
  const tabIndexAttr = el.getAttribute('tabindex');

  return {
    role: explicit?.trim() || getImplicitRole(el),
    explicitRole: !!explicit,
    accessibleName: getAccessibleName(el),
    ariaLabel: el.getAttribute('aria-label')?.trim() || null,
    ariaLabelledBy: el.getAttribute('aria-labelledby'),
    ariaDescribedBy: el.getAttribute('aria-describedby'),
    tabIndex: tabIndexAttr === null ? null : parseInt(tabIndexAttr, 10),
    focusable: isFocusable(el),
    disabled:
      (el as HTMLInputElement).disabled === true || el.getAttribute('aria-disabled') === 'true',
    hidden: (el as HTMLElement).hidden === true || el.getAttribute('aria-hidden') === 'true',
    expanded: parseBoolAttr(el.getAttribute('aria-expanded')),
    pressed: parseTristate(el.getAttribute('aria-pressed')),
    checked: getCheckedState(el),
    selected: parseBoolAttr(el.getAttribute('aria-selected')),
  };
}

export function a11yStateChips(a: A11yInfo): string[] {
  const chips: string[] = [];
  if (a.tabIndex !== null) chips.push(`tabindex=${a.tabIndex}`);
  if (a.focusable) chips.push('focusable');
  if (a.disabled) chips.push('disabled');
  if (a.hidden) chips.push('hidden');
  if (a.expanded !== null) chips.push(`expanded=${a.expanded}`);
  if (a.pressed !== null) chips.push(`pressed=${a.pressed}`);
  if (a.checked !== null) chips.push(`checked=${a.checked}`);
  if (a.selected !== null) chips.push(`selected=${a.selected}`);
  return chips;
}
