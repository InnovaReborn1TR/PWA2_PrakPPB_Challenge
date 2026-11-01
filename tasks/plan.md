# Implementation Plan: Celeng Feature Set

## Overview

Deliver the approved Celeng capabilities as small vertical slices over the
existing React/Vite SPA, using local persistence for capabilities not covered
by the current backend contract.

## Architecture Decisions

- Add a small TTL query cache in the service layer rather than introducing a
  state-management dependency.
- Keep cart, archive overlay, draft index, profile editor, and review votes
  browser-local until backend contracts exist.
- Treat product share URLs as app URLs with `?gun=<id>` and resolve them in
  `App.jsx`, preserving the existing manual navigation state.
- Make delete archive first and keep a separate permanent-delete action.
- Read the WhatsApp number from `VITE_WHATSAPP_NUMBER`; never commit the
  supplied personal number.

## Task List

### Phase 1: Foundation and catalog

- [ ] Task 1: Add cache, archive, share, and cart storage helpers
- [ ] Task 2: Add cached/incremental catalog reads and soft-delete filtering
- [ ] Task 3: Add share and add-to-cart actions to card/detail views

### Checkpoint: Foundation

- [ ] `npm run lint` passes
- [ ] `npm run build` passes
- [ ] Share links and cart state survive reload

### Phase 2: Profile workspace

- [ ] Task 4: Move About/Contact into Profile sections and add draft/archive lists
- [ ] Task 5: Add separate profile editor page/section

### Checkpoint: Profile

- [ ] Profile has no inline name/bio editor
- [ ] Draft restore/delete and archive restore/permanent-delete work

### Phase 3: Reviews and checkout

- [ ] Task 6: Add review edit/delete and thumbs voting
- [ ] Task 7: Add cart page and WhatsApp checkout flow

### Checkpoint: Complete

- [ ] All acceptance criteria in `SPEC-celeng.md` are met
- [ ] `npm run lint` and `npm run build` pass
- [ ] Runtime smoke checks cover direct share URL, archive, review CRUD/vote,
      cart quantity, and encoded WhatsApp message

## Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Backend lacks archive/vote endpoints | Medium | Use a namespaced local overlay and keep service boundaries ready for API wiring |
| Existing API response shapes differ | High | Reuse `normalizeProduct` and invalidate caches after mutations |
| Browser storage or clipboard unavailable | Medium | Guard storage access and expose a visible error/fallback |
| Checkout number absent in deployment | High | Fail explicitly with configuration guidance |

## Open Questions

- Backend archive and review-vote contracts can replace local overlays later.
- Deployment must configure `VITE_WHATSAPP_NUMBER`.
