import { useEffect, useState } from "react";
import { Clapperboard, MonitorPlay, Smartphone } from "lucide-react";
import { getVlogs, type Vlog } from "@/lib/vlogs";
import { ReelCard, VideoCard } from "@/components/vlog/VlogCards";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type Filter = "all" | "portrait" | "landscape";

const FILTERS: { id: Filter; label: string; icon: typeof Clapperboard }[] = [
    { id: "all", label: "All", icon: Clapperboard },
    { id: "portrait", label: "Reels", icon: Smartphone },
    { id: "landscape", label: "Videos", icon: MonitorPlay },
];

const VlogList = () => {
    const [vlogs, setVlogs] = useState<Vlog[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState<Filter>("all");

    useEffect(() => {
        document.title = "Vlogs | Amal V S";
        getVlogs().then(setVlogs).catch((e) => { setError((e as Error).message); setVlogs([]); });
    }, []);

    const reels = (vlogs ?? []).filter((v) => v.orientation === "portrait");
    const videos = (vlogs ?? []).filter((v) => v.orientation === "landscape");
    const [featured, ...moreVideos] = videos;

    return (
        <div className="min-h-screen bg-ink-950 font-reading text-white">
            <section className="relative overflow-hidden border-b border-white/5">
                <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-ember-500/25 blur-[120px]" aria-hidden />
                <div className="relative mx-auto max-w-7xl px-4 pb-10 pt-14 sm:px-6 md:pt-20 lg:px-8">
                    <p className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-ember-300">
                        <span className="h-px w-8 bg-ember-400" /> Vlogs
                    </p>
                    <h1 className="max-w-3xl font-display text-4xl font-semibold leading-[1.1] tracking-tight md:text-6xl">
                        Behind the build, <em className="font-medium italic text-ember-400">on camera</em>.
                    </h1>
                    <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-200 md:text-lg">Quick reels and longer walkthroughs — demos, setups and things I&apos;m figuring out.</p>
                    <div className="mt-8 flex gap-2">
                        {FILTERS.map((f) => (
                            <button
                                key={f.id}
                                type="button"
                                onClick={() => setFilter(f.id)}
                                className={cn(
                                    "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                                    filter === f.id ? "border-white bg-white text-ink-950" : "border-white/15 text-ink-200 hover:border-white/40 hover:text-white"
                                )}
                            >
                                <f.icon className="h-4 w-4" /> {f.label}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            <div className="mx-auto max-w-7xl space-y-16 px-4 py-12 sm:px-6 md:py-16 lg:px-8">
                {vlogs === null && (
                    <div className="flex gap-4 overflow-hidden">
                        {[0, 1, 2, 3, 4].map((i) => <Skeleton key={i} className="aspect-[9/16] w-48 shrink-0 rounded-2xl bg-white/5" />)}
                    </div>
                )}

                {vlogs !== null && vlogs.length === 0 && (
                    <div className="rounded-3xl border border-dashed border-white/10 py-24 text-center">
                        <Clapperboard className="mx-auto h-8 w-8 text-ink-400" />
                        <p className="mt-4 font-display text-2xl">{error ? "Couldn't load vlogs." : "First episode coming soon."}</p>
                        {error && <p className="mt-2 text-sm text-ink-300">{error}</p>}
                    </div>
                )}

                {filter !== "landscape" && reels.length > 0 && (
                    <section>
                        <div className="mb-6 flex items-end justify-between">
                            <h2 className="flex items-center gap-2 font-display text-2xl font-semibold md:text-3xl"><Smartphone className="h-5 w-5 text-ember-400" /> Reels</h2>
                            <span className="text-sm text-ink-300">{reels.length} {reels.length === 1 ? "reel" : "reels"}</span>
                        </div>
                        {filter === "portrait" ? (
                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-5">
                                {reels.map((v) => <ReelCard key={v.id} vlog={v} />)}
                            </div>
                        ) : (
                            <div className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6 md:gap-4 lg:-mx-8 lg:px-8 [scrollbar-width:thin]">
                                {reels.map((v) => <ReelCard key={v.id} vlog={v} className="w-40 shrink-0 snap-start sm:w-48 lg:w-56" />)}
                            </div>
                        )}
                    </section>
                )}

                {filter !== "portrait" && videos.length > 0 && (
                    <section>
                        <div className="mb-6 flex items-end justify-between">
                            <h2 className="flex items-center gap-2 font-display text-2xl font-semibold md:text-3xl"><MonitorPlay className="h-5 w-5 text-ember-400" /> Videos</h2>
                            <span className="text-sm text-ink-300">{videos.length} {videos.length === 1 ? "video" : "videos"}</span>
                        </div>
                        <div className="grid gap-x-6 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
                            {featured && <VideoCard vlog={featured} large className="md:col-span-2 lg:col-span-2 lg:row-span-2" />}
                            {moreVideos.map((v) => <VideoCard key={v.id} vlog={v} />)}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
};

export default VlogList;
