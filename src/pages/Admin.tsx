import { useState, useEffect } from "react";
import {
    ADMIN_SESSION_EXPIRED,
    adminLogin,
    blocksToHtml,
    checkAdminSession,
    clearAdminToken,
    deleteBlog,
    getBlogById,
    getBlogs,
    type BlogPost,
} from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trash2, Plus, Edit, ExternalLink, Clapperboard, Eye, Heart, Film } from "lucide-react";
import BlogComposer from "@/components/admin/BlogComposer";
import VlogComposer from "@/components/admin/VlogComposer";
import { deleteVlog, getVlogs, type Vlog } from "@/lib/vlogs";
import { formatDuration } from "@/lib/media";
import ProductivityDashboard from "@/components/admin/ProductivityDashboard";

const Admin = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [checkingSession, setCheckingSession] = useState(true);
    const [password, setPassword] = useState("");
    const [loginError, setLoginError] = useState<string | null>(null);
    const [loggingIn, setLoggingIn] = useState(false);
    const [blogs, setBlogs] = useState<BlogPost[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [vlogs, setVlogs] = useState<Vlog[]>([]);
    const [editingVlog, setEditingVlog] = useState<Partial<Vlog> | null>(null);
    const [tab, setTab] = useState("productivity");
    const [currentBlog, setCurrentBlog] = useState<Partial<BlogPost>>({});

    // Resume an existing session in this tab, and drop back to login when it expires.
    useEffect(() => {
        checkAdminSession()
            .then(setIsAuthenticated)
            .finally(() => setCheckingSession(false));
        const onExpired = () => {
            setIsAuthenticated(false);
            setLoginError("Your session expired. Log in again — unsaved writing is kept in this browser.");
        };
        window.addEventListener(ADMIN_SESSION_EXPIRED, onExpired);
        return () => window.removeEventListener(ADMIN_SESSION_EXPIRED, onExpired);
    }, []);

    const refreshVlogs = () => {
        getVlogs({ includeDrafts: true }).then(setVlogs).catch(() => {});
    };

    useEffect(() => {
        if (isAuthenticated) refreshVlogs();
    }, [isAuthenticated]);

    useEffect(() => {
        if (isAuthenticated) {
            getBlogs({ includeDrafts: true })
                .then(setBlogs)
                .catch((err) => alert("Failed to load blogs: " + (err as Error).message));
        }
    }, [isAuthenticated]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoggingIn(true);
        setLoginError(null);
        try {
            await adminLogin(password);
            setPassword("");
            setIsAuthenticated(true);
        } catch (err) {
            setLoginError((err as Error).message);
        } finally {
            setLoggingIn(false);
        }
    };

    const handleLogout = () => {
        clearAdminToken();
        setIsAuthenticated(false);
        setIsEditing(false);
    };

    const refreshBlogs = () => {
        getBlogs({ includeDrafts: true })
            .then(setBlogs)
            .catch(() => {});
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure?")) return;
        try {
            await deleteBlog(id);
            refreshBlogs();
        } catch (err) {
            alert("Failed to delete: " + (err as Error).message);
        }
    };

    if (checkingSession) {
        return <div className="flex min-h-[60vh] items-center justify-center text-sm text-slate-500">Checking session…</div>;
    }

    if (!isAuthenticated) {
        return (
            <div className="container flex items-center justify-center min-h-[60vh]">
                <Card className="w-full max-w-md">
                    <CardContent className="pt-6">
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Admin password"
                                    autoComplete="current-password"
                                    autoFocus
                                />
                            </div>
                            {loginError && <p className="text-sm text-red-500">{loginError}</p>}
                            <Button type="submit" className="w-full" disabled={!password || loggingIn}>
                                {loggingIn ? "Checking…" : "Login"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const handleDeleteVlog = async (id: string) => {
        if (!confirm("Delete this vlog?")) return;
        try {
            await deleteVlog(id);
            refreshVlogs();
        } catch (err) {
            alert("Failed to delete: " + (err as Error).message);
        }
    };

    if (editingVlog) {
        return (
            <VlogComposer
                key={editingVlog.id ?? "new-vlog"}
                initial={editingVlog}
                onSaved={refreshVlogs}
                onExit={() => {
                    setEditingVlog(null);
                    setTab("vlogs");
                    refreshVlogs();
                }}
            />
        );
    }

    if (isEditing) {
        return (
            <BlogComposer
                key={currentBlog.id ?? "new"}
                initial={currentBlog}
                onSaved={refreshBlogs}
                onExit={() => {
                    setIsEditing(false);
                    setCurrentBlog({});
                    refreshBlogs();
                }}
            />
        );
    }

    return (
        <div className="container mx-auto py-10 max-w-6xl px-6 md:px-12 flex flex-col">
            <div className="w-full flex flex-col items-center justify-between md:flex-row mb-10 gap-6">
                <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
                <div className="flex gap-2">
                    <Button onClick={() => { setCurrentBlog({}); setIsEditing(true); }} className="rounded-full">
                        <Plus className="mr-2 h-4 w-4" /> Write a story
                    </Button>
                    <Button onClick={() => setEditingVlog({})} variant="outline" className="rounded-full border-ember-500/40 text-ember-400 hover:bg-ember-500/10 hover:text-ember-300">
                        <Clapperboard className="mr-2 h-4 w-4" /> New vlog
                    </Button>
                    <Button variant="ghost" onClick={handleLogout}>
                        Logout
                    </Button>
                </div>
            </div>

            <Tabs value={tab} onValueChange={setTab} className="w-full max-w-full mx-auto flex flex-col items-center">
                <TabsList className="mb-10 bg-muted/60 backdrop-blur-md rounded-full p-2 inline-flex h-auto items-center justify-center border shadow-sm w-fit mx-auto">
                    <TabsTrigger value="stories" className="rounded-full px-6 py-2 text-sm font-medium data-[state=active]:bg-background data-[state=active]:shadow-md transition-all focus-visible:ring-0 focus-visible:ring-offset-0">Stories</TabsTrigger>
                    <TabsTrigger value="vlogs" className="rounded-full px-6 py-2 text-sm font-medium data-[state=active]:bg-background data-[state=active]:shadow-md transition-all focus-visible:ring-0 focus-visible:ring-offset-0">Vlogs</TabsTrigger>
                    <TabsTrigger value="productivity" className="rounded-full px-6 py-2 text-sm font-medium data-[state=active]:bg-background data-[state=active]:shadow-md transition-all focus-visible:ring-0 focus-visible:ring-offset-0">Productivity</TabsTrigger>
                </TabsList>
                
                <TabsContent value="stories" className="m-0 focus-visible:outline-none border-none outline-none w-full max-w-4xl mx-auto">
                    <div className="grid gap-6">
                        {blogs.length === 0 && (
                            <div className="text-center py-20 text-muted-foreground">
                                No stories yet. Start writing!
                            </div>
                        )}
                        {blogs.map(blog => (
                            <Card key={blog.id} className="group flex items-center justify-between p-6 hover:shadow-sm transition-all border-none shadow-none border-b rounded-none">
                                <div className="flex-1 space-y-1">
                                    <h3 className="font-bold text-xl font-serif flex items-center gap-2">
                                        {blog.title}
                                        {blog.status === "draft" && (
                                            <span className="rounded-full bg-amber-500/15 px-2 py-0.5 font-sans text-[10px] font-semibold uppercase tracking-wider text-amber-500">Draft</span>
                                        )}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        {new Date(blog.createdAt).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })}{blog.readingTime ? ` · ${blog.readingTime} min read` : ""}{blog.summary ? ` · ${blog.summary.slice(0, 100)}${blog.summary.length > 100 ? "…" : ""}` : ""}
                                    </p>
                                    <div className="flex gap-2 pt-2">
                                        {blog.tags.map(tag => (
                                            <span key={tag} className="bg-muted px-2 py-0.5 rounded-full text-xs text-muted-foreground">{tag}</span>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                    {blog.status !== "draft" && (
                                        <Button variant="ghost" size="icon" asChild title="View post">
                                            <a href={`/blog/${blog.id}`} target="_blank" rel="noopener noreferrer">
                                                <ExternalLink className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                                            </a>
                                        </Button>
                                    )}
                                    <Button variant="ghost" size="icon" onClick={async () => {
                                        const full = await getBlogById(blog.id);
                                        if (full) {
                                            const content = (full.blocks?.length ?? 0) > 0
                                                ? blocksToHtml(full.blocks!)
                                                : (full.content ?? "");
                                            setCurrentBlog({ ...full, content });
                                        } else {
                                            setCurrentBlog({ ...blog, content: blog.content ?? "" });
                                        }
                                        setIsEditing(true);
                                    }}>
                                        <Edit className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                                    </Button>
                                    <Button variant="ghost" size="icon" onClick={() => handleDelete(blog.id)}>
                                        <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                </TabsContent>
                
                <TabsContent value="vlogs" className="m-0 focus-visible:outline-none border-none outline-none w-full max-w-4xl mx-auto">
                    {vlogs.length === 0 ? (
                        <div className="flex flex-col items-center gap-4 py-20 text-center text-muted-foreground">
                            <Film className="h-8 w-8" />
                            <p>No vlogs yet. Share your first reel or video.</p>
                            <Button onClick={() => setEditingVlog({})} className="rounded-full"><Clapperboard className="mr-2 h-4 w-4" /> New vlog</Button>
                        </div>
                    ) : (
                        <div className="grid gap-3">
                            {vlogs.map((v) => (
                                <div key={v.id} className="group flex items-center gap-4 rounded-xl border border-slate-800 bg-slate-900/40 p-3">
                                    <div className={`relative shrink-0 overflow-hidden rounded-lg bg-slate-800 ${v.orientation === "portrait" ? "h-24 w-[54px]" : "h-[54px] w-24"}`}>
                                        {v.posterUrl ? <img src={v.posterUrl} alt="" className="h-full w-full object-cover" /> : <Film className="m-auto mt-4 h-5 w-5 text-slate-500" />}
                                        {v.durationSec > 0 && <span className="absolute bottom-1 right-1 rounded bg-black/70 px-1 text-[9px] font-semibold text-white">{formatDuration(v.durationSec)}</span>}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="flex items-center gap-2 truncate font-semibold text-slate-100">
                                            {v.title}
                                            {v.status === "draft" && <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-500">Draft</span>}
                                        </p>
                                        <p className="mt-1 flex items-center gap-3 text-xs text-slate-500">
                                            <span className="rounded-full border border-slate-700 px-2 py-0.5 uppercase tracking-wider">{v.orientation === "portrait" ? "Reel" : "Video"}</span>
                                            <span>{new Date(v.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                                            <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{v.views}</span>
                                            <span className="flex items-center gap-1"><Heart className="h-3 w-3" />{v.likes}</span>
                                        </p>
                                    </div>
                                    <div className="flex gap-1 opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100">
                                        {v.status !== "draft" && (
                                            <Button variant="ghost" size="icon" asChild title="View">
                                                <a href={`/vlogs/${v.id}`} target="_blank" rel="noopener noreferrer"><ExternalLink className="h-4 w-4" /></a>
                                            </Button>
                                        )}
                                        <Button variant="ghost" size="icon" title="Edit" onClick={() => setEditingVlog(v)}><Edit className="h-4 w-4" /></Button>
                                        <Button variant="ghost" size="icon" title="Delete" onClick={() => handleDeleteVlog(v.id)}><Trash2 className="h-4 w-4 hover:text-destructive" /></Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="productivity" className="m-0 focus-visible:outline-none border-none outline-none w-full max-w-6xl mx-auto px-2">
                    <ProductivityDashboard />
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default Admin;
