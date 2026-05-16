---
name: ghana-lead-finder
description: Use this skill to find and qualify local business prospects in Ghana that may need a website or better online presence — shops, salons, barbershops, restaurants, chop bars, pharmacies, tailors, gyms, schools, clinics, hotels, and local services. It runs assisted web research, checks whether each business has a real standalone website or only Facebook/Instagram/WhatsApp, scores the opportunity, and returns a concise lead sheet in chat or CSV. Trigger on requests like "find website clients near me", "businesses in East Legon that need a website", "prospect gyms in Accra", or "build me a lead list of local businesses".
---

# GhanaLeadFinder

Use this skill when the user wants to discover nearby Ghanaian local businesses that could become website, social-media, or digital-marketing clients.

The default output is a compact lead sheet in chat. Create a CSV or spreadsheet only when the user asks for a file, or when the result set is large enough that a chat table would be hard to read.

This skill answers in the same language as the user prompt (default: English, Ghana's official language; Twi/Ga/Ewe/Pidgin phrasing is fine if the user uses it).

## Tools & Environment

Discovery and verification use, in order of preference:

1. **`WebSearch`** — primary discovery and website-existence checks.
2. **`WebFetch`** — read a specific public page (business site, directory listing, Google Business profile) to confirm fields.
3. **Browser skills** — *fallback only.* If `WebSearch`/`WebFetch` are unavailable, error, are rate-limited, or a needed page is unreadable by `WebFetch`, and a browser capability exists in the environment (e.g. a computer-use / Playwright-style browser skill), use it to load the page or run the search. Use it responsibly as a research aid, not a scraper, and never to bypass logins, CAPTCHAs, or paywalls.

**Capability detection (run before promising results):**

1. Issue one cheap `WebSearch` (the first category query). Usable results → proceed.
2. `WebSearch` down/empty → try `WebFetch` against known directory URLs (Fallback Ladder).
3. `WebFetch` also failing on what you need → use browser skills if available.
4. If **none** of the three work → **do not fabricate leads.** Stop, say plainly that live web access is required, and offer offline help: refine the search plan, prepare query lists, or format a CSV / outreach templates from data the user provides.

Never invent a business, phone number, URL, or address. Every concrete fact in a lead must trace to a tool result. Unverifiable field → write `Not found` (or `Unknown` for website status), never a guess.

## Operating Budget

- Cap total tool calls at roughly `2 × max_leads + 10`. Stop early with partial results rather than looping.
- Max 1 `WebSearch` per category per area, plus targeted name searches for promising candidates only.
- Verify only candidates likely to make the final list.
- At ~80% of budget, finalize with what is verified and mark the rest.
- Prefer 6 solid leads over 20 unverified ones.

## Ghana Market Context

- A **huge share of Ghanaian SMEs have no website at all** — they run on a Facebook Page, Instagram, TikTok, and a WhatsApp number. "Social only" is the most common and most valuable prospect type here.
- **WhatsApp is the primary business contact channel**, but you **cannot confirm a number is on WhatsApp without messaging it**. Treat WhatsApp as *inferred from signals* (a `wa.me`/`api.whatsapp.com` link, "WhatsApp us", "DM/chat to order", a visible catalog) and label it **`likely`** — never assert it.
- **Mobile Money (MoMo)** is the dominant payment rail. MoMo + no online checkout = prime upsell.
- Many "websites" are a **Linktree, Google Business Profile, Jiji/Tonaton listing, or free Wix/Carrd page** — count as *social only* or *weak site*, never "has site".
- Phone numbers are Ghanaian: `+233` or local `0XX XXX XXXX` (10 local digits). Normalise `+233 XX XXX XXXX` → `0XX XXX XXXX`.
  - MTN: `024 / 054 / 055 / 059` · Telecel: `020 / 050` · AirtelTigo: `027 / 057 / 026 / 056`
  - Anything that fits no Ghana prefix or isn't 10 local digits → `Phone unverified` in notes; do not present as confirmed.
- Typical small-business website projects run roughly **GHS 1,500–8,000+**; mention only if asked about pricing/outreach.

**Structural limitation (always disclose):** the best prospects are businesses with *zero* web footprint, and those are exactly the ones a web-search tool cannot find. This skill systematically over-surfaces businesses that already have *some* online presence. It is a sampling aid, not an exhaustive census — state this in every run's Caveats.

## Inputs to Collect

If missing, infer reasonable Ghana defaults and continue:

- `base_location`: address, town, landmark, or area. Default reference areas: **Accra** (Osu, East Legon, Spintex, Tema, Madina, Adenta, Dansoman, Achimota, Airport Residential), **Kumasi** (Adum, Asokwa, KNUST), **Takoradi**, **Tamale**, **Cape Coast**.
- `area_scope`: which areas count as "near". Default = the named area plus its directly adjacent areas/landmarks. **There is no geocoding** — distance is not measured. If the user gives a km radius, treat it only as a hint for how wide to set the area set (small → the area itself; large → the area + neighbouring areas / whole city), and say so. Never print a fabricated kilometre figure.
- `categories`: default `shops & boutiques, salons & barbershops, spas, restaurants & chop bars, pharmacies & chemical shops, fashion designers & tailors, auto mechanics, hotels & guesthouses, gyms & fitness centres, private schools, clinics & dental, real estate agents, event planners & decorators, printing presses`.
- `max_leads`: default 15. Clamp to `1–50`.
- `language`: match the user's language.
- `output`: default `chat table`; optional `CSV`.

Ask at most one clarifying question, and only if the base location is missing and cannot be inferred. If unanswered, default to central Accra and state the assumption.

## Compliance Guardrails

- Assisted research tool, not a bulk scraper.
- Do not bypass CAPTCHAs, login walls, rate limits, bot protections, or paywalls — including via browser skills. Gated page → treat as unreadable and fall back.
- Do not extract or resell Google Maps / Jiji / Tonaton data at scale.
- Public business facts and official business contact channels only.
- No personal emails or private personal data unless the user gives a lawful basis and the source is clearly public *business* contact info. (Ghana's Data Protection Act, 2012 (Act 843) applies.)
- Any single listing is a discovery aid — cross-check important details.

## Research Workflow (fallback at every step)

**Step 1 — Validate inputs.** Parse location, area scope, categories, max_leads. Ambiguous location ("Legon") → pick the most common interpretation, note the assumption. Location outside Ghana → this is the one hard stop: tell the user the skill is Ghana-only and ask for a Ghanaian location.

**Step 2 — Discover candidates.** `WebSearch` per category + area, e.g. `"hair salon East Legon Accra contact"`.
- Thin/no results → broaden the area, try a synonym ("saloon", "barbering shop"), or scope to a directory (`site:jiji.com.gh salon Accra`).
- Still nothing after 2 reformulations → `WebFetch` a directory landing page (Fallback Ladder); then browser skills if available.
- A whole category yields nothing → record under "categories with no results", continue.

**Step 3 — Verify promising candidates.**
- The **search result snippet is the primary evidence**, especially for social-only businesses. **Do not spend `WebFetch` calls on Facebook/Instagram URLs** — they are almost always login-walled and waste budget. Prefer, in order: the business's own site, **directory listings (Jiji, GhanaYello, BusinessGhana, Tonaton)**, **Google Business profile**, then the search snippet itself.
- If FB/IG content is genuinely needed and `WebFetch` is blocked, only then consider a browser skill — and accept that it may still be gated.
- Fetch fails → try one alternate source; if still unverified keep the lead but cap confidence at `Low` and note what's unverified.
- Sources conflict (e.g. two phones) → present the stronger/more recent one, note the conflict, confidence `Medium` at best.

**Step 4 — Website existence check.** Exact-name + area search, e.g. `"Glow Beauty Spa East Legon" official website`. No clear answer after that search → `No site found`. If even that search could not run → `Unknown`, confidence `Low` (never silently "no site").

**Step 5 — Classify website status:** `No site found` · `Social only` · `Weak site` · `Has site` · `Unknown` (definitions: standalone own-domain, maintained = `Has site`; FB/IG/TikTok/WhatsApp/Linktree/GBP/Jiji/Tonaton only = `Social only`; broken/thin/free-builder/no contact flow = `Weak site`).

**Step 6 — Freshness check (anti-stale).** Look for a dated signal: a post, review, or listing update. Record the most recent one seen. **Ghanaian SMEs churn fast and listings rot** — a business with no signal of activity within ~12 months **cannot be scored `Hot`** (cap at `Warm`) and gets a `stale?` note.

**Step 7 — Confidence:** `High` (≥2 independent sources / official page) · `Medium` (one credible source + consistent search evidence) · `Low` (incomplete, conflicting, stale, or tool-degraded).

Subagents only if the user explicitly asks for parallel verification; each verifies website/social/contact only; never let orchestration block faster direct research.

## Fallback Ladder (discovery, best → last resort)

1. `WebSearch` general (category + area + "contact").
2. `WebSearch` directory-scoped: `site:jiji.com.gh`, `site:tonaton.com`, `site:businessghana.com`, `site:ghanayello.com`.
3. `WebFetch` directory URLs directly: jiji.com.gh, tonaton.com, businessghana.com/site/directory, ghanayello.com; and Google Business / own-site pages found via search.
4. **Browser skill** (if available): load the directory search or page that `WebFetch` could not.
5. None of 1–4 work → partial results + honest "degraded run" note. **Never fabricate.**

## Lead Scoring (point rubric — deterministic)

Score each candidate by points, then apply hard gates. Show the band only; keep points in `notes` if helpful.

| Signal | Points |
| --- | --- |
| No standalone site (`No site found` or `Social only`) | +3 |
| `Weak site` | +2 |
| Reachable Ghana-format phone or likely-WhatsApp | +2 |
| Activity signal within ~12 months (post/review/listing update) | +2 |
| In the target area (not just same city) | +1 |
| `Has site` (maintained, own domain) | −4 |

**Bands:** `Hot` = total ≥ 7 **and all three gates true**: (no real standalone site) **and** (reachable contact) **and** (fresh ≤ ~12 months). `Warm` = 4–6, or ≥7 but a gate fails (e.g. stale). `Low` = ≤ 3, or confidence `Low`/`Unknown`, or a maintained site exists. `Skip` = closed, duplicate, outside area scope, irrelevant category, branch of a national chain with a central site, or not a real prospect.

Tie-break when over `max_leads`: higher confidence → fresher activity → stronger no-site signal.

## Output Format

Run header line first:

`Search: <categories> · area: <area scope, e.g. "East Legon + adjacent (American House, Shiashie)"> · <date> · <N> leads · Mode: <full | degraded>`

Then a concise markdown table:

| Score | Business | Category | Area/Proximity | Website status | Website/Social | Phone | WhatsApp | Why it is a prospect | Confidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

Rules:

- `Area/Proximity` is qualitative: `In East Legon`, `Adjacent: American House`, or `Same city: Accra`. **Never a kilometre figure.**
- `WhatsApp`: `likely (wa.me)` / `likely (stated)` / `Not found` — never asserted as confirmed.
- `Why it is a prospect`: short and actionable ("Facebook + Jiji only, sells via DM, no booking; active this year").
- Missing field → `Not found`; unchecked website status → `Unknown`. Never blank, never invented.
- Phone in local Ghana format with network if the prefix is recognisable.
- After the table, **`Best first outreach targets`**: top 3 leads, one practical reason each + a one-line WhatsApp-style opener. Fuller scripts: `assets/outreach-templates.md` (note its anti-spam rules).
- **`Caveats`** block, always include: degraded mode? categories with no results? clamped inputs? low-confidence/stale leads? **and always the structural-limitation line** ("Web search can't see businesses with zero online footprint — the strongest prospects — so this is a sample, not a complete list.").
- **Zero qualified leads**: no empty table. Explain why and propose concrete next steps (wider area, different categories, nearby area).

## CSV / File Output

Columns (see `assets/lead-template.csv`):

```csv
score,business,category,area_proximity,website_status,website_url,social_urls,phone,whatsapp_status,source_urls,why_prospect,confidence,notes
```

When the user asks for a file: build the rows, then **use the `Write` tool** to save to `./ghana-leads-<area-slug>-<YYYY-MM-DD>.csv` in the working directory (or a path the user specifies). Confirm the saved path in the reply. RFC-4180 quoting: wrap any field containing a comma, `"`, or newline in double quotes and escape `"` as `""`; UTF-8; exactly one header row. Do not claim a file was written unless the `Write` call succeeded.

A correct, full-shape output is shown in `examples/sample-run.md` — match that structure.

## Quality Checks (before finalizing)

- **Dedupe** on name + area + phone (not exact string): one business across Facebook + Jiji + Maps = one lead.
- Never `Hot` if a maintained standalone site exists, or if not fresh within ~12 months, or contact unreachable.
- Never claim a site is missing unless an exact-name search actually ran; else `Unknown`.
- Never present a non-Ghana-format or unverifiable phone as confirmed; never assert WhatsApp.
- Drop candidates not tied to any tool result.
- Confirm the run header and the mandatory structural-limitation caveat are present.
- Re-read the output: every concrete value traceable to a source, or it is downgraded/removed.
