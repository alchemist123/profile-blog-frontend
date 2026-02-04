import { Link } from "react-router-dom";
import { getBlogsSearch, getBlogTags, type BlogPost } from "@/lib/storage";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, ArrowRight, Search, Heart, MessageCircle, Eye } from "lucide-react";
import { useEffect, useState, useCallback } from "react";

const BlogList = () => {
    const [blogs, setBlogs] = useState<BlogPost[]>([]);
    const [tags, setTags] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedTag, setSelectedTag] = useState("");

    const fetchBlogs = useCallback(() => {
        setLoading(true);
        setError(null);
        getBlogsSearch({
            search: searchQuery || undefined,
            tag: selectedTag || undefined,
        })
            .then(setBlogs)
            .catch((err) => setError((err as Error).message))
            .finally(() => setLoading(false));
    }, [searchQuery, selectedTag]);

    useEffect(() => {
        fetchBlogs();
    }, [fetchBlogs]);

    useEffect(() => {
        getBlogTags()
            .then(setTags)
            .catch(() => setTags([]));
    }, []);

    return (
        <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center text-center space-y-4 mb-10">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Technical Blog</h1>
                <p className="max-w-[700px] text-muted-foreground text-lg">
                    Insights on AI, Backend Architecture, and Cloud Systems.
                </p>
            </div>

            {/* Search and tag filter */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search by title or summary..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                    />
                </div>
                <select
                    value={selectedTag}
                    onChange={(e) => setSelectedTag(e.target.value)}
                    className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 min-w-[180px]"
                >
                    <option value="">All tags</option>
                    {tags.map((tag) => (
                        <option key={tag} value={tag}>
                            {tag}
                        </option>
                    ))}
                </select>
            </div>

            {loading && (
                <div className="text-center py-12 text-muted-foreground">Loading posts...</div>
            )}
            {error && (
                <div className="text-center py-12 text-destructive">
                    Failed to load posts. {error}
                </div>
            )}
            {!loading && !error && (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {blogs.map((blog) => (
                        <Card key={blog.id} className="flex flex-col h-full hover:shadow-md transition-shadow">
                            {blog.coverImage && (
                                <div className="w-full h-48 overflow-hidden rounded-t-xl bg-muted">
                                    <img
                                        src={blog.coverImage}
                                        alt={blog.title}
                                        className="w-full h-full object-cover transition-transform hover:scale-105"
                                    />
                                </div>
                            )}
                            <CardHeader>
                                <div className="flex gap-2 mb-2 flex-wrap min-h-0 overflow-hidden">
                                    {(blog.tags ?? []).slice(0, 3).map((tag) => (
                                        <Badge key={tag} variant="secondary" className="text-xs shrink-0">
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                                <CardTitle className="line-clamp-2">{blog.title}</CardTitle>
                                <div className="flex items-center text-xs text-muted-foreground mt-2 gap-3 flex-wrap">
                                    <span className="flex items-center gap-1">
                                        <Calendar className="mr-0.5 h-3 w-3" />
                                        {new Date(blog.createdAt).toLocaleDateString()}
                                    </span>
                                    {(blog.readCount ?? 0) > 0 && (
                                        <span className="flex items-center gap-1">
                                            <Eye className="h-3 w-3" />
                                            {blog.readCount}
                                        </span>
                                    )}
                                    {(blog.likes ?? 0) > 0 && (
                                        <span className="flex items-center gap-1">
                                            <Heart className="h-3 w-3" />
                                            {blog.likes}
                                        </span>
                                    )}
                                    {((blog.comments?.length) ?? 0) > 0 && (
                                        <span className="flex items-center gap-1">
                                            <MessageCircle className="h-3 w-3" />
                                            {blog.comments?.length ?? 0}
                                        </span>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent className="flex-1">
                                <p className="text-muted-foreground line-clamp-3">{blog.summary}</p>
                            </CardContent>
                            <CardFooter>
                                <Button asChild className="w-full" variant="ghost">
                                    <Link to={`/blog/${blog.id}`}>
                                        Read More <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                    {blogs.length === 0 && (
                        <div className="col-span-full text-center py-12 text-muted-foreground">
                            No posts found. Try a different search or tag.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default BlogList;
