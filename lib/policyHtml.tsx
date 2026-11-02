import { createElement, type ReactNode } from 'react';

type PolicySlug = 'privacy-policy' | 'terms-of-service';

export type PolicyTocEntry = { id: string; title: string };
export type PreparedPolicyContent = { content: ReactNode[]; toc: PolicyTocEntry[] };

const allowedTags = new Set(['h2', 'h3', 'p', 'ul', 'ol', 'li', 'strong', 'em', 'a', 'br']);
const discardedTags = new Set([
  'script', 'style', 'iframe', 'object', 'embed', 'svg', 'math', 'form',
  'input', 'button', 'textarea', 'select', 'option', 'template', 'noscript',
  'video', 'audio', 'source', 'track', 'canvas', 'picture', 'img', 'link',
  'meta', 'base', 'title', 'head', 'frame', 'frameset', 'applet', 'portal',
]);

// Preserve existing public fragments when the same heading is published.
const legacyAnchors: Record<PolicySlug, Record<string, string>> = {
  'terms-of-service': {
    'acceptance-of-terms': 'acceptance',
    eligibility: 'eligibility',
    'description-of-services': 'services',
    'account-registration': 'account',
    'fees-payments': 'fees',
    'fees-and-payments': 'fees',
    'refund-policy': 'refund',
    'user-conduct': 'conduct',
    'intellectual-property': 'ip',
    disclaimers: 'disclaimer',
    'limitation-of-liability': 'limitation',
    indemnification: 'indemnification',
    termination: 'termination',
    'governing-law': 'governing',
    'changes-to-terms': 'changes',
    'contact-us': 'contact',
  },
  'privacy-policy': {
    'information-we-collect': 'collection',
    'how-we-use-your-information': 'usage',
    'information-sharing': 'sharing',
    'data-security': 'security',
    'data-retention': 'retention',
    'your-rights': 'rights',
    'cookies-analytics': 'cookies',
    'cookies-and-analytics': 'cookies',
    'children-s-privacy': 'children',
    'international-data-transfers': 'international',
    'account-deletion': 'deletion',
    'policy-changes': 'changes',
    'contact-us': 'contact',
  },
};

function allowedHref(value: string | null): string | undefined {
  if (!value) return undefined;
  const href = value.trim();
  if (!/^(?:https?:\/\/|mailto:)/i.test(href)) return undefined;
  try {
    const url = new URL(href);
    return ['http:', 'https:', 'mailto:'].includes(url.protocol) ? href : undefined;
  } catch {
    return undefined;
  }
}

function headingSlug(title: string) {
  const normalized = title
    .replace(/^\s*(?:\d+|[ivxlcdm]+)[.)\-:]\s*/i, '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\p{Letter}\p{Mark}\p{Number}]+/gu, '-')
    .replace(/^-+|-+$/g, '');
  return Array.from(normalized).slice(0, 80).join('') || 'section';
}

function readableText(node: Node, depth = 0): string {
  if (depth > 64) throw new Error('Published policy nesting is too deep.');
  if (node.nodeType === 3) return node.nodeValue || '';
  if (node.nodeType !== 1) return '';
  const element = node as Element;
  if (element.namespaceURI !== 'http://www.w3.org/1999/xhtml' || discardedTags.has(element.localName)) return '';
  return Array.from(element.childNodes).map(child => readableText(child, depth + 1)).join('');
}

/** Parse only in the browser after receiving the canonical published snapshot. */
export function preparePolicyContent(html: string, slug: PolicySlug): PreparedPolicyContent {
  if (typeof document === 'undefined') throw new Error('Policy content requires a browser parser.');
  // Template content is inert: even discarded image/iframe URLs must not load during parsing.
  const template = document.createElement('template');
  template.innerHTML = html;
  if (!Array.from(template.content.childNodes).map(node => readableText(node)).join('').trim()) throw new Error('Published policy contains no readable content.');

  const toc: PolicyTocEntry[] = [];
  const usedIds = new Set<string>();

  const render = (node: Node, key: string, depth = 0): ReactNode[] => {
    if (depth > 64) throw new Error('Published policy nesting is too deep.');
    if (node.nodeType === 3) return [node.nodeValue || ''];
    if (node.nodeType !== 1) return [];
    const element = node as Element;
    const tag = element.localName;
    if (element.namespaceURI !== 'http://www.w3.org/1999/xhtml' || discardedTags.has(tag)) return [];

    const children = Array.from(element.childNodes).flatMap((child, index) => render(child, `${key}.${index}`, depth + 1));
    if (!allowedTags.has(tag)) return children;

    const props: Record<string, unknown> = { key };
    if (tag === 'a') {
      const href = allowedHref(element.getAttribute('href'));
      if (!href) return children;
      props.href = href;
    }
    if (tag === 'h2') {
      const title = readableText(element).replace(/\s+/g, ' ').trim();
      if (title) {
        const normalized = headingSlug(title);
        const aliases = legacyAnchors[slug];
        const base = Object.hasOwn(aliases, normalized) ? aliases[normalized] : `policy-${normalized}`;
        let id = base;
        let count = 2;
        while (usedIds.has(id)) id = `${base}-${count++}`;
        usedIds.add(id);
        props.id = id;
        toc.push({ id, title });
      }
    }
    return [createElement(tag, props, ...children)];
  };

  const content = Array.from(template.content.childNodes).flatMap((node, index) => render(node, `${index}`));
  return { content, toc };
}
