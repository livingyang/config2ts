import MarkdownIt from "markdown-it";
import anchor from "markdown-it-anchor";

// GitHub-compatible heading slugs so the in-document TOC anchors keep working
// after leaving Jekyll: lowercase, strip non word chars, every space becomes
// exactly one dash (e.g. "Output Modes (single / split)" ->
// "output-modes-single--split").
function githubSlugify(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s/g, "-");
}

const md = new MarkdownIt({ html: false, linkify: true, typographer: false });
md.use(anchor, { slugify: githubSlugify });

/**
 * Render markdown, optionally scoping in-document anchors to a route path.
 *
 * Under hash routing the URL fragment *is* the route, so a plain
 * href="#quick-start" would wipe the route. Rewriting it to
 * href="#/docs/zh#quick-start" keeps both: vue-router resolves the route and
 * scrollBehavior jumps to the heading.
 */
export function renderMarkdown(source: string, anchorBase?: string): string {
  const html = md.render(source);
  if (!anchorBase) return html;
  return html.replace(/href="#([^"#]+)"/g, (_m, anchorId: string) => `href="#${anchorBase}#${anchorId}"`);
}
