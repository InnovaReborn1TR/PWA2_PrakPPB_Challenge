# Capability Map: Bore & Barrel Enhancements

| Module id | Responsibility | Depends on |
|---|---|---|
| catalog-performance | Unique share links, lazy-loaded catalog media, query caching, soft-delete/archive visibility | — |
| profile-workspace | Profile About/Contact sections, draft list, archive list, separate profile editor | catalog-performance |
| review-interactions | Review CRUD and thumbs up/down voting | catalog-performance |
| cart-checkout | Add to cart, cart summary, and WhatsApp checkout deep link | catalog-performance |

Build order: catalog-performance -> profile-workspace and review-interactions -> cart-checkout
