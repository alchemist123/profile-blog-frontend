import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const SECTIONS = [
    { id: "introduction", label: "Introduction" },
    { id: "installation", label: "Installation" },
    { id: "quickstart", label: "Quick Start" },
    { id: "cli", label: "CLI Reference" },
    { id: "api-ref", label: "HTTP API" },
    { id: "architecture", label: "Architecture" },
];

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
                <Link to="/podx" className="font-black bg-gradient-to-br from-[#a78bfa] to-[#818cf8] bg-clip-text text-transparent">
                    PodX
                </Link>
                <span className="text-[0.72rem] text-[#484f58] hidden sm:inline">v0.1.0 · Alpha</span>
                <div className="ml-auto flex gap-2 text-[0.84rem]">
                    <Link to="/podx" className="text-[#8b949e] hover:text-[#e6edf3] px-3 py-1 rounded-lg hover:bg-[#161b22] transition-colors">
                        Home
                    </Link>
                    <a href="#installation" className="text-[#8b949e] hover:text-[#e6edf3] px-3 py-1 rounded-lg hover:bg-[#161b22] transition-colors hidden sm:inline">
                        Install
                    </a>
                </div>
            </div>

            <div className="max-w-6xl mx-auto flex flex-col lg:flex-row lg:items-start">
                {/* Sidebar — desktop */}
                <aside className="hidden lg:block w-60 shrink-0 sticky top-[calc(4rem+3.5rem)] h-[calc(100vh-8rem)] overflow-y-auto py-8 pl-6 pr-4 border-r border-[#21262d]">
                    <p className="text-[0.65rem] font-bold tracking-[0.12em] uppercase text-[#484f58] px-2 mb-2">On this page</p>
                    {SECTIONS.map((s) => (
                        <a
                            key={s.id}
                            href={`#${s.id}`}
                            className={`block text-[0.83rem] py-2 px-2.5 rounded-lg mb-0.5 transition-colors ${
                                active === s.id ? "text-violet-400 bg-violet-500/12 font-semibold" : "text-[#8b949e] hover:text-[#e6edf3] hover:bg-[#161b22]"
                            }`}
                        >
                            {s.label}
                        </a>
                    ))}
                </aside>

                <main className="flex-1 px-5 sm:px-8 lg:px-12 py-10 max-w-[860px]">
                    <section id="introduction" className="scroll-mt-40 mb-16">
                        <h1 className="text-4xl font-black tracking-tight mb-3">
                            PodX <span className="bg-gradient-to-br from-[#a78bfa] to-[#818cf8] bg-clip-text text-transparent">Documentation</span>
                        </h1>
                        <p className="text-lg text-[#8b949e] leading-relaxed mb-8">
                            PodX is a distributed LLM inference cluster written in Rust. Install one binary on multiple devices; they form a cluster that can run models too large for any single machine.
                        </p>
                        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/8 p-4 text-[0.88rem] text-emerald-300/90 leading-relaxed flex gap-3">
                            <span className="shrink-0">✅</span>
                            <div>
                                <strong className="text-emerald-200">OpenAI-compatible.</strong> PodX exposes <code className="text-violet-300 bg-[#161b22] px-1.5 py-0.5 rounded text-[0.85em]">/v1/chat/completions</code> with streaming SSE. Point your existing OpenAI client at PodX — change the base URL only.
                            </div>
                        </div>
                        <h3 className="text-lg font-bold mt-10 mb-3 text-[#e6edf3]">What PodX does</h3>
                        <ul className="list-disc pl-6 space-y-2 text-[#c9d1d9] text-[0.93rem] leading-relaxed">
                            <li>Discovers peers on your LAN via <strong>mDNS</strong></li>
                            <li>Elects a <strong>coordinator</strong> from hardware score</li>
                            <li>Splits transformer layers across nodes (pipeline parallelism)</li>
                            <li>Routes inference over <strong>gRPC</strong>, streams tokens via HTTP</li>
                            <li>Embedded <strong>web dashboard</strong> for cluster state</li>
                        </ul>
                    </section>

                    <section id="installation" className="scroll-mt-40 mb-16 pt-12 border-t border-[#21262d]">
                        <h2 className="text-2xl font-extrabold tracking-tight mb-4 text-[#e6edf3]">Installation</h2>
                        <p className="text-[0.93rem] text-[#c9d1d9] leading-relaxed mb-6">
                            PodX builds from source with Cargo. Install Rust via{" "}
                            <a href="https://rustup.rs" className="text-violet-400 hover:underline" target="_blank" rel="noopener noreferrer">
                                rustup
                            </a>
                            , then platform tools (protobuf, cmake, etc.). See the full matrix in the original project README.
                        </p>
                        <div className="rounded-xl border border-[#30363d] overflow-hidden bg-[#161b22] mb-6">
                            <div className="px-4 py-2 border-b border-[#21262d] bg-[#21262d] text-[0.7rem] font-bold uppercase tracking-wider text-[#484f58]">
                                macOS / Linux (outline)
                            </div>
                            <pre className="p-5 text-[0.815rem] leading-relaxed overflow-x-auto font-mono text-[#e6edf3]">
                                {`# Clone and build (example)
git clone <your-podx-repo>.git
cd podx
cargo build --release

# Apple Silicon + Metal
cargo build --release --features podx-inference/metal

# Linux + CUDA
cargo build --release --features podx-inference/cuda`}
                            </pre>
                        </div>
                    </section>

                    <section id="quickstart" className="scroll-mt-40 mb-16 pt-12 border-t border-[#21262d]">
                        <h2 className="text-2xl font-extrabold tracking-tight mb-4">Quick Start</h2>
                        <ol className="list-decimal pl-6 space-y-3 text-[0.93rem] text-[#c9d1d9] leading-relaxed">
                            <li>
                                Run <code className="text-violet-300 bg-[#161b22] px-1.5 rounded text-[0.85em]">podx start</code> — HTTP default <code className="text-cyan-300">8080</code>, gRPC{" "}
                                <code className="text-cyan-300">9090</code>.
                            </li>
                            <li>
                                Open <code className="text-cyan-300">http://localhost:8080/ui</code> for the dashboard.
                            </li>
                            <li>
                                Load a GGUF model via UI or <code className="text-violet-300 bg-[#161b22] px-1.5 rounded text-[0.85em]">podx model load --file /path/to/model.gguf</code>
                            </li>
                            <li>Call <code className="text-cyan-300">/v1/chat/completions</code> with your OpenAI client pointed at PodX.</li>
                        </ol>
                    </section>

                    <section id="cli" className="scroll-mt-40 mb-16 pt-12 border-t border-[#21262d]">
                        <h2 className="text-2xl font-extrabold tracking-tight mb-4">CLI Reference</h2>
                        <div className="space-y-4 text-[0.88rem] text-[#c9d1d9]">
                            <div className="rounded-lg border border-[#21262d] p-4 bg-[#161b22]/50">
                                <code className="text-emerald-400 font-mono font-bold">podx start</code>
                                <p className="mt-2 text-[#8b949e]">Start node: hardware detection, gRPC + HTTP, mDNS. Flags: <code className="text-cyan-300">--port</code>, <code className="text-cyan-300">--http-port</code>, <code className="text-cyan-300">--connect</code>.</p>
                            </div>
                            <div className="rounded-lg border border-[#21262d] p-4 bg-[#161b22]/50">
                                <code className="text-emerald-400 font-mono font-bold">podx model load --file &lt;path&gt;</code>
                                <p className="mt-2 text-[#8b949e]">Load GGUF on local node.</p>
                            </div>
                            <div className="rounded-lg border border-[#21262d] p-4 bg-[#161b22]/50">
                                <code className="text-emerald-400 font-mono font-bold">podx model install --file &lt;path&gt;</code>
                                <p className="mt-2 text-[#8b949e]">Shard model across the cluster.</p>
                            </div>
                            <div className="rounded-lg border border-[#21262d] p-4 bg-[#161b22]/50">
                                <code className="text-emerald-400 font-mono font-bold">podx key generate --scope Chat</code>
                                <p className="mt-2 text-[#8b949e]">API keys: Full, Chat, ReadOnly scopes.</p>
                            </div>
                        </div>
                    </section>

                    <section id="api-ref" className="scroll-mt-40 mb-16 pt-12 border-t border-[#21262d]">
                        <h2 className="text-2xl font-extrabold tracking-tight mb-4">HTTP API</h2>
                        <p className="text-[0.93rem] text-[#8b949e] mb-6">Default coordinator HTTP port: <strong className="text-[#e6edf3]">8080</strong></p>
                        <div className="overflow-x-auto rounded-xl border border-[#21262d]">
                            <table className="w-full text-[0.87rem] border-collapse">
                                <thead>
                                    <tr className="bg-[#161b22] text-[0.7rem] uppercase tracking-wider text-[#484f58]">
                                        <th className="text-left py-3 px-4 border-b border-[#21262d]">Endpoint</th>
                                        <th className="text-left py-3 px-4 border-b border-[#21262d]">Notes</th>
                                    </tr>
                                </thead>
                                <tbody className="text-[#c9d1d9]">
                                    <tr className="border-b border-[#21262d]">
                                        <td className="py-3 px-4 font-mono text-emerald-400">POST /v1/chat/completions</td>
                                        <td className="py-3 px-4">OpenAI-compatible streaming chat</td>
                                    </tr>
                                    <tr className="border-b border-[#21262d]">
                                        <td className="py-3 px-4 font-mono">GET /api/nodes</td>
                                        <td className="py-3 px-4">Cluster nodes & hardware</td>
                                    </tr>
                                    <tr className="border-b border-[#21262d]">
                                        <td className="py-3 px-4 font-mono">GET /api/state</td>
                                        <td className="py-3 px-4">Full ClusterState</td>
                                    </tr>
                                    <tr>
                                        <td className="py-3 px-4 font-mono">GET /ui</td>
                                        <td className="py-3 px-4">Web dashboard</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <section id="architecture" className="scroll-mt-40 mb-20 pt-12 border-t border-[#21262d]">
                        <h2 className="text-2xl font-extrabold tracking-tight mb-4">Architecture</h2>
                        <p className="text-[0.93rem] text-[#c9d1d9] leading-relaxed mb-4">
                            Workspace crates: <code className="text-violet-300">podx-core</code>, <code className="text-violet-300">podx-state</code>,{" "}
                            <code className="text-violet-300">podx-inference</code>, <code className="text-violet-300">podx-network</code>, <code className="text-violet-300">podx-api</code>,{" "}
                            <code className="text-violet-300">podx-cli</code>, <code className="text-violet-300">podx-node</code>. Gossip keeps <code className="text-cyan-300">ClusterState</code> in sync; coordinator election is score-based (RAM, cores, GPU, OS bonuses).
                        </p>
                    </section>

                    <div className="flex flex-wrap gap-4 pt-8 border-t border-[#21262d]">
                        <Link to="/podx" className="text-violet-400 hover:underline text-[0.93rem]">
                            ← PodX home
                        </Link>
                        <Link to="/" className="text-[#8b949e] hover:text-emerald-400 text-[0.93rem]">
                            Profile site
                        </Link>
                    </div>
                </main>
            </div>
        </div>
    );
}
