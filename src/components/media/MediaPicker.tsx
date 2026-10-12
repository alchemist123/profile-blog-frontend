import { useEffect, useRef, useState } from "react";
import { Check, Film, Image as ImageIcon, Library, Link2, Loader2, UploadCloud, X } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
    ACCEPT,
    MAX_BYTES,
    formatBytes,
    kindOfFile,
    listMedia,
    uploadMedia,
    youTubeEmbedUrl,
    youTubeId,
    type MediaItem,
    type MediaKind,
    type MediaSelection,
} from "@/lib/media";
import { cn } from "@/lib/utils";

type Tab = "upload" | "link" | "library";

interface MediaPickerProps {
    open: boolean;
    kind: MediaKind;
    allowYouTube?: boolean;
    title?: string;
    onClose: () => void;
    onSelect: (sel: MediaSelection) => void;
}

const TABS: { id: Tab; label: string; icon: typeof UploadCloud }[] = [
    { id: "upload", label: "Upload", icon: UploadCloud },
    { id: "link", label: "From URL", icon: Link2 },
    { id: "library", label: "Library", icon: Library },
];

/** Upload a file, paste a link, or reuse something uploaded before. Remount (key) to reset. */
const MediaPicker = ({ open, kind, allowYouTube = true, title, onClose, onSelect }: MediaPickerProps) => {
    const [tab, setTab] = useState<Tab>("upload");
    const [dragging, setDragging] = useState(false);
    const [progress, setProgress] = useState<number | null>(null);
    const [fileLabel, setFileLabel] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [link, setLink] = useState("");
    const [alt, setAlt] = useState("");
    const [library, setLibrary] = useState<MediaItem[] | null>(null);
    const abortRef = useRef<AbortController | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const close = () => {
        abortRef.current?.abort();
        onClose();
    };

    useEffect(() => {
        if (open && tab === "library" && library === null) {
            listMedia(kind).then(setLibrary).catch((e) => { setError((e as Error).message); setLibrary([]); });
        }
    }, [open, tab, kind, library]);

    const finish = (sel: MediaSelection) => {
        onSelect({ ...sel, alt: alt.trim() || undefined });
        onClose();
    };

    const handleFile = async (file: File) => {
        setError(null);
        const k = kindOfFile(file);
        if (k !== kind) {
            setError(kind === "image" ? "Choose a JPG, PNG, WebP, GIF or AVIF image." : "Choose an MP4, WebM or MOV video.");
            return;
        }
        if (file.size > MAX_BYTES[kind]) {
            setError(`That file is ${formatBytes(file.size)} — the limit is ${formatBytes(MAX_BYTES[kind])}.`);
            return;
        }
        const ctrl = new AbortController();
        abortRef.current = ctrl;
        setFileLabel(`${file.name} · ${formatBytes(file.size)}`);
        setProgress(0);
        try {
            const item = await uploadMedia(file, { onProgress: setProgress, signal: ctrl.signal });
            finish({ url: item.url, kind, source: "upload" });
        } catch (e) {
            if ((e as Error).name !== "AbortError") setError((e as Error).message);
            setProgress(null);
        }
    };

    const linkIsYouTube = kind === "video" && Boolean(youTubeId(link));
    const linkValid = /^https?:\/\/\S+$/i.test(link.trim()) && (!linkIsYouTube || allowYouTube);
    const kindLabel = kind === "image" ? "photo" : "video";

    return (
        <Dialog open={open} onOpenChange={(o) => !o && close()}>
            <DialogContent className="max-h-[90vh] overflow-y-auto border-sand-line bg-paper p-0 font-reading text-ink-900 sm:max-w-xl">
                <DialogHeader className="px-6 pt-6">
                    <DialogTitle className="flex items-center gap-2 font-display text-2xl text-ink-950">
                        {kind === "image" ? <ImageIcon className="h-5 w-5 text-ember-500" /> : <Film className="h-5 w-5 text-ember-500" />}
                        {title ?? `Add a ${kindLabel}`}
                    </DialogTitle>
                    <DialogDescription className="text-ink-500">
                        Upload from your device, paste a link{kind === "video" && allowYouTube ? " (YouTube works too)" : ""}, or reuse an earlier upload.
                    </DialogDescription>
                </DialogHeader>

                <div className="mx-6 mt-2 flex gap-1 rounded-xl bg-sand p-1">
                    {TABS.map((t) => (
                        <button
                            key={t.id}
                            type="button"
                            onClick={() => { setTab(t.id); setError(null); }}
                            className={cn(
                                "flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-medium transition-colors",
                                tab === t.id ? "bg-white text-ink-950 shadow-sm" : "text-ink-500 hover:text-ink-900"
                            )}
                        >
                            <t.icon className="h-4 w-4" /> {t.label}
                        </button>
                    ))}
                </div>

                <div className="px-6 pb-6 pt-5">
                    {tab === "upload" && (
                        progress === null ? (
                            <label
                                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                                onDragLeave={() => setDragging(false)}
                                onDrop={(e) => {
                                    e.preventDefault();
                                    setDragging(false);
                                    const f = e.dataTransfer.files?.[0];
                                    if (f) handleFile(f);
                                }}
                                className={cn(
                                    "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-6 py-12 text-center transition-colors",
                                    dragging ? "border-ember-500 bg-ember-50" : "border-sand-line bg-white hover:border-ink-300"
                                )}
                            >
                                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-ink-950 text-ember-400">
                                    <UploadCloud className="h-6 w-6" />
                                </span>
                                <span className="font-semibold text-ink-950">Drop a {kindLabel} here, or click to browse</span>
                                <span className="text-xs text-ink-400">
                                    {kind === "image" ? "JPG, PNG, WebP, GIF, AVIF · up to 20 MB" : "MP4, WebM, MOV · up to 1 GB"}
                                </span>
                                <input
                                    ref={inputRef}
                                    type="file"
                                    accept={ACCEPT[kind]}
                                    className="sr-only"
                                    onChange={(e) => {
                                        const f = e.target.files?.[0];
                                        if (f) handleFile(f);
                                        e.target.value = "";
                                    }}
                                />
                            </label>
                        ) : (
                            <div className="rounded-2xl border border-sand-line bg-white p-6">
                                <div className="flex items-center justify-between gap-3 text-sm">
                                    <span className="truncate font-medium text-ink-900">{fileLabel}</span>
                                    <span className="shrink-0 tabular-nums text-ink-500">{Math.round(progress * 100)}%</span>
                                </div>
                                <div className="mt-3 h-2 overflow-hidden rounded-full bg-sand">
                                    <div className="h-full rounded-full bg-ember-500 transition-[width] duration-200" style={{ width: `${progress * 100}%` }} />
                                </div>
                                <div className="mt-4 flex items-center justify-between text-xs text-ink-400">
                                    <span className="flex items-center gap-1.5">
                                        {progress < 1 ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5 text-emerald-600" />}
                                        {progress < 1 ? "Uploading to storage…" : "Processing…"}
                                    </span>
                                    <button type="button" onClick={() => abortRef.current?.abort()} className="font-semibold text-ink-600 hover:text-red-600">
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )
                    )}

                    {tab === "link" && (
                        <div className="space-y-4">
                            <input
                                autoFocus
                                value={link}
                                onChange={(e) => setLink(e.target.value)}
                                placeholder={kind === "image" ? "https://…/photo.jpg" : allowYouTube ? "https://…/video.mp4 or a YouTube link" : "https://…/video.mp4"}
                                className="w-full rounded-xl border border-sand-line bg-white px-4 py-3 text-sm outline-none focus:border-ink-400"
                            />
                            {linkValid && (
                                <div className="overflow-hidden rounded-2xl border border-sand-line bg-ink-950">
                                    {kind === "image" ? (
                                        <img src={link} alt="" className="max-h-64 w-full object-contain" />
                                    ) : linkIsYouTube ? (
                                        <iframe src={youTubeEmbedUrl(link)!} title="Preview" className="aspect-video w-full" allow="encrypted-media; picture-in-picture" />
                                    ) : (
                                        <video src={link} controls playsInline className="max-h-64 w-full" />
                                    )}
                                </div>
                            )}
                            {linkIsYouTube && !allowYouTube && <p className="text-sm text-ember-700">YouTube links can't be used here — use a direct video file.</p>}
                        </div>
                    )}

                    {tab === "library" && (
                        library === null ? (
                            <div className="flex justify-center py-12 text-ink-400"><Loader2 className="h-5 w-5 animate-spin" /></div>
                        ) : library.length === 0 ? (
                            <p className="py-12 text-center text-sm text-ink-400">Nothing uploaded yet.</p>
                        ) : (
                            <div className="grid max-h-80 grid-cols-3 gap-2 overflow-y-auto sm:grid-cols-4">
                                {library.map((m) => (
                                    <button
                                        key={m.id}
                                        type="button"
                                        onClick={() => finish({ url: m.url, kind, source: "upload" })}
                                        title={m.originalName}
                                        className="group relative aspect-square overflow-hidden rounded-xl bg-ink-900 ring-ember-500 hover:ring-2"
                                    >
                                        {m.kind === "image" ? (
                                            <img src={m.url} alt="" loading="lazy" className="h-full w-full object-cover" />
                                        ) : (
                                            <video src={`${m.url}#t=0.5`} muted preload="metadata" className="h-full w-full object-cover" />
                                        )}
                                        <span className="absolute inset-x-0 bottom-0 truncate bg-gradient-to-t from-black/70 px-2 pb-1 pt-4 text-left text-[10px] text-white opacity-0 group-hover:opacity-100">
                                            {m.originalName || m.key.split("/").pop()}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        )
                    )}

                    {kind === "image" && tab !== "library" && progress === null && (
                        <input
                            value={alt}
                            onChange={(e) => setAlt(e.target.value)}
                            placeholder="Alt text — describe the image (optional, helps accessibility)"
                            className="mt-4 w-full rounded-xl border border-sand-line bg-white px-4 py-2.5 text-sm outline-none focus:border-ink-400"
                        />
                    )}

                    {error && (
                        <p className="mt-4 flex items-start gap-2 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
                            <X className="mt-0.5 h-4 w-4 shrink-0" /> {error}
                        </p>
                    )}

                    {tab === "link" && (
                        <div className="mt-6 flex justify-end gap-2">
                            <button type="button" onClick={close} className="rounded-full px-4 py-2 text-sm font-semibold text-ink-600 hover:bg-sand">Cancel</button>
                            <button
                                type="button"
                                disabled={!linkValid}
                                onClick={() => finish({ url: link.trim(), kind, source: linkIsYouTube ? "youtube" : "url" })}
                                className="rounded-full bg-ember-500 px-5 py-2 text-sm font-semibold text-white hover:bg-ember-600 disabled:opacity-40"
                            >
                                Use this {kindLabel}
                            </button>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default MediaPicker;
