# StoreScan Lab — demo storefront

A static, automated research storefront. **No checkout, payments, orders or verified sales claims.**

## Automation

1. StarNet scans Thieve daily at 09:00 America/New_York 
2. Analyst, risk reviewer and operator run at 09:10 / 09:20 / 09:30.
3. A fixed-target data publisher syncs eligible discovery candidates to `site/catalog.json` hourly at minute 45. It also catches up after missed runs while StarNet is active.
4. A commit triggers GitHub Actions validation and Pages deployment. A daily cloud rebuild checks the saved catalog even when the local computer is offline; it cannot run the local crawler.

The publisher is in the private local StarNet checkout, not this public repository. It exports only public product names, source URLs, source timestamps and an explicit unverified demo status. No supplier credentials, browser profiles, prompts, financial records or keys are exported. Existing GitHub CLI authentication remains local. Unchanged catalogs produce no commit. Stale or failed scans retain the last catalog. Concurrent publisher runs are locked, and successful writes are read back before recording a local receipt. A repository commit and a successful Pages deployment are separate states.

Current data gates: Kalodata account required; Google Trends series not connected; supplier and shipping verification pending. Illustrations are abstract placeholders, not product photography. No product is cleared for real sale by appearing here. The basic exclusion filter is not legal clearance.

## Local preview

Run `python3 -m http.server 8080 --directory site`, then open http://localhost:8080.
Run `node --test test/*.test.cjs` to validate the catalog.

## Rollback / pause

Disable **StoreScan demo catalog publisher** in StarNet ROUTINES to pause updates. Disable the Pages workflow to pause deployments. To roll back, revert the relevant commit on GitHub and pause the publisher until the source issue is resolved.

Only `site/` is deployed. The workflow uses the standard GitHub Pages build artifact and deployment actions: https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages

## Bounded improvement loop

On each catalog update and daily scheduled build, `scripts/improve.cjs` evaluates catalog quality,
produces `site/experience.json`, runs tests and records changes before deployment. It proposes a
curated view with stale/duplicate/unsafe candidates withheld and unsupported title claims removed.
The raw catalog remains unchanged. The future frontend can consume the curated view; current
frontend work is deferred. History is bounded to 30 changes and unchanged evidence produces no
new quality commit. The backlog distinguishes missing demand evidence from missing real outcomes.
This is catalog-quality adaptation, not measured conversion optimization or autonomous code rewriting.
