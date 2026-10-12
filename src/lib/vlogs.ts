import { API_BASE, adminFetch } from "@/lib/storage";
import type { BlogStatus } from "@/lib/storage";
import { youTubeThumb } from "@/lib/media";

export type VlogOrientation = "portrait" | "landscape";

export interface Vlog {
    id: string;
    title: string;
    caption: string;
    videoUrl: string;
    source: "upload" | "url" | "youtube";
    posterUrl: string;
    orientation: VlogOrientation;
    durationSec: number;
    tags: string[];
    status: BlogStatus;
    likes: number;
    views: number;
    createdAt: string;
    updatedAt?: string;
}

export type VlogInput = Omit<Vlog, "id" | "likes" | "views" | "createdAt" | "updatedAt">;

async function call<T>(path: string, init?: RequestInit): Promise<T> {
    const res = await adminFetch(`${API_BASE}/api/vlogs${path}`, {
        cache: "no-store",
        ...init,
        headers: { "Content-Type": "application/json", ...init?.headers },
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({ error: res.statusText }));
        throw new Error((err as { error?: string }).error ?? res.statusText);
    }
    return res.status === 204 ? (undefined as T) : res.json();
}

export function getVlogs(opts?: { orientation?: VlogOrientation; limit?: number; includeDrafts?: boolean }): Promise<Vlog[]> {
    const p = new URLSearchParams();
    if (opts?.orientation) p.set("orientation", opts.orientation);
    if (opts?.limit) p.set("limit", String(opts.limit));
    if (opts?.includeDrafts) p.set("includeDrafts", "1");
    const q = p.toString();
    return call<Vlog[]>(q ? `?${q}` : "");
}

export const getVlog = (id: string) => call<Vlog>(`/${id}`);

export function saveVlog(v: VlogInput & { id?: string }): Promise<Vlog> {
    const { id, ...body } = v;
    return id
        ? call<Vlog>(`/${id}`, { method: "PUT", body: JSON.stringify(body) })
        : call<Vlog>("", { method: "POST", body: JSON.stringify(body) });
}

export const deleteVlog = (id: string) => call<void>(`/${id}`, { method: "DELETE" });
export const likeVlog = (id: string) => call<{ likes: number }>(`/${id}/like`, { method: "POST" });
export const recordVlogView = (id: string) => call<{ views: number }>(`/${id}/view`, { method: "POST" });

/** Cover image: custom poster, else the YouTube thumbnail. */
export const posterOf = (v: Pick<Vlog, "posterUrl" | "source" | "videoUrl">) =>
    v.posterUrl || (v.source === "youtube" ? youTubeThumb(v.videoUrl) ?? "" : "");
