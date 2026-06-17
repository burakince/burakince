# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Repo Is

This is the special GitHub profile repository (`burakince/burakince`). Its `README.md` appears on the GitHub profile page. It is kept in sync with the personal blog/portfolio at https://www.burakince.com (source repo: `burakince/burakince.github.io`).

## How the Sync Works

1. The blog builds a static JSON endpoint at `https://www.burakince.com/profile.json` that exports:
   - `name`, `jobTitle`, `company`, `companyUrl` — author identity
   - `socialLinks` — github, linkedin, twitter, bluesky
   - `recentPosts` — latest 5 posts with title, url, date, tags, excerpt
   - `skillCategories` — array of `{ label, items[] }` from the blog's skills library

2. After every successful deploy to the blog's `main` branch, GitHub Actions sends a `repository_dispatch` event (`event_type: blog-updated`) to this repo using a `PROFILE_DISPATCH_TOKEN` secret.

3. `.github/workflows/update-readme.yml` triggers on that dispatch, plus a weekly Monday cron fallback and `workflow_dispatch`. It runs `scripts/update-readme.mjs`, which fetches `profile.json`, rebuilds all auto-generated sections, and commits if content changed.

4. `README.md` contains four sentinel blocks. Everything between each pair of comments is auto-generated — manual edits there will be overwritten on the next sync:
   - `<!-- PROFILE_INTRO:START -->` / `<!-- PROFILE_INTRO:END -->` — job title and company from `jobTitle`, `company`, `companyUrl`
   - `<!-- BLOG_POSTS:START -->` / `<!-- BLOG_POSTS:END -->` — latest posts from `recentPosts`
   - `<!-- SKILLS:START -->` / `<!-- SKILLS:END -->` — tech categories from `skillCategories`
   - `<!-- SOCIAL_LINKS:START -->` / `<!-- SOCIAL_LINKS:END -->` — links from `socialLinks` and `siteUrl`

## Running the Script Locally

Requires Node.js 24+. No install step — the script uses only built-in Node APIs (`fetch`, `fs`).

```bash
node scripts/update-readme.mjs
```

## What to Avoid

- Do not edit content inside any of the four sentinel blocks (`PROFILE_INTRO`, `BLOG_POSTS`, `SKILLS`, `SOCIAL_LINKS`).
- Do not add a `Co-Authored-By` trailer to commits.
- Do not add npm dependencies to `scripts/update-readme.mjs` — keep it dependency-free.
