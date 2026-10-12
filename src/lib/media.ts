import { API_BASE, ADMIN_SESSION_EXPIRED, adminFetch, clearAdminToken, getAdminToken } from "@/lib/storage";

export type MediaKind = "image" | "video";

export interface MediaItem {
    id: string;
    key: string;
    kind: MediaKind;
    mimeType: string;
    size: number;
    originalName: string;
    url: string;
    createdAt: string;
}

/** What a picker hands back, whether uploaded, linked or chosen from the library. */
export interface MediaSelection {
    url: string;
    kind: MediaKind;
    source: "upload" | "url" | "youtube";
    alt?: string;
}

export const ACCEPT: Record<MediaKind, string> = {
    image: "image/jpeg,image/png,image/webp,image/gif,image/avif",
    video: "video/mp4,video/webm,video/quicktime",
};

export const MAX_BYTES: Record<MediaKind, number> = {
    image: 20 * 1024 * 1024,
    video: 1024 * 1024 * 1024,
};

export function kindOfFile(file: File): MediaKind | null {
    if (ACCEPT.image.split(",").includes(file.type)) return "image";
    if (ACCEPT.video.split(",").includes(file.type)) return "video";
    return null;
}

export function formatBytes(n: number): string {
    if (n < 1024 * 1024) return `${Math.max(1, Math.round(n / 1024))} KB`;
    if (n < 1024 * 1024 * 1024) return `${(n / 1024 / 1024).toFixed(1)} MB`;
    return `${(n / 1024 / 1024 / 1024).toFixed(2)} GB`;
}

/** Upload one file to MinIO via the backend, reporting progress 0..1. */
export function uploadMedia(file: File | Blob, opts?: { name?: string; onProgress?: (p: number) => void; signal?: AbortSignal }): Promise<MediaItem> {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", `${API_BASE}/api/media`);
        const token = getAdminToken();
        if (token) xhr.setRequestHeader("Authorization", `Bearer ${token}`);
        xhr.upload.onprogress = (e) => e.lengthComputable && opts?.onProgress?.(e.loaded / e.total);
        xhr.onload = () => {
            let body: unknown = null;
            try {
                body = JSON.parse(xhr.responseText);
            } catch {
                /* non-JSON */
            }
            if (xhr.status === 401) {
                clearAdminToken();
                window.dispatchEvent(new Event(ADMIN_SESSION_EXPIRED));
            }
            if (xhr.status >= 200 && xhr.status < 300) resolve(body as MediaItem);
            else reject(new Error((body as { error?: string })?.error ?? `Upload failed (${xhr.status})`));
        };
        xhr.onerror = () => reject(new Error("Network error while uploading"));
        xhr.onabort = () => reject(new DOMException("Upload cancelled", "AbortError"));
        opts?.signal?.addEventListener("abort", () => xhr.abort());
        const form = new FormData();
        form.append("file", file, opts?.name ?? (file instanceof File ? file.name : "upload"));
        xhr.send(form);
    });
}

export async function listMedia(kind?: MediaKind): Promise<MediaItem[]> {
    const res = await adminFetch(`${API_BASE}/api/media${kind ? `?kind=${kind}` : ""}`, { cache: "no-store" });
    if (!res.ok) throw new Error("Could not load media library");
    return res.json();
}

/* ───────── Video helpers ───────── */

export function youTubeId(url: string): string | null {
    const m = /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/|live\/)|youtu\.be\/)([\w-]{11})/.exec(url);
    return m ? m[1] : null;
}

export function youTubeEmbedUrl(url: string, opts?: { autoplay?: boolean; mute?: boolean; loop?: boolean }): string | null {
    const id = youTubeId(url);
    if (!id) return null;
    const p = new URLSearchParams({ rel: "0", modestbranding: "1", playsinline: "1" });
    if (opts?.autoplay) p.set("autoplay", "1");
    if (opts?.mute) p.set("mute", "1");
    if (opts?.loop) {
        p.set("loop", "1");
        p.set("playlist", id);
    }
    return `https://www.youtube-nocookie.com/embed/${id}?${p}`;
}

export function youTubeThumb(url: string): string | null {
    const id = youTubeId(url);
    return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : null;
}

export interface VideoInfo {
    width: number;
    height: number;
    duration: number;
}

/** Read dimensions and duration of a video URL (or object URL) without playing it. */
export function probeVideo(src: string): Promise<VideoInfo> {
    return new Promise((resolve, reject) => {
        const v = document.createElement("video");
        v.preload = "metadata";
        v.muted = true;
        v.crossOrigin = "anonymous";
        const done = () => {
            v.removeAttribute("src");
            v.load();
        };
        v.onloadedmetadata = () => {
            resolve({ width: v.videoWidth, height: v.videoHeight, duration: Number.isFinite(v.duration) ? v.duration : 0 });
            done();
        };
        v.onerror = () => {
            reject(new Error("Could not read this video. Check the URL points directly to an MP4/WebM file."));
            done();
        };
        v.src = src;
    });
}

/** Grab the current frame of a <video> as a JPEG (needs CORS-enabled source, which our uploads are). */
export function captureFrame(video: HTMLVideoElement, quality = 0.85): Promise<Blob> {
    return new Promise((resolve, reject) => {
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        try {
            canvas.getContext("2d")!.drawImage(video, 0, 0, canvas.width, canvas.height);
            canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Could not capture frame"))), "image/jpeg", quality);
        } catch {
            reject(new Error("This video's host doesn't allow capturing frames. Upload a poster image instead."));
        }
    });
}

export function formatDuration(sec: number): string {
    if (!sec) return "";
    const s = Math.round(sec);
    const m = Math.floor(s / 60);
    return `${m}:${String(s % 60).padStart(2, "0")}`;
}
