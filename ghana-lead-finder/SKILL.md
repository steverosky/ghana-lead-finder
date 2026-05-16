---
name: ghana-lead-finder
description: Use this skill to find and qualify local business prospects in Ghana that may need a website or better online presence — shops, salons, barbershops, restaurants, chop bars, pharmacies, tailors, gyms, schools, clinics, hotels, and local services. It runs assisted web research, checks whether each business has a real standalone website or only Facebook/Instagram/WhatsApp, scores the opportunity, and returns a concise lead sheet in chat or CSV. Trigger on requests like "find website clients near me", "businesses in East Legon that need a website", "prospect gyms in Accra", or "build me a lead list of local businesses".
---

# GhanaLeadFinder

Use this skill when the user wants to discover nearby Ghanaian local businesses that could become website, social-media, or digital-marketing clients.

The default output is a compact lead sheet in chat. Create a CSV or spreadsheet only when the user asks for a file, or when the result set is large enough that a chat table would be hard to read.

This skill answers in the same language as the user prompt (default: English, Ghana's official language; Twi/Ga/Ewe/Pidgin phrasing is fine if the user uses it).

## Ghana Market Context

Keep these realities in mind — they change how leads are scored:

- A **huge share of Ghanaian SMEs have no website at all**. They run entirely on a Facebook Page, Instagram, TikTok, and a WhatsApp Business number. This is the norm, not the exception — so "social only" is the single most common and most valuable prospect type here.
- **WhatsApp is the primary business contact channel.** A WhatsApp/MoMo number is often the only "contact info" a business publishes. Treat an active WhatsApp Business catalog as a strong buying signal (they already sell online, just badly).
- **Mobile Money (MoMo)** is the dominant payment rail. A business that takes MoMo but has no online checkout or site is a prime upsell.
- Many "websites" are actually a **Linktree, a Google Business Profile, a Jiji/Tonaton listing, or a free Wix/Carrd page** — count these as *social only* or *weak site*, never as "has site".
- Phone numbers are Ghanaian: `+233` country code or local `0XX XXX XXXX`.
  - MTN: `024 / 054 / 055 / 059`
  - Telecel (formerly Vodafone): `020 / 050`
  - AirtelTigo: `027 / 057 / 026 / 056`
- Typical small-business website projects in Ghana run roughly **GHS 1,500–8,000+**; mention budget framing only if the user asks about pricing/outreach.

## Inputs to Collect

If missing, infer reasonable Ghana defaults and continue:

- `base_location`: address, town, landmark, or area. Default reference cities: **Accra** (Osu, East Legon, Spintex, Tema, Madina, Adenta, Dansoman, Achimota, Airport Residential), **Kumasi** (Adum, Asokwa, KNUST), **Takoradi**, **Tamale**, **Cape Coast**.
- `radius_km`: default 15 km (urban Accra/Kumasi traffic makes wider radii less useful).
- `categories`: default `shops & boutiques, salons & barbershops, spas, restaurants & chop bars, pharmacies & chemical shops, fashion designers & tailors, auto mechanics, hotels & guesthouses, gyms & fitness centres, private schools, clinics & dental, real estate agents, event planners & decorators, printing presses`.
- `max_leads`: default 15.
- `language`: match the user's language.
- `output`: default `chat table`; optional `CSV`.

Ask a concise clarification **only** if the base location is missing and cannot be inferred.

## Compliance Guardrails

- Use web search and page fetches as an **assisted research tool, not a bulk scraper**.
- Do not bypass CAPTCHAs, login walls, rate limits, bot protections, or paywalls.
- Do not extract or resell Google Maps / Jiji / Tonaton data at scale.
- Prefer public business facts and official business contact channels.
- Do not collect personal emails or private personal data unless the user explicitly provides a lawful basis and the source is clearly public *business* contact information. (Note: Ghana's Data Protection Act, 2012 (Act 843) governs personal data — stick to public business contact info.)
- Treat any single listing source as a discovery aid only. Cross-check important details with independent public sources: the business's own page, social profiles, directory listings, or search results.

## Research Workflow

1. Run web searches for each requested category near `base_location` (e.g. `"hair salon East Legon Accra"`, `"chop bar Spintex"`, `"tailor Osu Accra contact"`).
2. Build a candidate list from search results and public directories. Prioritize Ghana-relevant sources:
   - Google Maps / Google Business Profiles
   - Facebook Pages and Instagram business profiles
   - **Jiji.com.gh**, **Tonaton.com** (classifieds — strong for SMEs with no site)
   - **BusinessGhana.com**, **GhanaYello.com** (local directories)
   - TikTok business accounts (increasingly the only presence for younger-run businesses)
3. For each candidate, fetch enough public sources to fill the lead fields.
4. Search the exact business name plus area/city to confirm whether a real standalone website exists (e.g. `"Glow Beauty Spa East Legon" website`).
5. Classify website status:
   - `No site found`: no credible standalone website after cross-check; may have a phone/WhatsApp only.
   - `Social only`: Facebook, Instagram, TikTok, WhatsApp Business, Linktree, Google Business Profile, or a Jiji/Tonaton listing only — **most common in Ghana**.
   - `Weak site`: a standalone site exists but is outdated, broken, very thin, not mobile-friendly, free-builder (Wix/Carrd/Google Sites subdomain), or missing a clear contact/booking/WhatsApp flow.
   - `Has site`: a credible, maintained standalone site with its own domain exists.
6. Mark confidence:
   - `High`: confirmed by at least two sources or an official page.
   - `Medium`: one credible source plus consistent search evidence.
   - `Low`: incomplete or ambiguous evidence.

When the user explicitly asks for subagents or parallel verification, split candidates into non-overlapping batches and have each subagent verify only website/social/contact status. Do not spin up subagents if it blocks faster direct research.

## Lead Scoring (Ghana-tuned)

- `Hot`: no site found or social-only, **with a reachable phone/WhatsApp**, visibly active business (recent posts, reviews, or listing), inside the target area. Active WhatsApp Business catalog or frequent Facebook/Instagram posting raises priority — they already sell online and clearly need a real site.
- `Warm`: weak site, free-builder page, marketplace/listing-only presence, or inconsistent online presentation.
- `Low`: a solid, maintained website already exists, or confidence is low.
- `Skip`: closed, duplicate, outside radius, irrelevant category, franchise/branch of a national chain with a central site, or not a real prospect.

## Output Format

For chat output, use a concise markdown table:

| Score | Business | Category | Area | Distance | Website status | Website/Social | Phone | Why it is a prospect | Confidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

Rules:

- Keep `Why it is a prospect` short and actionable (e.g. "2.3k IG followers, sells via DM, no site, no booking").
- Use `Not found` instead of leaving blank fields.
- Show phone in local Ghana format (`024 XXX XXXX`) and note the network if obvious.
- Include source links when useful, but do not flood the table with URLs.
- After the table, add a **`Best first outreach targets`** section: the top 3 leads, each with one practical reason and a one-line WhatsApp-style opener the user could send. For fuller outreach scripts (WhatsApp/phone), draw on `assets/outreach-templates.md`.
- If confidence is low, state exactly what remains uncertain.

## CSV Columns

When returning CSV-style rows or creating a file, use these columns (see `assets/lead-template.csv`):

```csv
score,business,category,area,distance_km,website_status,website_url,social_urls,phone,whatsapp,source_urls,why_prospect,confidence,notes
```

## Quality Checks

Before finalizing:

- Remove duplicates (same business listed on Facebook + Jiji + Maps = one lead).
- Never label a lead `Hot` if a real, maintained standalone website was found.
- Never claim a site is missing unless at least one exact-name web search was attempted.
- Prefer fewer verified leads over many weak guesses.
- Include the search location, radius, categories, and date in the final response.
