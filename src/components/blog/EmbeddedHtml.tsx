import { useEffect, useRef } from "react";
import { attachAutoHeightEmbed } from "@/lib/embed";
import { cn } from "@/lib/utils";

/** Sandboxed HTML embed that grows to fit its content (no inner scrollbar). */
const EmbeddedHtml = ({ html, className, title = "Embedded content" }: { html: string; className?: string; title?: string }) => {
    const ref = useRef<HTMLIFrameElement>(null);

    useEffect(() => {
        if (!ref.current) return;
        return attachAutoHeightEmbed(ref.current, html);
    }, [html]);

    return (
        <iframe
            ref={ref}
            title={title}
            sandbox="allow-scripts"
            scrolling="no"
            loading="lazy"
            className={cn("block w-full overflow-hidden border-0", className)}
            style={{ height: 320 }}
        />
    );
};

export default EmbeddedHtml;
