import { useState, useEffect } from "react";
import { getBlogs, getBlogById, deleteBlog, blocksToHtml, type BlogPost } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trash2, Plus, Edit, ExternalLink } from "lucide-react";
import BlogComposer from "@/components/admin/BlogComposer";
import ProductivityDashboard from "@/components/admin/ProductivityDashboard";

const Admin = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState("");
    const [blogs, setBlogs] = useState<BlogPost[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentBlog, setCurrentBlog] = useState<Partial<BlogPost>>({});

    useEffect(() => {
        if (isAuthenticated) {
            getBlogs({ includeDrafts: true })
                .then(setBlogs)
                .catch((err) => alert("Failed to load blogs: " + (err as Error).message));
        }
    }, [isAuthenticated]);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === "100Thousand@123") {
            setIsAuthenticated(true);
        } else {
            alert("Invalid password");
        }
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
                                    placeholder="Enter admin password (admin123)"
                                />
                            </div>
                            <Button type="submit" className="w-full">Login</Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
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
                    <Button variant="ghost" onClick={() => setIsAuthenticated(false)}>
                        Logout
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="productivity" className="w-full max-w-full mx-auto flex flex-col items-center">
                <TabsList className="mb-10 bg-muted/60 backdrop-blur-md rounded-full p-2 inline-flex h-auto items-center justify-center border shadow-sm w-fit mx-auto">
                    <TabsTrigger value="stories" className="rounded-full px-6 py-2 text-sm font-medium data-[state=active]:bg-background data-[state=active]:shadow-md transition-all focus-visible:ring-0 focus-visible:ring-offset-0">Stories</TabsTrigger>
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
                
                <TabsContent value="productivity" className="m-0 focus-visible:outline-none border-none outline-none w-full max-w-6xl mx-auto px-2">
                    <ProductivityDashboard />
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default Admin;
