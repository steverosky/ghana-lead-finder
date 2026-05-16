# GhanaLeadFinder

A Claude skill that turns local search into qualified client leads for the **Ghanaian market**.

GhanaLeadFinder finds nearby shops, salons, barbershops, chop bars, restaurants, pharmacies, tailors, gyms, schools, clinics, hotels, and other local businesses that may need a website or a stronger online presence. It runs assisted web research, checks whether each business has a real standalone website or only a Facebook/Instagram/TikTok/WhatsApp presence, scores the opportunity, and returns a clean lead sheet in chat or CSV — with WhatsApp-first outreach scripts ready to go.

## Why Ghana-specific

Generic prospecting tools miss how Ghanaian SMEs actually operate. GhanaLeadFinder is built around the local reality:

- Most SMEs run entirely on **Facebook + WhatsApp + MoMo** with no website at all — a deterministic point rubric treats these as the highest-value prospects.
- Phone and network parsing/normalisation for **Ghana numbers** (`+233`/`0XX`, MTN / Telecel / AirtelTigo); WhatsApp is reported as *likely*, never asserted.
- Discovery across **Ghana-relevant sources**: Google Business, Jiji.com.gh, Tonaton, BusinessGhana, GhanaYello — with `WebSearch` → `WebFetch` → browser-skill fallbacks and a no-fabrication rule.
- **Area/neighbourhood proximity** (honest — there's no geocoding, so no fake kilometre figures) across Accra, Kumasi, Takoradi, Tamale, Cape Coast.
- An **anti-stale gate** (no `Hot` without recent activity) and a stated discovery-bias limitation in every run.
- **WhatsApp-first outreach** templates with built-in anti-spam guardrails (1:1, public numbers only).
- Respects **Ghana's Data Protection Act, 2012 (Act 843)** — public business contact info only.

## Install

### One command (recommended)

Once published to npm:

```bash
npx ghana-lead-finder
```

Or straight from GitHub, no npm publish required:

```bash
npx github:<your-user>/<your-repo>
```

Either command copies the skill into your personal Claude skills directory:

```
~/.claude/skills/ghana-lead-finder
```

(On Windows: `C:\Users\<you>\.claude\skills\ghana-lead-finder`.)

### From a local clone

```bash
node bin/install.js
```

Restart Claude Code or start a new session if the skill does not appear immediately. To scope it to a single project instead, copy the `ghana-lead-finder/` folder into that repo's `.claude/skills/` directory.

### Publishing (maintainer)

The package is npx-ready (`bin` + shebang, `files` whitelist, ~11 kB). The npm name `ghana-lead-finder` is currently free. To publish:

```bash
npm publish        # runs prepublishOnly check, publishes public
```

For the GitHub route instead, just push this repo public — `npx github:user/repo` runs `bin/install.js` with no registry needed.

## Usage

The skill auto-activates when relevant, or invoke it explicitly:

```text
Find gyms and boutiques in East Legon, Accra (and adjacent areas) that may need a website, and return the lead sheet in chat.
```

```text
Use ghana-lead-finder to build a CSV of salons and chop bars in Kumasi (Adum/Asokwa) with no real website — include phone, WhatsApp, social links, lead score, and top prospects.
```

It answers in the same language as the prompt (default English; Twi/Ga/Ewe/Pidgin phrasing is fine).

## What's in the box

- `ghana-lead-finder/SKILL.md` — the skill definition: tools/fallbacks, research workflow, point rubric, output contract.
- `ghana-lead-finder/assets/lead-template.csv` — CSV header for file output.
- `ghana-lead-finder/assets/outreach-templates.md` — WhatsApp/phone scripts + anti-spam guardrails.
- `ghana-lead-finder/examples/sample-run.md` — known-good output shape (regression reference).
- `bin/install.js` — installs the skill into `~/.claude/skills/`.

## Compliance

GhanaLeadFinder is an assisted research tool, not a bulk scraper. It uses the web responsibly, does not bypass access controls or rate limits, sticks to public business contact information, and respects Ghana's Data Protection Act, 2012 (Act 843).

## License

MIT © 2026 Steve. See [LICENSE](LICENSE).
