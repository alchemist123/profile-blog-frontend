const API_BASE = import.meta.env.VITE_API_URL ?? "https://blog.api.binarybit.in";

export interface BlogComment {
    id?: string;
    _id?: string;
    name: string;
    text: string;
    createdAt: string;
}

export interface ContentBlockItem {
    type: "richtext" | "html";
    content: string;
}

export interface BlogPost {
    id: string;
    title: string;
    summary: string;
    content: string;
    createdAt: string;
    coverImage?: string;
    tags: string[];
    likes?: number;
    readCount?: number;
    comments?: BlogComment[];
    /** When present, render from blocks instead of content (no size limit per block) */
    blocks?: ContentBlockItem[];
}

export interface BlogSearchParams {
    search?: string;
    tag?: string;
}

async function request<T>(
    path: string,
    options?: RequestInit
): Promise<T> {
    const url = `${API_BASE}${path}`;
    const res = await fetch(url, {
        ...options,
        cache: "no-store",
        headers: {
            "Content-Type": "application/json",
            ...options?.headers,
        },
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({ error: res.statusText }));
        throw new Error((err as { error?: string }).error ?? res.statusText);
    }
    if (res.status === 204) return undefined as T;
    return res.json();
}

export async function getBlogs(): Promise<BlogPost[]> {
    return request<BlogPost[]>("/api/blogs");
}

export async function getBlogsSearch(params?: BlogSearchParams): Promise<BlogPost[]> {
    const sp = new URLSearchParams();
    if (params?.search?.trim()) sp.set("search", params.search.trim());
    if (params?.tag?.trim()) sp.set("tag", params.tag.trim());
    const q = sp.toString();
    return request<BlogPost[]>(`/api/blogs${q ? `?${q}` : ""}`);
}

export async function getBlogTags(): Promise<string[]> {
    return request<string[]>("/api/blogs/tags");
}

export async function likeBlog(id: string): Promise<{ likes: number }> {
    return request<{ likes: number }>(`/api/blogs/${id}/like`, { method: "POST" });
}

export async function recordRead(id: string): Promise<{ readCount: number }> {
    return request<{ readCount: number }>(`/api/blogs/${id}/read`, { method: "POST" });
}

export async function addComment(
    id: string,
    body: { name?: string; text: string }
): Promise<BlogComment> {
    return request<BlogComment>(`/api/blogs/${id}/comments`, {
        method: "POST",
        body: JSON.stringify(body),
    });
}

export async function getBlogById(id: string): Promise<BlogPost | undefined> {
    try {
        return await request<BlogPost>(`/api/blogs/${id}`);
    } catch {
        return undefined;
    }
}

/**
 * Reconstruct editor HTML from blocks (for loading post into editor when editing).
 */
export function blocksToHtml(blocks: ContentBlockItem[]): string {
    if (!blocks?.length) return "";
    return blocks
        .map((b) =>
            b.type === "html"
                ? `<div data-type="html-block" data-html="${escapeAttr(b.content)}"></div>`
                : b.content
        )
        .join("");
}

function escapeAttr(s: string): string {
    return s
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

/**
 * Parse editor HTML into blocks (richtext + html). Use when saving so content is stored in blocks collection (scalable, no single-field limit).
 */
export function htmlToBlocks(html: string): ContentBlockItem[] {
    if (!html || !html.trim()) return [];
    const div = document.createElement("div");
    div.innerHTML = html.trim();
    const blocks: ContentBlockItem[] = [];
    for (const child of Array.from(div.children)) {
        const el = child as HTMLElement;
        if (el.getAttribute?.("data-type") === "html-block") {
            const raw = el.getAttribute("data-html");
            blocks.push({ type: "html", content: raw ?? "" });
        } else {
            blocks.push({ type: "richtext", content: el.outerHTML });
        }
    }
    if (blocks.length === 0 && html.trim()) blocks.push({ type: "richtext", content: html.trim() });
    return blocks;
}

export async function saveBlog(
    blog: Partial<BlogPost> & { title: string } & ({ content: string } | { blocks: ContentBlockItem[] })
): Promise<BlogPost> {
    const tags = Array.isArray(blog.tags) ? blog.tags : (blog.tags ? String(blog.tags).split(",").map((t) => t.trim()) : []);
    const blocks = "blocks" in blog && Array.isArray(blog.blocks) && blog.blocks.length > 0 ? blog.blocks : undefined;
    const body = {
        title: blog.title,
        summary: blog.summary ?? "",
        content: blocks ? "" : (blog.content ?? ""),
        coverImage: blog.coverImage,
        tags,
        ...(blocks && { blocks }),
    };
    if (blog.id) {
        return request<BlogPost>(`/api/blogs/${blog.id}`, {
            method: "PUT",
            body: JSON.stringify(body),
        });
    }
    return request<BlogPost>("/api/blogs", {
        method: "POST",
        body: JSON.stringify(body),
    });
}

export async function deleteBlog(id: string): Promise<void> {
    await request(`/api/blogs/${id}`, { method: "DELETE" });
}
