import { useEffect, useState, type RefObject } from "react";

/** Thin ember bar under the navbar that fills as the article is read. */
const ReadingProgress = ({ target }: { target: RefObject<HTMLElement | null> }) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const onScroll = () => {
            const el = target.current;
            if (!el) return;
            const rect = el.getBoundingClientRect();
            const total = rect.height - window.innerHeight;
            const read = Math.min(Math.max(-rect.top, 0), Math.max(total, 1));
            setProgress(total > 0 ? read / total : 1);
        };
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll);
        return () => {
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
        };
    }, [target]);

    return (
        <div className="fixed left-0 right-0 top-16 z-40 h-[3px] bg-transparent" aria-hidden>
            <div className="h-full origin-left bg-ember-500 transition-transform duration-100" style={{ transform: `scaleX(${progress})` }} />
        </div>
    );
};

export default ReadingProgress;
