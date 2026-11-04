import MarkdownIt from "markdown-it";
import anchor from "markdown-it-anchor";

// GitHub-compatible heading slugs so the in-document TOC anchors keep working
// after leaving Jekyll: lowercase, strip non word chars, every space run of
// length 1 becomes exactly one dash (e.g. "Output Modes (single / split)" ->
// "output-modes-single--split").
function githubSlugify(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s/g, "-");
}

const md = new MarkdownIt({ html: false, linkify: true, typographer: false });
md.use(anchor, { slugify: githubSlugify, permalink: false });

export function renderMarkdown(source: string): string {
  return md.render(source);
}
