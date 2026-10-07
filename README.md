# StarNet Store Labs

One Bootstrap 5.3.8 renderer, multiple configured niche stores, and validated GitHub catalog publishing.

- [StoreScan Desk Lab](https://ninja-ops-guy.github.io/storescan-demo/?store=storescan-lab): home-office organization.
- [Trail Kit Lab](https://ninja-ops-guy.github.io/storescan-demo/?store=trail-kit): travel organization.

**Both stores are demonstrations.** Fixture products, evidence, prices and outcomes are synthetic.
No checkout, payment collection, customer accounts or order acceptance is implemented here.

## Shared application

`site/index.html`, `site/store.js`, `site/store.css` and vendored Bootstrap serve every tenant.
`site/stores.json` is the store directory. Tenant catalogs live at
`site/stores/<slug>/catalog.json`; adding a store does not require copying the application.
Every catalog has a release hash, explicit mode and commercial eligibility separate from deployment.

Private StarNet configuration contains niches, policies, supplier terms, economics, budgets,
agent assignments and workflow state. This repository receives only allowlisted public fields.
No credentials, private supplier terms, customer data, orders or internal profit figures belong here.

## Automated publication

The StarNet GitHub adapter creates a content-addressed branch and PR, reuses it on retries,
waits for passing schema/duplicate/link/media/price/hash/build checks, and merges only when the
configured demo automation policy permits it. It then verifies the served catalog and records a
private deployment receipt. Conflicts, failed checks and closed unmerged PRs stop automatic progress.
The Actions `storefront-preview` artifact is a downloadable static preview; hosted PR previews
are not configured. Failed validation prevents deployment and leaves the previous site intact.

The old single-store catalog/quality files remain as compatibility artifacts. New tenants use the
schema-v2 catalogs and shared renderer. Catalog-quality reports are generated and retained in build
artifacts; they do not assert conversion improvement or real profitability.

## Development

```
python3 -m http.server 8080 --directory site
node --test test/*.test.cjs
node scripts/validate-stores.cjs
node --check site/store.js
```

The actual StarNet engine, scheduler and private operations runbook remain in the existing
`starnet-commerce` project. Disabling its portfolio publisher pauses automatic PR work.
To roll back, pause the affected store and revert its catalog change through a validated PR.

Bootstrap is vendored with its MIT license. Placeholder graphics are original CSS shapes,
not supplier photography. Unknown live integrations remain blocked in StarNet rather than
being silently filled with simulated market data.
