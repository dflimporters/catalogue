# DFL Catalogue 2026 — Project Context

Handoff notes for continuing this build in Claude Code. Read this first.
History before 2026-09-10 (Covebay-primary green/blue branding, revenue
badges, the old xlsx-derived product list) is superseded — see git-less
history in this file's earlier prose if you need it, but don't rebuild
against it.

## What this is (as of 2026-09-10)

A DFL Importers product catalogue, web-first, **DFL-branded** (not
Covebay-branded) with Covebay as the featured/first product set, plus five
other DFL-distributed brands. Not professionally printed — no CMYK/bleed
constraints.

**No dollar figures anywhere in this catalogue** — explicit instruction.
Don't reintroduce revenue/price badges even as a "nice to have."

## "What we do" gallery upgrade (2026-09-10, fifth same-day round)

Joel shared a reference screenshot (3 gradient-icon-on-photo pillar cards:
Import & Distribution / Warehouse & Logistics / Hospitality & Foodservice)
and asked for icons + images added to "the stock images part" — read as the
existing `.cover-gallery` (Main Office/Inbound/Outbound), not the facts
section, since that's the only image content on the cover. Explicit
constraints: no gradient icon stroke, keep the outline-card-with-dividers
look already established by `.cover-facts-grid`.

- `.cover-gallery` restructured to match that ask: one bordered/shadowed
  card (`.cover-gallery-grid`, same visual language as `.cover-facts-grid`)
  containing 3 columns (`.gallery-col`) separated by `border-left` dividers
  — not 3 separate floating cards like the reference.
- Each column: real photo (unchanged assets — Main Office/Inbound/Outbound,
  **not** generic stock photography; "stock images" in the request was
  interpreted as "the image section," not literally new stock photos, since
  we have real facility photos and fabricating stand-in stock imagery isn't
  needed) → a solid flat-`--dfl-blue` circular icon (`.gallery-icon`, 42px,
  white border ring, no gradient) overlapping the photo/text boundary via
  negative `margin-top` → bold title (kept as the real facility name, not
  reworded to match the reference's generic capability names) → a short,
  factual one-line caption describing what's visibly happening in that
  specific photo (not invented specifics — "our head office," "containers
  arriving," "orders picked/packed/shipped" are descriptions of what the
  photo shows, not claims about volumes or capabilities).
- Icons are new hand-drawn SVGs (building/office, globe, truck) added
  inline in the markup, following the same stroke-icon convention as
  everywhere else (`stroke-width` ~1.7, `currentColor`).
- This made the gallery block noticeably taller than before (~311px vs the
  prior ~243px), so `.cover-hero`/`.cover-facts` padding needed re-tuning
  again to keep the cover at ~1056px total — same iterative
  `getBoundingClientRect` measurement approach as every other cover pass.
  If you touch cover spacing again, re-measure, don't assume the numbers
  currently in `catalogue.css` still add up after your change.

## Variable page height + Company Snapshot stats + compact banner (2026-09-10, fourth same-day round)

- **`assets/catalogue.js` no longer assumes every page is 1056px tall.**
  `scaleFrames()` used to hardcode `PAGE_H=1056`; it now reads each page's
  own `offsetHeight` at scale time (`transform:scale` doesn't affect
  `offsetHeight`, so this is safe and simple — no data attributes needed).
  This is what makes the next point possible; if you ever add another
  variable-height page, it just works, nothing else to wire up.
- **`03-covebay-banner.html`** (and its `index.html` mirror) is now genuinely
  short — `.page.divider{height:auto}` sizes it to just the header + banner
  image + intro text, instead of forcing the full 1056px canvas with a
  giant empty gap below. The one thing that made this non-trivial: `.footer`
  is normally `position:absolute;bottom:0`, which is invisible to a
  `height:auto` parent's size calculation (absolutely-positioned children
  don't contribute to auto-height). Fixed with `.page.divider .footer
  {position:static}` so it flows in-document and actually gets counted.
  If you add another short/variable-height page, remember this — don't
  just add `height:auto` to `.page` and expect the footer to behave.
- **Cover page**: blue photo hero shrunk 560px → 320px (~43% shorter, per
  "make the blue section shorter"), gallery padding tightened so the 3 ops
  photos sit higher on the page, and a new **"Company Snapshot" stats
  section** added below the gallery (`.cover-facts` / `.cover-facts-grid` /
  `.fact` / `.fact-num` / `.fact-label`) — 5 stats in a bordered white card
  matching the existing card design language (not the busy yellow-circle
  photo-collage from Joel's reference slide — he explicitly said "no need
  to match the design... just retrieve the facts and design it in a modern
  way"). The 5 facts, as given: 165+ Employees, 14 Parishes Served, 160
  Truck loads weekly, 50,000 sq ft storage across 4 warehouses, Food
  Service (dedicated division) — these are hardcoded copy pulled from a
  slide Joel shared, not from Supabase; if the real numbers change, they
  need to be updated by hand in both `01-cover-v3.html` and `index.html`.
  Total page height re-tuned to hit ~1056px again the same way as before
  (measure each section's rect via `getBoundingClientRect`, adjust padding,
  repeat) — see the cover-hero/cover-gallery/cover-facts values in
  `catalogue.css` as the current tuned state; don't guess new padding
  without re-measuring, the box model here is fiddly (border-box + a
  bordered card + a grid-with-dividers all stacked).

## Cover rebuild + all 29 cards now photographed (2026-09-10, third same-day round)

- **All 29 cards now have real photography** — Joel provided the last one
  (`Kraft Microwaveable.jpg` → Microwaveable Take-Out Containers, Covebay
  Take-Out page). `DFL_Catalogue_2026_Image_Checklist_v2.xlsx` is fully
  marked Y. No more `.picon` icons in use anywhere except as the "no photo"
  fallback pattern itself (still valid CSS, just currently unused).
- **Cover page rebuilt from scratch**, modeled on DFL's real digital
  business-card page (dflimporters.com) which Joel screenshotted as
  reference: thin white top bar with a centered color logo
  (`.cover-topbar`/`.cover-logo`), then a full-bleed photo hero with a blue
  gradient + dot-grid overlay (`.cover-hero`/`.cover-hero-bg`/
  `.cover-hero-overlay` — reuses the same dot-grid trick as `.hero::before`
  elsewhere, just applied over a photo instead of a flat gradient), then a
  3-photo "operations" strip (`.cover-gallery`) showing Main Office /
  Inbound / Outbound (`assets/products/DFL Main Office.png`, `DFL
  Inbound.png`, `DFL Outbound.png` — Joel's own facility photos, not stock).
  All of the old cover elements are gone per explicit instruction, don't
  bring them back: the `dflimporters.com` top-right text, the "Kingston,
  Jamaica" / "The team that cares" grey pills (`.badge`/`.badge-row`), and
  the 7-brand pill strip above the hero (`.brand-strip`/`.brand-pill`) — all
  judged to "serve no purpose." Their CSS was deleted, not just unused.
- **The old giant Covebay photo that used to fade in at the bottom of the
  cover is gone entirely** (`.bgwrap`/`.fade`/`.lowscrim`/`.strip`/`.cat`
  CSS all deleted with it). It's replaced by a **new dedicated divider page**
  between TOC and the first Covebay page: `03-covebay-banner.html` (also
  inserted into `index.html` as `#covebay-banner`, between `#toc` and
  `#covebay-cups` — not in the sitenav or the TOC tile grid, it's a pure
  visual transition, not a "section"). Uses `assets/products/Covebay Feature
  Image Banner.png` (a wide ~4:1 banner, not the old tall group photo) shown
  at natural width, centered, on a plain light page — new CSS classes
  `.divider-header`/`.divider-body`/`.divider-eyebrow`/`.divider-title`/
  `.divider-sub`. This finally uses page-tag `03`, previously called out in
  this file as "unused/reserved."
- **Sitenav**: centered (`justify-content:center` added to `.sitenav`), and
  the `Cover` / `Back Cover` links removed (7 links now, product sections
  only). Note this is the *sticky nav* only — the TOC page's own tabs and
  tiles still list Cover and Back Cover, that wasn't touched and shouldn't
  be; TOC's job is a complete index, the sticky nav's job is quick jumps
  while mid-scroll.
- **Footer text** changed everywhere, standalone files and `index.html`
  alike: `DFL Importers` → `DFL Importers | Catalogue 2026` (literal pipe
  character, not a middot). If you add a new page, match this exactly.

## Logo contrast fix + brand chips enlarged (2026-09-10, same-day follow-up)

- `.logo` (DFL header logo on every hero) and `.bc-logo` (back cover) now
  force `filter:brightness(0) invert(1)`. Without it, the blue "D" baked
  into `dfl-logo-white.png` sits at nearly the same hue as the hero gradient
  start color and disappears/clashes — flagged by Joel. The filter makes the
  whole mark solid white regardless of the source file's own colors, so this
  is safe even if the logo asset changes.
- `.hero-brand-chip` (the white pill holding a brand's own logo in the hero
  body) roughly doubled in size (28px→52px chip height, 15px→30px logo
  height) plus a drop shadow, per "too small, make it bigger but not
  overpowering." Single-brand pages (Covebay's two pages, Rhino) use the
  `.solo` size variant (60px/36px) and get a `.hero-brands-label` caption
  ("Featured brand") above the chip; the 4-logo household/paper page keeps
  the base size with a "Brands on this page" label instead — more logos in
  a row don't need to be as large individually to read as prominent.

## Product list spreadsheet (built 2026-09-10, revised same day)

`DFL_Catalogue_2026_Product_List_v2.xlsx` — the `_v2` suffix is *not*
meaningful versioning, it's because the original `..._List.xlsx` was open
(locked) in Excel on Joel's machine when the revision needed writing.
**If both files exist in the folder, `_v2` is the current one** — the
original is stale and should be deleted once Joel closes it, to avoid
someone opening the wrong one.

Built with Node + `exceljs` (this machine has no working Python — the xlsx
skill's openpyxl/pandas path assumes one; the WindowsApps `python`/
`python3`/`py` shims here just redirect to the Store installer). If a future
session hits the same wall, `npm install exceljs` in a scratch dir works
fine and supports real formulas (`{formula: '...'}`), freeze panes,
autofilter, and cell styling — just no LibreOffice-based recalc step, so
formulas compute whenever Excel itself next opens the file, not at write
time. Build script + source JSON: ask for them again if not still in a
scratch dir — they weren't checked into this project folder.

Three sheets: **Cards in Catalogue** (29 cards — 25 backed by real Supabase
SKUs, plus the 4 no-SKU "New for 2027" cards with a `COUNTIFS` formula that
correctly returns 0 for those, flagged in a Notes column), **All SKUs Used
(88)** (every real Supabase SKU behind the 25 real cards), **Notes &
Caveats** (Ol' Timez Mackerel — no active SKU, not included; and a note that
the 4 New-for-2027 cards are a preview with no real SKU yet). Page-number
prefixes in the "Page" column (04, 05, 06...) match the live page-tags
exactly — keep them in sync if pages are reordered again.

## Brand scope (revised 2026-09-10, same day as the rebuild above)

- **Covebay** — DFL's house brand, featured first and biggest, across 3
  pages (2 real, 1 preview — see below).
- **Domino** (toilet paper), **Bingo** (hand towel), **Rhino** (garbage
  bags), **Clean & White** (bleach), **White & Bright** (powder detergent),
  **Ol' Timez** (ginger beer, coconut oil, corned beef — added back same day
  after initially being cut; Mackerel is NOT included, no active SKU exists
  for it in `price_products`).
- **Covebay "New for 2027"** (Bath Tissue, Paper Towel, Soap Powder, Easy
  Dispense Garbage Bags) is included as an explicit preview page — Joel's
  call, deliberately reframed from "New for 2026" (this catalogue's own
  year) to "New for 2027" since these have no real SKU and the 2026 edition
  is already underway. Every card says "Details to be confirmed — no DFL SKU
  yet" — don't invent specs/pricing for these even under pressure to fill
  the page out; update honestly once real SKUs exist.

## Product data source — Supabase, not the old xlsx

Products are now pulled live from Supabase project `hzagwndglwhcepsirafi`,
table `public.price_products` (`product_name`, `category`, `brand`,
`pack_size`, `dfl_sku`, `active`). Query pattern used to build this edition:

```sql
select product_name, category, active, dfl_sku from price_products
where product_name ilike '%covebay%' or product_name ilike '%domino%'
   or product_name ilike '%bingo%' or product_name ilike '%rhino%'
   or product_name ilike '%clean & white%' or product_name ilike '%white & bright%'
order by active desc, category, product_name;
```

This returned 80+ active real SKUs across the 6 brands — far more granular
than the card families in the previous (xlsx-derived) edition. Cards in this
build are **consolidated by product family** (e.g. all Rhino Ezee-Pull sizes
→ one "Ezee-Pull Garbage Bags" card with sizes folded into the spec line),
not one card per literal SKU — re-run a similar query and re-derive families
by hand if products are added/removed; there's no live sync.

⚠️ **This is a full production database**, not a catalogue-only project —
it also holds invoices, customer data, budgets, rep commissions, fleet, HR,
etc. `list_tables` surfaced a **critical security advisory**: 21 tables have
Row Level Security disabled (including `invoices`, `sales_orders`,
`customers`-adjacent tables, budget tables), meaning the anon key can read
or write them. This is unrelated to the catalogue task but was surfaced
in-band — Joel/whoever owns this Supabase project should review it. Don't
auto-apply the fix; enabling RLS with no policies will break whatever
currently depends on anon access to those tables.

The old `DFL_Catalogue_2026_Product_Decisions.xlsx` (403 SKUs, revenue
figures, HERO/FEATURE/KEEP/ADD/CUT recommendations) is now fully superseded
— don't pull from it, and don't reintroduce its revenue figures per the "no
dollar figures" instruction above.

## Design system (rebranded 2026-09-10 — DFL blue/black/white, not Covebay green/blue)

```css
--dfl-blue:#2C67D2;      --dfl-blue-deep:#15295C;
--ink:#12161C;           --bg:#F4F5F7;         --card:#FFFFFF;
--line:rgba(18,22,28,0.08);
--orange:#F5A623;        --orange-deep:#D9890F;   /* "NEW" flag colour only */
--text-soft:#5B6472;     --text-faint:#8B93A0;
--radius:16px;           --radius-sm:10px;
```

- `--dfl-blue` sampled directly from `assets/dfl-logo-color.png` (pixel
  `#2C67D2`, confirmed at 3 points) — don't re-guess it.
- Covebay's old green is gone entirely. Orange survives only as the small
  "NEW" flag accent, not as a structural color.
- Hero bands: diagonal gradient `155deg, var(--dfl-blue) → var(--dfl-blue-deep)`
  (was blue→green). Back cover: `155deg, var(--dfl-blue) → var(--ink)`.
- **DFL logo at the top of every page**, not Covebay's. Use
  `assets/dfl-logo-white.png` on colored hero/back-cover backgrounds,
  `assets/dfl-logo-color.png` on the white cover background. Covebay (and
  other brands') logos now appear only as small white "chip" badges inside
  a page's hero body (`.hero-brands` / `.hero-brand-chip`) — a little white
  rounded pill holding the brand's own logo image, so any brand's original
  colors read cleanly regardless of the blue hero behind it.
- **`.picon` vs `.thumb`**: cards without a real photo show a small
  stroke-icon (`.picon`, 8 hand-drawn SVGs: cup, plate/circle, spoon, straw,
  box, roll, bag, sparkle — reused across cards by rough category). As of
  2026-09-10, 28 of 29 cards have real photography and use `.thumb` instead
  (`<div class="thumb"><img src="assets/products/<file>" alt="<card name>">
  </div>`, 64px/96px-feature, `object-fit:contain` on a light background) —
  see "Still open / next steps" above for the one exception and the mapping
  gotcha hit while wiring these in. The old `.pending-flag` "PHOTO PENDING"
  treatment is unused dead CSS at this point — don't reintroduce it, use
  `.picon` for "no photo yet" instead, it's the live convention now.
- Cards are single-row (icon left, name+specs right) — `.card{flex-direction:row}`
  — not the old vertical thumb-on-top layout, since there's no photo to
  anchor a taller layout.
- Font: Inter only, weights 400–900. Fixed 816×1056px page canvas per
  `<html>` file, scaled responsively in `index.html` via
  `assets/catalogue.js` (unchanged from the prior web-catalogue pivot).

## Logo assets (uploaded 2026-09-10, in `assets/`)

| File | Use |
|---|---|
| `dfl-logo-color.png` | Full-colour DFL lockup (blue "D" + black "FL IMPORTERS" + italic "'The Team That Cares'") — white backgrounds (cover). |
| `dfl-logo-white.png` | Same lockup, solid white — colored hero bands, back cover. |
| `covebay-logo.png` | Existing Covebay logo (from the prior edition) — now used only as a small hero-body brand chip on Covebay pages. |
| `domino-logo.png`, `bingo-logo.png`, `clean-white-logo.png`, `white-bright-logo.png`, `rhino-logo-black.png`, `rhino-logo-white.png` | Brand chips on their respective pages. Rhino has both a black and white variant; black is used since chips sit on a white pill regardless of hero color. |

All were renamed from their original uploaded filenames (which had spaces/
parens) to clean kebab-case slugs — original filenames are gone, these are
the only copies.

## Pages (rebuilt 2026-09-10 — old page files for this range were deleted, not kept)

| File | Status |
|---|---|
| `index.html` | Live scrolling site — nav + all 10 sections below |
| `01-cover-v3.html` | Cover — rebuilt 2026-09-10, see above. Top logo bar, photo hero w/ blue overlay, 3-photo ops gallery. No page-tag (matches back cover's untagged treatment). |
| `toc.html` | Table of contents — hero pill tabs + 8-tile card grid (Cover + 6 sections + Back Cover). Page-tag `02`. |
| `03-covebay-banner.html` | **New page, added 2026-09-10** — Covebay intro/divider banner between TOC and the first Covebay page, see above. Page-tag `03` (previously unused). |
| `02-covebay-cups.html` | Covebay Cups, Plates & Hot Drinkware (7 families, all photographed). Page-tag `04` — yes, filename `02` / page-tag `04` is a real mismatch, predates the banner page insert; not worth a filename churn to fix, the page-tag is what actually displays. |
| `03-covebay-takeout.html` | Covebay Take-Out, Foil & Wrap (7 families, all photographed). Page-tag `05`. |
| `04-covebay-new-2027.html` | Covebay "New for 2027" preview (Bath Tissue, Paper Towel, Soap Powder, Easy Dispense Garbage Bags), no real SKUs, `NEW FOR 2027` orange flag on every card. Page-tag `06`. |
| `05-household-paper.html` | Domino, Bingo, Clean & White, White & Bright (4 families, all photographed). Page-tag `07`. |
| `06-rhino-garbage-bags.html` | Rhino, 4 families, all photographed. Page-tag `08`. |
| `07-oltimez.html` | Ol' Timez Beverages & Pantry (Ginger Beer, Coconut Oil, Corned Beef — 3 families, all photographed). No Mackerel (no active SKU). Page-tag `09`. |
| `back-cover.html` | Back cover — DFL white logo; contact line still deliberately generic pending real contact details from Joel. No page-tag. |

Page-tag numbers (the small "NN / brands" text in each hero) now run, in
actual reading order: 01(cover, untagged) → 02(toc) → 03(covebay-banner) →
04(covebay-cups) → 05(covebay-takeout) → 06(covebay-new-2027) →
07(household-paper) → 08(rhino) → 09(oltimez) → back cover (untagged).
**Filenames no longer match this order** (`02-covebay-cups.html` displays
page-tag `04`, etc.) — that ship sailed when the banner page took slot `03`
without a full renumbering pass. Not a bug, just don't be surprised by it;
the page-tag (what's actually visible) is authoritative, not the filename.

Old files from the 2026-09-09/10 rebuild were deleted outright (not kept as
"safe to delete" leftovers) since their content was fully superseded:
`02-covebay-spread-v4.html`, `03-covebay-eco-takeout.html`,
`04-covebay-household.html`, `05-essentials-v2.html`.

## Local preview

No plain `file://` open for `index.html` (relative asset paths need a real
origin — the pages work fine standalone via `file://` since sibling-relative
`<img>`/`<link>` resolution doesn't need CORS, but `index.html`'s design was
validated through a real server). Use `.claude/launch.json`'s
`catalogue-preview` config (`node .claude/dev-server.js`, port 5183) or any
static server.

## Still open / next steps

- **Product photography: done.** All 29 cards now have real photos in
  `assets/products/` (Joel's own filenames, matched up by hand against
  `DFL_Catalogue_2026_Image_Checklist_v2.xlsx`, which has every row marked
  Y). Wired in via `.thumb` (see Design system below); `.picon` icons are
  no longer in active use anywhere but the CSS class stays valid for any
  future card that ships before its photo does.
  ⚠️ **Gotcha hit while wiring these in, worth remembering**: a naive
  regex that matches `picon-block + following cname` and replaces the
  picon can badly misfire when one card in the middle of a page has *no*
  photo (or when two cards share byte-identical icon SVG markup) — a lazy
  `[\s\S]*?` will backtrack **across the unmatched card's entire block**
  into the next card's picon, silently shifting every subsequent image
  onto the wrong card. Correct approach: split the file into per-card
  chunks first (`content.split(/(?=<(?:div|a) class="card)/)`), extract
  each chunk's own `cname`/`tile-title` as ground truth, and only ever
  touch the picon/thumb *within that specific chunk*. This corrupted 03,
  06, and the TOC tiles in index.html on the first pass (including several
  TOC nav tiles far away in the same file) — full corrective pass + a
  manual re-check of every cname-against-thumb pairing across all 8 files
  caught and fixed it. If you add more cards/photos later, use the chunk
  approach from the start, not the naive one.
- **Contact/order info**: back cover still says "contact your DFL sales
  representative" — needs real phone/email/address from Joel to expand,
  same as before.
- **Supabase RLS advisory**: 21 tables exposed to the anon key, including
  financial/customer data — surfaced above, not fixed, needs Joel's call on
  policies before enabling RLS.
- Not yet decided: does Rhino's biodegradable "Green" line deserve more
  emphasis (it's currently just the last card, styled as a closing feature)?
- Eventual goal (unchanged): a `catalogue_products` Supabase table purpose-
  built for the catalogue (this round used `price_products` directly, which
  is a pricing/ops table, not catalogue-shaped — fine for a first pass, but
  a dedicated table with a `status: live|planned` column would let "coming
  soon" items (like the New-for-2026 lines) be represented honestly).
