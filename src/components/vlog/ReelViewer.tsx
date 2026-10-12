import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronUp, Heart, Link2, Check, Volume2, VolumeX, X, Play } from "lucide-react";
import type { Vlog } from "@/lib/vlogs";
import { likeVlog, posterOf, recordVlogView } from "@/lib/vlogs";
import { AUTHOR, formatDate } from "@/lib/blog";
import VlogPlayer from "@/components/vlog/VlogPlayer";
import { cn } from "@/lib/utils";

const LIKED_KEY = "vlog:liked";
const likedIds = (): string[] => {
    try {
        return JSON.parse(localStorage.getItem(LIKED_KEY) ?? "[]");
    } catch {
        return [];
    }
};

interface Props {
    reels: Vlog[];
    startId: string;
    onClose: () => void;
    onActiveChange?: (id: string) => void;
}

/** Full-screen vertical reel feed: swipe/scroll or arrow keys to move, tap to pause. */
const ReelViewer = ({ reels, startId, onClose, onActiveChange }: Props) => {
    const [active, setActive] = useState(startId);
    const [muted, setMuted] = useState(true);
    const [pausedId, setPausedId] = useState<string | null>(null);
    const [liked, setLiked] = useState<string[]>(likedIds);
    const [likes, setLikes] = useState<Record<string, number>>(() => Object.fromEntries(reels.map((r) => [r.id, r.likes])));
    const [copied, setCopied] = useState(false);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const scroller = useRef<HTMLDivElement>(null);
    const videos = useRef(new Map<string, HTMLVideoElement>());
    const viewed = useRef(new Set<string>());

    // Lock page scroll while open
    useEffect(() => {
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = prev;
        };
    }, []);

    // Jump to the starting reel
    useEffect(() => {
        document.getElementById(`reel-${startId}`)?.scrollIntoView({ block: "start" });
    }, [startId]);

    // Track which reel is on screen
    useEffect(() => {
        const root = scroller.current;
        if (!root) return;
        const io = new IntersectionObserver(
            (entries) => {
                for (const e of entries) {
                    if (e.isIntersecting && e.intersectionRatio > 0.6) setActive((e.target as HTMLElement).dataset.id!);
                }
            },
            { root, threshold: [0.6] }
        );
        root.querySelectorAll("[data-id]").forEach((el) => io.observe(el));
        return () => io.disconnect();
    }, [reels]);

    // Play the active reel, pause the rest; count a view once per reel
    useEffect(() => {
        videos.current.forEach((v, id) => {
            if (id === active) {
                v.currentTime = 0;
                v.play().catch(() => {});
            } else {
                v.pause();
            }
        });
        onActiveChange?.(active);
        if (!viewed.current.has(active)) {
            viewed.current.add(active);
            recordVlogView(active).catch(() => {});
        }
    }, [active, onActiveChange]);

    const go = useCallback(
        (dir: 1 | -1) => {
            const i = reels.findIndex((r) => r.id === active);
            const next = reels[i + dir];
            if (next) document.getElementById(`reel-${next.id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
        },
        [reels, active]
    );

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
            else if (e.key === "ArrowDown" || e.key === "j") { e.preventDefault(); go(1); }
            else if (e.key === "ArrowUp" || e.key === "k") { e.preventDefault(); go(-1); }
            else if (e.key === "m") setMuted((m) => !m);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [go, onClose]);

    const togglePlay = (id: string) => {
        const v = videos.current.get(id);
        if (!v) return;
        if (v.paused) {
            v.play().catch(() => {});
            setPausedId(null);
        } else {
            v.pause();
            setPausedId(id);
        }
    };

    const like = (id: string) => {
        if (liked.includes(id)) return;
        const next = [...liked, id];
        setLiked(next);
        setLikes((l) => ({ ...l, [id]: (l[id] ?? 0) + 1 }));
        try {
            localStorage.setItem(LIKED_KEY, JSON.stringify(next));
        } catch {
            /* ignore */
        }
        likeVlog(id).then((r) => setLikes((l) => ({ ...l, [id]: r.likes }))).catch(() => {});
    };

    const share = async (r: Vlog) => {
        const url = `${window.location.origin}/vlogs/${r.id}`;
        if (navigator.share) {
            navigator.share({ title: r.title, url }).catch(() => {});
            return;
        }
        await navigator.clipboard.writeText(url).catch(() => {});
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
    };

    const index = reels.findIndex((r) => r.id === active);

    return (
        <div className="fixed inset-0 z-[60] bg-black text-white" role="dialog" aria-label="Reels">
            <div ref={scroller} className="h-[100dvh] snap-y snap-mandatory overflow-y-scroll [scrollbar-width:none]">
                {reels.map((r) => {
                    const isActive = r.id === active;
                    const isLiked = liked.includes(r.id);
                    return (
                        <section key={r.id} id={`reel-${r.id}`} data-id={r.id} className="relative flex h-[100dvh] snap-start snap-always items-center justify-center">
                            {/* Blurred backdrop on wide screens */}
                            {posterOf(r) && <img src={posterOf(r)} alt="" className="absolute inset-0 h-full w-full scale-110 object-cover opacity-30 blur-3xl" aria-hidden />}

                            <div className="relative h-full w-full sm:aspect-[9/16] sm:h-[calc(100dvh_-_2rem)] sm:w-auto sm:max-w-[calc(100vw_-_2rem)] sm:overflow-hidden sm:rounded-3xl">
                                {r.source === "youtube" ? (
                                    isActive ? <VlogPlayer vlog={r} autoPlay muted={muted} loop /> : <img src={posterOf(r)} alt="" className="h-full w-full object-cover" />
                                ) : (
                                    <VlogPlayer
                                        vlog={r}
                                        ref={(el) => {
                                            if (el) videos.current.set(r.id, el);
                                            else videos.current.delete(r.id);
                                        }}
                                        muted={muted}
                                        loop
                                        controls={false}
                                        fit="cover"
                                        onClick={() => togglePlay(r.id)}
                                    />
                                )}

                                {isActive && pausedId === r.id && (
                                    <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
                                        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-black/40 backdrop-blur"><Play className="ml-1 h-9 w-9 fill-current" /></span>
                                    </span>
                                )}

                                {/* Caption */}
                                <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent px-4 pb-6 pt-24 pr-20 sm:px-5">
                                    <div className="flex items-center gap-2">
                                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ember-500 font-display text-sm font-semibold">{AUTHOR.name.charAt(0)}</span>
                                        <span className="text-sm font-semibold">{AUTHOR.name}</span>
                                        <span className="text-xs text-white/60">· {formatDate(r.createdAt)}</span>
                                    </div>
                                    <h2 className="mt-3 font-display text-lg font-semibold leading-snug">{r.title}</h2>
                                    {r.caption && (
                                        <button
                                            type="button"
                                            onClick={() => setExpandedId((x) => (x === r.id ? null : r.id))}
                                            className={cn("pointer-events-auto mt-1 block text-left text-sm text-white/80", expandedId !== r.id && "line-clamp-2")}
                                        >
                                            {r.caption}
                                        </button>
                                    )}
                                    {r.tags.length > 0 && <p className="mt-2 text-xs font-medium text-ember-300">{r.tags.map((t) => `#${t}`).join(" ")}</p>}
                                </div>

                                {/* Actions rail */}
                                <div className="absolute bottom-24 right-3 flex flex-col items-center gap-5">
                                    <button type="button" onClick={() => like(r.id)} className="flex flex-col items-center gap-1 text-xs font-semibold" aria-label="Like">
                                        <span className={cn("flex h-11 w-11 items-center justify-center rounded-full bg-black/35 backdrop-blur transition-transform active:scale-90", isLiked && "text-ember-500")}>
                                            <Heart className={cn("h-6 w-6", isLiked && "fill-current")} />
                                        </span>
                                        {likes[r.id] ?? 0}
                                    </button>
                                    <button type="button" onClick={() => share(r)} className="flex flex-col items-center gap-1 text-xs font-semibold" aria-label="Share">
                                        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-black/35 backdrop-blur">
                                            {copied && isActive ? <Check className="h-5 w-5" /> : <Link2 className="h-5 w-5" />}
                                        </span>
                                        {copied && isActive ? "Copied" : "Share"}
                                    </button>
                                    {r.source !== "youtube" && (
                                        <button type="button" onClick={() => setMuted((m) => !m)} className="flex flex-col items-center gap-1 text-xs font-semibold" aria-label={muted ? "Unmute" : "Mute"}>
                                            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-black/35 backdrop-blur">
                                                {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                                            </span>
                                            {muted ? "Sound" : "Mute"}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </section>
                    );
                })}
            </div>

            {/* Chrome */}
            <button type="button" onClick={onClose} className="absolute left-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-black/40 backdrop-blur hover:bg-black/60" aria-label="Close">
                <X className="h-5 w-5" />
            </button>
            <span className="absolute right-4 top-6 rounded-full bg-black/40 px-3 py-1 text-xs font-semibold tabular-nums backdrop-blur">
                {index + 1} / {reels.length}
            </span>
            <div className="absolute right-6 top-1/2 hidden -translate-y-1/2 flex-col gap-3 lg:flex">
                <button type="button" onClick={() => go(-1)} disabled={index <= 0} className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30" aria-label="Previous">
                    <ChevronUp className="h-6 w-6" />
                </button>
                <button type="button" onClick={() => go(1)} disabled={index >= reels.length - 1} className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30" aria-label="Next">
                    <ChevronDown className="h-6 w-6" />
                </button>
            </div>
        </div>
    );
};

export default ReelViewer;
