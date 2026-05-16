---
name: ghana-lead-finder
description: Use this skill to find and qualify local business prospects in Ghana that may need a website or better online presence — shops, salons, barbershops, restaurants, chop bars, pharmacies, tailors, gyms, schools, clinics, hotels, and local services. It runs assisted web research, checks whether each business has a real standalone website or only Facebook/Instagram/WhatsApp, scores the opportunity, and returns a concise lead sheet in chat or CSV. Trigger on requests like "find website clients near me", "businesses in East Legon that need a website", "prospect gyms in Accra", or "build me a lead list of local businesses".
---

# GhanaLeadFinder

Use this skill when the user wants to discover nearby Ghanaian local businesses that could become website, social-media, or digital-marketing clients.

The default output is a compact lead sheet in chat. Create a CSV or spreadsheet only when the user asks for a file, or when the result set is large enough that a chat table would be hard to read.

This skill answers in the same language as the user prompt (default: English, Ghana's official language; Twi/Ga/Ewe/Pidgin phrasing is fine if the user uses it).

## Tools & Environment

This skill uses **only the `WebSearch` and `WebFetch` tools**. There is **no browser, no Google Maps automation, no scraping, and no logged-in session** — never assume one, and never tell the user to open a browser.

- `WebSearch` — primary discovery: find candidates and check for websites.
- `WebFetch` — verification: read a specific public page (business site, Facebook/Instagram page, directory listing) to confirm fields.

**Capability detection (run this first, before promising results):**

1. Issue one cheap `WebSearch` (e.g. the first category query). If it returns usable results, proceed normally.
2. If `WebSearch` is unavailable, errors, or returns nothing usable → fall back to `WebFetch` against known directory URLs (see Fallback Ladder). Tell the user discovery is degraded.
3. If **both** tools are unavailable or blocked → **do not fabricate leads**. Stop, explain plainly that live web access is required, and offer what you *can* do offline: refine the search plan, prepare query lists, or format a CSV/outreach templates from data the user provides.

Never invent a business, phone number, URL, or address. Every concrete fact in a lead must trace to a tool result. If a field cannot be verified, write `Not found` — never a guess.

## Operating Budget (keep it bounded)

To stay reliable and avoid rate limits:

- Cap total tool calls at roughly `2 × max_leads + 10` (search + verify). Stop early and return partial results rather than looping.
- Max 1 `WebSearch` per category per area, plus targeted name searches for promising candidates only.
- Verify (`WebFetch`) only candidates likely to make the final list, not every raw hit.
- If you hit ~80% of the budget, finalize with whatever is verified and clearly mark the rest.
- Hard time/effort sense: prefer returning 6 solid leads over 20 unverified ones.

## Ghana Market Context

Keep these realities in mind — they change how leads are scored:

- A **huge share of Ghanaian SMEs have no website at all**. They run entirely on a Facebook Page, Instagram, TikTok, and a WhatsApp Business number. This is the norm, not the exception — so "social only" is the single most common and most valuable prospect type here.
- **WhatsApp is the primary business contact channel.** A WhatsApp/MoMo number is often the only "contact info" a business publishes. Treat an active WhatsApp Business catalog as a strong buying signal (they already sell online, just badly).
- **Mobile Money (MoMo)** is the dominant payment rail. A business that takes MoMo but has no online checkout or site is a prime upsell.
- Many "websites" are actually a **Linktree, a Google Business Profile, a Jiji/Tonaton listing, or a free Wix/Carrd page** — count these as *social only* or *weak site*, never as "has site".
- Phone numbers are Ghanaian: `+233` country code or local `0XX XXX XXXX` (9 digits after the leading 0). Normalise `+233 XX XXX XXXX` → `0XX XXX XXXX`.
  - MTN: `024 / 054 / 055 / 059`
  - Telecel (formerly Vodafone): `020 / 050`
  - AirtelTigo: `027 / 057 / 026 / 056`
  - A number that fits no Ghana prefix, or is not 10 local digits, is suspect → mark `Phone unverified` in notes, do not present it as confirmed.
- Typical small-business website projects in Ghana run roughly **GHS 1,500–8,000+**; mention budget framing only if the user asks about pricing/outreach.

## Inputs to Collect

If missing, infer reasonable Ghana defaults and continue:

- `base_location`: address, town, landmark, or area. Default reference cities: **Accra** (Osu, East Legon, Spintex, Tema, Madina, Adenta, Dansoman, Achimota, Airport Residential), **Kumasi** (Adum, Asokwa, KNUST), **Takoradi**, **Tamale**, **Cape Coast**.
- `radius_km`: default 15 km. Clamp to `1–100`; values outside are coerced and noted.
- `categories`: default `shops & boutiques, salons & barbershops, spas, restaurants & chop bars, pharmacies & chemical shops, fashion designers & tailors, auto mechanics, hotels & guesthouses, gyms & fitness centres, private schools, clinics & dental, real estate agents, event planners & decorators, printing presses`.
- `max_leads`: default 15. Clamp to `1–50`.
- `language`: match the user's language.
- `output`: default `chat table`; optional `CSV`.

Ask a concise clarification **only** if the base location is missing and cannot be inferred from the prompt or recent context. Do not ask more than one clarifying question; if unanswered, default to central Accra and state the assumption.

## Compliance Guardrails

- Use web search and page fetches as an **assisted research tool, not a bulk scraper**.
- Do not bypass CAPTCHAs, login walls, rate limits, bot protections, or paywalls. If a page is gated, treat it as unreadable and fall back — never work around the control.
- Do not extract or resell Google Maps / Jiji / Tonaton data at scale.
- Prefer public business facts and official business contact channels.
- Do not collect personal emails or private personal data unless the user explicitly provides a lawful basis and the source is clearly public *business* contact information. (Ghana's Data Protection Act, 2012 (Act 843) governs personal data — stick to public business contact info.)
- Treat any single listing source as a discovery aid only. Cross-check important details with independent public sources.

## Research Workflow (with fallbacks at every step)

Each step has a primary action and a fallback. If a step fails, take the fallback and continue — never abort the whole run because one query failed.

**Step 1 — Validate inputs.**
Primary: parse location, radius, categories, max_leads.
Fallback: location ambiguous (e.g. "Legon" could be East Legon / Legon / American House) → pick the most common interpretation, proceed, and note the assumption. Location outside Ghana → tell the user this skill is Ghana-only and ask for a Ghanaian location (this is the one hard stop).

**Step 2 — Discover candidates.**
Primary: `WebSearch` per category near `base_location`, e.g. `"hair salon East Legon Accra contact"`, `"chop bar Spintex"`.
Fallback A: thin/no results → broaden ("Accra" instead of the neighbourhood), try a synonym ("barbering shop", "saloon"), or a directory-scoped query (`site:jiji.com.gh salon Accra`).
Fallback B: still nothing after 2 reformulations → `WebFetch` a directory landing page directly (see Fallback Ladder) and read listings from it.
Fallback C: a whole category yields nothing → skip it, record it under "categories with no results", continue with the rest.

**Step 3 — Verify each promising candidate.**
Primary: `WebFetch` the business's own page / social profile / listing to fill fields.
Fallback A: fetch fails, times out, or is blocked → try one alternate source (search snippet, directory cache, or a different profile). If still unverified, keep the lead but cap confidence at `Low` and note what is unverified.
Fallback B: sources conflict (e.g. two different phones) → present the one with the stronger/most recent source, note the conflict, set confidence `Medium` at best.

**Step 4 — Website existence check (the core question).**
Primary: exact-name + area search, e.g. `"Glow Beauty Spa East Legon" official website`.
Fallback: no clear answer → classify as `No site found` only after at least one exact-name search; if even that could not be run, classify `Unknown` (not `No site found`) and mark confidence `Low`.

**Step 5 — Classify website status:**
- `No site found`: no credible standalone website after an exact-name check; phone/WhatsApp only.
- `Social only`: Facebook / Instagram / TikTok / WhatsApp Business / Linktree / Google Business Profile / Jiji / Tonaton listing only — **most common in Ghana**.
- `Weak site`: standalone site exists but outdated, broken, very thin, not mobile-friendly, free-builder subdomain, or missing a clear contact/booking/WhatsApp flow.
- `Has site`: credible, maintained standalone site on its own domain.
- `Unknown`: could not be checked (tool failure) — never silently treat as "no site".

**Step 6 — Confidence:**
- `High`: confirmed by ≥2 independent sources or an official page.
- `Medium`: one credible source plus consistent search evidence.
- `Low`: incomplete, ambiguous, conflicting, or tool-failure-degraded evidence.

Subagents: only if the user explicitly asks for parallel verification. Split candidates into non-overlapping batches; each subagent verifies only website/social/contact status. Never let subagent orchestration block faster direct research.

## Fallback Ladder (discovery sources, best → last resort)

1. `WebSearch` general query (category + area + "contact").
2. `WebSearch` directory-scoped: `site:jiji.com.gh`, `site:tonaton.com`, `site:businessghana.com`, `site:ghanayello.com`, `site:facebook.com … Accra`.
3. `WebFetch` directory listing/search URLs directly:
   - `https://jiji.com.gh/` category/search pages
   - `https://tonaton.com/`
   - `https://www.businessghana.com/site/directory`
   - `https://www.ghanayello.com/`
4. `WebFetch` Google Business / Facebook public profile pages found via search.
5. If 1–4 all fail: return partial results + an honest "degraded run" note. Do **not** fabricate to fill the table.

## Lead Scoring (Ghana-tuned)

- `Hot`: no site found or social-only, **with a reachable Ghana phone/WhatsApp**, visibly active (recent posts, reviews, listing), inside the target area. Active WhatsApp Business catalog or frequent posting raises priority.
- `Warm`: weak site, free-builder page, marketplace/listing-only presence, or inconsistent online presentation.
- `Low`: a solid maintained website already exists, OR confidence is `Low`/`Unknown`.
- `Skip`: closed, duplicate, outside radius, irrelevant category, branch of a national chain with a central site, or not a real prospect.

Tie-break when over `max_leads`: prefer higher confidence, then closer to base, then stronger activity signal.

## Output Format

Always include a one-line **run header** before the table:

`Search: <categories> within <radius> km of <location> · <date> · <N> leads · Mode: <full | degraded>`

Then a concise markdown table:

| Score | Business | Category | Area | Distance | Website status | Website/Social | Phone | Why it is a prospect | Confidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

Rules:

- Keep `Why it is a prospect` short and actionable (e.g. "2.3k IG followers, sells via DM, no site, no booking").
- Use `Not found` for missing fields and `Unknown` for unchecked website status — never blank, never invented.
- Show phone in local Ghana format (`024 XXX XXXX`) with network if the prefix is recognisable.
- `Distance` is approximate unless a precise address was found — suffix with `~` when estimated.
- After the table, add **`Best first outreach targets`**: top 3 leads, each with one practical reason and a one-line WhatsApp-style opener. For fuller scripts, draw on `assets/outreach-templates.md`.
- Add a **`Caveats`** line: degraded mode? categories with no results? clamped inputs? low-confidence leads? State them explicitly.
- If **zero** qualified leads: do not return an empty table. Explain why (location too sparse, all had sites, tools degraded), and propose concrete next steps (wider radius, different categories, nearby area).

## CSV Columns

When returning CSV-style rows or creating a file, use these columns (see `assets/lead-template.csv`). Quote any field containing a comma, quote, or newline; escape `"` as `""`; UTF-8; one header row:

```csv
score,business,category,area,distance_km,website_status,website_url,social_urls,phone,whatsapp,source_urls,why_prospect,confidence,notes
```

## Quality Checks (before finalizing)

- **Dedupe**: same business across Facebook + Jiji + Maps = one lead. Match on name + area + phone, not exact string.
- Never label a lead `Hot` if a real maintained standalone website was found.
- Never claim a site is missing unless an exact-name search was actually run; otherwise `Unknown`.
- Never present an unverifiable or non-Ghana-format phone as confirmed.
- Drop candidates you cannot tie to any tool result.
- Prefer fewer verified leads over many weak guesses.
- Confirm the run header (location, radius, categories, date, lead count, mode) is present and accurate.
- Re-read the final output: every concrete value must be traceable to a source; if not, downgrade or remove it.
