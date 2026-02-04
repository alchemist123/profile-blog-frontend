import { useState, useEffect } from "react";
import { getBlogs, getBlogById, saveBlog, deleteBlog, htmlToBlocks, blocksToHtml, type BlogPost } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Trash2, Plus, LogOut, Edit } from "lucide-react";
import Editor from "@/components/ui/editor";

const Admin = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState("");
    const [blogs, setBlogs] = useState<BlogPost[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentBlog, setCurrentBlog] = useState<Partial<BlogPost>>({});
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    useEffect(() => {
        if (isAuthenticated) {
            getBlogs()
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

    const handleSave = async () => {
        const hasContent = currentBlog.content != null && String(currentBlog.content).trim() !== "";
        if (!currentBlog.title) {
            alert("Title is required");
            return;
        }
        if (!hasContent) {
            alert("Content is required");
            return;
        }

        const tags = Array.isArray(currentBlog.tags)
            ? currentBlog.tags
            : (currentBlog.tags ? String(currentBlog.tags).split(",").map((t) => t.trim()) : []);

        const blocks = htmlToBlocks(currentBlog.content ?? "");
        const payload = {
            id: currentBlog.id,
            title: currentBlog.title,
            summary: currentBlog.summary ?? "",
            coverImage: currentBlog.coverImage,
            tags,
            createdAt: currentBlog.createdAt,
            ...(blocks.length > 0 ? { blocks } : { content: currentBlog.content }),
        };

        try {
            await saveBlog(payload as Parameters<typeof saveBlog>[0]);
            const list = await getBlogs();
            setBlogs(list);
            setIsEditing(false);
            setCurrentBlog({});
            setIsSheetOpen(false);
        } catch (err) {
            alert("Failed to save: " + (err as Error).message);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure?")) return;
        try {
            await deleteBlog(id);
            const list = await getBlogs();
            setBlogs(list);
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
            <div className="min-h-screen bg-background">
                {/* Navbar for Editor */}
                <div className="flex items-center justify-between px-4 py-3 border-b sticky top-0 bg-background/95 backdrop-blur z-10">
                    <div className="flex items-center gap-4">
                        <div className="font-serif font-bold text-xl">Medium Clone</div>
                        <span className="text-sm text-muted-foreground">Draft</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                            <SheetTrigger asChild>
                                <Button className="rounded-full bg-green-600 hover:bg-green-700 text-white">Publish</Button>
                            </SheetTrigger>
                            <SheetContent>
                                <SheetHeader>
                                    <SheetTitle>Publishing Steps</SheetTitle>
                                </SheetHeader>
                                <div className="grid gap-6 py-6">
                                    <div className="space-y-2">
                                        <Label>Summary</Label>
                                        <Textarea
                                            value={currentBlog.summary || ""}
                                            onChange={(e) => setCurrentBlog({ ...currentBlog, summary: e.target.value })}
                                            placeholder="Preview text..."
                                            className="h-24 resize-none"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Cover Image URL</Label>
                                        <Input
                                            value={currentBlog.coverImage || ""}
                                            onChange={(e) => setCurrentBlog({ ...currentBlog, coverImage: e.target.value })}
                                            placeholder="https://..."
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Tags</Label>
                                        <Input
                                            value={Array.isArray(currentBlog.tags) ? currentBlog.tags.join(", ") : currentBlog.tags || ""}
                                            onChange={(e) => setCurrentBlog({ ...currentBlog, tags: e.target.value.split(',').map(t => t.trim()) })}
                                            placeholder="Tech, Life, Coding"
                                        />
                                    </div>
                                    <Button onClick={handleSave} className="w-full">Confirm & Publish</Button>
                                </div>
                            </SheetContent>
                        </Sheet>
                        <Button variant="ghost" size="icon" onClick={() => setIsEditing(false)}>
                            <LogOut className="h-5 w-5" />
                        </Button>
                    </div>
                </div>

                {/* Main Writing Area */}
                <div className="container max-w-3xl py-12 px-4 md:px-0 mx-auto">
                    {/* Title - Seamless */}
                    <Input
                        className="text-4xl md:text-5xl font-serif font-bold border-none shadow-none focus-visible:ring-0 px-0 h-auto placeholder:text-muted-foreground/30 mb-8"
                        value={currentBlog.title || ""}
                        onChange={(e) => setCurrentBlog({ ...currentBlog, title: e.target.value })}
                        placeholder="Title"
                        autoFocus
                    />

                    {/* Tiptap Editor */}
                    <div className="mb-20">
                        <Editor
                            content={currentBlog.content || ""}
                            onChange={(html) => setCurrentBlog({ ...currentBlog, content: html })}
                        />
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="container py-8 max-w-5xl">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Your Stories</h1>
                <div className="flex gap-2">
                    <Button onClick={() => { setCurrentBlog({}); setIsEditing(true); }} className="rounded-full">
                        <Plus className="mr-2 h-4 w-4" /> Write a story
                    </Button>
                    <Button variant="ghost" onClick={() => setIsAuthenticated(false)}>
                        Logout
                    </Button>
                </div>
            </div>

            <div className="grid gap-4">
                {blogs.length === 0 && (
                    <div className="text-center py-20 text-muted-foreground">
                        No stories yet. Start writing!
                    </div>
                )}
                {blogs.map(blog => (
                    <Card key={blog.id} className="group flex items-center justify-between p-6 hover:shadow-sm transition-all border-none shadow-none border-b rounded-none">
                        <div className="flex-1 space-y-1">
                            <h3 className="font-bold text-xl font-serif">{blog.title}</h3>
                            <p className="text-sm text-muted-foreground">
                                {new Date(blog.createdAt).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })} · {blog.summary?.slice(0, 100)}...
                            </p>
                            <div className="flex gap-2 pt-2">
                                {blog.tags.map(tag => (
                                    <span key={tag} className="bg-muted px-2 py-0.5 rounded-full text-xs text-muted-foreground">{tag}</span>
                                ))}
                            </div>
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
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
        </div>
    );
};

export default Admin;
