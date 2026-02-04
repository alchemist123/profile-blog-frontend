import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Terminal, Cpu, Database, Calendar, FileText, GitBranch, Heart, MessageCircle, Eye, Github, ExternalLink } from "lucide-react";
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
            {/* Hero Section */}
            <section className="relative py-24 md:py-32 overflow-hidden bg-background">
                <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col items-center text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="mb-6"
                        >
                            <Badge variant="outline" className="px-4 py-1.5 text-sm font-medium rounded-full border-primary/50 text-primary bg-primary/5">
                                Architect Engineer
                            </Badge>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground mb-6"
                        >
                            Amal V S
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="max-w-2xl text-muted-foreground text-lg md:text-xl leading-relaxed mb-10"
                        >
                            System Architect & Database Internals Specialist. Engineering scalable backend systems with Python, Rust, and Node.js.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="flex flex-wrap items-center justify-center gap-3"
                        >
                            <Button size="lg" className="rounded-full min-w-[140px]" asChild>
                                <Link to="/blog">
                                    Read My Blog <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                            <Button size="lg" variant="outline" className="rounded-full min-w-[140px]" asChild>
                                <a href="#summary">About Me</a>
                            </Button>
                        </motion.div>
                    </div>
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -z-10 pointer-events-none" />
            </section>

            {/* Recent Posts */}
            {recentBlogs.length > 0 && (
                <section className="py-20 md:py-28 border-t border-border/50 bg-muted/20">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4 }}
                            className="text-center mb-14"
                        >
                            <Badge variant="secondary" className="mb-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                From the blog
                            </Badge>
                            <h2 className="text-3xl font-bold tracking-tight md:text-4xl text-foreground">
                                Recent posts
                            </h2>
                            <p className="mt-3 max-w-xl mx-auto text-muted-foreground text-base">
                                Latest writing on architecture, AI, and backend systems.
                            </p>
                        </motion.div>

                        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                            {recentBlogs.map((blog, i) => (
                                <motion.div
                                    key={blog.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: i * 0.06 }}
                                    className="flex"
                                >
                                    <Link to={`/blog/${blog.id}`} className="block w-full group">
                                        <Card className="h-full overflow-hidden border bg-card shadow-sm hover:shadow-md hover:border-border transition-all duration-300 flex flex-col">
                                            {blog.coverImage ? (
                                                <div className="aspect-[16/10] overflow-hidden bg-muted shrink-0">
                                                    <img
                                                        src={blog.coverImage}
                                                        alt=""
                                                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="aspect-[16/10] flex items-center justify-center bg-muted/50 shrink-0">
                                                    <FileText className="h-12 w-12 text-muted-foreground/40" />
                                                </div>
                                            )}
                                            <CardHeader className="pb-2 flex-1 flex flex-col">
                                                <div className="flex flex-wrap gap-1.5 mb-2">
                                                    {blog.tags.slice(0, 3).map((tag) => (
                                                        <Badge key={tag} variant="secondary" className="text-[10px] font-medium">
                                                            {tag}
                                                        </Badge>
                                                    ))}
                                                </div>
                                                <CardTitle className="line-clamp-2 text-lg leading-snug group-hover:text-primary transition-colors">
                                                    {blog.title}
                                                </CardTitle>
                                                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-2 flex-wrap">
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="h-3.5 w-3.5 shrink-0" />
                                                        {new Date(blog.createdAt).toLocaleDateString(undefined, {
                                                            month: "short",
                                                            day: "numeric",
                                                            year: "numeric",
                                                        })}
                                                    </span>
                                                    {(blog.readCount ?? 0) > 0 && (
                                                        <span className="flex items-center gap-1">
                                                            <Eye className="h-3.5 w-3.5" />
                                                            {blog.readCount}
                                                        </span>
                                                    )}
                                                    {(blog.likes ?? 0) > 0 && (
                                                        <span className="flex items-center gap-1">
                                                            <Heart className="h-3.5 w-3.5" />
                                                            {blog.likes}
                                                        </span>
                                                    )}
                                                    {((blog.comments?.length) ?? 0) > 0 && (
                                                        <span className="flex items-center gap-1">
                                                            <MessageCircle className="h-3.5 w-3.5" />
                                                            {blog.comments?.length ?? 0}
                                                        </span>
                                                    )}
                                                </div>
                                            </CardHeader>
                                            <CardContent className="pt-0 pb-6">
                                                <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                                                    {blog.summary || "No summary."}
                                                </p>
                                                <span className="inline-flex items-center gap-1 mt-4 text-sm font-medium text-primary group-hover:gap-2 transition-all">
                                                    Read post
                                                    <ArrowRight className="h-4 w-4" />
                                                </span>
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
                            className="mt-12 flex justify-center"
                        >
                            <Button variant="outline" size="lg" className="rounded-full" asChild>
                                <Link to="/blog">
                                    View all posts
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </motion.div>
                    </div>
                </section>
            )}

            {/* Summary Section */}
            <section id="summary" className="py-20 md:py-28 bg-background">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid gap-12 lg:gap-16 lg:grid-cols-[1fr,340px] items-start">
                        <div className="min-w-0">
                            <h2 className="text-3xl font-bold tracking-tight md:text-4xl text-foreground mb-6">
                                System Architecture & Engineering
                            </h2>
                            <div className="space-y-5 text-muted-foreground leading-relaxed">
                                <p>
                                    I specialize in designing high-performance distributed systems and understanding database internals. My primary stack revolves around <strong className="text-foreground">Python currently, with deep expertise in Node.js and Rust</strong> for ensuring memory safety and concurrency control.
                                </p>
                                <p>
                                    My work bridges the gap between high-level architectural design and low-level system optimization. I focus on building resilient backends, optimizing query execution plans, and architecting event-driven microservices—with a strong emphasis on <strong className="text-foreground">technical consistency</strong>: clear patterns, shared standards, and coherent data models across services.
                                </p>
                                <p>
                                    A strong advocate for Polyglot persistence and selecting the right tool for the job—whether it's tuning a Postgres configuration or implementing a custom index in a Vector Store.
                                </p>
                            </div>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                            <Card className="border bg-card">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Architecture</CardTitle>
                                    <Cpu className="h-4 w-4 text-muted-foreground shrink-0" />
                                </CardHeader>
                                <CardContent>
                                    <p className="text-xl font-semibold">System Design</p>
                                    <p className="text-sm text-muted-foreground mt-0.5">Distributed Systems & Scalability</p>
                                </CardContent>
                            </Card>
                            <Card className="border bg-card">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Core Stack</CardTitle>
                                    <Terminal className="h-4 w-4 text-muted-foreground shrink-0" />
                                </CardHeader>
                                <CardContent>
                                    <p className="text-xl font-semibold">Rust & Python</p>
                                    <p className="text-sm text-muted-foreground mt-0.5">Performance & Speed</p>
                                </CardContent>
                            </Card>
                            <Card className="border bg-card">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Data</CardTitle>
                                    <Database className="h-4 w-4 text-muted-foreground shrink-0" />
                                </CardHeader>
                                <CardContent>
                                    <p className="text-xl font-semibold">DB Internals</p>
                                    <p className="text-sm text-muted-foreground mt-0.5">Optimization & Indexing</p>
                                </CardContent>
                            </Card>
                            <Card className="border bg-card sm:col-span-2 lg:col-span-1">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Principles</CardTitle>
                                    <GitBranch className="h-4 w-4 text-muted-foreground shrink-0" />
                                </CardHeader>
                                <CardContent>
                                    <p className="text-xl font-semibold">Technical Consistency</p>
                                    <p className="text-sm text-muted-foreground mt-0.5">Standards, patterns & maintainability</p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            {/* Skills Section */}
            <section className="py-20 md:py-28 bg-muted/20 border-t border-border/50">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold tracking-tight md:text-4xl text-foreground text-center mb-14">
                        Technical Expertise
                    </h2>

                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        <SkillCard
                            title="Primary Languages"
                            skills={["Python", "Rust", "Node.js", "JavaScript", "TypeScript", "C++", "Go"]}
                        />
                        <SkillCard
                            title="System Architecture"
                            skills={["Distributed Systems", "Microservices", "Event-Driven", "High Availability", "CAP Theorem", "Load Balancing"]}
                        />
                        <SkillCard
                            title="Database Internals"
                            skills={["PostgreSQL (Tuning)", "Indexing Strategies", "Query Optimization", "WAL & Replication", "NoSQL", "Vector Databases"]}
                        />
                        <SkillCard
                            title="Backend Tech"
                            skills={["FastAPI", "Nest.js", "Express", "Kafka", "RabbitMQ", "gRPC", "GraphQL"]}
                        />
                        <SkillCard
                            title="Cloud & DevOps"
                            skills={["AWS", "Azure", "Kubernetes", "Docker", "Terraform", "CI/CD Pipelines"]}
                        />
                        <SkillCard
                            title="AI & Search"
                            skills={["RAG Pipelines", "LangChain", "LangGraph", "Semantic Search", "OpenAI", "TensorFlow Lite"]}
                        />
                    </div>
                </div>
            </section>

            {/* GitHub Profile */}
            <section className="py-20 md:py-28 bg-background border-t border-border/50">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <Badge variant="secondary" className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            Open source
                        </Badge>
                        <h2 className="text-3xl font-bold tracking-tight md:text-4xl text-foreground">
                            On GitHub
                        </h2>
                        <p className="mt-2 max-w-xl mx-auto text-muted-foreground text-base">
                            Repos, contributions, and side projects.
                        </p>
                    </motion.div>

                    {githubUser ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="max-w-2xl mx-auto"
                        >
                            <Card className="border bg-card shadow-sm overflow-hidden">
                                <CardContent className="p-0">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-6 p-6">
                                        <img
                                            src={githubUser.avatar_url}
                                            alt=""
                                            className="h-24 w-24 rounded-full border-2 border-border object-cover shrink-0 mx-auto sm:mx-0"
                                        />
                                        <div className="flex-1 text-center sm:text-left min-w-0">
                                            <h3 className="text-xl font-semibold text-foreground">
                                                {githubUser.name || githubUser.login}
                                            </h3>
                                            <p className="text-sm text-muted-foreground font-mono mt-0.5">
                                                @{githubUser.login}
                                            </p>
                                            {githubUser.bio && (
                                                <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                                                    {githubUser.bio}
                                                </p>
                                            )}
                                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-4 text-sm text-muted-foreground">
                                                <span className="font-medium text-foreground">{githubUser.public_repos}</span>
                                                <span>repos</span>
                                                <span className="font-medium text-foreground">{githubUser.followers}</span>
                                                <span>followers</span>
                                                <span className="font-medium text-foreground">{githubUser.following}</span>
                                                <span>following</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="border-t px-6 py-4 bg-muted/30">
                                        <Button asChild className="w-full sm:w-auto gap-2">
                                            <a
                                                href={githubUser.html_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <Github className="h-4 w-4" />
                                                View GitHub profile
                                                <ExternalLink className="h-3.5 w-3.5" />
                                            </a>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ) : (
                        <div className="max-w-2xl mx-auto text-center">
                            <Card className="border bg-card">
                                <CardContent className="py-12">
                                    <Github className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                    <p className="text-muted-foreground text-sm mb-4">GitHub profile</p>
                                    <Button asChild variant="outline" className="gap-2">
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

const SkillCard = ({ title, skills }: { title: string; skills: string[] }) => (
    <Card className="h-full border bg-card shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
            <CardTitle className="text-base">{title}</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="font-normal">
                        {skill}
                    </Badge>
                ))}
            </div>
        </CardContent>
    </Card>
);

export default Home;
