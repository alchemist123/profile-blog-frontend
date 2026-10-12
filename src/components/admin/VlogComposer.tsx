import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Camera, Film, Heart, ImagePlus, Link2, Loader2, MessageCircle, MonitorPlay, RefreshCw, Send, Smartphone, UploadCloud, X } from "lucide-react";
import TagInput from "@/components/admin/TagInput";
import { useMediaPicker } from "@/components/media/useMediaPicker";
import {
    ACCEPT,
    MAX_BYTES,
    captureFrame,
    formatBytes,
    formatDuration,
    kindOfFile,
    probeVideo,
    uploadMedia,
    youTubeEmbedUrl,
    youTubeThumb,
} from "@/lib/media";
import { getVlogs, saveVlog, type Vlog, type VlogInput, type VlogOrientation } from "@/lib/vlogs";
import { AUTHOR } from "@/lib/blog";
import type { BlogStatus } from "@/lib/storage";
import { cn } from "@/lib/utils";

interface Props {
    initial: Partial<Vlog>;
    onExit: () => void;
    onSaved: () => void;
}

type Draft = VlogInput & { id?: string };

function toDraft(v: Partial<Vlog>): Draft {
    return {
        id: v.id,
        title: v.title ?? "",
        caption: v.caption ?? "",
        videoUrl: v.videoUrl ?? "",
        source: v.source ?? "upload",
        posterUrl: v.posterUrl ?? "",
        orientation: v.orientation ?? "portrait",
        durationSec: v.durationSec ?? 0,
        tags: v.tags ?? [],
        status: v.status ?? (v.id ? "published" : "draft"),
    };
}

const FORMATS: { id: VlogOrientation; title: string; sub: string; icon: typeof Smartphone }[] = [
    { id: "portrait", title: "Reel", sub: "Portrait · 9:16", icon: Smartphone },
    { id: "landscape", title: "Video", sub: "Landscape · 16:9", icon: MonitorPlay },
];

const VlogComposer = ({ initial, onExit, onSaved }: Props) => {
    const [draft, setDraft] = useState<Draft>(() => toDraft(initial));
    const [upload, setUpload] = useState<{ name: string; progress: number } | null>(null);
    const [dragging, setDragging] = useState(false);
    const [autoDetected, setAutoDetected] = useState(false);
    const [dims, setDims] = useState<{ width: number; height: number } | null>(null);
    const [busy, setBusy] = useState<string | null>(null);
    const [saving, setSaving] = useState<BlogStatus | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [knownTags, setKnownTags] = useState<string[]>([]);
    const previewRef = useRef<HTMLVideoElement>(null);
    const abortRef = useRef<AbortController | null>(null);
    const picker = useMediaPicker({ allowYouTube: true });

    const update = (patch: Partial<Draft>) => setDraft((d) => ({ ...d, ...patch }));
    const isYouTube = draft.source === "youtube";
    const isPublished = Boolean(draft.id) && draft.status === "published";

    useEffect(() => {
        getVlogs({ includeDrafts: true })
            .then((all) => setKnownTags([...new Set(all.flatMap((v) => v.tags ?? []))].sort()))
            .catch(() => {});
    }, []);

    /** Set the video, then detect orientation + duration from its metadata. */
    const applyVideo = async (url: string, source: Draft["source"]) => {
        setError(null);
        update({ videoUrl: url, source, posterUrl: source === "youtube" ? youTubeThumb(url) ?? "" : draft.posterUrl });
        setDims(null);
        if (source === "youtube") {
            setAutoDetected(false);
            if (/\/shorts\//.test(url)) update({ orientation: "portrait" });
            return;
        }
        try {
            const info = await probeVideo(url);
            setDims({ width: info.width, height: info.height });
            update({ orientation: info.height > info.width ? "portrait" : "landscape", durationSec: Math.round(info.duration * 10) / 10 });
            setAutoDetected(true);
        } catch (e) {
            setError((e as Error).message);
        }
    };

    const uploadFile = async (file: File) => {
        setError(null);
        if (kindOfFile(file) !== "video") return setError("Choose an MP4, WebM or MOV video.");
        if (file.size > MAX_BYTES.video) return setError(`That file is ${formatBytes(file.size)} — the limit is ${formatBytes(MAX_BYTES.video)}.`);
        const ctrl = new AbortController();
        abortRef.current = ctrl;
        setUpload({ name: `${file.name} · ${formatBytes(file.size)}`, progress: 0 });
        try {
            const item = await uploadMedia(file, { signal: ctrl.signal, onProgress: (p) => setUpload((u) => (u ? { ...u, progress: p } : u)) });
            await applyVideo(item.url, "upload");
        } catch (e) {
            if ((e as Error).name !== "AbortError") setError((e as Error).message);
        } finally {
            setUpload(null);
        }
    };

    const chooseFromPicker = async () => {
        const sel = await picker.open("video", "Choose a video");
        if (sel) await applyVideo(sel.url, sel.source);
    };

    const useCurrentFrame = async () => {
        const v = previewRef.current;
        if (!v) return;
        setBusy("frame");
        setError(null);
        try {
            const blob = await captureFrame(v);
            const item = await uploadMedia(blob, { name: "poster.jpg" });
            update({ posterUrl: item.url });
        } catch (e) {
            setError((e as Error).message);
        } finally {
            setBusy(null);
        }
    };

    const uploadPoster = async () => {
        const sel = await picker.open("image", "Cover image");
        if (sel) update({ posterUrl: sel.url });
    };

    const save = async (status: BlogStatus) => {
        if (!draft.videoUrl) return setError("Add a video first.");
        if (!draft.title.trim()) return setError("Give your vlog a title.");
        setSaving(status);
        setError(null);
        try {
            const saved = await saveVlog({ ...draft, title: draft.title.trim(), caption: draft.caption.trim(), status });
            setDraft(toDraft(saved));
            onSaved();
        } catch (e) {
            setError((e as Error).message);
        } finally {
            setSaving(null);
        }
    };

    const portrait = draft.orientation === "portrait";
    const ytEmbed = isYouTube ? youTubeEmbedUrl(draft.videoUrl, { mute: true }) : null;

    const previewMedia = draft.videoUrl ? (
        ytEmbed ? (
            <iframe src={ytEmbed} title="Preview" className="h-full w-full" allow="encrypted-media; picture-in-picture" />
        ) : (
            <video
                ref={previewRef}
                key={draft.videoUrl}
                src={draft.videoUrl}
                poster={draft.posterUrl || undefined}
                crossOrigin={draft.source === "upload" ? "anonymous" : undefined}
                controls
                playsInline
                muted
                loop
                className="h-full w-full bg-black object-cover"
            />
        )
    ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-ink-900 text-ink-300">
            <Film className="h-8 w-8" />
            <span className="text-xs">Your video appears here</span>
        </div>
    );

    return (
        <div className="min-h-screen bg-paper font-reading text-ink-900 [color-scheme:light]">
            {picker.element}

            <header className="sticky top-16 z-30 border-b border-sand-line bg-paper/90 backdrop-blur">
                <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4">
                    <button type="button" onClick={onExit} className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-ink-600 hover:bg-sand hover:text-ink-950">
                        <ArrowLeft className="h-4 w-4" /> Vlogs
                    </button>
                    <span className={cn("rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider", isPublished ? "bg-emerald-100 text-emerald-800" : "bg-sand text-ink-600")}>
                        {isPublished ? "Published" : "Draft"}
                    </span>
                    <div className="ml-auto flex items-center gap-2">
                        {!isPublished && (
                            <button type="button" onClick={() => save("draft")} disabled={saving !== null || upload !== null} className="rounded-full px-4 py-2 text-sm font-semibold text-ink-700 hover:bg-sand disabled:opacity-50">
                                {saving === "draft" ? "Saving…" : "Save draft"}
                            </button>
                        )}
                        {isPublished && (
                            <button type="button" onClick={() => save("draft")} disabled={saving !== null} className="hidden rounded-full px-4 py-2 text-sm font-semibold text-ink-600 hover:bg-sand disabled:opacity-50 sm:block">
                                Unpublish
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={() => save("published")}
                            disabled={saving !== null || upload !== null || !draft.videoUrl || !draft.title.trim()}
                            className="inline-flex items-center gap-2 rounded-full bg-ember-500 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-ember-600 disabled:opacity-40"
                        >
                            {saving === "published" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                            {isPublished ? "Update" : "Publish"}
                        </button>
                    </div>
                </div>
            </header>

            <main className="mx-auto grid max-w-6xl gap-10 px-4 py-10 lg:grid-cols-[1fr_380px]">
                <div className="min-w-0 space-y-8">
                    <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ember-600">New vlog</p>
                        <h1 className="mt-1 font-display text-4xl font-semibold tracking-tight text-ink-950">Share a reel or a video</h1>
                    </div>

                    {error && <p className="flex items-start gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"><X className="mt-0.5 h-4 w-4 shrink-0" />{error}</p>}

                    {/* 1. Video */}
                    <section className="rounded-3xl border border-sand-line bg-white p-5 md:p-6">
                        <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-ink-950"><span className="flex h-6 w-6 items-center justify-center rounded-full bg-ink-950 text-xs text-white">1</span> Video</h2>
                        {upload ? (
                            <div className="rounded-2xl bg-sand/60 p-5">
                                <div className="flex items-center justify-between gap-3 text-sm">
                                    <span className="truncate font-medium">{upload.name}</span>
                                    <span className="tabular-nums text-ink-500">{Math.round(upload.progress * 100)}%</span>
                                </div>
                                <div className="mt-3 h-2 overflow-hidden rounded-full bg-white">
                                    <div className="h-full rounded-full bg-ember-500 transition-[width]" style={{ width: `${upload.progress * 100}%` }} />
                                </div>
                                <button type="button" onClick={() => abortRef.current?.abort()} className="mt-3 text-xs font-semibold text-ink-500 hover:text-red-600">Cancel upload</button>
                            </div>
                        ) : draft.videoUrl ? (
                            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-sand/60 px-4 py-3 text-sm">
                                <span className="flex min-w-0 items-center gap-2">
                                    <Film className="h-4 w-4 shrink-0 text-ember-600" />
                                    <span className="truncate text-ink-700">
                                        {isYouTube ? "YouTube video" : draft.source === "upload" ? "Uploaded video" : "Linked video"}
                                        {dims && ` · ${dims.width}×${dims.height}`}
                                        {draft.durationSec > 0 && ` · ${formatDuration(draft.durationSec)}`}
                                    </span>
                                </span>
                                <button type="button" onClick={() => update({ videoUrl: "", posterUrl: "", durationSec: 0 })} className="inline-flex items-center gap-1 font-semibold text-ink-600 hover:text-ink-950">
                                    <RefreshCw className="h-3.5 w-3.5" /> Replace
                                </button>
                            </div>
                        ) : (
                            <>
                                <label
                                    onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                                    onDragLeave={() => setDragging(false)}
                                    onDrop={(e) => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files?.[0]; if (f) uploadFile(f); }}
                                    className={cn(
                                        "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-6 py-14 text-center transition-colors",
                                        dragging ? "border-ember-500 bg-ember-50" : "border-sand-line hover:border-ink-300"
                                    )}
                                >
                                    <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-ink-950 text-ember-400"><UploadCloud className="h-7 w-7" /></span>
                                    <span className="text-base font-semibold text-ink-950">Drop your video here, or click to upload</span>
                                    <span className="text-xs text-ink-400">MP4, WebM or MOV · up to 1 GB · portrait or landscape is detected automatically</span>
                                    <input type="file" accept={ACCEPT.video} className="sr-only" onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadFile(f); e.target.value = ""; }} />
                                </label>
                                <button type="button" onClick={chooseFromPicker} className="mt-3 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium text-ink-600 hover:bg-sand">
                                    <Link2 className="h-4 w-4" /> Use a link, YouTube or a previous upload
                                </button>
                            </>
                        )}
                    </section>

                    {/* 2. Format */}
                    <section className="rounded-3xl border border-sand-line bg-white p-5 md:p-6">
                        <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-ink-950">
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-ink-950 text-xs text-white">2</span> Format
                            {autoDetected && <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-700">Auto-detected</span>}
                        </h2>
                        <div className="grid grid-cols-2 gap-3">
                            {FORMATS.map((f) => (
                                <button
                                    key={f.id}
                                    type="button"
                                    onClick={() => { update({ orientation: f.id }); setAutoDetected(false); }}
                                    className={cn(
                                        "flex items-center gap-4 rounded-2xl border-2 p-4 text-left transition-colors",
                                        draft.orientation === f.id ? "border-ember-500 bg-ember-50" : "border-sand-line hover:border-ink-200"
                                    )}
                                >
                                    <span className={cn("flex items-center justify-center rounded-lg border-2", f.id === "portrait" ? "h-12 w-7" : "h-7 w-12", draft.orientation === f.id ? "border-ember-500 bg-ember-500/10" : "border-ink-300")}>
                                        <f.icon className="h-3.5 w-3.5 text-ink-500" />
                                    </span>
                                    <span>
                                        <span className="block font-semibold text-ink-950">{f.title}</span>
                                        <span className="block text-xs text-ink-400">{f.sub}</span>
                                    </span>
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* 3. Details */}
                    <section className="space-y-5 rounded-3xl border border-sand-line bg-white p-5 md:p-6">
                        <h2 className="flex items-center gap-2 text-sm font-semibold text-ink-950"><span className="flex h-6 w-6 items-center justify-center rounded-full bg-ink-950 text-xs text-white">3</span> Details</h2>
                        <div>
                            <input
                                value={draft.title}
                                onChange={(e) => update({ title: e.target.value })}
                                maxLength={160}
                                placeholder="Title"
                                className="w-full bg-transparent font-display text-3xl font-semibold tracking-tight text-ink-950 outline-none placeholder:text-ink-200"
                            />
                        </div>
                        <textarea
                            value={draft.caption}
                            onChange={(e) => update({ caption: e.target.value })}
                            rows={4}
                            maxLength={5000}
                            placeholder="Write a caption — what's this about? Links and #hashtags welcome."
                            className="w-full resize-y rounded-2xl border border-sand-line bg-paper px-4 py-3 text-[15px] leading-relaxed outline-none focus:border-ink-300"
                        />
                        <div className="rounded-2xl border border-sand-line px-4 py-2.5">
                            <TagInput tags={draft.tags} onChange={(tags) => update({ tags })} suggestions={knownTags} />
                        </div>
                    </section>

                    {/* 4. Cover */}
                    <section className="rounded-3xl border border-sand-line bg-white p-5 md:p-6">
                        <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-ink-950"><span className="flex h-6 w-6 items-center justify-center rounded-full bg-ink-950 text-xs text-white">4</span> Cover</h2>
                        <div className="flex flex-wrap items-center gap-4">
                            <div className={cn("overflow-hidden rounded-xl bg-ink-900 ring-1 ring-sand-line", portrait ? "h-36 w-[81px]" : "h-[81px] w-36")}>
                                {draft.posterUrl ? <img src={draft.posterUrl} alt="" className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-ink-400"><ImagePlus className="h-5 w-5" /></div>}
                            </div>
                            <div className="flex flex-col gap-2">
                                {!isYouTube && draft.videoUrl && (
                                    <button type="button" onClick={useCurrentFrame} disabled={busy !== null} className="inline-flex items-center gap-2 rounded-full bg-ink-950 px-4 py-2 text-sm font-semibold text-white hover:bg-ink-800 disabled:opacity-50">
                                        {busy === "frame" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />} Use current frame
                                    </button>
                                )}
                                <button type="button" onClick={uploadPoster} className="inline-flex items-center gap-2 rounded-full border border-ink-200 px-4 py-2 text-sm font-semibold text-ink-800 hover:border-ink-950">
                                    <ImagePlus className="h-4 w-4" /> Upload cover
                                </button>
                                {draft.posterUrl && <button type="button" onClick={() => update({ posterUrl: "" })} className="text-left text-xs font-semibold text-ink-400 hover:text-red-600">Remove cover</button>}
                            </div>
                        </div>
                        {!isYouTube && draft.videoUrl && <p className="mt-3 text-xs text-ink-400">Tip: scrub the preview to the moment you want, then “Use current frame”.</p>}
                    </section>
                </div>

                {/* Live preview */}
                <aside className="lg:sticky lg:top-[8.5rem] lg:self-start">
                    <p className="mb-3 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-400">Live preview</p>
                    {portrait ? (
                        <div className="mx-auto w-[300px] rounded-[2.75rem] bg-ink-950 p-3 shadow-2xl shadow-ink-950/30 ring-1 ring-black">
                            <div className="relative aspect-[9/16] overflow-hidden rounded-[2.1rem] bg-black">
                                {previewMedia}
                                <div className={cn("pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent p-4 pt-16 text-white", draft.videoUrl && !isYouTube && "pb-16")}>
                                    <div className="flex items-center gap-2">
                                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ember-500 font-display text-xs font-semibold">{AUTHOR.name.charAt(0)}</span>
                                        <span className="text-xs font-semibold">{AUTHOR.name}</span>
                                    </div>
                                    <p className="mt-2 line-clamp-2 text-sm font-semibold">{draft.title || "Your title"}</p>
                                    {draft.caption && <p className="mt-1 line-clamp-2 text-xs text-white/75">{draft.caption}</p>}
                                </div>
                                <div className={cn("pointer-events-none absolute right-3 flex flex-col items-center gap-4 text-white", draft.videoUrl && !isYouTube ? "bottom-36" : "bottom-24")}>
                                    <Heart className="h-6 w-6" />
                                    <MessageCircle className="h-6 w-6" />
                                    <Send className="h-6 w-6" />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="overflow-hidden rounded-2xl bg-white shadow-xl shadow-ink-950/10 ring-1 ring-sand-line">
                            <div className="aspect-video bg-black">{previewMedia}</div>
                            <div className="flex gap-3 p-4">
                                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ember-500 font-display text-sm font-semibold text-white">{AUTHOR.name.charAt(0)}</span>
                                <div className="min-w-0">
                                    <p className="line-clamp-2 font-display text-lg font-semibold leading-snug text-ink-950">{draft.title || "Your title"}</p>
                                    <p className="mt-0.5 text-xs text-ink-400">{AUTHOR.name}{draft.durationSec > 0 && ` · ${formatDuration(draft.durationSec)}`}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </aside>
            </main>
        </div>
    );
};

export default VlogComposer;
