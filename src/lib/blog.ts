import type { BlogPost } from "@/lib/storage";

export const AUTHOR = {
    name: "Amal V S",
    role: "System Architect",
    bio: "I design backend systems, AI pipelines and cloud infrastructure, and write down what I learn the hard way.",
    email: "amal.vs.engineer@gmail.com",
    linkedin: "https://www.linkedin.com/in/amal-v-s-948079200/",
    github: "https://github.com/alchemist123",
};

const WORDS_PER_MINUTE = 220;

export function htmlToText(html: string): string {
    return html
        .replace(/<(script|style)[\s\S]*?<\/\1>/gi, " ")
        .replace(/<[^>]+>/g, " ")
        .replace(/&nbsp;/g, " ")
        .replace(/&[a-z#0-9]+;/gi, " ")
        .replace(/\s+/g, " ")
        .trim();
}

export function countWords(html: string): number {
    const text = htmlToText(html);
    return text ? text.split(" ").length : 0;
}

export function estimateReadingTime(html: string): number {
    return Math.max(1, Math.round(countWords(html) / WORDS_PER_MINUTE));
}

/** Reading time for a post, preferring the backend value and falling back to the body. */
export function readingTimeOf(post: Pick<BlogPost, "readingTime" | "content" | "blocks">): number {
    if (post.readingTime) return post.readingTime;
    const body = post.blocks?.length ? post.blocks.map((b) => b.content).join(" ") : post.content ?? "";
    return estimateReadingTime(body);
}

/** First meaningful paragraph of the editor HTML, trimmed for use as a summary. */
export function autoSummary(html: string, maxLength = 180): string {
    const div = document.createElement("div");
    div.innerHTML = html;
    const p = Array.from(div.querySelectorAll("p")).find((el) => (el.textContent ?? "").trim().length > 40);
    const text = (p?.textContent ?? htmlToText(html)).trim();
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).replace(/\s+\S*$/, "") + "…";
}

export function formatDate(iso: string, style: "long" | "short" = "short"): string {
    return new Date(iso).toLocaleDateString("en-US", {
        year: "numeric",
        month: style === "long" ? "long" : "short",
        day: "numeric",
    });
}

export function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-")
        .slice(0, 64);
}

export interface Heading {
    id: string;
    text: string;
    level: 2 | 3;
}

/**
 * Give every h2/h3 across the given HTML fragments a stable, unique id.
 * Done on the HTML strings (not the live DOM) so React renders the ids itself.
 */
export function addHeadingIds(fragments: string[]): { fragments: string[]; headings: Heading[] } {
    const seen = new Map<string, number>();
    const headings: Heading[] = [];
    const out = fragments.map((html) => {
        if (!/<h[23][\s>]/i.test(html)) return html;
        const tpl = document.createElement("template");
        tpl.innerHTML = html;
        tpl.content.querySelectorAll<HTMLHeadingElement>("h2, h3").forEach((el) => {
            const text = (el.textContent ?? "").trim();
            if (!text) return;
            const base = slugify(text) || "section";
            const n = seen.get(base) ?? 0;
            seen.set(base, n + 1);
            el.id = n ? `${base}-${n}` : base;
            headings.push({ id: el.id, text, level: el.tagName === "H2" ? 2 : 3 });
        });
        return tpl.innerHTML;
    });
    return { fragments: out, headings };
}

export function commentCountOf(post: BlogPost): number {
    return post.commentCount ?? post.comments?.length ?? 0;
}
