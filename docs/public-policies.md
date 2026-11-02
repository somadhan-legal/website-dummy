# Published Public Policies

The website reads the same public Nest policy detail endpoint as the app:

- `/terms` -> `https://api.somadhan.legal/v1/public/policies/terms-of-service`
- `/privacy` -> `https://api.somadhan.legal/v1/public/policies/privacy-policy`

This is an unauthenticated, read-only `GET`. The response contract is exactly
`{ slug, html, effectiveDate, publishedAt }`. A 404 means there is no currently
published policy; network, malformed-response, and other HTTP failures show an
error with retry. No request uses admin credentials, draft endpoints, or cookies.

The API returns only the last published snapshot. Saving a draft does not alter
that public response. Unpublishing removes the document from the public reader.
The website neither writes nor publishes policy content.

## Freshness

Requests use `cache: no-store`, matching the API's `Cache-Control: no-store`.
There is no local-storage policy cache or hardcoded fallback. A fresh detail read
runs on page entry, focus, return to a visible tab, restored browser page, and
every 60 seconds while visible. The request timeout is 12 seconds. Failed refreshes
and 404 responses remove the previously displayed body rather than label it as
current. Requests are cancelled on route changes/unmount.

Pre-rendering emits only a heading and loading state, not build-time policy text.
An authorized publication can therefore appear without rebuilding the website.
This is polling/refetch behavior, not an instantaneous push subscription.

## Locale And Revision

The current API has no locale field, translation payload, or version identifier.
EN/BN page controls, headings, and dates follow the website language. The policy
body remains the published English text with `lang="en"`; the Bangla interface
explicitly explains that no approved Bangla translation has been published.
`?lang=en` and `?lang=bn` are supported. No automatic legal translation is made.

`publishedAt` is shown as the last-publication timestamp and used as the revision
marker, not presented as a separate version ID. `effectiveDate` is rendered only
when provided. Historical local update dates are not reused.

## Rendering And Navigation

An inert HTML template parser builds allowlisted React elements from published HTML. It
never inserts the response with `dangerouslySetInnerHTML`. Incoming executable
elements and attributes are discarded. Links permit only absolute HTTP, HTTPS,
and mailto destinations. H2 headings form the table of contents; matching legacy
heading fragments such as `#refund`, `#fees`, and `#deletion` are retained.

The existing account-deletion control remains a separate website utility. Its
independent seven-business-day request/success promise was removed with explicit
approval; neutral request-received copy links to the published Privacy Policy.
Its form validation, submission logic, and data are unchanged. No real deletion
request is sent during verification.

## Checks

- `npm run test:policies`: public response validation, fixed endpoint,
  unauthenticated/no-store reads, draft-shaped response rejection, 404/errors,
  repeated fresh reads.
- `npm run verify`: build, TypeScript, performance budgets, pre-rendered public
  page checks, and the policy contract tests.
- Browser verification covers actual public API text parity/CORS, locale,
  reload/history, old fragments, unavailable states, stale asynchronous requests,
  publication changes, and malicious HTML/links without database mutations.
