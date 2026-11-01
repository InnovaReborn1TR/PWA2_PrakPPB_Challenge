# Spec: Celeng Feature Set

## Objective

Extend the Bore & Barrel React PWA with the requested catalog sharing,
performance, profile, review, archive, and checkout workflows while preserving
the current API-first behavior and local fallback catalog.

The implementation assumes:

1. This remains a client-side React/Vite PWA; no new backend service is
   introduced.
2. Existing API endpoints remain the source of truth when available.
3. Features that have no matching backend endpoint (cart, share route, draft
   index, archive fallback, and review votes) persist locally so the UI remains
   usable offline.
4. A unique share link uses the product id in a route/query parameter and opens
   the same product detail view when the app loads that URL.
5. WhatsApp checkout uses `VITE_WHATSAPP_NUMBER`; when it is absent, the app
   reports a clear configuration error rather than silently opening a broken
   link.

## Success Criteria

- Each product detail/card exposes a Share action that copies a unique
  app-relative URL and uses the Web Share API when available.
- Product images use native lazy loading and the catalog renders incrementally
  through an intersection observer or equivalent pagination boundary.
- Identical product/review reads reuse a bounded, TTL-based in-memory cache;
  mutations invalidate the relevant cache keys.
- About and Contact are reachable as sections under Profile, without requiring
  top-level navigation items.
- Profile contains a complete draft list with restore/delete actions and an
  archive list with restore/permanent-delete actions.
- Product deletion is soft-delete/archive first; archived products are hidden
  from the active catalog and can be restored from Profile.
- A new page/section edits username and bio; the main profile summary no longer
  contains the edit form.
- Existing reviews can be edited/deleted by their owner and can receive
  thumbs-up/thumbs-down votes. Vote state is one choice per browser/user.
- Users can add products to a cart, adjust quantity/remove items, and start a
  WhatsApp checkout message beginning with `Hi aku mau pesan ...`.
- Existing CRUD, favorite, review submission, and local fallback behavior remain
  functional.

## Commands

```bash
npm run lint
npm run build
npm run dev
```

## Project Structure

- `src/App.jsx` — route/query-aware app shell and shared cart/archive handlers.
- `src/hooks/` — cached product/review data and local cart state.
- `src/services/` — API adapters and cache invalidation boundaries.
- `src/pages/` — catalog, detail, and profile sections.
- `src/components/` — reusable cards, review controls, cart, and share actions.
- `src/utils/` — draft, archive, cache, share, and checkout helpers.

## Code Style

Use existing functional React components and named helpers. Keep browser-only
storage guarded and make failures visible:

```jsx
const handleShare = async () => {
  const url = buildShareUrl(gun.id)
  try {
    await navigator.clipboard.writeText(url)
    setFeedback('Share link copied.')
  } catch (error) {
    setFeedback(error.message || 'Unable to copy share link.')
  }
}
```

Use the existing CSS class naming pattern (`btn`, `btn--primary`,
`section-title`) and lucide-react icons. Avoid adding dependencies unless an
existing package cannot provide the behavior.

## Testing Strategy

- Run `npm run lint` after each coherent implementation slice.
- Run `npm run build` as the integration gate.
- Verify cache hits/invalidation, archive transitions, cart totals, checkout
  URL encoding, share-link navigation, and draft restore with focused manual
  browser checks.
- Keep localStorage parsing defensive and verify behavior when storage or
  browser APIs are unavailable.

## Boundaries

- Always: preserve current API/local fallback behavior, validate IDs and
  quantities, invalidate stale cache entries after mutations, and show errors.
- Ask first: changes to backend schema/endpoints, authentication, payment
  processing, or committing a real WhatsApp number.
- Never: commit secrets or personal phone numbers, hard-delete data as the
  default delete action, hide API errors with success-shaped fallbacks, or
  remove existing tests/checks.

## Open Questions

- The current repository does not expose a documented archive endpoint. The
  first implementation should use a local archive overlay unless the backend
  contract is provided.
- The current repository does not expose a documented review-vote endpoint.
  The first implementation should use local per-user votes unless a backend
  contract is provided.
- No WhatsApp number is present in `.env.example`; deployment must provide
  `VITE_WHATSAPP_NUMBER`.
