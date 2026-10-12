import { cn } from "@/lib/utils";

interface CoverArtProps {
    src?: string;
    title: string;
    label?: string;
    className?: string;
    imgClassName?: string;
}

/** Post cover image, or a generated brand panel when the post has none. */
const CoverArt = ({ src, title, label, className, imgClassName }: CoverArtProps) => {
    if (src) {
        return (
            <div className={cn("relative overflow-hidden bg-ink-900", className)}>
                <img src={src} alt="" loading="lazy" className={cn("h-full w-full object-cover", imgClassName)} />
            </div>
        );
    }

    return (
        <div
            className={cn("relative overflow-hidden bg-ink-900 text-ink-100", className)}
            aria-hidden
        >
            <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-ember-500/70 blur-3xl" />
            <div className="absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-ember-300/20 blur-3xl" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:28px_28px]" />
            <div className="relative flex h-full flex-col justify-between p-6">
                {label && (
                    <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ember-200">{label}</span>
                )}
                <span className="font-display text-6xl font-semibold leading-none text-white/90">
                    {title.trim().charAt(0).toUpperCase() || "·"}
                </span>
            </div>
        </div>
    );
};

export default CoverArt;
