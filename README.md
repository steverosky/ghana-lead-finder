# GhanaLeadFinder

A Claude skill that turns local search into qualified client leads for the **Ghanaian market**.

GhanaLeadFinder finds nearby shops, salons, barbershops, chop bars, restaurants, pharmacies, tailors, gyms, schools, clinics, hotels, and other local businesses that may need a website or a stronger online presence. It runs assisted web research, checks whether each business has a real standalone website or only a Facebook/Instagram/TikTok/WhatsApp presence, scores the opportunity, and returns a clean lead sheet in chat or CSV — with WhatsApp-first outreach scripts ready to go.

## Why Ghana-specific

Generic prospecting tools miss how Ghanaian SMEs actually operate. GhanaLeadFinder is built around the local reality:

- Most SMEs run entirely on **Facebook + WhatsApp Business + MoMo** with no website at all — these are the highest-value prospects, and the scoring treats them that way.
- Phone and network parsing for **Ghana numbers** (`+233` / `0XX`, MTN / Telecel / AirtelTigo).
- Discovery across **Ghana-relevant sources**: Google Business, Jiji.com.gh, Tonaton, BusinessGhana, GhanaYello.
- Default coverage of **Accra, Kumasi, Takoradi, Tamale, Cape Coast** and their key neighbourhoods.
- **WhatsApp-first outreach** templates tuned to how Ghanaian owners buy.
- Respects **Ghana's Data Protection Act, 2012 (Act 843)** — public business contact info only.

## Install

From this folder:

```bash
node bin/install.js
```

This installs the skill to your personal Claude skills directory:

```
~/.claude/skills/ghana-lead-finder
```

(On Windows: `C:\Users\<you>\.claude\skills\ghana-lead-finder`.)

Restart Claude Code or start a new session if the skill does not appear immediately. To scope it to a single project instead, copy the `ghana-lead-finder/` folder into that repo's `.claude/skills/` directory.

## Usage

The skill auto-activates when relevant, or invoke it explicitly:

```text
Find gyms and boutiques within 15 km of East Legon, Accra that may need a website, and return the lead sheet in chat.
```

```text
Use ghana-lead-finder to build a CSV of salons and chop bars in Kumasi (Adum/Asokwa) with no real website — include phone, WhatsApp, social links, lead score, and top prospects.
```

It answers in the same language as the prompt (default English; Twi/Ga/Ewe/Pidgin phrasing is fine).

## What's in the box

- `ghana-lead-finder/SKILL.md` — the skill definition and research/scoring workflow.
- `ghana-lead-finder/assets/lead-template.csv` — CSV header for file output.
- `ghana-lead-finder/assets/outreach-templates.md` — WhatsApp and phone outreach scripts for Ghanaian SMEs.
- `bin/install.js` — installs the skill into `~/.claude/skills/`.

## Compliance

GhanaLeadFinder is an assisted research tool, not a bulk scraper. It uses the web responsibly, does not bypass access controls or rate limits, sticks to public business contact information, and respects Ghana's Data Protection Act, 2012 (Act 843).

## License

MIT © 2026 Steve. See [LICENSE](LICENSE).
