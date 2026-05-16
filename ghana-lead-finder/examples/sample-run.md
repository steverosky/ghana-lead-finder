# Sample run — regression reference

This is an **illustrative fixture** showing the exact output shape a correct run must produce. Business names/URLs/phones below were seen in a real `WebSearch` for salons in East Legon, Accra (May 2026); the **scores, freshness, and confidence here are hand-set for format-checking only** — they are not live claims and listings age fast. Use this to verify structure, not to contact anyone.

A passing run must reproduce: the run header, the qualitative `Area/Proximity` column (no km), `likely`-only WhatsApp, `Unknown` vs `Not found` discipline, the rubric-driven bands with hard gates, and a `Caveats` block that always contains the structural-limitation line.

---

Search: salons & barbershops · area: East Legon + adjacent (American House, Shiashie) · 2026-05-16 · 4 leads · Mode: full

| Score | Business | Category | Area/Proximity | Website status | Website/Social | Phone | WhatsApp | Why it is a prospect | Confidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Hot | Exottica Salon and Spa | Salon & spa | In East Legon (American House) | Social only | [Facebook](https://www.facebook.com/exotticasalonandspa/) | 050 140 2363 (Telecel) | likely (stated) | FB-only, no standalone site, reachable, posting this year — needs a real bookable site | Medium |
| Warm | Twists & Locs (East Legon) | Salon | In East Legon (Pineapple Loop) | Social only | [Fresha booking](https://www.fresha.com/a/twists-locs-east-legon-branch-accra-7-pineapple-loop-a3w7kblv) | 020 011 9574 (Telecel) | likely (stated) | Sells via a 3rd-party booking portal, no owned site/domain; activity signal not confirmed → capped Warm | Low |
| Low | Delaganza Hair & Beauty | Salon | In East Legon (Boundary Rd) | Has site | [delaganza-ghana.com](https://delaganza-ghana.com/) | 054 792 1396 (MTN) | Not found | Maintained own-domain site already exists — not a website prospect (possible upsell only) | High |
| Low | HairbyTMS | Salon | Same city: Accra | Unknown | search snippet only | 055 379 7326 (MTN) | Not found | Has a /ghana page on hairbytms.com but standalone status not verified (WebFetch not run) → Unknown, not "no site" | Low |

**Best first outreach targets**

1. **Exottica Salon and Spa** — Facebook-only, reachable, recently active: cleanest "no site → needs site" pitch.
   > Hello 👋 Came across Exottica Salon and Spa on Facebook — lovely work. I build simple mobile sites so clients can find you on Google and book directly (WhatsApp + MoMo). Want a quick sample?
2. **Twists & Locs (East Legon)** — already sells via Fresha, so they value online booking; pitch an owned site they don't rent.
   > Hi Twists & Locs — saw you take bookings online. A site on your own name (not a portal) keeps the client relationship yours. Can I send a 60-sec example?

**Caveats**

- 1 lead (`HairbyTMS`) is `Unknown` website status — `WebFetch` budget not spent to confirm; do not treat as "no site".
- Freshness/activity not independently confirmed for `Twists & Locs` → capped at `Warm` per the anti-stale gate.
- Outreach copy is governed by the anti-spam rules in `assets/outreach-templates.md` (1:1, manual, public numbers only).
- **Web search cannot see businesses with zero online footprint — often the strongest prospects — so this is a sample, not a complete list of salons in the area.**
