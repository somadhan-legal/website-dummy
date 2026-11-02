export const PUBLIC_POLICY_API = 'https://api.somadhan.legal/v1/public/policies';
export type PolicySlug = 'terms-of-service' | 'privacy-policy';

export interface PublicPolicy {
  slug: PolicySlug;
  html: string;
  effectiveDate: string | null;
  publishedAt: string;
}

function isCalendarDate(value: unknown): value is string {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

export function validatePublicPolicy(value: unknown, slug: PolicySlug): PublicPolicy {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Invalid public policy response');
  const policy = value as Record<string, unknown>;
  const fields = ['slug', 'html', 'effectiveDate', 'publishedAt'];
  if (Object.keys(policy).some(key => !fields.includes(key))
    || policy.slug !== slug
    || typeof policy.html !== 'string' || !policy.html.trim() || policy.html.length > 4 * 1024 * 1024
    || (policy.effectiveDate !== null && !isCalendarDate(policy.effectiveDate))
    || typeof policy.publishedAt !== 'string'
    || !/^\d{4}-\d{2}-\d{2}T(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/.test(policy.publishedAt)
    || !isCalendarDate(policy.publishedAt.slice(0, 10))
    || Number.isNaN(Date.parse(policy.publishedAt))) {
    throw new Error('Invalid public policy response');
  }
  return policy as unknown as PublicPolicy;
}

export async function readPublishedPolicy(slug: PolicySlug, signal?: AbortSignal, request: typeof fetch = fetch): Promise<PublicPolicy | null> {
  const response = await request(`${PUBLIC_POLICY_API}/${slug}`, {
    method: 'GET', headers: { Accept: 'application/json' },
    credentials: 'omit', cache: 'no-store', redirect: 'error', signal,
  });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`Public policy request failed (${response.status})`);
  return validatePublicPolicy(await response.json(), slug);
}
