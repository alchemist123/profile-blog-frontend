import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Calendar, Eye, Heart } from "lucide-react";
import { getVlog, getVlogs, likeVlog, posterOf, recordVlogView, type Vlog } from "@/lib/vlogs";
import { isoDuration, setPageMeta } from "@/lib/seo";
import { AUTHOR, formatDate } from "@/lib/blog";
import { formatDuration, youTubeEmbedUrl } from "@/lib/media";
import VlogPlayer from "@/components/vlog/VlogPlayer";
import ReelViewer from "@/components/vlog/ReelViewer";
import { ReelCard, VideoCard } from "@/components/vlog/VlogCards";
import ShareButtons from "@/components/blog/ShareButtons";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const LIKED_KEY = "vlog:liked";

/** Landscape: theater page. Portrait: full-screen reel feed starting at this reel. */
const VlogWatch = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [vlog, setVlog] = useState<Vlog | null>(null);
    const [all, setAll] = useState<Vlog[]>([]);
    const [likes, setLikes] = useState(0);
    const [liked, setLiked] = useState(false);
    const counted = useRef<string | null>(null);

    useEffect(() => {
        if (!id) return;
        getVlog(id)
            .then((v) => {
                setVlog(v);
                setLikes(v.likes);
                try {
                    setLiked((JSON.parse(localStorage.getItem(LIKED_KEY) ?? "[]") as string[]).includes(v.id));
                } catch {
                    setLiked(false);
                }
            })
            .catch(() => navigate("/vlogs", { replace: true }));
        window.scrollTo({ top: 0 });
    }, [id, navigate]);

    useEffect(() => {
        getVlogs().then(setAll).catch(() => setAll([]));
    }, []);

    // SEO: description, canonical, social cards and VideoObject structured data
    useEffect(() => {
        if (!vlog) return;
        const url = `${window.location.origin}/vlogs/${vlog.id}`;
        const thumb = posterOf(vlog);
        return setPageMeta({
            title: `${vlog.title} | Vlogs · Amal V S`,
            description: vlog.caption || vlog.title,
            url,
            image: thumb || undefined,
            type: "video.other",
            jsonLd: {
                "@type": "VideoObject",
                name: vlog.title,
                description: vlog.caption || vlog.title,
                thumbnailUrl: thumb ? [thumb] : undefined,
                uploadDate: vlog.createdAt,
                duration: isoDuration(vlog.durationSec),
                ...(vlog.source === "youtube" ? { embedUrl: youTubeEmbedUrl(vlog.videoUrl) ?? undefined } : { contentUrl: vlog.videoUrl }),
                keywords: vlog.tags.join(", ") || undefined,
                author: { "@type": "Person", name: AUTHOR.name },
            },
        });
    }, [vlog]);

    // Reels count their own views inside the viewer; landscape videos count here.
    useEffect(() => {
        if (vlog?.orientation === "landscape" && counted.current !== vlog.id) {
            counted.current = vlog.id;
            recordVlogView(vlog.id).catch(() => {});
        }
    }, [vlog]);

    const onReelChange = useCallback((reelId: string) => {
        window.history.replaceState(null, "", `/vlogs/${reelId}`);
    }, []);

    if (!vlog || vlog.id !== id) {
        return (
            <div className="min-h-screen bg-ink-950 px-4 py-10">
                <div className="mx-auto max-w-6xl">
                    <Skeleton className="aspect-video w-full rounded-3xl bg-white/5" />
                    <Skeleton className="mt-6 h-8 w-2/3 bg-white/5" />
                </div>
            </div>
        );
    }

    if (vlog.orientation === "portrait") {
        const reels = all.filter((v) => v.orientation === "portrait");
        const feed = reels.some((r) => r.id === vlog.id) ? reels : [vlog, ...reels];
        return <ReelViewer key={vlog.id} reels={feed} startId={vlog.id} onClose={() => navigate("/vlogs")} onActiveChange={onReelChange} />;
    }

    const like = () => {
        if (liked) return;
        setLiked(true);
        setLikes((n) => n + 1);
        try {
            const ids = JSON.parse(localStorage.getItem(LIKED_KEY) ?? "[]") as string[];
            localStorage.setItem(LIKED_KEY, JSON.stringify([...ids, vlog.id]));
        } catch {
            /* ignore */
        }
        likeVlog(vlog.id).then((r) => setLikes(r.likes)).catch(() => {});
    };

    const upNext = all.filter((v) => v.orientation === "landscape" && v.id !== vlog.id).slice(0, 6);
    const reels = all.filter((v) => v.orientation === "portrait").slice(0, 8);

    return (
        <div className="min-h-screen bg-ink-950 font-reading text-white">
            <div className="mx-auto max-w-7xl px-4 pb-20 pt-6 sm:px-6 lg:px-8">
                <Link to="/vlogs" className="mb-5 inline-flex items-center gap-1.5 text-sm text-ink-300 hover:text-white">
                    <ArrowLeft className="h-4 w-4" /> All vlogs
                </Link>

                <div className="grid gap-10 lg:grid-cols-[1fr_340px]">
                    <div className="min-w-0">
                        <div className="relative aspect-video overflow-hidden rounded-3xl bg-black shadow-2xl shadow-black/50 ring-1 ring-white/10">
                            <VlogPlayer vlog={vlog} autoPlay={vlog.source !== "youtube"} />
                        </div>

                        <h1 className="mt-6 font-display text-3xl font-semibold leading-tight tracking-tight md:text-4xl">{vlog.title}</h1>

                        <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-ember-500 font-display text-lg font-semibold">{AUTHOR.name.charAt(0)}</span>
                                <div className="leading-tight">
                                    <p className="font-semibold">{AUTHOR.name}</p>
                                    <p className="text-xs text-ink-300">{AUTHOR.role}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={like}
                                    className={cn(
                                        "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                                        liked ? "bg-ember-500 text-white" : "bg-white/10 text-white hover:bg-white/20"
                                    )}
                                >
                                    <Heart className={cn("h-4 w-4", liked && "fill-current")} /> {likes}
                                </button>
                                <ShareButtons url={window.location.href} title={vlog.title} className="[&_a]:border-white/20 [&_a]:text-white [&_button]:border-white/20 [&_button]:text-white" />
                            </div>
                        </div>

                        <div className="mt-6 rounded-2xl bg-white/5 p-5">
                            <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm font-semibold text-ink-100">
                                <span className="flex items-center gap-1.5"><Eye className="h-4 w-4 text-ember-400" />{vlog.views} views</span>
                                <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4 text-ember-400" />{formatDate(vlog.createdAt, "long")}</span>
                                {vlog.durationSec > 0 && <span>{formatDuration(vlog.durationSec)}</span>}
                            </p>
                            {vlog.caption && <p className="mt-3 whitespace-pre-wrap text-[15px] leading-relaxed text-ink-100">{vlog.caption}</p>}
                            {vlog.tags.length > 0 && (
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {vlog.tags.map((t) => <span key={t} className="text-sm font-medium text-ember-300">#{t}</span>)}
                                </div>
                            )}
                        </div>
                    </div>

                    <aside className="space-y-10">
                        {upNext.length > 0 && (
                            <div>
                                <h2 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-300">Up next</h2>
                                <div className="space-y-6">{upNext.map((v) => <VideoCard key={v.id} vlog={v} />)}</div>
                            </div>
                        )}
                        {reels.length > 0 && (
                            <div>
                                <h2 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-300">Reels</h2>
                                <div className="grid grid-cols-3 gap-2 lg:grid-cols-2">{reels.map((v) => <ReelCard key={v.id} vlog={v} />)}</div>
                            </div>
                        )}
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default VlogWatch;
