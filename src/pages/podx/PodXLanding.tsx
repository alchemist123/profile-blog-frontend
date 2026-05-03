import { Fragment } from "react";
import { Link } from "react-router-dom";
import { HeroNetworkCanvas } from "./HeroNetworkCanvas";
import { PodXTerminal } from "./PodXTerminal";

const BELT = [
    "⚡ OpenAI-compatible API",
    "🔒 100% local inference",
    "🍎 Metal GPU acceleration",
    "⚙️ CUDA on Linux & Windows",
    "🌐 Zero-config mDNS discovery",
    "🗂️ Automatic shard distribution",
    "🛡️ Scoped API key auth",
    "📊 Kubernetes-style dashboard",
];

const PROBLEMS = [
    {
        icon: "💸",
        title: "Cloud APIs cost real money",
        body: "GPT-4 costs $30/1M tokens. Run a long session with tool calls and you're paying real money every day.",
        fix: "PodX runs on your hardware for free",
    },
    {
        icon: "🕵️",
        title: "Your prompts leave your device",
        body: "Every message you send to a cloud API trains their model, feeds their logs, and leaves your network permanently.",
        fix: "PodX never sends data off your LAN",
    },
    {
        icon: "📦",
        title: "One machine can't fit 70B models",
        body: "Consumer hardware tops out at 16–32 GB unified memory. Llama 3 70B needs more than most people own.",
        fix: "PodX pools RAM across your devices",
    },
    {
        icon: "📡",
        title: "Cloud goes down without warning",
        body: "Rate limits, outages, API changes — your workflow breaks whenever the provider decides to change something.",
        fix: "PodX works fully offline, always",
    },
    {
        icon: "🔌",
        title: "Complex distributed setup",
        body: "Existing tools like vLLM or Ollama don't distribute across machines. Setting up Ray or Kubernetes just to run an LLM is overkill.",
        fix: "One binary, zero config, LAN auto-discovery",
    },
    {
        icon: "🎛️",
        title: "No control over routing",
        body: "Cloud APIs offer one model at a fixed price. You can't choose which hardware handles which request or adjust strategies.",
        fix: "5 load-balancing strategies, tunable live",
    },
];

/** How it works — four steps + shared styling */
const HOW_PIPELINE_STEPS = [
    {
        step: "1",
        title: "Install & start",
        body: "Run podx start on each machine: hardware detection, gRPC + HTTP, mDNS advertise.",
        grad: "from-violet-600 to-indigo-500",
        icon: "▶",
    },
    {
        step: "2",
        title: "Auto-discovery",
        body: "Peers find each other over mDNS in seconds — no static IPs or config files.",
        grad: "from-blue-600 to-cyan-400",
        icon: "◎",
    },
    {
        step: "3",
        title: "Load a model",
        body: "podx model load with any GGUF. The cluster computes a shard map and places layers.",
        grad: "from-emerald-600 to-teal-400",
        icon: "⌁",
    },
    {
        step: "4",
        title: "Inference ready",
        body: "POST /v1/chat/completions — OpenAI-compatible API with streaming SSE responses.",
        grad: "from-cyan-600 to-sky-400",
        icon: "✦",
    },
] as const;

const PIPELINE_NODES = [
    { label: "Node A", layers: "Layers 0–10", chip: "Metal / CUDA" },
    { label: "Node B", layers: "Layers 11–28", chip: "CPU pool" },
    { label: "Node C", layers: "Layers 29–end", chip: "VRAM heavy" },
] as const;

/** Workspace crates — single source for architecture section */
const WORKSPACE_CRATES = [
    { name: "podx-core", blurb: "Shared types, IDs, error taxonomy — no side effects.", accent: "from-orange-500/25 to-amber-600/10" },
    { name: "podx-state", blurb: "ClusterState, gossip, elections — one replicated document.", accent: "from-violet-500/25 to-indigo-600/10" },
    { name: "podx-inference", blurb: "GGUF, pipeline shards, Metal / CUDA backends.", accent: "from-emerald-500/25 to-teal-600/10" },
    { name: "podx-network", blurb: "mDNS, gRPC clients, tonic services — no imports from inference.", accent: "from-cyan-500/25 to-blue-600/10" },
    { name: "podx-api", blurb: "HTTP server, OpenAI routes, SSE streaming, dashboard assets.", accent: "from-sky-500/25 to-violet-600/10" },
    { name: "podx-cli", blurb: "Clap commands: start, model, key — thin over node runtime.", accent: "from-fuchsia-500/25 to-pink-600/10" },
    { name: "podx-node", blurb: "Wires crates together — the `podx` binary you run.", accent: "from-rose-500/25 to-orange-600/10" },
] as const;

const FEATURES = [
    {
        icon: "🔗",
        title: "Distributed Layer Pipeline",
        body: "Transformer layers are split across nodes. Each node runs its slice, passes activations forward over gRPC.",
        sub: "Supports any GGUF model",
    },
    {
        icon: "📡",
        title: "Zero-Config Discovery",
        body: "mDNS auto-discovery finds peers the moment they start. Same protocol as Bonjour and AirPrint.",
        sub: "Or use --connect for Tailscale",
    },
    {
        icon: "✅",
        title: "OpenAI-Compatible API",
        body: "Drop-in replacement for the OpenAI SDK. Streaming SSE chat completions on /v1/chat/completions.",
        sub: "Works with any OpenAI client",
    },
    {
        icon: "⚡",
        title: "GPU Acceleration",
        body: "Native Metal on Apple Silicon and CUDA on NVIDIA — compiled in via Cargo feature flags.",
        sub: "Metal · CUDA · CPU fallback",
    },
    {
        icon: "🗳️",
        title: "Score-Based Election",
        body: "The node with the best hardware automatically becomes coordinator. The cluster self-heals if it disappears.",
        sub: "No manual configuration",
    },
    {
        icon: "📊",
        title: "Kubernetes-Style Dashboard",
        body: "Embedded web UI with live cluster topology, shard visualization, metrics, chat, and settings.",
        sub: "No separate deployment",
    },
    {
        icon: "🛡️",
        title: "Scoped API Keys",
        body: "Three permission levels: Full, Chat, and ReadOnly. Generate and revoke keys through the UI or CLI.",
        sub: "Full · Chat · ReadOnly scopes",
    },
    {
        icon: "🔄",
        title: "Gossip Replication",
        body: "Every node holds the full ClusterState document. Changes gossip to all peers.",
        sub: "No coordinator SPOF",
    },
    {
        icon: "⚖️",
        title: "5 Load-Balancing Strategies",
        body: "LeastLoaded, RoundRobin, LatencyAware, Weighted, Random — switch live from the dashboard.",
        sub: "Live config update",
    },
];

const gradientText = "bg-gradient-to-br from-[#e2d9f3] via-[#a78bfa] to-[#22d3ee] bg-clip-text text-transparent";

export default function PodXLanding() {
    return (
        <div className="min-h-screen bg-[#050709] text-[#e6edf3] overflow-x-hidden selection:bg-violet-500/30">
            {/* Nav */}
            <nav className="sticky top-16 z-40 flex items-center justify-between px-6 md:px-10 h-[62px] border-b border-transparent bg-[#050709]/88 backdrop-blur-xl border-[#21262d]/80">
                <Link to="/podx" className={`text-[1.1rem] font-black tracking-wide ${gradientText}`}>
                    PodX
                </Link>
                <div className="hidden sm:flex items-center gap-1 flex-wrap justify-end">
                    <a href="#how" className="text-[0.88rem] px-3.5 py-1.5 rounded-lg text-[#8b949e] hover:text-[#e6edf3] hover:bg-[#161b22] transition-colors">
                        How it works
                    </a>
                    <a href="#features" className="text-[0.88rem] px-3.5 py-1.5 rounded-lg text-[#8b949e] hover:text-[#e6edf3] hover:bg-[#161b22] transition-colors">
                        Features
                    </a>
                    <a href="#compare" className="text-[0.88rem] px-3.5 py-1.5 rounded-lg text-[#8b949e] hover:text-[#e6edf3] hover:bg-[#161b22] transition-colors">
                        vs Cloud
                    </a>
                    <Link
                        to="/podx/docs"
                        className="text-[0.88rem] px-3.5 py-1.5 rounded-lg text-[#8b949e] hover:text-[#e6edf3] hover:bg-[#161b22] transition-colors"
                    >
                        Docs
                    </Link>
                    <Link
                        to="/podx/docs#installation"
                        className="text-[0.88rem] px-[18px] py-[7px] rounded-lg font-semibold text-white bg-gradient-to-br from-[#7c3aed] to-[#5b21b6] shadow-[0_0_24px_rgba(124,58,237,0.3)] hover:opacity-90 transition-opacity"
                    >
                        Get Started →
                    </Link>
                </div>
            </nav>

            {/* Hero */}
            <section className="relative min-h-[calc(100vh-62px)] flex items-center pt-4 pb-20 overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                    <HeroNetworkCanvas />
                </div>
                <div
                    className="absolute inset-0 opacity-25 pointer-events-none"
                    style={{
                        backgroundImage: `linear-gradient(rgba(33,38,45,.6) 1px,transparent 1px),linear-gradient(90deg,rgba(33,38,45,.6) 1px,transparent 1px)`,
                        backgroundSize: "72px 72px",
                        maskImage: "radial-gradient(ellipse 80% 70% at 50% 40%,#000 40%,transparent 100%)",
                    }}
                />
                <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-[radial-gradient(ellipse,rgba(124,58,237,.12)_0%,transparent_70%)] pointer-events-none" />

                <div className="relative z-[2] max-w-[1140px] mx-auto px-7 w-full">
                    <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-12 lg:gap-16 items-center py-16 lg:py-24">
                        <div>
                            <div className="inline-flex items-center gap-2 text-[0.72rem] font-bold tracking-[0.1em] uppercase text-emerald-400 mb-6">
                                <span className="w-[7px] h-[7px] rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399] animate-pulse" />
                                Open Source · Alpha v0.1
                            </div>
                            <h1 className="text-[clamp(2.5rem,4.8vw,3.8rem)] font-black tracking-tight leading-[1.05] mb-6 text-[#e6edf3]">
                                Run 70B models on your own hardware.
                                <br />
                                <span className={gradientText}>Together.</span>
                            </h1>
                            <p className="text-[1.08rem] text-[#8b949e] leading-relaxed mb-10 max-w-[480px]">
                                PodX connects your devices over LAN, splits transformer layers across them, and serves LLMs with a{" "}
                                <strong className="text-[#c9d1d9]">drop-in OpenAI API</strong>. Private. Fast. Free.
                            </p>
                            <div className="flex flex-wrap gap-3 mb-12">
                                <Link
                                    to="/podx/docs#installation"
                                    className="inline-flex items-center gap-2 bg-gradient-to-br from-[#7c3aed] to-[#5b21b6] text-white font-bold px-6 py-3.5 rounded-[10px] text-[0.95rem] shadow-[0_0_32px_rgba(124,58,237,0.35)] hover:opacity-90 hover:-translate-y-0.5 transition-all"
                                >
                                    Get Started →
                                </Link>
                                <Link
                                    to="/podx/docs"
                                    className="inline-flex items-center gap-2 bg-[#161b22] text-[#c9d1d9] font-semibold px-6 py-3.5 rounded-[10px] text-[0.95rem] border border-[#30363d] hover:border-violet-400/50 hover:text-white transition-all"
                                >
                                    Read Docs
                                </Link>
                            </div>
                            <div className="flex flex-wrap gap-9">
                                {[
                                    ["70B+", "Model size"],
                                    ["$0", "Per token"],
                                    ["100%", "Private"],
                                    ["1", "Binary"],
                                ].map(([v, l]) => (
                                    <div key={l}>
                                        <span className="block text-[1.75rem] font-black text-[#a78bfa] leading-none">{v}</span>
                                        <span className="block text-[0.68rem] text-[#484f58] uppercase tracking-[0.09em] mt-1">{l}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="rounded-2xl border border-[#30363d] bg-[#0d1117] overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.7)]">
                            <div className="bg-[#161b22] px-[18px] py-3 flex items-center gap-2 border-b border-[#21262d]">
                                <span className="w-[13px] h-[13px] rounded-full bg-[#ff5f57]" />
                                <span className="w-[13px] h-[13px] rounded-full bg-[#ffbd2e]" />
                                <span className="w-[13px] h-[13px] rounded-full bg-[#28c840]" />
                                <span className="mx-auto text-[0.73rem] text-[#484f58] font-sans">podx — zsh</span>
                            </div>
                            <div className="p-5 md:p-6">
                                <PodXTerminal />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Belt */}
            <div className="border-y border-[#21262d] bg-[#0d1117] py-4 overflow-hidden select-none">
                <div className="flex w-max animate-[podx-belt_28s_linear_infinite] hover:[animation-play-state:paused] gap-0">
                    {[...BELT, ...BELT].map((t, i) => (
                        <span key={i} className="inline-flex items-center gap-2.5 px-7 text-[0.82rem] text-[#8b949e] whitespace-nowrap">
                            {t}
                            <span className="text-[#484f58] text-[0.6rem]">·</span>
                        </span>
                    ))}
                </div>
            </div>
            <style>{`
        @keyframes podx-belt {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>

            {/* Problem */}
            <section id="problem" className="relative py-24 md:py-36 scroll-mt-28 overflow-hidden bg-gradient-to-b from-[#050709] via-[#080c12] to-[#050709]">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_65%_50%_at_15%_20%,rgba(251,146,60,0.08),transparent)]" />
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_85%_70%,rgba(139,92,246,0.12),transparent)]" />
                <div className="pointer-events-none absolute inset-0 opacity-[0.22] [background-image:linear-gradient(rgba(148,163,184,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.06)_1px,transparent_1px)] [background-size:36px_36px]" />
                <div className="relative max-w-[1140px] mx-auto px-7">
                    <div className="flex flex-col lg:flex-row lg:items-stretch gap-10 lg:gap-14 mb-16 md:mb-20">
                        <div className="lg:w-[48%] shrink-0 flex flex-col justify-center">
                            <span className="inline-flex items-center gap-2 w-fit text-[0.68rem] font-bold tracking-[0.14em] uppercase text-[#d8b4fe] bg-violet-500/12 border border-violet-500/25 px-3.5 py-1.5 rounded-full mb-6">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.75)]" aria-hidden />
                                The problem
                            </span>
                            <h2 className="font-black tracking-[-0.03em] leading-[1.12] mb-5 space-y-4">
                                <span className="block rounded-2xl border border-amber-500/35 bg-gradient-to-br from-[#1a1512]/95 via-[#0d1117] to-[#0d1117] px-5 py-5 sm:px-6 sm:py-6 text-[clamp(1.55rem,3vw,2.25rem)] text-[#fafafa] shadow-[0_24px_60px_-28px_rgba(251,146,60,0.28)] ring-1 ring-amber-500/10">
                                    Your models are too big for one machine.
                                </span>
                                <span className={`block text-[clamp(2rem,4vw,3.05rem)] ${gradientText}`}>
                                    Your cluster is already in the room.
                                </span>
                            </h2>
                            <p className="text-[1.05rem] text-[#94a3b8] leading-relaxed mb-6">
                                A 70B-class weights footprint can exceed what any single laptop holds — but the phones, desktops, and workstations on your desk and LAN often add up to enough aggregate RAM and VRAM to load the model end-to-end.
                            </p>
                            <div className="flex flex-wrap gap-3 text-[0.78rem] text-[#64748b]">
                                <span className="inline-flex items-center gap-1.5 rounded-lg border border-[#30363d] bg-[#0d1117]/80 px-3 py-2">
                                    <span className="text-amber-400/95" aria-hidden>
                                        ○
                                    </span>
                                    One GPU / one DIMM stack hits a wall fast
                                </span>
                                <span className="inline-flex items-center gap-1.5 rounded-lg border border-[#30363d] bg-[#0d1117]/80 px-3 py-2">
                                    <span className="text-emerald-400/95" aria-hidden>
                                        ✦
                                    </span>
                                    Same Wi‑Fi — pool capacity instead of paying cloud
                                </span>
                            </div>
                        </div>
                        <div className="flex-1 min-w-0 rounded-3xl border border-[#21262d] bg-gradient-to-br from-[#0d1117] via-[#0f1419] to-[#0d1117] p-1 shadow-[0_0_0_1px_rgba(251,146,60,0.06),0_28px_90px_-28px_rgba(0,0,0,0.75)]">
                            <div className="rounded-[22px] bg-[#0d1117]/95 p-6 sm:p-8 border border-amber-500/10 h-full flex flex-col">
                                <p className="text-[0.72rem] font-bold uppercase tracking-[0.16em] text-[#64748b] mb-6">
                                    Capacity at a glance
                                </p>
                                <div className="space-y-8 flex-1 flex flex-col justify-center">
                                    <div>
                                        <div className="flex items-center justify-between gap-3 mb-2.5">
                                            <span className="text-[0.78rem] font-semibold text-[#cbd5e1]">Single machine</span>
                                            <span className="text-[0.68rem] font-mono text-orange-400/95 uppercase tracking-wider">Insufficient</span>
                                        </div>
                                        <div className="h-2.5 rounded-full bg-[#161b22] border border-[#21262d] overflow-hidden">
                                            <div
                                                className="h-full w-[32%] rounded-full bg-gradient-to-r from-orange-600 to-amber-500 shadow-[0_0_20px_rgba(251,146,60,0.35)]"
                                                aria-hidden
                                            />
                                        </div>
                                        <p className="mt-2 text-[0.72rem] text-[#64748b]">Typical laptop unified memory — model weights alone can exceed it.</p>
                                    </div>
                                    <div className="relative py-2">
                                        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#30363d] to-transparent -translate-x-1/2 hidden sm:block" aria-hidden />
                                        <p className="text-center text-[0.65rem] font-mono uppercase tracking-[0.2em] text-[#475569] sm:mb-0 mb-4">
                                            vs
                                        </p>
                                    </div>
                                    <div>
                                        <div className="flex items-center justify-between gap-3 mb-2.5">
                                            <span className="text-[0.78rem] font-semibold text-[#cbd5e1]">Devices in the room (LAN)</span>
                                            <span className="text-[0.68rem] font-mono text-emerald-400/95 uppercase tracking-wider">Pooled</span>
                                        </div>
                                        <div className="flex gap-1.5 h-3 rounded-lg overflow-hidden border border-[#21262d] bg-[#161b22] p-0.5">
                                            <div className="flex-[7] rounded-md bg-gradient-to-br from-violet-600 to-violet-500 min-w-0" title="Device A" />
                                            <div className="flex-[5] rounded-md bg-gradient-to-br from-cyan-600 to-cyan-500 min-w-0" title="Device B" />
                                            <div className="flex-[6] rounded-md bg-gradient-to-br from-emerald-600 to-teal-500 min-w-0" title="Device C" />
                                        </div>
                                        <p className="mt-2 text-[0.72rem] text-[#64748b]">
                                            Combined footprint matches pipeline shards — PodX maps layers to nodes automatically.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[#21262d] border border-[#21262d] rounded-2xl overflow-hidden shadow-[0_24px_80px_-32px_rgba(0,0,0,0.65)]">
                        {PROBLEMS.map((p) => (
                            <div key={p.title} className="bg-[#0d1117] p-8 hover:bg-[#161b22] transition-colors">
                                <div className="text-[1.6rem] mb-3.5">{p.icon}</div>
                                <h3 className="text-[0.95rem] font-bold mb-2 text-[#e6edf3]">{p.title}</h3>
                                <p className="text-[0.83rem] text-[#8b949e] leading-relaxed mb-3">{p.body}</p>
                                <p className="text-[0.78rem] text-emerald-400 font-semibold mt-3.5 before:content-['✓_']">{p.fix}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How */}
            <section id="how" className="relative py-24 md:py-36 bg-[#0d1117] scroll-mt-28 overflow-hidden">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_45%_at_70%_10%,rgba(34,211,238,0.12),transparent)]" />
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_20%_80%,rgba(139,92,246,0.1),transparent)]" />
                <div className="pointer-events-none absolute inset-0 opacity-[0.25] [background-image:linear-gradient(rgba(148,163,184,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.07)_1px,transparent_1px)] [background-size:40px_40px]" />
                <div className="relative max-w-[1140px] mx-auto px-7">
                    <div className="flex flex-col lg:flex-row lg:items-stretch gap-10 lg:gap-14 mb-14 md:mb-20">
                        <div className="lg:w-[46%] shrink-0 flex flex-col justify-center">
                            <span className="inline-flex items-center gap-2 w-fit text-[0.68rem] font-bold tracking-[0.14em] uppercase text-[#a5f3fc] bg-cyan-500/10 border border-cyan-500/25 px-3.5 py-1.5 rounded-full mb-6">
                                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.75)]" aria-hidden />
                                How it works
                            </span>
                            <h2 className="text-[clamp(2rem,4vw,3.15rem)] font-black tracking-[-0.03em] leading-[1.08] mb-5">
                                <span className="block text-[#f4f4f5]">A transformer pipeline across</span>
                                <span className={`block mt-1 ${gradientText}`}>every device in your cluster</span>
                            </h2>
                            <p className="text-[1.05rem] text-[#94a3b8] leading-relaxed mb-6">
                                PodX partitions the model into contiguous layer ranges — each device runs a shard, forwards activations to the next hop over gRPC, and the elected coordinator turns final logits into streamed tokens.
                            </p>
                            <div className="flex flex-wrap gap-3 text-[0.78rem] text-[#64748b]">
                                <span className="inline-flex items-center gap-1.5 rounded-lg border border-[#30363d] bg-[#050709]/60 px-3 py-2">
                                    <span className="text-violet-400/95" aria-hidden>
                                        ⟿
                                    </span>
                                    Pipeline parallelism across LAN
                                </span>
                                <span className="inline-flex items-center gap-1.5 rounded-lg border border-[#30363d] bg-[#050709]/60 px-3 py-2">
                                    <span className="text-emerald-400/95" aria-hidden>
                                        ⚡
                                    </span>
                                    Coordinator streams SSE to clients
                                </span>
                            </div>
                        </div>
                        <div className="flex-1 min-w-0 rounded-3xl border border-[#21262d] bg-gradient-to-br from-[#0d1117] via-[#0a1620] to-[#0d1117] p-1 shadow-[0_0_0_1px_rgba(34,211,238,0.06),0_28px_90px_-28px_rgba(0,0,0,0.75)]">
                            <div className="rounded-[22px] bg-[#0d1117]/95 p-6 sm:p-8 border border-cyan-500/10 h-full">
                                <p className="text-[0.72rem] font-bold uppercase tracking-[0.16em] text-[#64748b] mb-6">
                                    Layer pipeline (conceptual)
                                </p>
                                <div className="relative">
                                    <div
                                        className="absolute left-[6%] right-[6%] top-[48%] h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent hidden sm:block pointer-events-none"
                                        aria-hidden
                                    />
                                    <div className="flex flex-col sm:flex-row sm:items-stretch sm:justify-center gap-3 sm:gap-1">
                                        {PIPELINE_NODES.map((node, i) => (
                                            <Fragment key={node.label}>
                                                {i === 0 && (
                                                    <div className="hidden sm:flex flex-col justify-end pb-3 pr-0.5 shrink-0">
                                                        <span className="text-[0.62rem] font-mono text-[#475569] uppercase tracking-wider whitespace-nowrap">
                                                            ← activations in
                                                        </span>
                                                    </div>
                                                )}
                                                <div className="sm:flex-1 sm:min-w-0 sm:max-w-[32%]">
                                                    <div className="rounded-xl border border-[#30363d] bg-[#050709]/80 px-3 py-3.5 sm:py-4 text-center sm:text-left hover:border-cyan-500/35 transition-colors h-full">
                                                        <div className="text-[0.7rem] font-bold text-cyan-400/95 mb-1">{node.label}</div>
                                                        <div className="text-[0.72rem] text-[#e6edf3] font-mono leading-snug mb-1.5">{node.layers}</div>
                                                        <div className="text-[0.62rem] text-[#64748b]">{node.chip}</div>
                                                    </div>
                                                </div>
                                                {i < PIPELINE_NODES.length - 1 && (
                                                    <>
                                                        <div className="flex sm:hidden justify-center py-1 text-cyan-500/55 text-xl" aria-hidden>
                                                            ↓
                                                        </div>
                                                        <div
                                                            className="hidden sm:flex items-center justify-center w-7 shrink-0 text-cyan-500/45 text-lg font-mono self-center pb-1"
                                                            aria-hidden
                                                        >
                                                            →
                                                        </div>
                                                    </>
                                                )}
                                            </Fragment>
                                        ))}
                                    </div>
                                    <p className="mt-6 pt-5 border-t border-[#21262d] text-center text-[0.75rem] text-[#8b949e] leading-relaxed">
                                        Activations flow forward along the pipeline; the{" "}
                                        <span className="text-[#a78bfa] font-semibold">coordinator</span> runs softmax on the last logits and emits tokens to{" "}
                                        <code className="text-xs text-cyan-400/90 bg-[#161b22] px-1.5 py-0.5 rounded">/v1/chat/completions</code>.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                        {HOW_PIPELINE_STEPS.map((s) => (
                            <div
                                key={s.title}
                                className="group relative rounded-2xl border border-[#21262d] bg-[#0d1117]/80 backdrop-blur-sm p-6 hover:border-violet-500/40 hover:-translate-y-0.5 hover:shadow-[0_20px_50px_-24px_rgba(139,92,246,0.35)] transition-all duration-300"
                            >
                                <div className="flex items-start gap-4">
                                    <div
                                        className={`shrink-0 w-11 h-11 rounded-xl flex items-center justify-center text-sm bg-gradient-to-br ${s.grad} shadow-lg font-black text-white`}
                                    >
                                        {s.step}
                                    </div>
                                    <div className="min-w-0 pt-0.5">
                                        <div className="flex items-center gap-2 mb-1.5">
                                            <span className="text-[0.65rem] text-[#64748b] font-mono">{s.icon}</span>
                                            <h3 className="text-[0.95rem] font-bold text-[#e6edf3] leading-snug">{s.title}</h3>
                                        </div>
                                        <p className="text-[0.8rem] text-[#8b949e] leading-relaxed">{s.body}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Architecture */}
            <section id="arch" className="relative py-24 md:py-36 bg-[#050709] scroll-mt-28 overflow-hidden">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(139,92,246,0.18),transparent)]" />
                <div className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:linear-gradient(rgba(148,163,184,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.06)_1px,transparent_1px)] [background-size:32px_32px]" />
                <div className="relative max-w-[1140px] mx-auto px-7">
                    <div className="flex flex-col lg:flex-row lg:items-stretch gap-10 lg:gap-14 mb-14 md:mb-20">
                        <div className="lg:w-[42%] shrink-0 flex flex-col justify-center">
                            <span className="inline-flex items-center gap-2 w-fit text-[0.68rem] font-bold tracking-[0.14em] uppercase text-[#c4b5fd] bg-violet-500/12 border border-violet-500/25 px-3.5 py-1.5 rounded-full mb-6">
                                <span className="w-1.5 h-1.5 rounded-full bg-orange-400 shadow-[0_0_10px_rgba(251,146,60,0.8)]" aria-hidden />
                                Architecture
                            </span>
                            <h2 className="text-[clamp(2rem,4vw,3.15rem)] font-black tracking-[-0.03em] leading-[1.08] mb-5">
                                <span className="block text-[#f4f4f5]">Built in Rust.</span>
                                <span className={`block mt-1 ${gradientText}`}>Seven focused crates.</span>
                            </h2>
                            <p className="text-[1.05rem] text-[#94a3b8] leading-relaxed mb-6">
                                One Cargo workspace, strict boundaries: core types at the bottom, state and inference stay siblings — no circular imports. The CLI and HTTP API are thin shells over the same runtime.
                            </p>
                            <div className="flex flex-wrap gap-3 text-[0.78rem] text-[#64748b]">
                                <span className="inline-flex items-center gap-1.5 rounded-lg border border-[#30363d] bg-[#0d1117]/80 px-3 py-2">
                                    <span className="text-orange-400/90" aria-hidden>
                                        ◆
                                    </span>
                                    Memory-safe concurrency by default
                                </span>
                                <span className="inline-flex items-center gap-1.5 rounded-lg border border-[#30363d] bg-[#0d1117]/80 px-3 py-2">
                                    <span className="text-emerald-400/90" aria-hidden>
                                        ✓
                                    </span>
                                    tonic · prost · cluster.proto
                                </span>
                            </div>
                        </div>
                        <div className="flex-1 min-w-0 rounded-3xl border border-[#21262d] bg-gradient-to-br from-[#0d1117] via-[#0a0e14] to-[#050709] p-1 shadow-[0_0_0_1px_rgba(139,92,246,0.08),0_24px_80px_-24px_rgba(0,0,0,0.85)]">
                            <div className="rounded-[22px] bg-[#0d1117]/95 p-6 sm:p-8 h-full border border-white/[0.04]">
                                <p className="text-[0.72rem] font-bold uppercase tracking-[0.16em] text-[#64748b] mb-5">
                                    Crate map
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {WORKSPACE_CRATES.map((c) => (
                                        <div
                                            key={c.name}
                                            className="group relative rounded-xl border border-[#21262d] bg-[#050709]/40 p-4 hover:border-violet-500/40 hover:bg-[#161b22]/80 transition-all duration-300"
                                        >
                                            <div
                                                className={`absolute inset-0 rounded-xl bg-gradient-to-br ${c.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}
                                            />
                                            <div className="relative">
                                                <code className="text-[0.78rem] sm:text-[0.82rem] font-bold text-[#e6edf3] tracking-tight block mb-1.5 font-mono">
                                                    {c.name}
                                                </code>
                                                <p className="text-[0.75rem] sm:text-[0.8rem] text-[#8b949e] leading-snug">{c.blurb}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-5">
                        <div className="rounded-2xl border border-[#21262d] bg-[#0d1117]/90 backdrop-blur-sm p-7 hover:border-orange-500/30 transition-colors">
                            <h3 className="text-[0.95rem] font-bold text-[#e6edf3] mb-2 flex items-center gap-2">
                                <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/15 text-lg" aria-hidden>
                                    ⚙️
                                </span>
                                Layered dependencies
                            </h3>
                            <p className="text-[0.84rem] text-[#8b949e] leading-relaxed">
                                <strong className="text-[#cbd5e1]">podx-core</strong> has zero workspace deps.{" "}
                                <strong className="text-[#cbd5e1]">podx-state</strong>,{" "}
                                <strong className="text-[#cbd5e1]">podx-inference</strong>, and{" "}
                                <strong className="text-[#cbd5e1]">podx-network</strong> only talk through traits and messages — never import each other directly.
                            </p>
                        </div>
                        <div className="rounded-2xl border border-[#21262d] bg-[#0d1117]/90 backdrop-blur-sm p-7 hover:border-cyan-500/30 transition-colors">
                            <h3 className="text-[0.95rem] font-bold text-[#e6edf3] mb-2 flex items-center gap-2">
                                <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/15 text-lg" aria-hidden>
                                    📡
                                </span>
                                gRPC wire protocol
                            </h3>
                            <p className="text-[0.84rem] text-[#8b949e] leading-relaxed font-mono">
                                Forward · Gossip · Heartbeat · InstallShard — generated services from{" "}
                                <span className="text-cyan-400/90">cluster.proto</span> via tonic &amp; prost.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section id="features" className="relative py-24 md:py-36 scroll-mt-28 overflow-hidden bg-gradient-to-b from-[#050709] via-[#0c0618] to-[#050709]">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,rgba(124,58,237,0.22),transparent)]" />
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_45%_35%_at_10%_90%,rgba(34,211,238,0.08),transparent)]" />
                <div className="pointer-events-none absolute inset-0 opacity-[0.22] [background-image:linear-gradient(rgba(148,163,184,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.06)_1px,transparent_1px)] [background-size:36px_36px]" />
                <div className="relative max-w-[1140px] mx-auto px-7">
                    <div className="flex flex-col lg:flex-row lg:items-stretch gap-10 lg:gap-14 mb-16 md:mb-20">
                        <div className="lg:w-[46%] shrink-0 flex flex-col justify-center">
                            <span className="inline-flex items-center gap-2 w-fit text-[0.68rem] font-bold tracking-[0.14em] uppercase text-[#d8b4fe] bg-violet-500/14 border border-violet-500/30 px-3.5 py-1.5 rounded-full mb-6">
                                <span className="w-1.5 h-1.5 rounded-full bg-violet-400 shadow-[0_0_12px_rgba(167,139,250,0.85)]" aria-hidden />
                                Features
                            </span>
                            <h2 className="text-[clamp(2rem,4vw,3.15rem)] font-black tracking-[-0.03em] leading-[1.08] mb-5">
                                <span className="block text-[#f4f4f5]">Everything in</span>
                                <span className={`block mt-1 ${gradientText}`}>one binary</span>
                            </h2>
                            <p className="text-[1.05rem] text-[#94a3b8] leading-relaxed mb-6">
                                One installable ships the CLI, embedded HTTP + OpenAI-compatible API, cluster gossip, inference runtime hooks, and the dashboard — no separate microservices or compose stack to babysit.
                            </p>
                            <div className="flex flex-wrap gap-3 text-[0.78rem] text-[#64748b]">
                                <span className="inline-flex items-center gap-1.5 rounded-lg border border-[#30363d] bg-[#0d1117]/90 px-3 py-2">
                                    <span className="text-violet-400/95" aria-hidden>
                                        ◈
                                    </span>
                                    Single artifact per platform
                                </span>
                                <span className="inline-flex items-center gap-1.5 rounded-lg border border-[#30363d] bg-[#0d1117]/90 px-3 py-2">
                                    <span className="text-cyan-400/95" aria-hidden>
                                        ⚡
                                    </span>
                                    CLI · REST · UI in one process tree
                                </span>
                            </div>
                        </div>
                        <div className="flex-1 min-w-0 rounded-3xl border border-[#21262d] bg-gradient-to-br from-[#0d1117] via-[#12081f] to-[#0d1117] p-1 shadow-[0_0_0_1px_rgba(167,139,250,0.1),0_28px_90px_-28px_rgba(0,0,0,0.75)]">
                            <div className="rounded-[22px] bg-[#0d1117]/95 p-6 sm:p-8 border border-violet-500/15 h-full flex flex-col justify-center">
                                <p className="text-[0.72rem] font-bold uppercase tracking-[0.16em] text-[#64748b] mb-6">What ships inside</p>
                                <div className="flex flex-col items-center sm:flex-row sm:items-stretch sm:justify-center gap-4 sm:gap-3">
                                    <div className="w-full sm:flex-1 rounded-xl border border-[#30363d] bg-[#050709]/90 px-4 py-5 text-center ring-1 ring-violet-500/20">
                                        <div className="text-[0.65rem] font-mono uppercase tracking-widest text-violet-400/90 mb-2">Binary</div>
                                        <code className="text-[1.15rem] sm:text-[1.25rem] font-black text-[#e6edf3] tracking-tight">podx</code>
                                        <p className="mt-2 text-[0.72rem] text-[#64748b] leading-snug">Coordinator + worker in one build</p>
                                    </div>
                                    <div className="hidden sm:flex items-center text-[#475569] text-2xl font-light pb-6" aria-hidden>
                                        →
                                    </div>
                                    <div className="flex sm:contents flex-col gap-2 w-full sm:w-auto">
                                        {[
                                            ["CLI", "start · model · key"],
                                            ["HTTP", "/v1 · /api · /ui"],
                                            ["LAN", "mDNS · gRPC"],
                                        ].map(([t, sub]) => (
                                            <div
                                                key={t}
                                                className="sm:flex-1 rounded-xl border border-[#21262d] bg-[#161b22]/60 px-4 py-3.5 text-center sm:text-left"
                                            >
                                                <div className="text-[0.68rem] font-bold text-[#a78bfa] uppercase tracking-wider">{t}</div>
                                                <div className="text-[0.72rem] text-[#8b949e] mt-1 font-mono leading-snug">{sub}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <p className="mt-8 pt-6 border-t border-[#21262d] text-center text-[0.78rem] text-[#8b949e] leading-relaxed">
                                    Run <code className="text-emerald-400/95 bg-[#161b22] px-1.5 py-0.5 rounded text-[0.72rem]">podx start</code> — discovery, API, and dashboard come up together.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                        {FEATURES.map((f) => (
                            <div
                                key={f.title}
                                className="rounded-[14px] border border-[#21262d] bg-[#0d1117]/90 backdrop-blur-sm p-7 hover:border-violet-500/40 hover:-translate-y-0.5 hover:bg-[#161b22]/95 hover:shadow-[0_20px_50px_-28px_rgba(124,58,237,0.2)] transition-all duration-300"
                            >
                                <div className="w-10 h-10 rounded-[10px] flex items-center justify-center mb-4 text-lg bg-violet-500/12 border border-violet-500/15">
                                    {f.icon}
                                </div>
                                <h3 className="text-[0.95rem] font-bold mb-2 text-[#e6edf3]">{f.title}</h3>
                                <p className="text-[0.82rem] text-[#8b949e] leading-relaxed mb-3">{f.body}</p>
                                <span className="text-[0.67rem] uppercase tracking-wider text-[#a78bfa] font-bold">{f.sub}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* PodX vs cloud — drop-in code + comparison table */}
            <section id="compare" className="relative py-24 md:py-36 scroll-mt-28 overflow-hidden bg-[#050709]">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_20%_15%,rgba(124,58,237,0.14),transparent)]" />
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_90%_75%,rgba(34,211,238,0.1),transparent)]" />
                <div className="pointer-events-none absolute inset-0 opacity-[0.2] [background-image:linear-gradient(rgba(148,163,184,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.06)_1px,transparent_1px)] [background-size:40px_40px]" />
                <div className="relative max-w-[1140px] mx-auto px-7">
                    <div className="flex flex-col lg:flex-row lg:items-stretch gap-10 lg:gap-14 mb-14 md:mb-20">
                        <div className="lg:w-[46%] shrink-0 flex flex-col justify-center">
                            <span className="inline-flex items-center gap-2 w-fit text-[0.68rem] font-bold tracking-[0.14em] uppercase text-[#c4b5fd] bg-violet-500/12 border border-violet-500/25 px-3.5 py-1.5 rounded-full mb-6">
                                <span className="w-1.5 h-1.5 rounded-full bg-violet-400 shadow-[0_0_12px_rgba(167,139,250,0.75)]" aria-hidden />
                                PodX vs cloud
                            </span>
                            <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-black tracking-[-0.03em] leading-[1.06] mb-5">
                                <span className="block text-[#f4f4f5]">PodX vs</span>
                                <span className={`block mt-1 ${gradientText}`}>Cloud APIs</span>
                            </h2>
                            <p className="text-[1.05rem] text-[#94a3b8] leading-relaxed mb-6">
                                Same OpenAI Python SDK, same <code className="text-[0.85em] text-violet-300 bg-[#161b22] px-1.5 py-0.5 rounded">chat.completions</code> calls — change{" "}
                                <strong className="text-[#e2e8f0]">base URL</strong> and a local key. No rewrites, no new client library.
                            </p>
                            <div className="flex flex-wrap gap-3 text-[0.78rem] text-[#64748b]">
                                <span className="inline-flex items-center gap-1.5 rounded-lg border border-[#30363d] bg-[#0d1117]/80 px-3 py-2">
                                    <span className="text-violet-400/95" aria-hidden>
                                        ⌘
                                    </span>
                                    Streaming SSE unchanged
                                </span>
                                <span className="inline-flex items-center gap-1.5 rounded-lg border border-[#30363d] bg-[#0d1117]/80 px-3 py-2">
                                    <span className="text-emerald-400/95" aria-hidden>
                                        🔒
                                    </span>
                                    Payloads stay on your LAN
                                </span>
                            </div>
                        </div>
                        <div className="flex-1 min-w-0 rounded-3xl border border-[#21262d] bg-gradient-to-br from-[#0d1117] via-[#10161f] to-[#0d1117] p-1 shadow-[0_0_0_1px_rgba(139,92,246,0.08),0_28px_90px_-28px_rgba(0,0,0,0.75)]">
                            <div className="rounded-[22px] bg-[#0d1117]/95 p-6 sm:p-8 border border-violet-500/15 h-full flex flex-col justify-center">
                                <p className="text-[0.72rem] font-bold uppercase tracking-[0.16em] text-[#64748b] mb-4">Drop-in replacement</p>
                                <p className="text-[clamp(1.65rem,2.8vw,2.25rem)] font-black text-[#f4f4f5] leading-tight mb-2">One line change.</p>
                                <p className={`text-[clamp(1.65rem,2.8vw,2.25rem)] font-black leading-tight mb-5 ${gradientText}`}>Your code stays the same.</p>
                                <p className="text-[0.84rem] text-[#8b949e] leading-relaxed border-t border-[#21262d] pt-5">
                                    Point <span className="text-emerald-400 font-mono text-[0.8rem]">base_url</span> at your coordinator (e.g.{" "}
                                    <span className="text-cyan-400/90 font-mono text-[0.78rem]">http://&lt;host&gt;:8080/v1</span>) — everything else is identical.
                                </p>
                            </div>
                        </div>
                    </div>

                    <p className="text-[0.72rem] font-bold uppercase tracking-[0.16em] text-[#64748b] mb-4 px-1">Before / after — OpenAI client</p>
                    <div className="grid md:grid-cols-2 gap-5 mb-16 md:mb-20">
                        <div className="rounded-2xl border border-[#21262d] overflow-hidden bg-[#161b22] shadow-[0_20px_50px_-28px_rgba(0,0,0,0.55)] ring-1 ring-white/[0.04]">
                            <div className="flex justify-between items-center px-[18px] py-3 border-b border-[#21262d] bg-[#1c2128]">
                                <span className="text-[0.72rem] font-bold text-[#f85149]">Before — cloud API</span>
                                <span className="text-[0.62rem] text-[#484f58] font-mono uppercase">internet egress</span>
                            </div>
                            <pre className="p-5 text-[0.79rem] leading-relaxed overflow-x-auto font-mono text-[#e6edf3]">
                                <span className="text-[#ff7b72]">from</span> openai <span className="text-[#ff7b72]">import</span> OpenAI{"\n\n"}
                                client = OpenAI(api_key=<span className="text-[#a5d6ff]">&quot;sk-proj-...&quot;</span>)
                                {"\n\n"}
                                response = client.chat.completions.create(...)
                            </pre>
                        </div>
                        <div className="rounded-2xl border border-emerald-500/25 overflow-hidden bg-[#161b22] shadow-[0_20px_50px_-28px_rgba(16,185,129,0.12)] ring-1 ring-emerald-500/15">
                            <div className="flex justify-between items-center px-[18px] py-3 border-b border-[#21262d] bg-[#101916]">
                                <span className="text-[0.72rem] font-bold text-emerald-400">After — PodX</span>
                                <span className="text-[0.62rem] text-emerald-500/80 font-mono uppercase">LAN only</span>
                            </div>
                            <pre className="p-5 text-[0.79rem] leading-relaxed overflow-x-auto font-mono text-[#e6edf3]">
                                client = OpenAI(
                                {"\n"}
                                {"  "}
                                <span className="text-emerald-400">base_url</span>=<span className="text-[#a5d6ff]">&quot;http://localhost:8080/v1&quot;</span>,
                                {"\n"}
                                {"  "}
                                <span className="text-emerald-400">api_key</span>=<span className="text-[#a5d6ff]">&quot;sk-podx-...&quot;</span>,
                                {"\n"})
                            </pre>
                        </div>
                    </div>

                    <p className="text-[0.72rem] font-bold uppercase tracking-[0.16em] text-[#64748b] mb-4 px-1">Capability matrix</p>
                    <div className="rounded-2xl border border-[#21262d] overflow-x-auto bg-[#0d1117]/95 shadow-[0_24px_80px_-32px_rgba(0,0,0,0.65)] ring-1 ring-white/[0.03]">
                        <table className="w-full border-collapse min-w-[640px]">
                            <thead>
                                <tr className="bg-[#161b22] text-[0.7rem] uppercase tracking-wider text-[#484f58]">
                                    <th className="text-left py-4 px-6 border-b border-[#21262d]">Capability</th>
                                    <th className="text-left py-4 px-6 border-b border-[#21262d] text-violet-400">PodX</th>
                                    <th className="text-left py-4 px-6 border-b border-[#21262d]">OpenAI / Anthropic</th>
                                    <th className="text-left py-4 px-6 border-b border-[#21262d]">Ollama</th>
                                </tr>
                            </thead>
                            <tbody className="text-[0.88rem]">
                                {[
                                    ["Cost per token", "$0.00", "$0.002–$0.06 / 1K", "$0.00"],
                                    ["Data leaves network", "Never", "Always", "Never"],
                                    ["70B+ on consumer HW", "Yes — pooled RAM", "Cloud only", "If one machine fits"],
                                    ["Multi-machine", "Core feature", "N/A", "No"],
                                ].map(([c, p, o, ol]) => (
                                    <tr key={c as string} className="hover:bg-violet-500/[0.03] border-b border-[#21262d] last:border-0">
                                        <td className="py-4 px-6 text-[#c9d1d9] font-medium">{c}</td>
                                        <td className="py-4 px-6 text-emerald-400 font-bold">{p}</td>
                                        <td className="py-4 px-6 text-[#8b949e]">{o}</td>
                                        <td className="py-4 px-6 text-[#8b949e]">{ol}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section id="start" className="relative py-24 md:py-40 scroll-mt-28 overflow-hidden bg-[#050709]">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_55%_at_50%_20%,rgba(124,58,237,0.18),transparent)]" />
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_80%_100%,rgba(16,185,129,0.12),transparent)]" />
                <div className="pointer-events-none absolute inset-0 opacity-[0.18] [background-image:linear-gradient(rgba(148,163,184,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.06)_1px,transparent_1px)] [background-size:44px_44px]" />
                <div className="relative max-w-[1140px] mx-auto px-7">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-12 lg:gap-16">
                        <div className="lg:flex-1 text-center lg:text-left">
                            <span className="inline-flex items-center gap-2 text-[0.68rem] font-bold tracking-[0.14em] uppercase text-emerald-400/95 bg-emerald-500/10 border border-emerald-500/25 px-3.5 py-1.5 rounded-full mb-6 mx-auto lg:mx-0">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.85)]" aria-hidden />
                                Open source
                            </span>
                            <h2 className="font-black tracking-[-0.03em] leading-[1.06] mb-5">
                                <span className="block rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-[#0f1915]/95 via-[#0d1117] to-[#0d1117] px-5 py-5 sm:px-7 sm:py-6 text-[clamp(1.75rem,3.5vw,2.65rem)] text-[#fafafa] shadow-[0_28px_70px_-32px_rgba(16,185,129,0.35)] ring-1 ring-white/[0.06] mx-auto lg:mx-0 max-w-xl lg:max-w-none">
                                    Start your cluster
                                </span>
                                <span className={`block mt-4 text-[clamp(2.1rem,4.2vw,3.35rem)] ${gradientText}`}>in under 5 minutes.</span>
                            </h2>
                            <p className="text-[1.08rem] text-[#94a3b8] leading-relaxed mb-8 max-w-[520px] mx-auto lg:mx-0">
                                One binary on each machine, bring-up over LAN, then load a GGUF — no vendor signup, no keys leaving your network.
                            </p>
                            <ul className="list-none flex flex-col sm:flex-row lg:flex-col xl:flex-row flex-wrap gap-3 justify-center lg:justify-start text-[0.8rem] text-[#64748b] p-0 m-0">
                                {["Rust toolchain · cargo build", "Same Wi‑Fi or tailnet", "Dashboard on :8080/ui"].map((line) => (
                                    <li
                                        key={line}
                                        className="inline-flex items-center gap-2 rounded-lg border border-[#30363d] bg-[#0d1117]/80 px-3 py-2 mx-auto lg:mx-0"
                                    >
                                        <span className="text-emerald-500/90" aria-hidden>
                                            ✓
                                        </span>
                                        {line}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="lg:w-[min(440px,100%)] shrink-0 w-full max-w-md mx-auto lg:mx-0">
                            <div className="rounded-3xl border border-[#21262d] bg-gradient-to-br from-[#0d1117] via-[#0a1210] to-[#0d1117] p-1 shadow-[0_0_0_1px_rgba(16,185,129,0.12),0_32px_100px_-36px_rgba(0,0,0,0.85)]">
                                <div className="rounded-[22px] bg-[#0d1117]/95 p-7 sm:p-8 border border-emerald-500/15">
                                    <p className="text-[0.72rem] font-bold uppercase tracking-[0.16em] text-[#64748b] mb-6">Get started</p>
                                    <div className="flex flex-col gap-3">
                                        <Link
                                            to="/podx/docs#installation"
                                            className="inline-flex items-center justify-center gap-2 w-full bg-gradient-to-br from-[#7c3aed] to-[#5b21b6] text-white font-bold px-6 py-4 rounded-xl shadow-[0_0_40px_rgba(124,58,237,0.38)] hover:opacity-92 hover:-translate-y-0.5 transition-all text-[0.95rem]"
                                        >
                                            Read the install guide →
                                        </Link>
                                        <Link
                                            to="/podx/docs"
                                            className="inline-flex items-center justify-center gap-2 w-full bg-[#161b22] text-[#e6edf3] font-semibold px-6 py-4 rounded-xl border border-[#30363d] hover:border-violet-400/45 hover:bg-[#1c2128] transition-colors text-[0.95rem]"
                                        >
                                            Browse full docs
                                        </Link>
                                    </div>
                                    <p className="mt-8 pt-6 border-t border-[#21262d] text-center text-[0.78rem] text-[#64748b] leading-relaxed">
                                        MIT licensed · Rust · llama.cpp ·{" "}
                                        <a
                                            href="https://github.com/alchemist123"
                                            className="text-[#a78bfa] hover:text-violet-300 transition-colors font-medium"
                                        >
                                            GitHub
                                        </a>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-[#21262d] py-14 bg-[#0d1117]">
                <div className="max-w-[1140px] mx-auto px-7 flex flex-col sm:flex-row justify-between items-center gap-6 text-[0.78rem] text-[#484f58]">
                    <span>© {new Date().getFullYear()} PodX · MIT License</span>
                    <Link to="/" className="text-[#8b949e] hover:text-emerald-400 transition-colors">
                        ← Back to profile
                    </Link>
                </div>
            </footer>
        </div>
    );
}
