import { useEffect, useState } from "react";
import type { Heading } from "@/lib/blog";
import { cn } from "@/lib/utils";

/** Section list with scroll-spy; highlights the heading currently being read. */
const TableOfContents = ({ headings }: { headings: Heading[] }) => {
    const [activeId, setActiveId] = useState<string>(headings[0]?.id ?? "");

    useEffect(() => {
        if (!headings.length) return;
        const onScroll = () => {
            // Last heading that has scrolled past the reading line (below the fixed navbar).
            let current = headings[0].id;
            for (const h of headings) {
                const el = document.getElementById(h.id);
                if (el && el.getBoundingClientRect().top <= 120) current = h.id;
            }
            setActiveId(current);
        };
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, [headings]);

    if (!headings.length) return null;

    return (
        <nav aria-label="Table of contents">
            <ul className="space-y-1 border-l border-sand-line">
                {headings.map((h) => {
                    const active = h.id === activeId;
                    return (
                        <li key={h.id}>
                            <a
                                href={`#${h.id}`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    document.getElementById(h.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
                                    history.replaceState(null, "", `#${h.id}`);
                                }}
                                className={cn(
                                    "-ml-px block border-l-2 py-1.5 text-sm leading-snug transition-colors",
                                    h.level === 3 ? "pl-7" : "pl-4",
                                    active
                                        ? "border-ember-500 font-medium text-ink-950"
                                        : "border-transparent text-ink-400 hover:text-ink-800"
                                )}
                            >
                                {h.text}
                            </a>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
};

export default TableOfContents;
