import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const SECTIONS = [
    { id: "introduction", label: "Introduction" },
    { id: "installation", label: "Installation" },
    { id: "quickstart", label: "Quick Start" },
    { id: "cluster-setup", label: "Cluster Setup" },
    { id: "cli", label: "CLI Reference" },
    { id: "api-ref", label: "HTTP API" },
    { id: "architecture", label: "Architecture" },
    { id: "concepts", label: "Key Concepts" },
    { id: "performance", label: "Performance" },
    { id: "tech-stack", label: "Tech Stack" },
    { id: "roadmap", label: "Roadmap" },
];

const CodeBlock = ({ title, lang = "bash", children }: { title?: string; lang?: string; children: string }) => (
    <div className="rounded-xl border border-[#30363d] overflow-hidden bg-[#0d1117] mb-6 shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
        {title && (
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#21262d] bg-[#161b22]">
                <span className="text-[0.68rem] font-bold uppercase tracking-widest text-[#484f58]">{title}</span>
                <span className="text-[0.62rem] font-mono text-[#484f58]">{lang}</span>
            </div>
        )}
        <pre className="p-5 text-[0.815rem] leading-relaxed overflow-x-auto font-mono text-[#e6edf3] whitespace-pre">{children}</pre>
    </div>
);

const InlineCode = ({ children }: { children: React.ReactNode }) => (
    <code className="text-violet-300 bg-[#161b22] px-1.5 py-0.5 rounded text-[0.85em] font-mono">{children}</code>
);

const Callout = ({ type = "info", children }: { type?: "info" | "warning" | "tip"; children: React.ReactNode }) => {
    const styles = {
        info: "border-violet-500/25 bg-violet-500/8 text-violet-200/90",
        warning: "border-amber-500/30 bg-amber-500/8 text-amber-200/90",
        tip: "border-emerald-500/20 bg-emerald-500/8 text-emerald-300/90",
    } as const;
    const icons = { info: "ℹ", warning: "⚠", tip: "✅" };
    return (
        <div className={`rounded-lg border p-4 text-[0.88rem] leading-relaxed flex gap-3 mb-6 ${styles[type]}`}>
            <span className="shrink-0 mt-0.5">{icons[type]}</span>
            <div>{children}</div>
        </div>
    );
};

const SectionHeader = ({ id, children }: { id: string; children: React.ReactNode }) => (
    <h2 id={id} className="text-2xl font-extrabold tracking-tight mb-5 text-[#e6edf3] scroll-mt-40">
        {children}
    </h2>
);

const SubHeader = ({ children }: { children: React.ReactNode }) => (
    <h3 className="text-lg font-bold mt-10 mb-3 text-[#e6edf3]">{children}</h3>
);

export default function PodXDocsPage() {
    const [active, setActive] = useState("introduction");

    useEffect(() => {
        const obs = new IntersectionObserver(
            (entries) => {
                for (const e of entries) {
                    if (e.isIntersecting) setActive(e.target.id);
                }
            },
            { rootMargin: "-20% 0px -60% 0px" }
        );
        SECTIONS.forEach((s) => {
            const el = document.getElementById(s.id);
            if (el) obs.observe(el);
        });
        return () => obs.disconnect();
    }, []);

    return (
        <div className="min-h-screen bg-[#0d1117] text-[#e6edf3]">
            {/* Top bar */}
            <div className="sticky top-16 z-30 flex items-center gap-4 px-4 sm:px-6 h-14 border-b border-[#21262d] bg-[#0d1117]/95 backdrop-blur-md">
                <Link to="/podx" className="font-black bg-gradient-to-br from-[#a78bfa] to-[#818cf8] bg-clip-text text-transparent text-[0.95rem]">
                    PodX
                </Link>
                <span className="text-[0.72rem] text-[#484f58] hidden sm:inline">v0.1.0 · Alpha</span>
                <div className="ml-auto flex gap-2 text-[0.84rem]">
                    <Link to="/podx" className="text-[#8b949e] hover:text-[#e6edf3] px-3 py-1 rounded-lg hover:bg-[#161b22] transition-colors">
                        ← Home
                    </Link>
                    <a href="#installation" className="text-[#8b949e] hover:text-[#e6edf3] px-3 py-1 rounded-lg hover:bg-[#161b22] transition-colors hidden sm:inline">
                        Install
                    </a>
                </div>
            </div>

            <div className="max-w-6xl mx-auto flex flex-col lg:flex-row lg:items-start">
                {/* Sidebar — desktop */}
                <aside className="hidden lg:block w-60 shrink-0 sticky top-[calc(4rem+3.5rem)] h-[calc(100vh-8rem)] overflow-y-auto py-8 pl-6 pr-4 border-r border-[#21262d]">
                    <p className="text-[0.65rem] font-bold tracking-[0.12em] uppercase text-[#484f58] px-2 mb-3">Documentation</p>
                    {SECTIONS.map((s) => (
                        <a
                            key={s.id}
                            href={`#${s.id}`}
                            className={`block text-[0.83rem] py-2 px-2.5 rounded-lg mb-0.5 transition-colors ${
                                active === s.id
                                    ? "text-violet-400 bg-violet-500/12 font-semibold"
                                    : "text-[#8b949e] hover:text-[#e6edf3] hover:bg-[#161b22]"
                            }`}
                        >
                            {s.label}
                        </a>
                    ))}
                    <div className="mt-8 pt-6 border-t border-[#21262d] px-2">
                        <p className="text-[0.65rem] font-bold tracking-[0.12em] uppercase text-[#484f58] mb-3">Project</p>
                        <Link to="/podx" className="block text-[0.83rem] py-1.5 text-[#8b949e] hover:text-violet-400 transition-colors">
                            Landing page
                        </Link>
                        <Link to="/" className="block text-[0.83rem] py-1.5 text-[#8b949e] hover:text-emerald-400 transition-colors">
                            Profile site
                        </Link>
                    </div>
                </aside>

                {/* Main content */}
                <main className="flex-1 px-5 sm:px-8 lg:px-12 py-10 max-w-[860px] min-w-0">
                    {/* ─── Introduction ─── */}
                    <section id="introduction" className="scroll-mt-40 mb-16">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="inline-flex items-center gap-2 text-[0.68rem] font-bold tracking-[0.14em] uppercase text-emerald-400/95 bg-emerald-500/10 border border-emerald-500/25 px-3 py-1.5 rounded-full">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]" />
                                Alpha v0.1
                            </span>
                        </div>
                        <h1 className="text-4xl font-black tracking-tight mb-3">
                            PodX{" "}
                            <span className="bg-gradient-to-br from-[#a78bfa] to-[#818cf8] bg-clip-text text-transparent">
                                Documentation
                            </span>
                        </h1>
                        <p className="text-lg text-[#8b949e] leading-relaxed mb-8">
                            PodX is a distributed LLM inference engine written in Rust. Install one binary on multiple devices — they discover each other on your LAN, elect a coordinator, split a model's transformer layers across themselves, and serve requests together as one unified cluster with an OpenAI-compatible API.
                        </p>

                        <Callout type="tip">
                            <strong className="text-emerald-200">Drop-in OpenAI replacement.</strong> PodX exposes <InlineCode>/v1/chat/completions</InlineCode> with streaming SSE. Change only <InlineCode>base_url</InlineCode> — your existing SDK code works unchanged.
                        </Callout>

                        <SubHeader>What PodX does</SubHeader>
                        <ul className="list-none space-y-2.5 text-[#c9d1d9] text-[0.93rem] leading-relaxed mb-8">
                            {[
                                ["mDNS auto-discovery", "Peers find each other on the LAN within seconds — no IP config, no registry."],
                                ["Score-based coordinator election", "The node with the best hardware becomes coordinator automatically."],
                                ["Pipeline parallelism", "Transformer layers are split across nodes; activations flow forward over gRPC."],
                                ["OpenAI-compatible HTTP API", "Streaming SSE chat completions on /v1/chat/completions with bearer auth."],
                                ["Gossip cluster state", "Every node holds a full ClusterState replica — no single point of failure."],
                                ["Embedded web dashboard", "Kubernetes-style UI for topology, shards, metrics, chat, and settings."],
                            ].map(([title, desc]) => (
                                <li key={title as string} className="flex gap-3">
                                    <span className="text-violet-400 mt-1 shrink-0">▸</span>
                                    <span>
                                        <strong className="text-[#e6edf3]">{title}</strong>
                                        {" — "}
                                        {desc}
                                    </span>
                                </li>
                            ))}
                        </ul>

                        <SubHeader>Implementation status</SubHeader>
                        <div className="overflow-x-auto rounded-xl border border-[#21262d] mb-4">
                            <table className="w-full text-[0.87rem] border-collapse">
                                <tbody className="text-[#c9d1d9]">
                                    {[
                                        [true, "Distributed layer-parallel inference over gRPC"],
                                        [true, "Persistent KV cache (coordinator + workers, incremental decode)"],
                                        [true, "Speculative decoding with draft model verification"],
                                        [true, "Gossip-based cluster state with heartbeat failure detection"],
                                        [true, "mDNS zero-config peer discovery"],
                                        [true, "OpenAI-compatible API (chat completions, completions, embeddings)"],
                                        [true, "Hardware-weighted shard assignment (GPU/platform-aware)"],
                                        [true, "Session persistence across multi-turn conversations"],
                                        [true, "API key management with scope controls"],
                                        [true, "macOS Metal + Linux CPU/CUDA support"],
                                        [false, "Cross-datacenter WAN deployment (Phase 5)"],
                                        [false, "Tensor parallelism within a node (Phase 6)"],
                                        [false, "Web dashboard v2 with sparklines (in progress)"],
                                    ].map(([done, feat]) => (
                                        <tr key={feat as string} className="border-b border-[#21262d] last:border-0 hover:bg-[#161b22]/50">
                                            <td className="py-2.5 px-4 w-10">
                                                <span className={done ? "text-emerald-400" : "text-[#484f58]"}>{done ? "✓" : "○"}</span>
                                            </td>
                                            <td className={`py-2.5 px-4 ${done ? "" : "text-[#484f58]"}`}>{feat as string}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* ─── Installation ─── */}
                    <section id="installation" className="scroll-mt-40 mb-16 pt-12 border-t border-[#21262d]">
                        <SectionHeader id="installation">Installation</SectionHeader>
                        <p className="text-[0.93rem] text-[#c9d1d9] leading-relaxed mb-6">
                            PodX builds from source with Cargo. Install Rust via{" "}
                            <a href="https://rustup.rs" className="text-violet-400 hover:underline" target="_blank" rel="noopener noreferrer">
                                rustup.rs
                            </a>{" "}
                            (1.78 or later), then install the required platform tools.
                        </p>

                        <SubHeader>Prerequisites</SubHeader>
                        <div className="overflow-x-auto rounded-xl border border-[#21262d] mb-6">
                            <table className="w-full text-[0.87rem] border-collapse">
                                <thead>
                                    <tr className="bg-[#161b22] text-[0.7rem] uppercase tracking-wider text-[#484f58]">
                                        <th className="text-left py-3 px-4 border-b border-[#21262d]">Dependency</th>
                                        <th className="text-left py-3 px-4 border-b border-[#21262d]">macOS</th>
                                        <th className="text-left py-3 px-4 border-b border-[#21262d]">Ubuntu / Debian</th>
                                    </tr>
                                </thead>
                                <tbody className="text-[#c9d1d9]">
                                    {[
                                        ["Rust 1.78+", "via rustup.rs", "via rustup.rs"],
                                        ["Build tools", "xcode-select --install", "build-essential, cmake, clang"],
                                        ["Protobuf compiler", "brew install protobuf", "protobuf-compiler"],
                                        ["GGUF model file", "huggingface.co/models?library=gguf", "huggingface.co/models?library=gguf"],
                                    ].map(([dep, mac, linux]) => (
                                        <tr key={dep} className="border-b border-[#21262d] last:border-0">
                                            <td className="py-3 px-4 font-mono text-[0.82rem] text-violet-300">{dep}</td>
                                            <td className="py-3 px-4 font-mono text-[0.79rem] text-[#8b949e]">{mac}</td>
                                            <td className="py-3 px-4 font-mono text-[0.79rem] text-[#8b949e]">{linux}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <SubHeader>Build</SubHeader>
                        <CodeBlock title="Clone & build" lang="bash">{`git clone https://github.com/alchemist123/podx
cd podx

# CPU-only (works on any machine)
cargo build --release

# Apple Silicon — Metal GPU acceleration
cargo build --release --features podx-inference/metal

# Linux / Windows NVIDIA — CUDA acceleration
cargo build --release --features podx-inference/cuda`}</CodeBlock>

                        <p className="text-[0.88rem] text-[#8b949e] mb-4">
                            Binary lands at <InlineCode>target/release/podx</InlineCode>. Copy it to any machine in your cluster — it is self-contained.
                        </p>

                        <SubHeader>GPU build matrix</SubHeader>
                        <div className="overflow-x-auto rounded-xl border border-[#21262d] mb-6">
                            <table className="w-full text-[0.87rem] border-collapse">
                                <thead>
                                    <tr className="bg-[#161b22] text-[0.7rem] uppercase tracking-wider text-[#484f58]">
                                        <th className="text-left py-3 px-4 border-b border-[#21262d]">Platform</th>
                                        <th className="text-left py-3 px-4 border-b border-[#21262d]">Feature flag</th>
                                        <th className="text-left py-3 px-4 border-b border-[#21262d]">VRAM detection</th>
                                    </tr>
                                </thead>
                                <tbody className="text-[#c9d1d9]">
                                    {[
                                        ["Apple Silicon (M1/M2/M3/M4)", "podx-inference/metal", "system_profiler"],
                                        ["Linux / Windows NVIDIA", "podx-inference/cuda", "nvidia-smi"],
                                        ["Any platform (CPU fallback)", "(default)", "RAM only"],
                                    ].map(([plat, flag, detect]) => (
                                        <tr key={plat} className="border-b border-[#21262d] last:border-0">
                                            <td className="py-3 px-4 text-[#c9d1d9]">{plat}</td>
                                            <td className="py-3 px-4 font-mono text-emerald-400 text-[0.82rem]">{flag}</td>
                                            <td className="py-3 px-4 text-[#8b949e] text-[0.82rem]">{detect}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <Callout type="info">
                            GPU nodes are automatically weighted more heavily in the election score and preferred as pipeline heads. The <InlineCode>metal</InlineCode> feature gives Apple Silicon a +2000 platform bonus because unified memory means GPU and CPU share the same RAM pool.
                        </Callout>
                    </section>

                    {/* ─── Quick Start ─── */}
                    <section id="quickstart" className="scroll-mt-40 mb-16 pt-12 border-t border-[#21262d]">
                        <SectionHeader id="quickstart">Quick Start — Single Node</SectionHeader>
                        <p className="text-[0.93rem] text-[#c9d1d9] leading-relaxed mb-6">
                            Run <InlineCode>podx start</InlineCode> on any machine. It detects hardware, starts gRPC on <InlineCode>:9090</InlineCode>, HTTP on <InlineCode>:8080</InlineCode>, and advertises itself via mDNS.
                        </p>

                        <CodeBlock title="Start a node" lang="bash">{`./podx start
# Output:
#   Hardware: 16 GB RAM · 10 cores · Metal GPU detected
#   gRPC listening on 0.0.0.0:9090
#   HTTP listening on 0.0.0.0:8080
#   mDNS: advertising _podx._tcp · node-id: abc123
#   ✓ Cluster ready — coordinator elected`}</CodeBlock>

                        <CodeBlock title="Load a model (CLI)" lang="bash">{`# Load on local node only
./podx model load --file /path/to/llama3-8b.gguf

# Or open the web UI — Models page
open http://localhost:8080/ui`}</CodeBlock>

                        <CodeBlock title="Chat via curl" lang="bash">{`curl http://localhost:8080/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer sk-podx-..." \\
  -d '{
    "model": "podx-default",
    "messages": [{"role": "user", "content": "Hello!"}],
    "stream": true
  }'`}</CodeBlock>

                        <CodeBlock title="Chat via Python (OpenAI SDK)" lang="python">{`from openai import OpenAI

client = OpenAI(
    base_url="http://localhost:8080/v1",
    api_key="sk-podx-...",   # generate with: podx key generate
)

response = client.chat.completions.create(
    model="podx-default",
    messages=[{"role": "user", "content": "Explain gRPC in one paragraph."}],
    stream=True,
)

for chunk in response:
    print(chunk.choices[0].delta.content or "", end="", flush=True)`}</CodeBlock>

                        <Callout type="tip">
                            The <InlineCode>base_url</InlineCode> is the <strong className="text-emerald-200">only change</strong> needed from your existing OpenAI code. Every other call — streaming, function calling, model listing — is API-compatible.
                        </Callout>
                    </section>

                    {/* ─── Cluster Setup ─── */}
                    <section id="cluster-setup" className="scroll-mt-40 mb-16 pt-12 border-t border-[#21262d]">
                        <SectionHeader id="cluster-setup">Cluster Setup — Multiple Nodes</SectionHeader>
                        <p className="text-[0.93rem] text-[#c9d1d9] leading-relaxed mb-6">
                            Run the same binary on each machine. Nodes on the same Wi-Fi or Ethernet automatically discover each other via mDNS within seconds. No static IPs or config files required.
                        </p>

                        <SubHeader>Same LAN (mDNS auto-discovery)</SubHeader>
                        <CodeBlock title="Machine 1 (becomes coordinator if highest score)" lang="bash">{`./podx start
# gRPC :9090, HTTP :8080`}</CodeBlock>
                        <CodeBlock title="Machine 2" lang="bash">{`./podx start --port 9091 --http-port 8081
# Discovers Machine 1 via mDNS within ~5 seconds
# Lower-scored node becomes worker`}</CodeBlock>

                        <CodeBlock title="Verify cluster" lang="bash">{`./podx status
# Node count: 2 · Coordinator: machine-1 (score 4200)
# Worker: machine-2 (score 3800)

curl http://localhost:8080/api/nodes | jq`}</CodeBlock>

                        <SubHeader>Tailscale or explicit peers</SubHeader>
                        <CodeBlock title="Cross-network (manual connect)" lang="bash">{`./podx start --connect 100.64.0.1:9090
# Gossip protocol handles the rest`}</CodeBlock>

                        <SubHeader>Distribute a model across all nodes</SubHeader>
                        <CodeBlock title="Shard a model cluster-wide" lang="bash">{`./podx model install --file /path/to/llama3-70b-q4.gguf
# Computes shard map (layers proportional to hardware score)
# Pushes appropriate layer range to each node via gRPC
# Marks model active on the cluster`}</CodeBlock>

                        <Callout type="info">
                            <strong>Hardware-weighted shard assignment.</strong> Layers are assigned proportionally by hardware score — <InlineCode>RAM × 100 + CPU_cores × 50 + GPU_VRAM × 200 + platform_bonus</InlineCode>. A 16 GB M2 MacBook (score ~4000) gets more layers than a 32 GB Linux CPU server (score ~3600) because Metal accelerates matrix operations 10–20× faster.
                        </Callout>

                        <SubHeader>How the pipeline works</SubHeader>
                        <CodeBlock title="Per-token inference flow" lang="text">{`User request  →  Coordinator (layers 0–18)
                        │ activation tensor (~12 KiB over LAN)
                        ▼
              Worker A (layers 19–28)
                        │ logits → sample next token
                        ▼
              Streaming SSE token  →  client`}</CodeBlock>
                        <p className="text-[0.88rem] text-[#8b949e] leading-relaxed">
                            The hidden state passed between nodes is a float vector at the layer boundary. At 3072 dimensions (Llama 3.2 3B) it compresses to ~12 KiB per token, crossing a LAN in under 1 ms. Network is not the bottleneck.
                        </p>
                    </section>

                    {/* ─── CLI Reference ─── */}
                    <section id="cli" className="scroll-mt-40 mb-16 pt-12 border-t border-[#21262d]">
                        <SectionHeader id="cli">CLI Reference</SectionHeader>
                        <p className="text-[0.93rem] text-[#8b949e] mb-8">All commands operate on the local node unless otherwise noted.</p>

                        {[
                            {
                                group: "Node",
                                cmds: [
                                    { cmd: "podx start", flags: "[--port <n>] [--http-port <n>] [--connect <host:port>] [--force-coordinator] [--threads <n>]", desc: "Start the node. Hardware detection, gRPC server, HTTP server, and mDNS advertisement all launch together." },
                                    { cmd: "podx status", flags: "", desc: "Print cluster summary: node count, coordinator, active model, uptime." },
                                ],
                            },
                            {
                                group: "Model",
                                cmds: [
                                    { cmd: "podx model load", flags: "--file <path> [--n-ctx <n>] [--threads <n>]", desc: "Load a GGUF file on the local node only." },
                                    { cmd: "podx model install", flags: "--file <path> [--n-ctx <n>]", desc: "Compute a shard map and push each shard to the appropriate cluster node." },
                                    { cmd: "podx model list", flags: "", desc: "List all models known to the cluster." },
                                    { cmd: "podx model info <id>", flags: "", desc: "Show layer count, quantization, vocab size, and hidden dim." },
                                    { cmd: "podx model switch <id>", flags: "", desc: "Set the active model for inference requests." },
                                    { cmd: "podx model remove <id>", flags: "", desc: "Unload and remove a model from all nodes." },
                                ],
                            },
                            {
                                group: "Node management",
                                cmds: [
                                    { cmd: "podx node list", flags: "", desc: "List all cluster nodes with hardware details and roles." },
                                    { cmd: "podx node ping <id>", flags: "", desc: "Measure round-trip latency to a specific node." },
                                    { cmd: "podx node kick <id>", flags: "", desc: "Remove a node from the cluster." },
                                    { cmd: "podx node promote <id>", flags: "", desc: "Force a node to become coordinator." },
                                ],
                            },
                            {
                                group: "API keys",
                                cmds: [
                                    { cmd: "podx key generate", flags: "[--name <label>] [--scope Full|Chat|ReadOnly]", desc: "Create a new scoped bearer token." },
                                    { cmd: "podx key list", flags: "", desc: "List all active keys (name, scope, created date)." },
                                    { cmd: "podx key revoke <key>", flags: "", desc: "Immediately invalidate a key." },
                                ],
                            },
                            {
                                group: "Config",
                                cmds: [
                                    { cmd: "podx config show", flags: "", desc: "Print current cluster configuration." },
                                    { cmd: "podx config set <key> <value>", flags: "", desc: "Update a config value (lb_strategy, heartbeat_ms, max_queue, require_auth)." },
                                ],
                            },
                        ].map(({ group, cmds }) => (
                            <div key={group} className="mb-8">
                                <p className="text-[0.7rem] font-bold uppercase tracking-[0.14em] text-[#484f58] mb-3">{group}</p>
                                <div className="space-y-3">
                                    {cmds.map(({ cmd, flags, desc }) => (
                                        <div key={cmd} className="rounded-lg border border-[#21262d] p-4 bg-[#0d1117]/80 hover:border-violet-500/30 transition-colors">
                                            <div className="flex flex-wrap items-baseline gap-2 mb-2">
                                                <code className="text-emerald-400 font-mono font-bold text-[0.88rem]">{cmd}</code>
                                                {flags && <code className="text-[#484f58] font-mono text-[0.78rem]">{flags}</code>}
                                            </div>
                                            <p className="text-[0.84rem] text-[#8b949e] leading-relaxed">{desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </section>

                    {/* ─── HTTP API ─── */}
                    <section id="api-ref" className="scroll-mt-40 mb-16 pt-12 border-t border-[#21262d]">
                        <SectionHeader id="api-ref">HTTP API</SectionHeader>
                        <p className="text-[0.93rem] text-[#8b949e] mb-2">
                            Default coordinator HTTP port: <strong className="text-[#e6edf3] font-mono">8080</strong>
                        </p>
                        <p className="text-[0.93rem] text-[#8b949e] mb-6">
                            Authenticated endpoints require a bearer token in the <InlineCode>Authorization</InlineCode> header:{" "}
                            <InlineCode>Authorization: Bearer sk-podx-...</InlineCode>
                        </p>

                        <SubHeader>Authentication scopes</SubHeader>
                        <div className="overflow-x-auto rounded-xl border border-[#21262d] mb-8">
                            <table className="w-full text-[0.87rem] border-collapse">
                                <thead>
                                    <tr className="bg-[#161b22] text-[0.7rem] uppercase tracking-wider text-[#484f58]">
                                        <th className="text-left py-3 px-4 border-b border-[#21262d]">Scope</th>
                                        <th className="text-left py-3 px-4 border-b border-[#21262d]">Access</th>
                                    </tr>
                                </thead>
                                <tbody className="text-[#c9d1d9]">
                                    {[
                                        ["Full", "All endpoints — config, key management, model loading, inference"],
                                        ["Chat", "Inference endpoints only (/v1/*)"],
                                        ["ReadOnly", "Cluster status and metrics endpoints only"],
                                    ].map(([scope, access]) => (
                                        <tr key={scope} className="border-b border-[#21262d] last:border-0">
                                            <td className="py-3 px-4 font-mono text-violet-300 text-[0.85rem]">{scope}</td>
                                            <td className="py-3 px-4 text-[#8b949e]">{access}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <SubHeader>Endpoint reference</SubHeader>
                        <div className="overflow-x-auto rounded-xl border border-[#21262d] mb-6">
                            <table className="w-full text-[0.85rem] border-collapse">
                                <thead>
                                    <tr className="bg-[#161b22] text-[0.7rem] uppercase tracking-wider text-[#484f58]">
                                        <th className="text-left py-3 px-4 border-b border-[#21262d]">Method</th>
                                        <th className="text-left py-3 px-4 border-b border-[#21262d]">Path</th>
                                        <th className="text-left py-3 px-4 border-b border-[#21262d]">Auth</th>
                                        <th className="text-left py-3 px-4 border-b border-[#21262d]">Description</th>
                                    </tr>
                                </thead>
                                <tbody className="text-[#c9d1d9]">
                                    {[
                                        ["POST", "/v1/chat/completions", "Chat / Full", "OpenAI-compatible streaming inference (SSE)"],
                                        ["GET", "/v1/models", "—", "List available models"],
                                        ["GET", "/api/nodes", "—", "All cluster nodes with full hardware info"],
                                        ["GET", "/api/metrics", "—", "Node count, active model, coordinator ID"],
                                        ["GET", "/api/state", "—", "Full ClusterState document"],
                                        ["POST", "/api/model/load", "Full", "Load a GGUF file on the local node"],
                                        ["POST", "/api/models/install", "Full", "Distribute model shards across the cluster"],
                                        ["POST", "/api/config", "Full", "Update lb_strategy, heartbeat_ms, max_queue, require_auth"],
                                        ["POST", "/api/keys", "Full", "Create an API key"],
                                        ["GET", "/api/keys", "Full", "List all API keys"],
                                        ["DELETE", "/api/keys/:key", "Full", "Revoke an API key"],
                                        ["GET", "/ui", "—", "Embedded web dashboard"],
                                    ].map(([method, path, auth, desc]) => (
                                        <tr key={path} className="border-b border-[#21262d] last:border-0 hover:bg-[#161b22]/50">
                                            <td className="py-3 px-4 font-mono text-[0.8rem]">
                                                <span className={`font-bold ${method === "POST" ? "text-violet-300" : method === "DELETE" ? "text-red-400" : "text-cyan-400"}`}>{method}</span>
                                            </td>
                                            <td className="py-3 px-4 font-mono text-emerald-400 text-[0.82rem]">{path}</td>
                                            <td className="py-3 px-4 text-[#8b949e] text-[0.8rem] whitespace-nowrap">{auth}</td>
                                            <td className="py-3 px-4 text-[#8b949e]">{desc}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <SubHeader>Example: streaming chat</SubHeader>
                        <CodeBlock title="POST /v1/chat/completions" lang="bash">{`curl http://localhost:8080/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer sk-podx-YOUR_KEY" \\
  -d '{
    "model": "podx-default",
    "stream": true,
    "messages": [
      {"role": "system", "content": "You are a helpful assistant."},
      {"role": "user", "content": "Explain pipeline parallelism in one paragraph."}
    ]
  }'`}</CodeBlock>
                    </section>

                    {/* ─── Architecture ─── */}
                    <section id="architecture" className="scroll-mt-40 mb-16 pt-12 border-t border-[#21262d]">
                        <SectionHeader id="architecture">Architecture</SectionHeader>
                        <p className="text-[0.93rem] text-[#c9d1d9] leading-relaxed mb-6">
                            One Cargo workspace with strict dependency boundaries — <InlineCode>podx-core</InlineCode> has zero workspace dependencies; every other crate depends downward only.
                        </p>

                        <SubHeader>Workspace layout</SubHeader>
                        <CodeBlock title="Directory tree" lang="text">{`podx/
├── crates/
│   ├── podx-core       Shared types: NodeInfo, HardwareInfo, ModelMeta, ApiKey …
│   ├── podx-state      ClusterState, gossip engine, shard map, coordinator election
│   ├── podx-inference  llama.cpp backend, hardware detection, Metal/CUDA features
│   ├── podx-network    tonic gRPC server/client, mDNS discovery, tensor serialisation
│   ├── podx-api        axum HTTP router, OpenAI handlers, SSE streaming, dashboard
│   ├── podx-cli        clap CLI commands (start, model, key, node, config)
│   └── podx-node       Binary entry point — wires all crates together
└── proto/
    └── cluster.proto   gRPC services: Forward, Gossip, Heartbeat, InstallShard`}</CodeBlock>

                        <SubHeader>Dependency graph</SubHeader>
                        <CodeBlock title="Import order (no circular deps)" lang="text">{`podx-core  ←  podx-state  ←  podx-network  ←  podx-api  ←  podx-node
                    ↑                                ↑
              podx-inference  ────────────────────────┘`}</CodeBlock>

                        <SubHeader>Core types</SubHeader>
                        <CodeBlock title="podx-core/src/types.rs (key structs)" lang="rust">{`NodeInfo {
    id: NodeId,
    grpc_addr: SocketAddr,
    http_addr: SocketAddr,
    hardware: HardwareInfo,
    status: NodeStatus,           // Online | Offline | Syncing
    layers: Option<(u32, u32)>,   // shard range [start, end)
    queue_depth: u32,
    avg_latency_ms: f64,
}

HardwareInfo {
    ram_gb: f64,
    cpu_cores: u32,
    cpu_arch: String,
    has_gpu: bool,
    gpu_vram_gb: f64,
    os: OsKind,                   // MacOS | Linux | Windows
}

ClusterState {
    coordinator: NodeId,
    nodes: HashMap<NodeId, NodeInfo>,
    shard_map: ShardMap,
    active_model: Option<ModelMeta>,
    version: u64,
    require_auth: bool,
    lb_strategy: LoadBalanceStrategy,
}

ModelMeta {
    id: String,
    layer_count: u32,
    hidden_dim: u32,
    vocab_size: u32,
    quant: QuantType,
    size_bytes: u64,
}`}</CodeBlock>

                        <SubHeader>gRPC services</SubHeader>
                        <div className="overflow-x-auto rounded-xl border border-[#21262d] mb-6">
                            <table className="w-full text-[0.87rem] border-collapse">
                                <thead>
                                    <tr className="bg-[#161b22] text-[0.7rem] uppercase tracking-wider text-[#484f58]">
                                        <th className="text-left py-3 px-4 border-b border-[#21262d]">RPC</th>
                                        <th className="text-left py-3 px-4 border-b border-[#21262d]">Purpose</th>
                                    </tr>
                                </thead>
                                <tbody className="text-[#c9d1d9]">
                                    {[
                                        ["Forward", "Transmit activation tensor from one node to the next in the pipeline"],
                                        ["Gossip", "Replicate ClusterState changes to a random peer"],
                                        ["Heartbeat", "Keep-alive ping; 3 missed = node marked offline, shard map rebalanced"],
                                        ["InstallShard", "Push model weight bytes to a specific node during cluster-wide install"],
                                    ].map(([rpc, purpose]) => (
                                        <tr key={rpc} className="border-b border-[#21262d] last:border-0">
                                            <td className="py-3 px-4 font-mono text-cyan-400 text-[0.85rem]">{rpc}</td>
                                            <td className="py-3 px-4 text-[#8b949e]">{purpose}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <SubHeader>Load-balancing strategies</SubHeader>
                        <div className="overflow-x-auto rounded-xl border border-[#21262d] mb-4">
                            <table className="w-full text-[0.87rem] border-collapse">
                                <thead>
                                    <tr className="bg-[#161b22] text-[0.7rem] uppercase tracking-wider text-[#484f58]">
                                        <th className="text-left py-3 px-4 border-b border-[#21262d]">Strategy</th>
                                        <th className="text-left py-3 px-4 border-b border-[#21262d]">Behavior</th>
                                    </tr>
                                </thead>
                                <tbody className="text-[#c9d1d9]">
                                    {[
                                        ["LeastLoaded (default)", "Routes to the node with the fewest queued requests"],
                                        ["RoundRobin", "Distributes requests in strict rotation"],
                                        ["LatencyAware", "Prefers the node with the lowest recent average latency"],
                                        ["Weighted", "Probability proportional to each node's hardware score"],
                                        ["Random", "Picks a random available node"],
                                    ].map(([strategy, behavior]) => (
                                        <tr key={strategy} className="border-b border-[#21262d] last:border-0">
                                            <td className="py-3 px-4 font-mono text-violet-300 text-[0.85rem] whitespace-nowrap">{strategy}</td>
                                            <td className="py-3 px-4 text-[#8b949e]">{behavior}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <p className="text-[0.86rem] text-[#64748b]">Strategies switch live from the dashboard or <InlineCode>podx config set lb_strategy RoundRobin</InlineCode> — no restart required.</p>
                    </section>

                    {/* ─── Key Concepts ─── */}
                    <section id="concepts" className="scroll-mt-40 mb-16 pt-12 border-t border-[#21262d]">
                        <SectionHeader id="concepts">Key Concepts</SectionHeader>

                        <SubHeader>1. KV Cache — O(1) decode per token</SubHeader>
                        <p className="text-[0.93rem] text-[#c9d1d9] leading-relaxed mb-4">
                            Every token requires the model to attend over all previous tokens. Without a cache this is O(N²) total work. The KV cache stores each token's Key and Value matrices as it is processed, so subsequent tokens only compute one new pair rather than reprocessing the full sequence.
                        </p>
                        <CodeBlock title="Complexity comparison" lang="text">{`Without KV cache:               With KV cache:
  Token 1: compute 1 pair         Token 1: compute 1 pair, cache it
  Token 2: recompute 1+2 pairs    Token 2: read cache, compute 1 new pair
  Token N: O(N²) total work       Token N: O(N) total, O(1) per step`}</CodeBlock>
                        <p className="text-[0.88rem] text-[#8b949e] leading-relaxed mb-6">
                            The KV cache is <strong className="text-[#c9d1d9]">distributed</strong> — each node caches only the K/V pairs for its own layer slice. On every decode step each node reads its local cache, keeping the inter-node gRPC payload at ~12 KiB (single-token activation) rather than hundreds of kilobytes (full sequence replay).
                        </p>

                        <SubHeader>2. Speculative Decoding — 2–4× throughput</SubHeader>
                        <p className="text-[0.93rem] text-[#c9d1d9] leading-relaxed mb-4">
                            Token generation is inherently sequential: you cannot generate token N+1 until token N is known. Speculative decoding breaks this limit by using a small draft model to predict ahead.
                        </p>
                        <CodeBlock title="How it works" lang="text">{`Draft model (3B):  [the] [cat] [sat] [on] [the]  ← 5 guesses in ~50ms
Target model (70B): [the] [cat] [ran] [on] ...    ← verifies all 5 in ~500ms
                             ✓    ✗
Result: accepts "the cat", corrects to "ran" — 3 tokens from 1 big-model pass`}</CodeBlock>
                        <p className="text-[0.88rem] text-[#8b949e] leading-relaxed mb-6">
                            With ~65% acceptance rate (typical for natural language), speculative decoding yields <strong className="text-[#c9d1d9]">2–3× effective throughput</strong> with no hardware changes.
                        </p>

                        <SubHeader>3. Score-based coordinator election</SubHeader>
                        <p className="text-[0.93rem] text-[#c9d1d9] leading-relaxed mb-4">
                            Every node computes a hardware score at startup. The highest-scoring node automatically becomes coordinator. If it disappears (3 missed heartbeats in 30 s), the cluster re-elects without operator intervention.
                        </p>
                        <CodeBlock title="Election score formula" lang="text">{`score = RAM_GB × 100
      + CPU_cores × 50
      + GPU_VRAM_GB × 200
      + platform_bonus   // +2000 for Apple Silicon (unified memory)`}</CodeBlock>

                        <SubHeader>4. Gossip-based cluster state</SubHeader>
                        <p className="text-[0.93rem] text-[#c9d1d9] leading-relaxed mb-4">
                            PodX uses the same eventual-consistency gossip mechanism as Cassandra, Consul, and Redis Cluster. Each node periodically shares its <InlineCode>ClusterState</InlineCode> view with a random peer. Within a few rounds all nodes converge. Version numbers detect and resolve conflicts. No central database — no SPOF.
                        </p>

                        <SubHeader>5. gRPC wire protocol</SubHeader>
                        <p className="text-[0.93rem] text-[#c9d1d9] leading-relaxed mb-2">
                            Inter-node activations are transmitted as Protocol Buffer messages over HTTP/2. The hidden-state tensor is additionally compressed: float32 → float16, then LZ4, yielding ~6× reduction (1.5 MB → ~250 KB raw). HTTP/2 multiplexing allows multiple in-flight requests on a single TCP connection.
                        </p>
                    </section>

                    {/* ─── Performance ─── */}
                    <section id="performance" className="scroll-mt-40 mb-16 pt-12 border-t border-[#21262d]">
                        <SectionHeader id="performance">Performance</SectionHeader>
                        <p className="text-[0.93rem] text-[#c9d1d9] leading-relaxed mb-6">
                            Benchmarks measured on a two-node cluster: Mac coordinator (M-series, Metal) + Linux CPU worker. Model: Llama 3.2 3B-Instruct IQ3_M.
                        </p>

                        <SubHeader>Decode latency vs. context length</SubHeader>
                        <div className="overflow-x-auto rounded-xl border border-[#21262d] mb-6">
                            <table className="w-full text-[0.87rem] border-collapse">
                                <thead>
                                    <tr className="bg-[#161b22] text-[0.7rem] uppercase tracking-wider text-[#484f58]">
                                        <th className="text-left py-3 px-4 border-b border-[#21262d]">Metric</th>
                                        <th className="text-left py-3 px-4 border-b border-[#21262d] text-red-400">No KV Cache</th>
                                        <th className="text-left py-3 px-4 border-b border-[#21262d] text-emerald-400">KV Cache</th>
                                        <th className="text-left py-3 px-4 border-b border-[#21262d] text-violet-400">+ Speculative</th>
                                    </tr>
                                </thead>
                                <tbody className="text-[#c9d1d9]">
                                    {[
                                        ["Decode latency scaling", "O(N) per token", "O(1) per token", "O(1) per token"],
                                        ["Throughput (tok/s)", "baseline", "1×", "2–4×"],
                                        ["Worker time at token 35", "~9 500 ms", "~400 ms", "~400 ms"],
                                        ["Coordinator embed at token 35", "~10 000 ms", "~50 ms", "~50 ms"],
                                    ].map(([metric, no, kv, spec]) => (
                                        <tr key={metric} className="border-b border-[#21262d] last:border-0 hover:bg-[#161b22]/50">
                                            <td className="py-3 px-4 text-[#c9d1d9] font-medium">{metric}</td>
                                            <td className="py-3 px-4 text-red-400 font-mono text-[0.82rem]">{no}</td>
                                            <td className="py-3 px-4 text-emerald-400 font-mono text-[0.82rem]">{kv}</td>
                                            <td className="py-3 px-4 text-violet-400 font-mono text-[0.82rem]">{spec}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <SubHeader>Two-node cluster targets (3B model)</SubHeader>
                        <div className="grid sm:grid-cols-3 gap-3 mb-6">
                            {[
                                ["Prefill", "~4 000 ms", "One-time cost for first message in a new session"],
                                ["Decode / token", "500–700 ms", "~1.5–2 tok/s steady state"],
                                ["+ Speculative", "~3–5 tok/s", "65% acceptance rate, 2–3× multiplier"],
                            ].map(([label, value, note]) => (
                                <div key={label} className="rounded-xl border border-[#21262d] bg-[#0d1117]/80 p-5 hover:border-violet-500/30 transition-colors">
                                    <p className="text-[0.7rem] font-bold uppercase tracking-widest text-[#484f58] mb-1">{label}</p>
                                    <p className="text-[1.3rem] font-black text-[#a78bfa] tabular-nums mb-1">{value}</p>
                                    <p className="text-[0.72rem] text-[#64748b] leading-snug">{note}</p>
                                </div>
                            ))}
                        </div>

                        <Callout type="tip">
                            Single-node Mac baseline is ~1.2 tok/s. A two-node cluster exceeds this — the crossover point where distribution pays off. Adding more nodes or higher-VRAM hardware scales further.
                        </Callout>

                        <SubHeader>Competitive landscape</SubHeader>
                        <div className="overflow-x-auto rounded-xl border border-[#21262d] mb-4">
                            <table className="w-full text-[0.87rem] border-collapse">
                                <thead>
                                    <tr className="bg-[#161b22] text-[0.7rem] uppercase tracking-wider text-[#484f58]">
                                        <th className="text-left py-3 px-4 border-b border-[#21262d]">Solution</th>
                                        <th className="text-left py-3 px-4 border-b border-[#21262d]">Cost</th>
                                        <th className="text-left py-3 px-4 border-b border-[#21262d]">Privacy</th>
                                        <th className="text-left py-3 px-4 border-b border-[#21262d]">Multi-machine</th>
                                        <th className="text-left py-3 px-4 border-b border-[#21262d]">Setup</th>
                                    </tr>
                                </thead>
                                <tbody className="text-[#c9d1d9]">
                                    {[
                                        ["OpenAI API", "$2–15 / M tokens", "Data leaves network", "Cloud only", "None"],
                                        ["Azure / AWS hosted", "$3–20 / M tokens", "Data leaves network", "Cloud only", "Moderate"],
                                        ["vLLM (single node)", "Hardware CapEx", "On-prem", "No", "High (Python, CUDA)"],
                                        ["Ollama", "Hardware CapEx", "On-prem", "No", "Low (single binary)"],
                                        ["PodX", "$0 / token", "Fully on-prem", "Core feature", "Minimal (single binary)"],
                                    ].map(([sol, cost, priv, multi, setup]) => (
                                        <tr
                                            key={sol}
                                            className={`border-b border-[#21262d] last:border-0 ${sol === "PodX" ? "bg-violet-500/[0.06]" : "hover:bg-[#161b22]/50"}`}
                                        >
                                            <td className={`py-3 px-4 font-medium ${sol === "PodX" ? "text-violet-300 font-bold" : "text-[#c9d1d9]"}`}>{sol}</td>
                                            <td className={`py-3 px-4 ${sol === "PodX" ? "text-emerald-400 font-bold" : "text-[#8b949e]"}`}>{cost}</td>
                                            <td className={`py-3 px-4 ${sol === "PodX" ? "text-emerald-400 font-bold" : "text-[#8b949e]"}`}>{priv}</td>
                                            <td className={`py-3 px-4 ${sol === "PodX" ? "text-emerald-400 font-bold" : "text-[#8b949e]"}`}>{multi}</td>
                                            <td className={`py-3 px-4 ${sol === "PodX" ? "text-emerald-400 font-bold" : "text-[#8b949e]"}`}>{setup}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* ─── Tech Stack ─── */}
                    <section id="tech-stack" className="scroll-mt-40 mb-16 pt-12 border-t border-[#21262d]">
                        <SectionHeader id="tech-stack">Technology Stack</SectionHeader>
                        <p className="text-[0.93rem] text-[#c9d1d9] leading-relaxed mb-6">
                            Every library was selected for a specific reason — no incidental dependencies.
                        </p>
                        <div className="overflow-x-auto rounded-xl border border-[#21262d] mb-4">
                            <table className="w-full text-[0.87rem] border-collapse">
                                <thead>
                                    <tr className="bg-[#161b22] text-[0.7rem] uppercase tracking-wider text-[#484f58]">
                                        <th className="text-left py-3 px-4 border-b border-[#21262d]">Layer</th>
                                        <th className="text-left py-3 px-4 border-b border-[#21262d]">Technology</th>
                                        <th className="text-left py-3 px-4 border-b border-[#21262d]">Why</th>
                                    </tr>
                                </thead>
                                <tbody className="text-[#c9d1d9]">
                                    {[
                                        ["Language", "Rust", "Memory-safe, zero-cost abstractions, no GC pauses during inference"],
                                        ["Inference", "llama.cpp via llama-cpp-2", "State-of-the-art GGUF quantization; runs on CPU, Metal, CUDA"],
                                        ["RPC", "tonic (gRPC / Protobuf)", "Binary protocol, generated types, HTTP/2 multiplexing"],
                                        ["Async runtime", "Tokio", "Industry-standard Rust async, battle-tested at scale"],
                                        ["Discovery", "mdns-sd", "Zero-config LAN peer discovery"],
                                        ["Cluster state", "Custom gossip engine", "Eventual consistency, no SPOF"],
                                        ["HTTP API", "Axum (HTTP/1.1 + SSE)", "Lightweight, composable, streaming-first"],
                                        ["Compression", "LZ4 + FP16 quantization", "~6× payload reduction on inter-node tensor transfers"],
                                    ].map(([layer, tech, why]) => (
                                        <tr key={layer} className="border-b border-[#21262d] last:border-0 hover:bg-[#161b22]/50">
                                            <td className="py-3 px-4 text-[#8b949e] font-mono text-[0.82rem] whitespace-nowrap">{layer}</td>
                                            <td className="py-3 px-4 font-semibold text-violet-300">{tech}</td>
                                            <td className="py-3 px-4 text-[#8b949e]">{why}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* ─── Roadmap ─── */}
                    <section id="roadmap" className="scroll-mt-40 mb-20 pt-12 border-t border-[#21262d]">
                        <SectionHeader id="roadmap">Roadmap</SectionHeader>
                        <p className="text-[0.93rem] text-[#c9d1d9] leading-relaxed mb-8">
                            Planned features across performance, model support, networking, cluster management, and developer experience.
                        </p>

                        {[
                            {
                                title: "Performance",
                                accent: "emerald",
                                items: [
                                    "KV-cache sharding — each node caches only K/V pairs for its own layer slice",
                                    "Tensor compression — quantize activations in-flight before gRPC transmission",
                                    "Prefill / decode split — route prefill to GPU nodes, decode to idle nodes",
                                    "Speculative decoding with configurable draft model",
                                    "Continuous batching — bin-pack concurrent requests into a single forward pass",
                                    "Flash Attention 2 integration (Metal + CUDA)",
                                ],
                            },
                            {
                                title: "Model Support",
                                accent: "violet",
                                items: [
                                    "HuggingFace Hub download — podx model install meta-llama/Llama-3-8B-Instruct",
                                    "Multi-model serving — load multiple models, route by model name",
                                    "Live shard rebalancing — redistribute layers when nodes join or leave mid-serving",
                                    "Vision model support — LLaVA, Qwen-VL routing",
                                ],
                            },
                            {
                                title: "Networking",
                                accent: "cyan",
                                items: [
                                    "QUIC transport — replace TCP gRPC for high-latency or unreliable links",
                                    "WireGuard overlay — automatic VPN mesh across networks",
                                    "Bandwidth-aware shard placement — factor link speed into assignment",
                                    "Reconnect with jitter backoff for unstable Wi-Fi",
                                ],
                            },
                            {
                                title: "Cluster Management",
                                accent: "orange",
                                items: [
                                    "Persistent config to ~/.podx/config.toml",
                                    "podx logs --follow — stream structured logs from all nodes",
                                    "Graceful drain — finish in-flight requests before shutdown",
                                    "Auto-demotion of slow or unresponsive nodes",
                                ],
                            },
                            {
                                title: "Developer Experience",
                                accent: "pink",
                                items: [
                                    "podx bench — built-in throughput and latency benchmark tool",
                                    "Prometheus /metrics — drop-in Grafana dashboard",
                                    "Docker Compose — spin up a multi-node cluster locally with one command",
                                    "GitHub Actions CI — build matrix: Linux / macOS × CPU / Metal / CUDA",
                                ],
                            },
                        ].map(({ title, accent, items }) => {
                            const colors: Record<string, string> = {
                                emerald: "text-emerald-400 border-emerald-500/30 bg-emerald-500/[0.06]",
                                violet: "text-violet-400 border-violet-500/30 bg-violet-500/[0.06]",
                                cyan: "text-cyan-400 border-cyan-500/30 bg-cyan-500/[0.06]",
                                orange: "text-orange-400 border-orange-500/30 bg-orange-500/[0.06]",
                                pink: "text-pink-400 border-pink-500/30 bg-pink-500/[0.06]",
                            };
                            return (
                                <div key={title} className={`rounded-xl border p-6 mb-4 ${colors[accent]}`}>
                                    <p className="text-[0.78rem] font-bold uppercase tracking-widest mb-4 opacity-80">{title}</p>
                                    <ul className="space-y-2">
                                        {items.map((item) => (
                                            <li key={item} className="flex gap-2.5 text-[0.87rem] text-[#c9d1d9]">
                                                <span className="opacity-40 shrink-0 mt-0.5">○</span>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            );
                        })}
                    </section>

                    {/* Footer nav */}
                    <div className="flex flex-wrap gap-4 pt-8 border-t border-[#21262d]">
                        <Link to="/podx" className="text-violet-400 hover:underline text-[0.93rem]">
                            ← PodX home
                        </Link>
                        <Link to="/" className="text-[#8b949e] hover:text-emerald-400 text-[0.93rem]">
                            Profile site
                        </Link>
                        <a
                            href="#introduction"
                            className="ml-auto text-[#484f58] hover:text-[#8b949e] text-[0.93rem] transition-colors"
                        >
                            Back to top ↑
                        </a>
                    </div>
                </main>
            </div>
        </div>
    );
}
