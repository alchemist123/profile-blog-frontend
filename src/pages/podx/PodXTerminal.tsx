import { useEffect, useRef, useState, type ReactNode } from "react";

type Entry =
    | { kind: "blank"; delay: number }
    | { kind: "line"; delay: number; className: string; text: string };

const ENTRIES: Entry[] = [
    { kind: "blank", delay: 300 },
    { kind: "line", delay: 50, className: "text-violet-300", text: "  ____           _  __  __" },
    { kind: "line", delay: 40, className: "text-violet-300", text: " |  _ \\ ___   __| |\\ \\/ /" },
    { kind: "line", delay: 40, className: "text-violet-300", text: " | |_) / _ \\ / _` | \\  / " },
    { kind: "line", delay: 40, className: "text-violet-300", text: " |  __/ (_) | (_| | /  \\ " },
    { kind: "line", delay: 40, className: "text-violet-300", text: " |_|   \\___/ \\__,_|/_/\\_\\" },
    { kind: "blank", delay: 120 },
    { kind: "line", delay: 80, className: "text-slate-500", text: " Distributed LLM Inference Cluster  v0.1.0" },
    { kind: "blank", delay: 200 },
    { kind: "line", delay: 60, className: "text-slate-400", text: "▸ Hardware: Apple M2 · 16 GB RAM · 8 cores" },
    { kind: "line", delay: 60, className: "text-violet-300", text: "▸ GPU: Metal (10 GB VRAM) · Score: 4300" },
    { kind: "line", delay: 60, className: "text-slate-400", text: "▸ gRPC  → 0.0.0.0:9090" },
    { kind: "line", delay: 60, className: "text-slate-400", text: "▸ HTTP  → 0.0.0.0:8080" },
    { kind: "line", delay: 80, className: "text-slate-400", text: "▸ mDNS: advertising on local network…" },
    { kind: "line", delay: 90, className: "text-emerald-400", text: "  ✓ Peer: dave-macbook.local (8 GB · 2400 pts)" },
    { kind: "line", delay: 90, className: "text-emerald-400", text: "  ✓ Peer: home-server.local (32 GB · 5100 pts)" },
    { kind: "line", delay: 100, className: "text-amber-500", text: "  → Coordinator: home-server.local (5100 pts)" },
    { kind: "line", delay: 80, className: "text-violet-300", text: "  → Shard assigned: L0–9 (10 of 28 layers)" },
    { kind: "blank", delay: 160 },
    { kind: "line", delay: 0, className: "text-emerald-400 font-semibold", text: "✓ Cluster ready · 3 nodes · 56 GB total RAM" },
];

export function PodXTerminal() {
    const [rows, setRows] = useState<{ key: string; el: ReactNode }[]>([]);
    const k = useRef(0);

    useEffect(() => {
        let i = 0;
        let cancelled = false;
        let tid: ReturnType<typeof setTimeout> | undefined;

        function run() {
            if (cancelled || i >= ENTRIES.length) return;
            const e = ENTRIES[i++];
            if (e.kind === "blank") {
                setRows((r) => [...r, { key: `b-${k.current++}`, el: <br /> }]);
                tid = setTimeout(run, e.delay);
                return;
            }
            setRows((r) => [
                ...r,
                {
                    key: `l-${k.current++}`,
                    el: <span className={`block ${e.className}`}>{e.text}</span>,
                },
            ]);
            tid = setTimeout(run, e.delay || 60);
        }

        tid = setTimeout(run, 900);
        return () => {
            cancelled = true;
            if (tid) clearTimeout(tid);
        };
    }, []);

    return (
        <div className="font-mono text-[0.77rem] leading-relaxed min-h-[300px] text-left overflow-y-auto text-[#e6edf3]">
            <span className="block text-emerald-400">
                <span>❯</span> <span className="text-[#e6edf3]">podx start</span>
            </span>
            {rows.map((r) => (
                <span key={r.key}>{r.el}</span>
            ))}
        </div>
    );
}
