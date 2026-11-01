# Celeng Tasks

- [x] Task 1: Add cache, archive, share, and cart storage helpers
  - Acceptance: Helpers are namespaced, defensive, and expose cache invalidation.
  - Verify: `npm run lint`
  - Dependencies: None

- [x] Task 2: Add cached/incremental catalog reads and soft-delete filtering
  - Acceptance: Repeated reads reuse cache; archived IDs are excluded.
  - Verify: `npm run build`
  - Dependencies: Task 1

- [x] Task 3: Add share and add-to-cart actions to card/detail views
  - Acceptance: Share URL copies/opens; cart quantity updates correctly.
  - Verify: Manual browser smoke check
  - Dependencies: Tasks 1-2

- [x] Task 4: Move About/Contact into Profile sections and add draft/archive lists
  - Acceptance: Profile exposes all drafts and archived products with actions.
  - Verify: Manual profile smoke check
  - Dependencies: Tasks 1-2

- [x] Task 5: Add separate profile editor page/section
  - Acceptance: Name/bio editing is separate from the profile summary.
  - Verify: `npm run lint`
  - Dependencies: Task 4

- [x] Task 6: Add review edit/delete and thumbs voting
  - Acceptance: Owner CRUD and one local vote per review work.
  - Verify: `npm run build`
  - Dependencies: Task 1

- [x] Task 7: Add cart page and WhatsApp checkout flow
  - Acceptance: Checkout creates an encoded WhatsApp URL with the requested
    greeting and line items.
  - Verify: Manual browser smoke check
  - Dependencies: Task 3

## Checkpoint

- [x] Lint and build pass
- [x] All approved success criteria verified
