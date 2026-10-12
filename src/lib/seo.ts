/**
 * Per-page SEO tags for the SPA: title, description, canonical, Open Graph / Twitter, JSON-LD.
 * Search engines that render JavaScript (Google) read these; returns a cleanup that removes them.
 */

interface PageMeta {
    title: string;
    description: string;
    url: string;
    image?: string;
    type?: "article" | "video.other" | "website";
    jsonLd?: Record<string, unknown>;
}

type Restore = () => void;

/** Set an attribute on a head element (creating it if needed) and return how to undo that. */
function upsert(selector: string, create: () => HTMLElement, attr: string, value: string): Restore {
    let el = document.head.querySelector<HTMLElement>(selector);
    if (!el) {
        el = create();
        document.head.appendChild(el);
        el.setAttribute(attr, value);
        const created = el;
        return () => created.remove();
    }
    const prev = el.getAttribute(attr);
    el.setAttribute(attr, value);
    const existing = el;
    return () => (prev === null ? existing.removeAttribute(attr) : existing.setAttribute(attr, prev));
}

const meta = (key: "name" | "property", name: string, content: string): Restore =>
    upsert(
        `meta[${key}="${name}"]`,
        () => {
            const m = document.createElement("meta");
            m.setAttribute(key, name);
            return m;
        },
        "content",
        content
    );

export function setPageMeta({ title, description, url, image, type = "article", jsonLd }: PageMeta): () => void {
    const prevTitle = document.title;
    document.title = title;
    const desc = description.length > 160 ? description.slice(0, 157).replace(/\s+\S*$/, "") + "…" : description;

    const restores: Restore[] = [
        meta("name", "description", desc),
        meta("property", "og:title", title),
        meta("property", "og:description", desc),
        meta("property", "og:type", type),
        meta("property", "og:url", url),
        meta("name", "twitter:card", image ? "summary_large_image" : "summary"),
        meta("name", "twitter:title", title),
        meta("name", "twitter:description", desc),
        upsert('link[rel="canonical"]', () => Object.assign(document.createElement("link"), { rel: "canonical" }), "href", url),
    ];
    if (image) restores.push(meta("property", "og:image", image), meta("name", "twitter:image", image));

    let script: HTMLScriptElement | null = null;
    if (jsonLd) {
        script = document.createElement("script");
        script.type = "application/ld+json";
        script.textContent = JSON.stringify({ "@context": "https://schema.org", ...jsonLd });
        document.head.appendChild(script);
    }

    return () => {
        document.title = prevTitle;
        script?.remove();
        restores.reverse().forEach((r) => r());
    };
}

/** ISO 8601 duration (PT1M5S) for schema.org VideoObject. */
export function isoDuration(sec: number): string | undefined {
    if (!sec) return undefined;
    const s = Math.round(sec);
    return `PT${Math.floor(s / 60) ? `${Math.floor(s / 60)}M` : ""}${s % 60}S`;
}
