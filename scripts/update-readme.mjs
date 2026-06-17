import { readFileSync, writeFileSync } from "fs";

const PROFILE_JSON_URL = "https://www.burakince.com/profile.json";
const README_PATH = new URL("../README.md", import.meta.url).pathname;

const res = await fetch(PROFILE_JSON_URL);
if (!res.ok) throw new Error(`Failed to fetch profile.json: ${res.status}`);
const profile = await res.json();

const lines = [
    ...profile.recentPosts.map(
        (p) => `* **[${p.title}](${p.url})** — ${p.excerpt}`
    ),
    "",
    `> _Updated automatically from [burakince.com](${profile.siteUrl})_`,
];

const block = lines.join("\n");

const readme = readFileSync(README_PATH, "utf8");
const updated = readme.replace(
    /<!-- BLOG_POSTS:START -->[\s\S]*?<!-- BLOG_POSTS:END -->/,
    `<!-- BLOG_POSTS:START -->\n${block}\n<!-- BLOG_POSTS:END -->`
);

if (updated === readme) {
    console.log("No changes.");
} else {
    writeFileSync(README_PATH, updated, "utf8");
    console.log("README updated.");
}
