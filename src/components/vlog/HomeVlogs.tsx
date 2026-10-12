import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Clapperboard } from "lucide-react";
import { getVlogs, type Vlog } from "@/lib/vlogs";
import { ReelCard, VideoCard } from "@/components/vlog/VlogCards";

/** Profile home: latest reels strip + landscape videos. Renders nothing until there is at least one vlog. */
const HomeVlogs = () => {
    const [vlogs, setVlogs] = useState<Vlog[]>([]);

    useEffect(() => {
        getVlogs({ limit: 24 }).then(setVlogs).catch(() => setVlogs([]));
    }, []);

    if (vlogs.length === 0) return null;

    const reels = vlogs.filter((v) => v.orientation === "portrait").slice(0, 10);
    const videos = vlogs.filter((v) => v.orientation === "landscape").slice(0, 3);

    return (
        <section className="relative overflow-hidden border-t border-slate-800/50 bg-[#0B1015] py-20 md:py-28">
            <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-ember-500/10 blur-[120px]" aria-hidden />
            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4 }}
                    className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end"
                >
                    <div>
                        <div className="mb-4 inline-flex items-center gap-2 rounded border border-ember-500/25 bg-ember-500/10 px-3 py-1.5">
                            <Clapperboard className="h-3 w-3 text-ember-400" />
                            <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-ember-400">Stream: _vlogs</span>
                        </div>
                        <h2 className="text-4xl font-bold tracking-tight text-slate-100 md:text-5xl">On Camera</h2>
                        <p className="mt-4 max-w-xl text-lg text-slate-400">
                            <span className="font-mono text-sm tracking-widest text-ember-400">{`_ // `}</span> Reels and walkthroughs from the build.
                        </p>
                    </div>
                    <Link to="/vlogs" className="group inline-flex items-center gap-2 self-start rounded-md border border-slate-800 bg-slate-900/50 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 md:self-auto">
                        Watch all <ArrowRight className="h-4 w-4 text-ember-400 transition-transform group-hover:translate-x-1" />
                    </Link>
                </motion.div>

                {reels.length > 0 && (
                    <div className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-3 sm:-mx-6 sm:px-6 md:gap-4 lg:-mx-8 lg:px-8 [scrollbar-width:none]">
                        {reels.map((v, i) => (
                            <motion.div
                                key={v.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.35, delay: i * 0.05 }}
                                className="w-40 shrink-0 snap-start sm:w-48 lg:w-52"
                            >
                                <ReelCard vlog={v} />
                            </motion.div>
                        ))}
                    </div>
                )}

                {videos.length > 0 && (
                    <div className={`grid gap-8 md:grid-cols-2 lg:grid-cols-3 ${reels.length ? "mt-14" : ""}`}>
                        {videos.map((v) => <VideoCard key={v.id} vlog={v} />)}
                    </div>
                )}
            </div>
        </section>
    );
};

export default HomeVlogs;
