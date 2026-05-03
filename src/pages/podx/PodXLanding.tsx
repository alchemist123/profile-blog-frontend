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
            <section id="problem" className="py-24 md:py-32 bg-gradient-to-b from-[#050709] via-[#0d1117]/50 to-[#050709] scroll-mt-28">
                <div className="max-w-[1140px] mx-auto px-7">
                    <div className="text-center max-w-[660px] mx-auto mb-16">
                        <span className="inline-block text-[0.7rem] font-bold tracking-[0.12em] uppercase text-[#a78bfa] bg-violet-500/10 border border-violet-500/20 px-3 py-1 rounded-full mb-4">
                            The Problem
                        </span>
                        <h2 className="text-[clamp(1.9rem,3.5vw,2.7rem)] font-black tracking-tight leading-tight mb-4 text-[#e6edf3]">
                            Your models are too big for one machine.
                            <br />
                            <span className={gradientText}>Your cluster is already in the room.</span>
                        </h2>
                        <p className="text-[1rem] text-[#8b949e] leading-relaxed">
                            A 70B model needs ~40 GB of RAM. You don't have that on one laptop — but combined, your devices might.
                        </p>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[#21262d] border border-[#21262d] rounded-2xl overflow-hidden">
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
            <section id="how" className="py-24 md:py-32 bg-[#0d1117] scroll-mt-28">
                <div className="max-w-[1140px] mx-auto px-7">
                    <div className="text-center max-w-[660px] mx-auto mb-16">
                        <span className="inline-block text-[0.7rem] font-bold tracking-[0.12em] uppercase text-[#a78bfa] bg-violet-500/10 border border-violet-500/20 px-3 py-1 rounded-full mb-4">
                            How It Works
                        </span>
                        <h2 className="text-[clamp(1.9rem,3.5vw,2.7rem)] font-black tracking-tight leading-tight mb-4">
                            A transformer pipeline across
                            <br />
                            <span className={gradientText}>every device in your cluster</span>
                        </h2>
                        <p className="text-[1rem] text-[#8b949e] leading-relaxed">
                            PodX splits a model&apos;s layers across nodes. Each node runs a contiguous shard, passes activations over gRPC, and the coordinator samples tokens from the final logits.
                        </p>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mt-6">
                        {[
                            ["1", "Install & Start", "Run podx start on each machine. Hardware detection, gRPC + HTTP, mDNS advertise.", "from-violet-600 to-indigo-500"],
                            ["2", "Auto-Discovery", "Nodes find each other via mDNS in seconds — no static IPs.", "from-blue-600 to-cyan-400"],
                            ["3", "Load a Model", "podx model load with any GGUF. Shard map computed automatically.", "from-emerald-600 to-emerald-400"],
                            ["4", "Inference Ready", "POST /v1/chat/completions — OpenAI-compatible, streaming SSE.", "from-cyan-600 to-cyan-300"],
                        ].map(([num, title, body, grad]) => (
                            <div
                                key={title}
                                className="rounded-xl border border-[#21262d] bg-[#0d1117] p-6 hover:border-violet-500/35 hover:-translate-y-0.5 transition-all"
                            >
                                <div
                                    className={`w-10 h-10 rounded-lg mb-4 flex items-center justify-center text-lg bg-gradient-to-br ${grad} bg-opacity-20 text-white font-black`}
                                >
                                    {num}
                                </div>
                                <h3 className="text-[0.95rem] font-bold mb-2 text-[#e6edf3]">{title}</h3>
                                <p className="text-[0.82rem] text-[#8b949e] leading-relaxed">{body}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Architecture teaser */}
            <section id="arch" className="py-24 md:py-32 bg-[#050709] scroll-mt-28">
                <div className="max-w-[1140px] mx-auto px-7">
                    <div className="text-center max-w-[660px] mx-auto mb-16">
                        <span className="inline-block text-[0.7rem] font-bold tracking-[0.12em] uppercase text-[#a78bfa] bg-violet-500/10 border border-violet-500/20 px-3 py-1 rounded-full mb-4">
                            Architecture
                        </span>
                        <h2 className="text-[clamp(1.9rem,3.5vw,2.7rem)] font-black tracking-tight">
                            Built in Rust.
                            <br />
                            <span className={gradientText}>Seven focused crates.</span>
                        </h2>
                        <p className="text-[1rem] text-[#8b949e] mt-4 leading-relaxed">
                            Workspace layout: podx-core, podx-state, podx-inference, podx-network, podx-api, podx-cli, podx-node — strict dependency rules, no circular imports.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-5">
                        <div className="rounded-2xl border border-[#21262d] bg-[#0d1117] p-8 hover:border-violet-500/35 transition-colors">
                            <h3 className="text-[0.95rem] font-bold text-[#e6edf3] mb-2">⚙️ Core crates</h3>
                            <p className="text-[0.82rem] text-[#8b949e] leading-relaxed mb-4">
                                podx-core is pure types. State, inference, and network are independent — they never import each other.
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {["podx-core", "podx-state", "podx-inference", "podx-network", "podx-api", "podx-cli"].map((t) => (
                                    <span key={t} className="text-[0.62rem] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-violet-500/15 text-violet-300 border border-violet-500/25">
                                        {t}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="rounded-2xl border border-[#21262d] bg-[#0d1117] p-8 hover:border-violet-500/35 transition-colors">
                            <h3 className="text-[0.95rem] font-bold text-[#e6edf3] mb-2">📡 gRPC protocol</h3>
                            <p className="text-[0.82rem] text-[#8b949e] leading-relaxed font-mono">
                                Forward · Gossip · Heartbeat · InstallShard — tonic/prost generated from cluster.proto.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section id="features" className="py-24 md:py-32 bg-gradient-to-b from-[#050709] via-violet-950/30 to-[#050709] scroll-mt-28">
                <div className="max-w-[1140px] mx-auto px-7">
                    <div className="text-center max-w-[660px] mx-auto mb-16">
                        <span className="inline-block text-[0.7rem] font-bold tracking-[0.12em] uppercase text-[#a78bfa] bg-violet-500/10 border border-violet-500/20 px-3 py-1 rounded-full mb-4">
                            Features
                        </span>
                        <h2 className="text-[clamp(1.9rem,3.5vw,2.7rem)] font-black tracking-tight">
                            Everything in
                            <br />
                            <span className={gradientText}>one binary</span>
                        </h2>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                        {FEATURES.map((f) => (
                            <div
                                key={f.title}
                                className="rounded-[14px] border border-[#21262d] bg-[#0d1117] p-7 hover:border-violet-500/35 hover:-translate-y-0.5 hover:bg-[#161b22] transition-all"
                            >
                                <div className="w-10 h-10 rounded-[10px] flex items-center justify-center mb-4 text-lg bg-violet-500/10">
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

            {/* Demo code */}
            <section id="demo" className="py-24 md:py-32 bg-[#0d1117] scroll-mt-28">
                <div className="max-w-[1140px] mx-auto px-7">
                    <div className="text-center max-w-[660px] mx-auto mb-12">
                        <span className="inline-block text-[0.7rem] font-bold tracking-[0.12em] uppercase text-[#a78bfa] bg-violet-500/10 border border-violet-500/20 px-3 py-1 rounded-full mb-4">
                            Drop-in replacement
                        </span>
                        <h2 className="text-[clamp(1.9rem,3.5vw,2.7rem)] font-black tracking-tight">
                            One line change.
                            <br />
                            <span className={gradientText}>Your code stays the same.</span>
                        </h2>
                    </div>
                    <div className="grid md:grid-cols-2 gap-5">
                        <div className="rounded-xl border border-[#21262d] overflow-hidden bg-[#161b22]">
                            <div className="flex justify-between items-center px-[18px] py-3 border-b border-[#21262d] bg-[#1c2128]">
                                <span className="text-[0.72rem] font-bold text-[#484f58]">Before — Cloud API</span>
                            </div>
                            <pre className="p-5 text-[0.79rem] leading-relaxed overflow-x-auto font-mono text-[#e6edf3]">
                                <span className="text-[#ff7b72]">from</span> openai <span className="text-[#ff7b72]">import</span> OpenAI{"\n\n"}
                                client = OpenAI(api_key=<span className="text-[#a5d6ff]">&quot;sk-proj-...&quot;</span>)
                                {"\n\n"}
                                response = client.chat.completions.create(...)
                            </pre>
                        </div>
                        <div className="rounded-xl border border-[#21262d] overflow-hidden bg-[#161b22]">
                            <div className="flex justify-between items-center px-[18px] py-3 border-b border-[#21262d] bg-[#1c2128]">
                                <span className="text-[0.72rem] font-bold text-emerald-400">After — PodX</span>
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
                </div>
            </section>

            {/* Compare */}
            <section id="compare" className="py-24 md:py-32 bg-[#050709] scroll-mt-28">
                <div className="max-w-[1140px] mx-auto px-7">
                    <div className="text-center max-w-[660px] mx-auto mb-12">
                        <span className="inline-block text-[0.7rem] font-bold tracking-[0.12em] uppercase text-[#a78bfa] bg-violet-500/10 border border-violet-500/20 px-3 py-1 rounded-full mb-4">
                            Comparison
                        </span>
                        <h2 className="text-[clamp(1.9rem,3.5vw,2.7rem)] font-black tracking-tight">
                            PodX vs
                            <br />
                            <span className={gradientText}>Cloud APIs</span>
                        </h2>
                    </div>
                    <div className="rounded-2xl border border-[#21262d] overflow-x-auto bg-[#0d1117]">
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
            <section className="py-24 md:py-36 text-center bg-[radial-gradient(ellipse_70%_60%_at_50%_50%,rgba(124,58,237,.09)_0%,transparent_100%)]">
                <div className="max-w-[660px] mx-auto px-7">
                    <span className="inline-block text-[0.7rem] font-bold tracking-[0.12em] uppercase text-[#a78bfa] mb-4">Open Source</span>
                    <h2 className="text-[clamp(2.2rem,4vw,3.2rem)] font-black tracking-tight mb-4 text-[#e6edf3]">
                        Start your cluster
                        <br />
                        <span className={gradientText}>in under 5 minutes.</span>
                    </h2>
                    <p className="text-[1.05rem] text-[#8b949e] mb-10">One binary. Any hardware. No cloud account.</p>
                    <div className="flex flex-wrap gap-3.5 justify-center">
                        <Link
                            to="/podx/docs#installation"
                            className="inline-flex items-center gap-2 bg-gradient-to-br from-[#7c3aed] to-[#5b21b6] text-white font-bold px-6 py-3.5 rounded-[10px] shadow-[0_0_32px_rgba(124,58,237,0.35)] hover:opacity-90 transition-opacity"
                        >
                            Read the install guide →
                        </Link>
                        <Link
                            to="/podx/docs"
                            className="inline-flex items-center gap-2 bg-[#161b22] text-[#c9d1d9] font-semibold px-6 py-3.5 rounded-[10px] border border-[#30363d] hover:border-violet-400/50 transition-colors"
                        >
                            Browse the docs
                        </Link>
                    </div>
                    <p className="mt-6 text-[0.8rem] text-[#484f58]">
                        MIT licensed · Rust · llama.cpp ·{" "}
                        <a href="https://github.com/alchemist123" className="text-[#8b949e] hover:text-violet-400 transition-colors">
                            GitHub
                        </a>
                    </p>
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
