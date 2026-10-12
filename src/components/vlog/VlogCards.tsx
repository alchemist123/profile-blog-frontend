import { useRef } from "react";
import { Link } from "react-router-dom";
import { Eye, Play } from "lucide-react";
import { posterOf, type Vlog } from "@/lib/vlogs";
import { formatDuration } from "@/lib/media";
import { formatDate } from "@/lib/blog";
import { cn } from "@/lib/utils";

function compact(n: number) {
    return n >= 1000 ? `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k` : String(n);
}

/** Poster that quietly plays a muted preview on hover (self-hosted / linked files only). */
const HoverPreview = ({ vlog, className }: { vlog: Vlog; className?: string }) => {
    const ref = useRef<HTMLVideoElement>(null);
    const poster = posterOf(vlog);
    const canPreview = vlog.source !== "youtube";
    return (
        <div
            className={cn("relative overflow-hidden bg-ink-900", className)}
            onMouseEnter={() => canPreview && ref.current?.play().catch(() => {})}
            onMouseLeave={() => {
                if (!ref.current) return;
                ref.current.pause();
                ref.current.currentTime = 0;
            }}
        >
            {canPreview ? (
                <video
                    ref={ref}
                    src={`${vlog.videoUrl}${poster ? "" : "#t=0.5"}`}
                    poster={poster || undefined}
                    muted
                    loop
                    playsInline
                    preload={poster ? "none" : "metadata"}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
            ) : (
                <img src={poster} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
            )}
        </div>
    );
};

/** 9:16 reel tile. */
export const ReelCard = ({ vlog, className }: { vlog: Vlog; className?: string }) => (
    <Link to={`/vlogs/${vlog.id}`} className={cn("group relative block aspect-[9/16] overflow-hidden rounded-2xl bg-ink-900 ring-1 ring-white/10", className)}>
        <HoverPreview vlog={vlog} className="absolute inset-0" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-black/20" />
        <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-black/45 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur">
            <Play className="h-2.5 w-2.5 fill-current" /> {formatDuration(vlog.durationSec) || "Reel"}
        </span>
        <div className="absolute inset-x-0 bottom-0 p-3 text-white">
            <p className="line-clamp-2 text-sm font-semibold leading-snug">{vlog.title}</p>
            <p className="mt-1 flex items-center gap-1 text-[11px] text-white/70"><Eye className="h-3 w-3" /> {compact(vlog.views)}</p>
        </div>
    </Link>
);

/** 16:9 video tile. */
export const VideoCard = ({ vlog, large = false, className }: { vlog: Vlog; large?: boolean; className?: string }) => (
    <Link to={`/vlogs/${vlog.id}`} className={cn("group block", className)}>
        <div className="relative aspect-video overflow-hidden rounded-2xl ring-1 ring-white/10">
            <HoverPreview vlog={vlog} className="absolute inset-0" />
            <span className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-ember-500/90 text-white shadow-xl"><Play className="ml-0.5 h-6 w-6 fill-current" /></span>
            </span>
            {vlog.durationSec > 0 && (
                <span className="absolute bottom-2 right-2 rounded-md bg-black/75 px-1.5 py-0.5 text-[11px] font-semibold tabular-nums text-white">{formatDuration(vlog.durationSec)}</span>
            )}
        </div>
        <div className="mt-3">
            <p className={cn("line-clamp-2 font-display font-semibold leading-snug text-white transition-colors group-hover:text-ember-300", large ? "text-2xl" : "text-lg")}>{vlog.title}</p>
            <p className="mt-1 text-xs text-ink-300">{compact(vlog.views)} views · {formatDate(vlog.createdAt)}</p>
        </div>
    </Link>
);
