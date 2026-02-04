import { useEffect, useState, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
    getBlogById,
    recordRead,
    likeBlog,
    addComment,
    type BlogPost as BlogPostType,
    type BlogComment,
} from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Calendar, User, Heart, MessageCircle, Eye, Share2, Copy, Check } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const shareUrl = (base: string, params: Record<string, string>) =>
    base + "?" + new URLSearchParams(params).toString();

const ShareButtons = ({
    url,
    title,
    onCopy,
    copied,
}: {
    url: string;
    title: string;
    onCopy: () => void;
    copied: boolean;
}) => {
    const text = `${title} ${url}`;
    const iconClass = "h-4 w-4";

    return (
        <div className="flex items-center gap-1">
            <a
                href={shareUrl("https://www.linkedin.com/sharing/share-offsite/", { url })}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                title="Share on LinkedIn"
            >
                <LinkedInIcon className={iconClass} />
                <span className="sr-only">LinkedIn</span>
            </a>
            <a
                href={`https://wa.me/?text=${encodeURIComponent(text)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                title="Share on WhatsApp"
            >
                <WhatsAppIcon className={iconClass} />
                <span className="sr-only">WhatsApp</span>
            </a>
            <a
                href={shareUrl("https://twitter.com/intent/tweet", { url: url, text: title })}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                title="Share on X (Twitter)"
            >
                <TwitterIcon className={iconClass} />
                <span className="sr-only">X</span>
            </a>
            <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => {
                    navigator.clipboard.writeText(url);
                    onCopy();
                }}
                title="Copy link"
            >
                {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
            </Button>
        </div>
    );
};

const LinkedInIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
);
const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
);
const TwitterIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
);

const BlogPost = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [blog, setBlog] = useState<BlogPostType | null>(null);
    const [loading, setLoading] = useState(true);
    const [likes, setLikes] = useState<number>(0);
    const [readCount, setReadCount] = useState<number>(0);
    const [liked, setLiked] = useState(false);
    const [commentName, setCommentName] = useState("");
    const [commentText, setCommentText] = useState("");
    const [submittingComment, setSubmittingComment] = useState(false);
    const [copied, setCopied] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);
    const readRecorded = useRef(false);

    useEffect(() => {
        if (!id) return;
        setLoading(true);
        getBlogById(id)
            .then((found) => {
                if (found) {
                    setBlog(found);
                    setLikes(found.likes ?? 0);
                    setReadCount(found.readCount ?? 0);
                } else {
                    navigate("/blog");
                }
            })
            .catch(() => navigate("/blog"))
            .finally(() => setLoading(false));
    }, [id, navigate]);

    // Record read count once when post is viewed
    useEffect(() => {
        if (!id || !blog || readRecorded.current) return;
        readRecorded.current = true;
        recordRead(id)
            .then((res) => setReadCount(res.readCount))
            .catch(() => {});
    }, [id, blog]);

    // Legacy: render HTML blocks in iframes when content is stored as single HTML (no blocks)
    useEffect(() => {
        if (blog?.blocks && blog.blocks.length > 0) return;
        const el = contentRef.current;
        if (!el) return;
        el.querySelectorAll('[data-type="html-block"]').forEach((block) => {
            const div = block as HTMLElement;
            const html = div.getAttribute("data-html");
            if (html) {
                div.innerHTML = "";
                const iframe = document.createElement("iframe");
                iframe.setAttribute("title", "HTML block");
                iframe.sandbox.add("allow-scripts");
                iframe.srcdoc = html;
                iframe.className = "w-full min-h-[320px] border-0 rounded-lg my-4 bg-white dark:bg-zinc-900";
                iframe.style.minHeight = "320px";
                div.appendChild(iframe);
            }
        });
    }, [blog?.content, blog?.blocks]);

    // OG meta for share preview (when link is shared)
    useEffect(() => {
        if (!blog) return;
        const title = blog.title;
        const desc = blog.summary || blog.title;
        const img = blog.coverImage || "";
        const url = typeof window !== "undefined" ? window.location.href : "";
        const setMeta = (property: string, content: string) => {
            let el = document.querySelector(`meta[property="${property}"]`);
            if (!el) {
                el = document.createElement("meta");
                el.setAttribute("property", property);
                document.head.appendChild(el);
            }
            el.setAttribute("content", content);
        };
        setMeta("og:title", title);
        setMeta("og:description", desc);
        setMeta("og:image", img);
        setMeta("og:url", url);
        document.title = `${title} | Blog`;
        return () => {
            document.title = "profile";
        };
    }, [blog]);

    const handleLike = () => {
        if (!id || liked) return;
        likeBlog(id)
            .then((res) => {
                setLikes(res.likes);
                setLiked(true);
            })
            .catch(() => {});
    };

    const handleCommentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!id || !commentText.trim() || submittingComment) return;
        setSubmittingComment(true);
        addComment(id, { name: commentName.trim() || undefined, text: commentText.trim() })
            .then((newComment) => {
                setBlog((prev) =>
                    prev
                        ? {
                              ...prev,
                              comments: [
                                  ...(prev.comments ?? []),
                                  {
                                      ...newComment,
                                      createdAt: newComment.createdAt ?? new Date().toISOString(),
                                  },
                              ],
                          }
                        : null
                );
                setCommentText("");
                setCommentName("");
            })
            .catch(() => {})
            .finally(() => setSubmittingComment(false));
    };

    const comments: BlogComment[] = blog?.comments ?? [];

    if (loading || !blog) {
        return (
            <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <Skeleton className="h-10 w-32 mb-8 rounded-md" />
                <div className="space-y-4 mb-8">
                    <div className="flex flex-wrap gap-2">
                        <Skeleton className="h-6 w-16 rounded-full" />
                        <Skeleton className="h-6 w-20 rounded-full" />
                        <Skeleton className="h-6 w-14 rounded-full" />
                    </div>
                    <Skeleton className="h-12 w-full max-w-2xl rounded-md" />
                    <Skeleton className="h-12 w-3/4 max-w-md rounded-md" />
                    <div className="flex gap-6 pt-2">
                        <Skeleton className="h-4 w-24 rounded" />
                        <Skeleton className="h-4 w-32 rounded" />
                    </div>
                </div>
                <Skeleton className="w-full h-[400px] rounded-xl mb-10" />
                <div className="space-y-3 mt-8">
                    <Skeleton className="h-4 w-full rounded" />
                    <Skeleton className="h-4 w-full rounded" />
                    <Skeleton className="h-4 w-4/5 rounded" />
                    <Skeleton className="h-4 w-full rounded" />
                    <Skeleton className="h-4 w-2/3 rounded" />
                </div>
                <div className="mt-12 pt-8 border-t flex flex-wrap items-center gap-6">
                    <Skeleton className="h-9 w-20 rounded-md" />
                    <div className="flex gap-2">
                        <Skeleton className="h-8 w-8 rounded-md" />
                        <Skeleton className="h-8 w-8 rounded-md" />
                        <Skeleton className="h-8 w-8 rounded-md" />
                    </div>
                </div>
                <div className="mt-10 pt-8 border-t space-y-4">
                    <Skeleton className="h-6 w-28 rounded" />
                    <Skeleton className="h-24 w-full rounded-md" />
                    <Skeleton className="h-10 w-24 rounded-md" />
                </div>
            </div>
        );
    }

    const tags = Array.isArray(blog.tags) ? blog.tags : [];

    return (
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <Button variant="ghost" className="mb-8 pl-0 hover:pl-2 transition-all" asChild>
                <Link to="/blog">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog
                </Link>
            </Button>

            <article className="prose prose-zinc dark:prose-invert lg:prose-xl max-w-none">
                <div className="space-y-4 mb-8">
                    <div className="flex flex-wrap gap-2">
                        {tags.map((tag) => (
                            <Badge key={tag} variant="secondary">
                                {tag}
                            </Badge>
                        ))}
                    </div>
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
                        {blog.title}
                    </h1>
                    <div className="flex flex-wrap items-center gap-6 text-muted-foreground text-sm">
                        <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <span>Amal V S</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>
                                {new Date(blog.createdAt).toLocaleDateString(undefined, {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                            </span>
                        </div>
                        {(readCount > 0) && (
                            <div className="flex items-center gap-2">
                                <Eye className="h-4 w-4" />
                                <span>{readCount} reads</span>
                            </div>
                        )}
                    </div>
                </div>

                {blog.coverImage && (
                    <div className="w-full h-[400px] overflow-hidden rounded-xl mb-10 bg-muted">
                        <img
                            src={blog.coverImage}
                            alt={blog.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}

                {(blog.blocks ?? []).length > 0 ? (
                    <div className="mt-8 leading-7 blog-content space-y-4">
                        {(blog.blocks ?? []).map((block, i) =>
                            block.type === "html" ? (
                                <iframe
                                    key={i}
                                    title="HTML block"
                                    srcDoc={block.content ?? ""}
                                    sandbox="allow-scripts"
                                    className="w-full min-h-[320px] border-0 rounded-lg my-4 bg-white dark:bg-zinc-900 block"
                                    style={{ minHeight: "320px" }}
                                />
                            ) : (
                                <div
                                    key={i}
                                    className="blog-content-block prose prose-zinc dark:prose-invert max-w-none [&_*]:max-w-none"
                                    dangerouslySetInnerHTML={{ __html: block.content ?? "" }}
                                />
                            )
                        )}
                    </div>
                ) : (
                    <div
                        ref={contentRef}
                        className="mt-8 leading-7 blog-content"
                        dangerouslySetInnerHTML={{ __html: blog.content ?? "" }}
                    />
                )}
            </article>

            {/* Like & Share */}
            <div className="mt-12 pt-8 border-t flex flex-wrap items-center gap-6">
                <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2"
                    onClick={handleLike}
                    disabled={liked}
                >
                    <Heart
                        className={`h-4 w-4 ${liked ? "fill-red-500 text-red-500" : ""}`}
                    />
                    {likes} {likes === 1 ? "like" : "likes"}
                </Button>

                <div className="flex items-center gap-2">
                    <Share2 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Share:</span>
                    <ShareButtons
                        url={typeof window !== "undefined" ? window.location.href : ""}
                        title={blog.title}
                        onCopy={() => {
                            setCopied(true);
                            setTimeout(() => setCopied(false), 2000);
                        }}
                        copied={copied}
                    />
                </div>
            </div>

            {/* Comments */}
            <div className="mt-10 pt-8 border-t">
                <h3 className="text-xl font-semibold flex items-center gap-2 mb-6">
                    <MessageCircle className="h-5 w-5" />
                    Comments {comments.length > 0 && `(${comments.length})`}
                </h3>

                <form onSubmit={handleCommentSubmit} className="space-y-4 mb-10">
                    <div className="space-y-2">
                        <Label htmlFor="comment-name">Name (optional)</Label>
                        <Input
                            id="comment-name"
                            placeholder="Your name or leave blank for Anonymous"
                            value={commentName}
                            onChange={(e) => setCommentName(e.target.value)}
                            className="max-w-md"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="comment-text">Comment</Label>
                        <Textarea
                            id="comment-text"
                            placeholder="Write a comment..."
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            rows={4}
                            required
                            className="max-w-full"
                        />
                    </div>
                    <Button type="submit" disabled={!commentText.trim() || submittingComment}>
                        {submittingComment ? "Posting..." : "Post comment"}
                    </Button>
                </form>

                <ul className="space-y-4 list-none p-0 m-0">
                    {comments.length === 0 && (
                        <li className="text-muted-foreground text-sm">No comments yet.</li>
                    )}
                    {comments.map((c, i) => (
                        <li
                            key={(c as BlogComment & { _id?: string })._id ?? c.id ?? i}
                            className="list-none"
                        >
                            <Card className="border bg-card shadow-sm overflow-hidden">
                                <CardContent className="p-4">
                                    <div className="flex items-baseline justify-between gap-2 flex-wrap">
                                        <span className="font-semibold text-sm text-primary bg-primary/10 px-2 py-0.5 rounded">
                                            {c.name || "Anonymous"}
                                        </span>
                                        {c.createdAt && (
                                            <span className="text-xs text-muted-foreground">
                                                {new Date(c.createdAt).toLocaleString(undefined, {
                                                    year: "numeric",
                                                    month: "short",
                                                    day: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-foreground mt-2 leading-relaxed whitespace-pre-wrap">
                                        {c.text}
                                    </p>
                                </CardContent>
                            </Card>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default BlogPost;
