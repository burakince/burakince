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

3. `.github/workflows/update-readme.yml` triggers on that dispatch, plus a weekly Monday cron fallback and `workflow_dispatch`. It runs `scripts/update-readme.mjs`, which fetches `profile.json`, rebuilds the blog posts section, and commits if content changed.

4. `README.md` contains a `<!-- BLOG_POSTS:START -->` / `<!-- BLOG_POSTS:END -->` sentinel block. Everything between those comments is auto-generated — manual edits there will be overwritten on the next sync.

## Running the Script Locally

Requires Node.js 24+. No install step — the script uses only built-in Node APIs (`fetch`, `fs`).

```bash
node scripts/update-readme.mjs
```

## What to Avoid

- Do not edit content between `<!-- BLOG_POSTS:START -->` and `<!-- BLOG_POSTS:END -->`.
- Do not add a `Co-Authored-By` trailer to commits.
- Do not add npm dependencies to `scripts/update-readme.mjs` — keep it dependency-free.
