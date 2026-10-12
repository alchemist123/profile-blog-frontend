import { useCallback, useId, useRef, useState } from "react";
import MediaPicker from "@/components/media/MediaPicker";
import type { MediaKind, MediaSelection } from "@/lib/media";

/**
 * Promise-style picker: `const pick = useMediaPicker(); const sel = await pick.open("image")`.
 * Render `pick.element` once.
 */
export function useMediaPicker(opts?: { allowYouTube?: boolean }) {
    const [state, setState] = useState<{ kind: MediaKind; title?: string } | null>(null);
    const [session, setSession] = useState(0);
    const uid = useId();
    const resolver = useRef<((sel: MediaSelection | null) => void) | null>(null);

    const open = useCallback((kind: MediaKind, title?: string) => {
        resolver.current?.(null);
        setSession((n) => n + 1);
        setState({ kind, title });
        return new Promise<MediaSelection | null>((resolve) => {
            resolver.current = resolve;
        });
    }, []);

    const element = (
        <MediaPicker
            key={`${uid}-${session}`}
            open={state !== null}
            kind={state?.kind ?? "image"}
            title={state?.title}
            allowYouTube={opts?.allowYouTube}
            onClose={() => {
                resolver.current?.(null);
                resolver.current = null;
                setState(null);
            }}
            onSelect={(sel) => {
                resolver.current?.(sel);
                resolver.current = null;
            }}
        />
    );

    return { open, element };
}
