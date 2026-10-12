import { forwardRef } from "react";
import type { Vlog } from "@/lib/vlogs";
import { youTubeEmbedUrl } from "@/lib/media";
import { cn } from "@/lib/utils";

interface Props {
    vlog: Vlog;
    autoPlay?: boolean;
    muted?: boolean;
    loop?: boolean;
    controls?: boolean;
    className?: string;
    fit?: "cover" | "contain";
    onClick?: () => void;
}

/** Plays an uploaded/linked file with <video>, or a YouTube link via its privacy-enhanced embed. */
const VlogPlayer = forwardRef<HTMLVideoElement, Props>(
    ({ vlog, autoPlay, muted, loop, controls = true, className, fit = "contain", onClick }, ref) => {
        if (vlog.source === "youtube") {
            const src = youTubeEmbedUrl(vlog.videoUrl, { autoplay: autoPlay, mute: muted, loop });
            return (
                <iframe
                    src={src ?? undefined}
                    title={vlog.title}
                    className={cn("h-full w-full border-0 bg-black", className)}
                    allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                    allowFullScreen
                />
            );
        }
        return (
            <video
                ref={ref}
                src={vlog.videoUrl}
                poster={vlog.posterUrl || undefined}
                autoPlay={autoPlay}
                muted={muted}
                loop={loop}
                controls={controls}
                playsInline
                preload="metadata"
                onClick={onClick}
                className={cn("h-full w-full bg-black", fit === "cover" ? "object-cover" : "object-contain", className)}
            />
        );
    }
);
VlogPlayer.displayName = "VlogPlayer";

export default VlogPlayer;
