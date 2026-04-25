import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Terminal, Cpu, Database, Calendar, FileText, GitBranch, Github, ExternalLink, Code2, Server, Cloud, Brain, BookMarked, Users, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import { getBlogs, type BlogPost } from "@/lib/storage";

const RECENT_BLOGS_COUNT = 3;

const GITHUB_USER = "alchemist123";
const GITHUB_API = `https://api.github.com/users/${GITHUB_USER}`;

interface GitHubUser {
    avatar_url: string;
    name: string | null;
    login: string;
    bio: string | null;
    public_repos: number;
    followers: number;
    following: number;
    html_url: string;
}

const Home = () => {
    const [recentBlogs, setRecentBlogs] = useState<BlogPost[]>([]);
    const [githubUser, setGithubUser] = useState<GitHubUser | null>(null);

    useEffect(() => {
        getBlogs()
            .then((all) => setRecentBlogs(all.slice(0, RECENT_BLOGS_COUNT)))
            .catch(() => setRecentBlogs([]));
    }, []);

    useEffect(() => {
        fetch(GITHUB_API, { cache: "no-store" })
            .then((res) => (res.ok ? res.json() : null))
            .then(setGithubUser)
            .catch(() => setGithubUser(null));
    }, []);

    return (
        <div className="flex flex-col min-h-screen">
            {/* Modernized Hero Section */}
            <section className="relative pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden bg-background">
                {/* Background Grid & Glow */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-20 bg-[radial-gradient(var(--primary)_0%,transparent_50%)] blur-3xl pointer-events-none mix-blend-screen" />

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
                        {/* Left Column: Text Content */}
                        <div className="flex flex-col items-start text-left">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="mb-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20"
                            >
                                <span className="relative flex h-2 w-2">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                                </span>
                                <span className="text-xs font-medium text-primary tracking-wide uppercase">System Architect</span>
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                                className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-foreground mb-6"
                            >
                                <span className="block mb-2 text-4xl">Hey, I'm</span>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-primary to-emerald-400">Amal V S.</span>
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="max-w-xl text-muted-foreground text-lg md:text-xl leading-relaxed mb-4"
                            >
                                <strong className="font-semibold text-foreground">System Architect & Database Internals Specialist.</strong><br/>
                                Engineering scalable, resilient backend systems mapped with <span className="font-mono text-sm text-blue-500 bg-blue-500/10 px-1.5 py-0.5 rounded">Python</span>, <span className="font-mono text-sm text-orange-500 bg-orange-500/10 px-1.5 py-0.5 rounded">Rust</span>, and <span className="font-mono text-sm text-green-500 bg-green-500/10 px-1.5 py-0.5 rounded">Node.js</span>.
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                                className="flex flex-wrap items-center gap-4 mt-8"
                            >
                                <Button size="lg" className="rounded-full min-w-[150px] shadow-lg shadow-primary/20 group" asChild>
                                    <Link to="/blog">
                                        Read My Blog <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </Button>
                                <Button size="lg" variant="outline" className="rounded-full min-w-[150px] border-border hover:bg-muted" asChild>
                                    <a href="#summary">Explore Framework</a>
                                </Button>
                            </motion.div>
                        </div>
                        
                        {/* Right Column: Code Showcase */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, rotateY: 10 }}
                            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                            transition={{ duration: 0.7, delay: 0.2 }}
                            className="relative mx-auto w-full max-w-[500px] lg:max-w-none perspective-1000"
                        >
                            <div className="rounded-2xl border border-border/40 bg-[#0B1015] shadow-2xl overflow-hidden relative group">
                                <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                
                                <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-white/5">
                                    <div className="w-3 h-3 rounded-full bg-red-400" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                                    <div className="w-3 h-3 rounded-full bg-green-400" />
                                    <div className="ml-2 text-[11px] font-mono text-white/40 flex items-center gap-2"><Terminal className="w-3 h-3" /> sys_arch.rs</div>
                                </div>
                                <div className="p-5 font-mono text-xs sm:text-sm text-slate-300 leading-relaxed overflow-x-auto shadow-inner">
                                    <div className="text-pink-400">impl <span className="text-blue-400">SystemArchitect</span> for <span className="text-yellow-300">AmalVS</span> {'{'}</div>
                                    <div className="pl-4 text-emerald-400 mt-1">fn <span className="text-blue-300">init_backend</span>(&mut self) -&gt; Result&lt;(), EngineError&gt; {'{'}</div>
                                    <div className="pl-8 text-slate-400 mt-1">self.bootstrap_cluster(Nodes::new(3))?;</div>
                                    <div className="pl-8 text-slate-400 mt-1">self.optimize_indexing_layer(DbParams::PgSQL)?;</div>
                                    <div className="pl-8 text-slate-400 mt-1">self.deploy_event_mesh(Kafka::default())?;</div>
                                    <div className="pl-8 text-pink-400 mt-2">Ok<span className="text-slate-300">(())</span></div>
                                    <div className="pl-4 text-emerald-400 mt-1">{'}'}</div>
                                    
                                    <div className="pl-4 text-emerald-400 mt-4">fn <span className="text-blue-300">scale_systems</span>(&self, traffic: TrafficLoad) {'{'}</div>
                                    <div className="pl-8 text-slate-400 mt-1"><span className="text-pink-400">match</span> traffic {'{'}</div>
                                    <div className="pl-12 text-slate-400 mt-1">TrafficLoad::High =&gt; self.spin_up_replicas(),</div>
                                    <div className="pl-12 text-slate-400 mt-1">TrafficLoad::Spike =&gt; self.throttle_gracefully(),</div>
                                    <div className="pl-12 text-slate-400 mt-1">_ =&gt; self.maintain_efficiency(),</div>
                                    <div className="pl-8 text-slate-400 mt-1">{'}'}</div>
                                    <div className="pl-4 text-emerald-400 mt-1">{'}'}</div>
                                    <div className="text-pink-400 mt-1">{'}'}</div>
                                </div>
                            </div>
                            
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/20 blur-3xl rounded-full -z-10" />
                            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-emerald-500/20 blur-3xl rounded-full -z-10" />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Recent Posts */}
            {recentBlogs.length > 0 && (
                <section className="relative py-20 md:py-28 border-t border-border/10 bg-[#0B1015]">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-[#0B1015] to-[#0B1015] -z-10" />

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4 }}
                            className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6"
                        >
                            <div className="text-left">
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-primary/10 border border-primary/20 mb-4">
                                    <Terminal className="w-3 h-3 text-primary" />
                                    <span className="text-[10px] uppercase font-mono tracking-widest text-primary font-bold">Query: _recent_nodes</span>
                                </div>
                                <h2 className="text-4xl font-bold tracking-tight md:text-5xl text-slate-100">
                                    Recent Transmissions
                                </h2>
                                <p className="mt-4 max-w-xl text-slate-400 text-lg">
                                    <span className="text-emerald-500 font-mono tracking-widest text-sm">{`_ // `}</span> Latest logs on architecture, AI, and backend systems.
                                </p>
                            </div>
                            
                            <Button variant="outline" className="hidden border-slate-800 bg-slate-900/50 hover:bg-slate-800 text-slate-300 md:flex group" asChild>
                                <Link to="/blog">
                                    View all logs <ArrowRight className="ml-2 h-4 w-4 text-emerald-500 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </Button>
                        </motion.div>

                        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 z-10 relative">
                            {recentBlogs.map((blog, i) => (
                                <motion.div
                                    key={blog.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: i * 0.08 }}
                                    className="flex"
                                >
                                    <Link to={`/blog/${blog.id}`} className="block w-full group">
                                        <Card className="h-full overflow-hidden border border-slate-800 bg-slate-900/40 backdrop-blur-md shadow-2xl hover:shadow-emerald-500/5 hover:-translate-y-1 hover:border-emerald-500/40 transition-all duration-300 flex flex-col relative">
                                            {/* Decorative Top Line */}
                                            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-20" />
                                            
                                            {blog.coverImage ? (
                                                <div className="aspect-[16/10] overflow-hidden bg-slate-900 shrink-0 relative">
                                                    <div className="absolute inset-0 bg-[#0B1015]/60 group-hover:bg-transparent transition-colors duration-500 z-10" />
                                                    <img
                                                        src={blog.coverImage}
                                                        alt=""
                                                        className="h-full w-full object-cover grayscale-[40%] group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105 relative z-0"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="aspect-[16/10] flex items-center justify-center bg-[#0B1015]/80 shrink-0 border-b border-slate-800/80">
                                                    <FileText className="h-10 w-10 text-slate-700 group-hover:text-emerald-500/50 transition-colors" />
                                                </div>
                                            )}
                                            
                                            <CardHeader className="pb-3 flex-1 flex flex-col px-6 pt-6 relative z-20 bg-slate-900/40 backdrop-blur-sm">
                                                <div className="flex flex-wrap gap-2 mb-3">
                                                    {blog.tags.slice(0, 3).map((tag) => (
                                                        <Badge key={tag} variant="secondary" className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 text-[9px] font-mono tracking-widest uppercase">
                                                            {tag}
                                                        </Badge>
                                                    ))}
                                                </div>
                                                <CardTitle className="text-xl leading-tight group-hover:text-emerald-300 text-slate-200 transition-colors font-bold tracking-tight">
                                                    {blog.title}
                                                </CardTitle>
                                            </CardHeader>
                                            
                                            <CardContent className="px-6 pb-6 pt-0 relative z-20 bg-slate-900/40 backdrop-blur-sm">
                                                <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed">
                                                    {blog.summary || "No description metadata found."}
                                                </p>
                                                
                                                <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-800">
                                                    <span className="flex items-center gap-2 text-xs font-mono text-slate-500">
                                                        <Calendar className="h-3.5 w-3.5 text-blue-500" />
                                                        {new Date(blog.createdAt).toLocaleDateString(undefined, {
                                                            month: "short",
                                                            day: "2-digit",
                                                        }).toUpperCase()}
                                                    </span>
                                                    
                                                    <span className="inline-flex items-center gap-1 text-[10px] uppercase font-mono tracking-widest font-bold text-emerald-500 group-hover:text-emerald-400 transition-colors">
                                                        Read <ArrowRight className="h-4 w-4 -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                                                    </span>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="mt-12 flex justify-center md:hidden"
                        >
                            <Button variant="outline" className="w-full border-slate-800 bg-slate-900/50 text-slate-300" asChild>
                                <Link to="/blog">
                                    View all logs
                                    <ArrowRight className="ml-2 h-4 w-4 text-emerald-500" />
                                </Link>
                            </Button>
                        </motion.div>
                    </div>
                </section>
            )}

            {/* Summary Section */}
            <section id="summary" className="relative py-20 md:py-28 bg-[#0B1015] border-t border-slate-800/50">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-blue-500/5 via-[#0B1015] to-[#0B1015] -z-10" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid gap-12 lg:gap-16 lg:grid-cols-[1fr,340px] items-start">
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="min-w-0"
                        >
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-blue-500/10 border border-blue-500/20 mb-6">
                                <Cpu className="w-3 h-3 text-blue-400" />
                                <span className="text-[10px] uppercase font-mono tracking-widest text-blue-400 font-bold">SYS.Framework</span>
                            </div>
                            <h2 className="text-3xl font-bold tracking-tight md:text-5xl text-slate-100 mb-8">
                                System Architecture <span className="text-slate-600 font-light">&</span> Engineering
                            </h2>
                            <div className="space-y-6 text-slate-400 text-lg leading-relaxed font-light">
                                <p>
                                    I specialize in designing high-performance distributed systems and understanding database internals. My primary stack revolves around <strong className="text-blue-400 font-semibold font-mono text-[15px] bg-blue-500/10 px-2 py-0.5 rounded">Python</strong> currently, with deep expertise in <strong className="text-green-500 font-semibold font-mono text-[15px] bg-green-500/10 px-2 py-0.5 rounded">Node.js</strong> and <strong className="text-orange-500 font-semibold font-mono text-[15px] bg-orange-500/10 px-2 py-0.5 rounded">Rust</strong> for ensuring memory safety and concurrency control.
                                </p>
                                <p>
                                    My work bridges the gap between high-level architectural design and low-level system optimization. I focus on building resilient backends, optimizing query execution plans, and architecting event-driven microservices—with a strong emphasis on <strong className="text-slate-200 font-medium tracking-tight">technical consistency</strong>: clear patterns, shared standards, and coherent data models across services.
                                </p>
                                <p>
                                    A strong advocate for Polyglot persistence and selecting the right tool for the job—whether it's tuning a Postgres configuration or implementing a custom index in a Vector Store.
                                </p>
                            </div>
                        </motion.div>
                        
                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 relative"
                        >
                            {/* Accent Glow */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-blue-500/10 blur-[100px] -z-10 rounded-full" />
                            
                            <Card className="border border-slate-800 bg-slate-900/40 backdrop-blur-md shadow-2xl hover:border-blue-500/40 transition-colors group">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-[11px] font-mono tracking-widest uppercase text-slate-500 group-hover:text-blue-400 transition-colors">Architecture</CardTitle>
                                    <Cpu className="h-4 w-4 text-blue-500/50 group-hover:text-blue-400 transition-colors shrink-0" />
                                </CardHeader>
                                <CardContent>
                                    <p className="text-xl font-bold text-slate-200">System Design</p>
                                    <p className="text-sm text-slate-500 mt-1">Distributed Systems & Scalability</p>
                                </CardContent>
                            </Card>
                            
                            <Card className="border border-slate-800 bg-slate-900/40 backdrop-blur-md shadow-2xl hover:border-orange-500/40 transition-colors group">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-[11px] font-mono tracking-widest uppercase text-slate-500 group-hover:text-orange-400 transition-colors">Core Stack</CardTitle>
                                    <Terminal className="h-4 w-4 text-orange-500/50 group-hover:text-orange-400 transition-colors shrink-0" />
                                </CardHeader>
                                <CardContent>
                                    <p className="text-xl font-bold text-slate-200">Rust & Python</p>
                                    <p className="text-sm text-slate-500 mt-1">Performance & Speed</p>
                                </CardContent>
                            </Card>
                            
                            <Card className="border border-slate-800 bg-slate-900/40 backdrop-blur-md shadow-2xl hover:border-emerald-500/40 transition-colors group">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-[11px] font-mono tracking-widest uppercase text-slate-500 group-hover:text-emerald-400 transition-colors">Data</CardTitle>
                                    <Database className="h-4 w-4 text-emerald-500/50 group-hover:text-emerald-400 transition-colors shrink-0" />
                                </CardHeader>
                                <CardContent>
                                    <p className="text-xl font-bold text-slate-200">DB Internals</p>
                                    <p className="text-sm text-slate-500 mt-1">Optimization & Indexing</p>
                                </CardContent>
                            </Card>
                            
                            <Card className="border border-slate-800 bg-slate-900/40 backdrop-blur-md shadow-2xl hover:border-purple-500/40 transition-colors group sm:col-span-2 lg:col-span-1">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-[11px] font-mono tracking-widest uppercase text-slate-500 group-hover:text-purple-400 transition-colors">Principles</CardTitle>
                                    <GitBranch className="h-4 w-4 text-purple-500/50 group-hover:text-purple-400 transition-colors shrink-0" />
                                </CardHeader>
                                <CardContent>
                                    <p className="text-xl font-bold text-slate-200">Technical Consistency</p>
                                    <p className="text-sm text-slate-500 mt-1">Standards, patterns & maintainability</p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Skills Section */}
            <section className="relative py-20 md:py-28 bg-[#0B1015] border-t border-slate-800/50 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-500/5 via-[#0B1015] to-[#0B1015] -z-10" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div 
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4 }}
                        className="text-center mb-16"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-emerald-500/10 border border-emerald-500/20 mb-6 mx-auto">
                            <Terminal className="w-3 h-3 text-emerald-400" />
                            <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-400 font-bold">Capabilities</span>
                        </div>
                        <h2 className="text-4xl font-bold tracking-tight md:text-5xl text-slate-100">
                            Technical Expertise
                        </h2>
                    </motion.div>

                    <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 mt-12">
                        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
                            <SkillNode
                                title="Primary Languages"
                                icon={<Code2 className="w-5 h-5" />}
                                accent="blue"
                                skills={["Python", "Rust", "Node.js", "JavaScript", "TypeScript", "C++", "Go"]}
                            />
                        </motion.div>
                        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
                            <SkillNode
                                title="System Architecture"
                                icon={<Cpu className="w-5 h-5" />}
                                accent="purple"
                                skills={["Distributed Systems", "Microservices", "Event-Driven", "High Availability", "CAP Theorem", "Load Balancing"]}
                            />
                        </motion.div>
                        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
                            <SkillNode
                                title="Database Internals"
                                icon={<Database className="w-5 h-5" />}
                                accent="emerald"
                                skills={["PostgreSQL (Tuning)", "Indexing Strategies", "Query Optimization", "WAL & Replication", "NoSQL", "Vector Databases"]}
                            />
                        </motion.div>
                        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }}>
                            <SkillNode
                                title="Backend Tech"
                                icon={<Server className="w-5 h-5" />}
                                accent="orange"
                                skills={["FastAPI", "Nest.js", "Express", "Kafka", "RabbitMQ", "gRPC", "GraphQL"]}
                            />
                        </motion.div>
                        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.5 }}>
                            <SkillNode
                                title="Cloud & DevOps"
                                icon={<Cloud className="w-5 h-5" />}
                                accent="cyan"
                                skills={["AWS", "Azure", "Kubernetes", "Docker", "Terraform", "CI/CD Pipelines"]}
                            />
                        </motion.div>
                        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.6 }}>
                            <SkillNode
                                title="AI & Search"
                                icon={<Brain className="w-5 h-5" />}
                                accent="pink"
                                skills={["RAG Pipelines", "LangChain", "LangGraph", "Semantic Search", "OpenAI", "TensorFlow Lite"]}
                            />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* GitHub Profile */}
            <section className="relative py-20 md:py-28 bg-[#0B1015] border-t border-slate-800/50 overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/5 blur-[120px] rounded-full pointer-events-none -z-10" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-purple-500/10 border border-purple-500/20 mb-6 mx-auto">
                            <Github className="w-3 h-3 text-purple-400" />
                            <span className="text-[10px] uppercase font-mono tracking-widest text-purple-400 font-bold">Open Source</span>
                        </div>
                        <h2 className="text-4xl font-bold tracking-tight md:text-5xl text-slate-100">
                            On GitHub
                        </h2>
                        <p className="mt-4 max-w-xl mx-auto text-slate-400 text-lg">
                            <span className="text-purple-500 font-mono tracking-widest text-sm">{`$ ls -la origin/main`}</span><br /> Repos, contributions, and active clusters.
                        </p>
                    </motion.div>

                    {githubUser ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="max-w-2xl mx-auto"
                        >
                            <Card className="border border-slate-800 bg-slate-900/40 backdrop-blur-md shadow-2xl overflow-hidden hover:border-purple-500/30 transition-colors group relative">
                                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20" />
                                <CardContent className="p-0 relative z-10">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-6 p-8">
                                        <div className="relative mx-auto sm:mx-0 shrink-0">
                                            <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-xl animate-pulse -z-10" />
                                            <img
                                                src={githubUser.avatar_url}
                                                alt=""
                                                className="h-28 w-28 rounded-full border border-slate-700 object-cover bg-black"
                                            />
                                        </div>
                                        <div className="flex-1 text-center sm:text-left min-w-0">
                                            <h3 className="text-2xl font-bold text-slate-100 tracking-tight">
                                                {githubUser.name || githubUser.login}
                                            </h3>
                                            <p className="text-sm text-purple-400 font-mono tracking-wide mt-1">
                                                @{githubUser.login}
                                            </p>
                                            {githubUser.bio && (
                                                <p className="text-sm text-slate-400 mt-4 leading-relaxed line-clamp-2">
                                                    {githubUser.bio}
                                                </p>
                                            )}
                                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-6 gap-y-2 mt-6 text-sm text-slate-500 font-mono">
                                                <span className="flex items-center gap-2 group/metric">
                                                    <BookMarked className="w-4 h-4 text-slate-600 group-hover/metric:text-blue-400 transition-colors" />
                                                    <span className="font-bold text-slate-300">{githubUser.public_repos}</span>
                                                    <span className="text-[10px] uppercase tracking-widest">repos</span>
                                                </span>
                                                <span className="flex items-center gap-2 group/metric">
                                                    <Users className="w-4 h-4 text-slate-600 group-hover/metric:text-emerald-400 transition-colors" />
                                                    <span className="font-bold text-slate-300">{githubUser.followers}</span>
                                                    <span className="text-[10px] uppercase tracking-widest">followers</span>
                                                </span>
                                                <span className="flex items-center gap-2 group/metric">
                                                    <UserPlus className="w-4 h-4 text-slate-600 group-hover/metric:text-orange-400 transition-colors" />
                                                    <span className="font-bold text-slate-300">{githubUser.following}</span>
                                                    <span className="text-[10px] uppercase tracking-widest">following</span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="border-t border-slate-800/80 px-8 py-4 bg-black/20 flex justify-end">
                                        <Button asChild className="w-full sm:w-auto gap-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/20 transition-all group/btn rounded">
                                            <a
                                                href={githubUser.html_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <Terminal className="h-4 w-4" />
                                                View Source
                                                <ArrowRight className="h-4 w-4 -rotate-45 group-hover/btn:rotate-0 transition-transform" />
                                            </a>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ) : (
                        <div className="max-w-2xl mx-auto text-center">
                            <Card className="border border-slate-800 bg-slate-900/40 backdrop-blur-md">
                                <CardContent className="py-16">
                                    <div className="p-4 bg-slate-800/50 rounded-full inline-block mb-6">
                                        <Github className="h-8 w-8 text-slate-400" />
                                    </div>
                                    <p className="text-slate-400 font-mono tracking-widest text-sm uppercase mb-8">System Git Interface</p>
                                    <Button asChild variant="outline" className="gap-2 border-slate-700 hover:bg-slate-800 text-slate-300 rounded">
                                        <a href={`https://github.com/${GITHUB_USER}`} target="_blank" rel="noopener noreferrer">
                                            @{GITHUB_USER}
                                            <ExternalLink className="h-3.5 w-3.5" />
                                        </a>
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

const SkillNode = ({ title, skills, icon, accent = "emerald" }: { title: string; skills: string[]; icon?: React.ReactNode; accent?: "blue" | "purple" | "emerald" | "orange" | "cyan" | "pink" }) => {
    const accentColors = {
        blue: "text-blue-500 group-hover:border-blue-500 shadow-blue-500/10",
        purple: "text-purple-500 group-hover:border-purple-500 shadow-purple-500/10",
        emerald: "text-emerald-500 group-hover:border-emerald-500 shadow-emerald-500/10",
        orange: "text-orange-500 group-hover:border-orange-500 shadow-orange-500/10",
        cyan: "text-cyan-500 group-hover:border-cyan-500 shadow-cyan-500/10",
        pink: "text-pink-500 group-hover:border-pink-500 shadow-pink-500/10",
    } as const;

    return (
        <div className={`group relative py-2 pl-6 transition-all duration-500 border-l border-slate-800 ${accentColors[accent as keyof typeof accentColors]}`}>
            {/* Ambient Background Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-current to-transparent opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500 pointer-events-none -z-10" />
            
            <div className="flex items-center gap-4 mb-5">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-current/10 p-2 rounded-md">
                    {icon}
                </div>
                <h3 className="text-xl font-semibold text-slate-300 group-hover:text-slate-100 transition-colors tracking-tight">
                    {title}
                </h3>
            </div>
            
            <div className="flex flex-wrap gap-y-2 gap-x-4">
                {skills.map((skill) => (
                    <div key={skill} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-800 group-hover:bg-current transition-colors duration-500" />
                        <span className="text-[13px] font-mono text-slate-500 group-hover:text-slate-300 transition-colors duration-300">
                            {skill}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;
