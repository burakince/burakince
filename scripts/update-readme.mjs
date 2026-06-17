import { readFileSync, writeFileSync } from "fs";

const PROFILE_JSON_URL = "https://www.burakince.com/profile.json";
const README_PATH = new URL("../README.md", import.meta.url).pathname;

const res = await fetch(PROFILE_JSON_URL);
if (!res.ok) throw new Error(`Failed to fetch profile.json: ${res.status}`);
const profile = await res.json();

function replaceBlock(content, tag, lines) {
    return content.replace(
        new RegExp(`<!-- ${tag}:START -->[\\s\\S]*?<!-- ${tag}:END -->`),
        `<!-- ${tag}:START -->\n${lines.join("\n")}\n<!-- ${tag}:END -->`
    );
}

const introLines = [
    `I'm a software craftsman and tech lead who loves bridging the gap between high-level AI architecture and stable, production-grade systems. Right now, I'm working as a **${profile.jobTitle}** at [${profile.company}](${profile.companyUrl}), helping teams design and scale cloud-native architectures.`,
    "",
    "My engineering philosophy is built on clean code, Test-Driven Development (TDD), and building systems that actually last.",
];

const blogPostLines = [
    ...profile.recentPosts.map(
        (p) => `* **[${p.title}](${p.url})** — ${p.excerpt}`
    ),
    "",
    `> _Updated automatically from [burakince.com](${profile.siteUrl})_`,
];

const hostname = profile.siteUrl.replace(/^https?:\/\/(www\.)?/, "");
const liHandle = profile.socialLinks.linkedin.split("/").pop();
const twHandle = profile.socialLinks.twitter.split("/").pop();
const bsHandle = profile.socialLinks.bluesky.split("/profile/").pop();
const socialLinkLines = [
    `* **Personal Blog**: [${hostname}](${profile.siteUrl})`,
    `* **LinkedIn**: [${liHandle}](${profile.socialLinks.linkedin})`,
    `* **Twitter / X**: [@${twHandle}](${profile.socialLinks.twitter})`,
    `* **Bluesky**: [@${bsHandle}](${profile.socialLinks.bluesky})`,
];

const skillLines = profile.skillCategories.map(
    (cat) => `* **${cat.label}**: ${cat.items.join(", ")}`
);

let readme = readFileSync(README_PATH, "utf8");
const original = readme;

readme = replaceBlock(readme, "PROFILE_INTRO", introLines);
readme = replaceBlock(readme, "BLOG_POSTS", blogPostLines);
readme = replaceBlock(readme, "SKILLS", skillLines);
readme = replaceBlock(readme, "SOCIAL_LINKS", socialLinkLines);

if (readme === original) {
    console.log("No changes.");
} else {
    writeFileSync(README_PATH, readme, "utf8");
    console.log("README updated.");
}
