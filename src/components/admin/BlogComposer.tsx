import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Check, Circle, ImagePlus, Loader2, Sparkles } from "lucide-react";
import { useMediaPicker } from "@/components/media/useMediaPicker";
import TagInput from "@/components/admin/TagInput";
import { getBlogTags, htmlToBlocks, saveBlog, type BlogPost, type BlogStatus } from "@/lib/storage";
import { autoSummary, countWords, estimateReadingTime } from "@/lib/blog";
import Editor from "@/components/ui/editor";
import BlogCard from "@/components/blog/BlogCard";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

interface Draft {
    id?: string;
    title: string;
    summary: string;
    coverImage: string;
    tags: string[];
    content: string;
    status: BlogStatus;
    createdAt?: string;
}

interface BlogComposerProps {
    initial: Partial<BlogPost>;
    onExit: () => void;
    onSaved: () => void;
}

const MIN_WORDS_TO_PUBLISH = 30;
const localKey = (id?: string) => `blog:composer:${id ?? "new"}`;

function toDraft(p: Partial<BlogPost>): Draft {
    return {
        id: p.id,
        title: p.title ?? "",
        summary: p.summary ?? "",
        coverImage: p.coverImage ?? "",
        tags: Array.isArray(p.tags) ? p.tags.filter(Boolean) : [],
        content: p.content ?? "",
        status: p.status ?? (p.id ? "published" : "draft"),
        createdAt: p.createdAt,
    };
}

function readLocal(id?: string): (Draft & { savedAt: number }) | null {
    try {
        const raw = localStorage.getItem(localKey(id));
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

/** Textarea that grows with its content (title / subtitle). */
const AutoTextarea = ({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => {
    const ref = useRef<HTMLTextAreaElement>(null);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        el.style.height = "auto";
        el.style.height = `${el.scrollHeight}px`;
    }, [props.value]);
    return <textarea ref={ref} rows={1} className={cn("w-full resize-none overflow-hidden bg-transparent outline-none", className)} {...props} />;
};

const BlogComposer = ({ initial, onExit, onSaved }: BlogComposerProps) => {
    const [draft, setDraft] = useState<Draft>(() => toDraft(initial));
    const [restored, setRestored] = useState(false);
    const [localSavedAt, setLocalSavedAt] = useState<number | null>(null);
    const [saving, setSaving] = useState<BlogStatus | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [publishOpen, setPublishOpen] = useState(false);
    const picker = useMediaPicker();
    const [knownTags, setKnownTags] = useState<string[]>([]);
    // Editor is uncontrolled after mount; bump this to remount it with restored content.
    const [editorKey, setEditorKey] = useState(0);

    const update = useCallback((patch: Partial<Draft>) => setDraft((d) => ({ ...d, ...patch })), []);
    // Last version known to be on the server; autosave skips when the draft matches it.
    const serverSnapshot = useRef(JSON.stringify(toDraft(initial)));

    useEffect(() => {
        getBlogTags().then(setKnownTags).catch(() => {});
    }, []);

    // Offer the locally autosaved version if it is newer than what the server has.
    useEffect(() => {
        const local = readLocal(initial.id);
        if (!local) return;
        const serverTime = initial.updatedAt ? Date.parse(initial.updatedAt) : 0;
        if (local.savedAt > serverTime && (local.title || countWords(local.content) > 0)) {
            const { savedAt, ...rest } = local;
            setDraft(rest);
            setLocalSavedAt(savedAt);
            setRestored(true);
            setEditorKey((k) => k + 1);
        }
    }, [initial.id, initial.updatedAt]);

    // Autosave unsaved changes to this browser after a second of inactivity.
    useEffect(() => {
        const t = setTimeout(() => {
            try {
                if (JSON.stringify(draft) === serverSnapshot.current) {
                    localStorage.removeItem(localKey(draft.id));
                    return;
                }
                const savedAt = Date.now();
                localStorage.setItem(localKey(draft.id), JSON.stringify({ ...draft, savedAt }));
                setLocalSavedAt(savedAt);
            } catch {
                /* storage full or unavailable */
            }
        }, 1000);
        return () => clearTimeout(t);
    }, [draft]);

    const words = useMemo(() => countWords(draft.content), [draft.content]);
    const minutes = useMemo(() => estimateReadingTime(draft.content), [draft.content]);
    const suggestedSummary = useMemo(() => autoSummary(draft.content), [draft.content]);
    const isPublished = draft.status === "published" && Boolean(draft.id);

    const save = useCallback(
        async (status: BlogStatus) => {
            if (!draft.title.trim()) {
                setError("Add a title first.");
                return false;
            }
            if (status === "published" && words < MIN_WORDS_TO_PUBLISH) {
                setError(`Write at least ${MIN_WORDS_TO_PUBLISH} words before publishing.`);
                return false;
            }
            setSaving(status);
            setError(null);
            try {
                const blocks = htmlToBlocks(draft.content);
                const saved = await saveBlog({
                    id: draft.id,
                    title: draft.title.trim(),
                    summary: draft.summary.trim() || suggestedSummary,
                    coverImage: draft.coverImage.trim() || undefined,
                    tags: draft.tags,
                    status,
                    ...(blocks.length > 0 ? { blocks } : { content: draft.content }),
                } as Parameters<typeof saveBlog>[0]);
                try {
                    localStorage.removeItem(localKey(draft.id));
                    localStorage.removeItem(localKey(saved.id));
                } catch {
                    /* ignore */
                }
                serverSnapshot.current = JSON.stringify({ ...draft, id: saved.id, status, summary: draft.summary || suggestedSummary });
                setDraft((d) => ({ ...d, id: saved.id, status, summary: d.summary || suggestedSummary }));
                setLocalSavedAt(null);
                setRestored(false);
                onSaved();
                return true;
            } catch (err) {
                setError((err as Error).message);
                return false;
            } finally {
                setSaving(null);
            }
        },
        [draft, words, suggestedSummary, onSaved]
    );

    // Ctrl/Cmd+S saves with the current status.
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
                e.preventDefault();
                save(isPublished ? "published" : "draft");
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [save, isPublished]);

    const changeCover = async () => {
        const sel = await picker.open("image", "Cover image");
        if (sel) update({ coverImage: sel.url });
    };

    const discardLocal = () => {
        try {
            localStorage.removeItem(localKey(initial.id));
        } catch {
            /* ignore */
        }
        setDraft(toDraft(initial));
        setRestored(false);
        setLocalSavedAt(null);
        setEditorKey((k) => k + 1);
    };

    const checklist = [
        { ok: draft.title.trim().length > 0, label: "Title", hint: "Give the post a clear, specific title" },
        { ok: words >= MIN_WORDS_TO_PUBLISH, label: `Body (${words} words)`, hint: `At least ${MIN_WORDS_TO_PUBLISH} words` },
        { ok: Boolean(draft.summary.trim() || suggestedSummary), label: "Summary", hint: draft.summary.trim() ? "Custom" : "Auto-generated from your first paragraph" },
        { ok: Boolean(draft.coverImage.trim()), label: "Cover image", hint: "Optional — a branded cover is generated if empty", optional: true },
        { ok: draft.tags.length > 0, label: "Tags", hint: "Optional — helps readers filter", optional: true },
    ];
    const canPublish = checklist.every((c) => c.ok || c.optional);

    const preview: BlogPost = {
        id: draft.id ?? "preview",
        title: draft.title || "Untitled post",
        summary: draft.summary || suggestedSummary,
        content: "",
        coverImage: draft.coverImage || undefined,
        tags: draft.tags,
        createdAt: draft.createdAt ?? new Date().toISOString(),
        readingTime: minutes,
    };

    return (
        <div className="min-h-screen bg-paper font-reading text-ink-900 [color-scheme:light]">
            {/* Top bar */}
            <header className="sticky top-16 z-30 border-b border-sand-line bg-paper/90 backdrop-blur">
                <div className="mx-auto flex h-14 max-w-5xl items-center gap-3 px-4">
                    <button type="button" onClick={onExit} className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-ink-600 hover:bg-sand hover:text-ink-950">
                        <ArrowLeft className="h-4 w-4" /> Stories
                    </button>
                    <span className={cn("rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider", isPublished ? "bg-emerald-100 text-emerald-800" : "bg-sand text-ink-600")}>
                        {isPublished ? "Published" : "Draft"}
                    </span>
                    <span className="hidden text-xs text-ink-400 sm:inline">
                        {saving ? "Saving…" : localSavedAt ? `Autosaved ${new Date(localSavedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}` : ""}
                    </span>
                    <div className="ml-auto flex items-center gap-2">
                        <span className="hidden text-xs text-ink-400 md:inline">{words} words · {minutes} min read</span>
                        {!isPublished && (
                            <button
                                type="button"
                                onClick={() => save("draft")}
                                disabled={saving !== null}
                                className="rounded-full px-4 py-2 text-sm font-semibold text-ink-700 hover:bg-sand disabled:opacity-50"
                                title="Save draft (Ctrl+S)"
                            >
                                {saving === "draft" ? "Saving…" : "Save draft"}
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={() => { setError(null); setPublishOpen(true); }}
                            className="rounded-full bg-ember-500 px-5 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-ember-600"
                        >
                            {isPublished ? "Update" : "Publish"}
                        </button>
                    </div>
                </div>
            </header>

            {restored && (
                <div className="mx-auto mt-4 flex max-w-[760px] items-center justify-between gap-4 rounded-xl border border-ember-200 bg-ember-50 px-4 py-3 text-sm text-ember-800">
                    <span>Restored unsaved changes from this browser.</span>
                    <button type="button" onClick={discardLocal} className="font-semibold underline underline-offset-2">Discard</button>
                </div>
            )}
            {error && !publishOpen && (
                <div className="mx-auto mt-4 max-w-[760px] rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
            )}

            <main className="mx-auto max-w-[760px] px-4 pb-24 pt-10 sm:pl-14">
                {/* Cover */}
                {draft.coverImage ? (
                    <div className="group relative mb-10 overflow-hidden rounded-2xl ring-1 ring-sand-line">
                        <img src={draft.coverImage} alt="" className="aspect-[16/8] w-full object-cover" />
                        <div className="absolute right-3 top-3 flex gap-2 opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100">
                            <button type="button" onClick={changeCover} className="rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-ink-900 shadow hover:bg-white">Change</button>
                            <button type="button" onClick={() => update({ coverImage: "" })} className="rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-red-600 shadow hover:bg-white">Remove</button>
                        </div>
                    </div>
                ) : (
                    <button type="button" onClick={changeCover} className="mb-6 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium text-ink-400 hover:bg-sand hover:text-ink-800">
                        <ImagePlus className="h-4 w-4" /> Add cover image
                    </button>
                )}
                {picker.element}

                <div className="mb-6">
                    <TagInput tags={draft.tags} onChange={(tags) => update({ tags })} suggestions={knownTags} />
                </div>

                <AutoTextarea
                    autoFocus={!draft.title}
                    value={draft.title}
                    onChange={(e) => update({ title: e.target.value.replace(/\n/g, " ") })}
                    placeholder="Title"
                    className="font-display text-4xl font-semibold leading-[1.15] tracking-tight text-ink-950 placeholder:text-ink-200 md:text-5xl"
                />
                <div className="group relative mt-4">
                    <AutoTextarea
                        value={draft.summary}
                        onChange={(e) => update({ summary: e.target.value })}
                        placeholder={suggestedSummary || "Add a short subtitle — shown on cards and link previews"}
                        className="pr-20 text-lg leading-relaxed text-ink-500 placeholder:text-ink-300"
                    />
                    {!draft.summary && suggestedSummary && (
                        <button
                            type="button"
                            onClick={() => update({ summary: suggestedSummary })}
                            className="absolute right-0 top-1 inline-flex items-center gap-1 rounded-full bg-sand px-2.5 py-1 text-[11px] font-semibold text-ink-600 hover:bg-ink-950 hover:text-white"
                            title="Use the suggested summary from your first paragraph"
                        >
                            <Sparkles className="h-3 w-3" /> Use
                        </button>
                    )}
                </div>

                <div className="my-8 h-px bg-sand-line" />

                <Editor key={editorKey} content={draft.content} onChange={(content) => update({ content })} />
            </main>

            {/* Publish panel */}
            <Sheet open={publishOpen} onOpenChange={setPublishOpen}>
                <SheetContent className="w-full overflow-y-auto border-l border-sand-line bg-paper text-ink-900 sm:max-w-md">
                    <SheetHeader>
                        <SheetTitle className="font-display text-2xl text-ink-950">{isPublished ? "Update post" : "Ready to publish?"}</SheetTitle>
                        <SheetDescription className="text-ink-500">This is how your post will appear in the list.</SheetDescription>
                    </SheetHeader>

                    <div className="pointer-events-none mt-6 select-none">
                        <BlogCard blog={preview} />
                    </div>

                    <ul className="mt-8 space-y-3">
                        {checklist.map((c) => (
                            <li key={c.label} className="flex items-start gap-3">
                                {c.ok ? (
                                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white"><Check className="h-3 w-3" /></span>
                                ) : (
                                    <Circle className={cn("mt-0.5 h-5 w-5 shrink-0", c.optional ? "text-ink-200" : "text-ember-500")} />
                                )}
                                <div>
                                    <p className="text-sm font-semibold text-ink-900">{c.label}{c.optional && <span className="ml-1 font-normal text-ink-400">(optional)</span>}</p>
                                    <p className="text-xs text-ink-400">{c.hint}</p>
                                </div>
                            </li>
                        ))}
                    </ul>

                    {error && <p className="mt-6 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

                    <div className="mt-8 flex flex-col gap-2">
                        <button
                            type="button"
                            disabled={!canPublish || saving !== null}
                            onClick={async () => { if (await save("published")) setPublishOpen(false); }}
                            className="inline-flex items-center justify-center gap-2 rounded-full bg-ember-500 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-ember-600 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            {saving === "published" && <Loader2 className="h-4 w-4 animate-spin" />}
                            {isPublished ? "Save changes" : "Publish now"}
                        </button>
                        <button
                            type="button"
                            disabled={saving !== null}
                            onClick={async () => { if (await save("draft")) setPublishOpen(false); }}
                            className="rounded-full px-5 py-3 text-sm font-semibold text-ink-600 hover:bg-sand disabled:opacity-40"
                        >
                            {isPublished ? "Unpublish (move to drafts)" : "Save as draft"}
                        </button>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
};

export default BlogComposer;
