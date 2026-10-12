import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Calendar, ChevronDown, Clock, Eye, Heart, List, Mail, MessageCircle } from "lucide-react";
import {
    addComment,
    getBlogById,
    getBlogs,
    likeBlog,
    recordRead,
    type BlogComment,
    type BlogPost as BlogPostType,
} from "@/lib/storage";
import { AUTHOR, addHeadingIds, formatDate, readingTimeOf } from "@/lib/blog";
import CoverArt from "@/components/blog/CoverArt";
import ShareButtons from "@/components/blog/ShareButtons";
import TableOfContents from "@/components/blog/TableOfContents";
import ReadingProgress from "@/components/blog/ReadingProgress";
import BlogCard from "@/components/blog/BlogCard";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const LIKED_KEY = "blog:liked";

function hasLiked(id: string): boolean {
    try {
        return (JSON.parse(localStorage.getItem(LIKED_KEY) ?? "[]") as string[]).includes(id);
    } catch {
        return false;
    }
}

function rememberLike(id: string) {
    try {
        const ids = JSON.parse(localStorage.getItem(LIKED_KEY) ?? "[]") as string[];
        localStorage.setItem(LIKED_KEY, JSON.stringify([...new Set([...ids, id])]));
    } catch {
        /* storage unavailable */
    }
}

const SidebarHeading = ({ children }: { children: React.ReactNode }) => (
    <h4 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-400">{children}</h4>
);

const PostSkeleton = () => (
    <div className="bg-paper">
        <div className="bg-ink-950">
            <div className="mx-auto grid max-w-7xl gap-10 px-4 pb-16 pt-14 sm:px-6 lg:grid-cols-2 lg:px-8 lg:pt-20">
                <div className="space-y-5">
                    <Skeleton className="h-5 w-40 bg-white/10" />
                    <Skeleton className="h-12 w-full bg-white/10" />
                    <Skeleton className="h-12 w-3/4 bg-white/10" />
                    <Skeleton className="h-5 w-64 bg-white/10" />
                </div>
                <Skeleton className="aspect-[16/9] w-full rounded-2xl bg-white/10" />
            </div>
        </div>
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[260px_1fr] lg:px-8">
            <Skeleton className="hidden h-64 rounded-2xl bg-sand lg:block" />
            <div className="max-w-[720px] space-y-4">
                {[100, 95, 100, 80, 100, 60].map((w, i) => (
                    <Skeleton key={i} className="h-4 rounded bg-sand" style={{ width: `${w}%` }} />
                ))}
            </div>
        </div>
    </div>
);

const BlogPost = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [blog, setBlog] = useState<BlogPostType | null>(null);
    const [likes, setLikes] = useState(0);
    const [readCount, setReadCount] = useState(0);
    const [likedNow, setLikedNow] = useState<string[]>([]);
    const [related, setRelated] = useState<BlogPostType[]>([]);
    const [commentName, setCommentName] = useState("");
    const [commentText, setCommentText] = useState("");
    const [submittingComment, setSubmittingComment] = useState(false);
    const articleRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const readRecorded = useRef<string | null>(null);

    useEffect(() => {
        if (!id) return;
        getBlogById(id)
            .then((found) => {
                if (!found) return navigate("/blog");
                setBlog(found);
                setLikes(found.likes ?? 0);
                setReadCount(found.readCount ?? 0);
            })
            .catch(() => navigate("/blog"));
        window.scrollTo({ top: 0 });
    }, [id, navigate]);

    // Record read count once per post view
    useEffect(() => {
        if (!id || !blog || readRecorded.current === id) return;
        readRecorded.current = id;
        recordRead(id).then((res) => setReadCount(res.readCount)).catch(() => {});
    }, [id, blog]);

    // Related posts: share a tag first, then fall back to most recent
    useEffect(() => {
        if (!blog) return;
        getBlogs()
            .then((all) => {
                const others = all.filter((b) => b.id !== blog.id);
                const tagSet = new Set(blog.tags ?? []);
                const score = (b: BlogPostType) => (b.tags ?? []).filter((t) => tagSet.has(t)).length;
                setRelated([...others].sort((a, b) => score(b) - score(a)).slice(0, 3));
            })
            .catch(() => setRelated([]));
    }, [blog]);

    // Legacy posts stored as a single HTML string: render embedded HTML blocks in sandboxed iframes
    useEffect(() => {
        if (blog?.blocks && blog.blocks.length > 0) return;
        contentRef.current?.querySelectorAll('[data-type="html-block"]').forEach((block) => {
            const div = block as HTMLElement;
            const html = div.getAttribute("data-html");
            if (!html) return;
            div.innerHTML = "";
            const iframe = document.createElement("iframe");
            iframe.setAttribute("title", "HTML block");
            iframe.sandbox.add("allow-scripts");
            iframe.srcdoc = html;
            iframe.className = "w-full border-0 my-8 bg-white";
            iframe.style.minHeight = "320px";
            div.appendChild(iframe);
        });
    }, [blog?.content, blog?.blocks]);

    // Body fragments with heading ids injected, plus the table of contents built from them
    const body = useMemo(() => {
        const blocks = blog?.blocks ?? [];
        const useBlocks = blocks.length > 0;
        const rich = useBlocks ? blocks.map((b) => (b.type === "html" ? "" : b.content ?? "")) : [blog?.content ?? ""];
        const { fragments, headings } = addHeadingIds(rich);
        return { useBlocks, fragments, headings };
    }, [blog]);
    const headings = body.headings;

    // OG meta for share previews
    useEffect(() => {
        if (!blog) return;
        const setMeta = (property: string, content: string) => {
            let el = document.querySelector(`meta[property="${property}"]`);
            if (!el) {
                el = document.createElement("meta");
                el.setAttribute("property", property);
                document.head.appendChild(el);
            }
            el.setAttribute("content", content);
        };
        setMeta("og:title", blog.title);
        setMeta("og:description", blog.summary || blog.title);
        setMeta("og:image", blog.coverImage || "");
        setMeta("og:url", window.location.href);
        document.title = `${blog.title} | Amal V S`;
        return () => {
            document.title = "Amal V S | Blog";
        };
    }, [blog]);

    const loading = !blog || blog.id !== id;
    const liked = Boolean(id && (likedNow.includes(id) || hasLiked(id)));

    const handleLike = () => {
        if (!id || liked) return;
        setLikedNow((ids) => [...ids, id]);
        setLikes((n) => n + 1);
        rememberLike(id);
        likeBlog(id).then((res) => setLikes(res.likes)).catch(() => {});
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
                                  { ...newComment, createdAt: newComment.createdAt ?? new Date().toISOString() },
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

    if (loading || !blog) return <PostSkeleton />;

    const tags = Array.isArray(blog.tags) ? blog.tags : [];
    const comments: BlogComment[] = blog.comments ?? [];
    const url = window.location.href.split("#")[0];
    const minutes = readingTimeOf(blog);

    const likeButton = (
        <button
            type="button"
            onClick={handleLike}
            disabled={liked}
            className={cn(
                "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-all",
                liked
                    ? "border-ember-500 bg-ember-500 text-white"
                    : "border-ink-200 text-ink-800 hover:border-ember-500 hover:text-ember-600"
            )}
        >
            <Heart className={cn("h-4 w-4", liked && "fill-current")} />
            {likes} {likes === 1 ? "like" : "likes"}
        </button>
    );

    return (
        <div className="bg-paper font-reading text-ink-800">
            <ReadingProgress target={articleRef} />

            {/* ── Hero ── */}
            <section className="relative overflow-hidden bg-ink-950 text-white">
                <div className="absolute -left-40 top-0 h-[28rem] w-[28rem] rounded-full bg-ember-500/20 blur-[140px]" aria-hidden />
                <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 pb-14 pt-10 sm:px-6 md:pb-20 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:pt-16">
                    <div>
                        <nav className="mb-8 flex items-center gap-2 text-sm text-ink-300">
                            <Link to="/blog" className="inline-flex items-center gap-1.5 hover:text-white">
                                <ArrowLeft className="h-4 w-4" /> All logs
                            </Link>
                            {tags[0] && (
                                <>
                                    <span className="text-ink-500">/</span>
                                    <span className="text-ember-300">{tags[0]}</span>
                                </>
                            )}
                        </nav>
                        <h1 className="font-display text-[2rem] font-semibold leading-[1.12] tracking-tight md:text-5xl">
                            {blog.title}
                        </h1>
                        {blog.summary && (
                            <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-200 md:text-lg">{blog.summary}</p>
                        )}
                        <ul className="mt-8 flex flex-wrap items-center gap-y-3 text-xs font-medium uppercase tracking-[0.12em] text-ink-200 md:text-sm">
                            {[
                                { icon: Clock, text: `${minutes} min read` },
                                { icon: Calendar, text: formatDate(blog.createdAt) },
                                ...(readCount > 0 ? [{ icon: Eye, text: `${readCount} reads` }] : []),
                            ].map(({ icon: Icon, text }) => (
                                <li key={text} className="flex items-center gap-2 border-r border-white/15 pr-4 mr-4 last:mr-0 last:border-0 last:pr-0">
                                    <Icon className="h-4 w-4 text-ember-400" />
                                    {text}
                                </li>
                            ))}
                        </ul>
                        <div className="mt-8 flex items-center gap-3">
                            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ember-500 font-display text-lg font-semibold">
                                {AUTHOR.name.charAt(0)}
                            </span>
                            <div className="leading-tight">
                                <p className="text-sm font-semibold">{AUTHOR.name}</p>
                                <p className="text-xs text-ink-300">{AUTHOR.role}</p>
                            </div>
                        </div>
                    </div>
                    <CoverArt
                        src={blog.coverImage}
                        title={blog.title}
                        label={tags[0]}
                        className="aspect-[610/343] w-full rounded-2xl shadow-2xl shadow-black/40 ring-1 ring-white/10 lg:ml-auto lg:max-w-[38rem]"
                    />
                </div>
            </section>

            {/* ── Body ── */}
            <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
                <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-16">
                    {/* Sidebar */}
                    <aside className="hidden w-[260px] shrink-0 flex-col gap-10 lg:sticky lg:top-24 lg:flex lg:max-h-[calc(100vh-7rem)]">
                        {headings.length > 0 && (
                            <div className="min-h-0 overflow-y-auto pr-2">
                                <SidebarHeading>On this page</SidebarHeading>
                                <TableOfContents headings={headings} />
                            </div>
                        )}
                        <div className="shrink-0">
                            <SidebarHeading>Share</SidebarHeading>
                            <ShareButtons url={url} title={blog.title} />
                        </div>
                        <div className="shrink-0 rounded-2xl bg-ink-950 p-5 text-white">
                            <p className="font-display text-lg font-semibold leading-snug">Building something similar?</p>
                            <p className="mt-2 text-sm leading-relaxed text-ink-200">
                                Happy to compare notes on architecture, AI pipelines or scaling.
                            </p>
                            <a
                                href={`mailto:${AUTHOR.email}?subject=${encodeURIComponent(`Re: ${blog.title}`)}`}
                                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-ember-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-ember-600"
                            >
                                <Mail className="h-4 w-4" /> Get in touch
                            </a>
                        </div>
                    </aside>

                    {/* Article */}
                    <div className="min-w-0 flex-1">
                        <div className="max-w-[720px]">
                            {/* Mobile contents */}
                            {headings.length > 0 && (
                                <details className="group mb-10 rounded-2xl border border-sand-line bg-white lg:hidden">
                                    <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4 text-sm font-semibold text-ink-950">
                                        <span className="flex items-center gap-2"><List className="h-4 w-4 text-ember-500" /> On this page</span>
                                        <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
                                    </summary>
                                    <div className="px-5 pb-5">
                                        <TableOfContents headings={headings} />
                                    </div>
                                </details>
                            )}

                            <article ref={articleRef} className="article-body">
                                {body.useBlocks ? (
                                    (blog.blocks ?? []).map((block, i) =>
                                        block.type === "html" ? (
                                            <iframe
                                                key={i}
                                                title="HTML block"
                                                srcDoc={block.content ?? ""}
                                                sandbox="allow-scripts"
                                                className="block w-full border-0 bg-white"
                                                style={{ minHeight: "320px" }}
                                            />
                                        ) : (
                                            <div key={i} className="blog-content-block" dangerouslySetInnerHTML={{ __html: body.fragments[i] }} />
                                        )
                                    )
                                ) : (
                                    <div ref={contentRef} className="blog-content-block" dangerouslySetInnerHTML={{ __html: body.fragments[0] }} />
                                )}
                            </article>

                            {/* Tags + reactions */}
                            <div className="mt-14 flex flex-col gap-6 border-y border-sand-line py-6 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex flex-wrap gap-2">
                                    {tags.map((tag) => (
                                        <span key={tag} className="rounded-full bg-sand px-3 py-1 text-xs font-medium text-ink-600">#{tag}</span>
                                    ))}
                                </div>
                                <div className="flex flex-wrap items-center gap-4">
                                    {likeButton}
                                    <ShareButtons url={url} title={blog.title} className="lg:hidden" />
                                </div>
                            </div>

                            {/* Author */}
                            <div className="mt-10 flex flex-col gap-5 rounded-3xl bg-white p-6 ring-1 ring-sand-line sm:flex-row sm:items-center md:p-8">
                                <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-ink-950 font-display text-3xl font-semibold text-ember-400">
                                    {AUTHOR.name.charAt(0)}
                                </span>
                                <div className="flex-1">
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-400">Written by</p>
                                    <p className="mt-1 font-display text-xl font-semibold text-ink-950">{AUTHOR.name}</p>
                                    <p className="mt-1 text-sm leading-relaxed text-ink-500">{AUTHOR.bio}</p>
                                </div>
                                <a
                                    href={AUTHOR.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex shrink-0 items-center gap-1 rounded-full border border-ink-200 px-4 py-2 text-sm font-semibold text-ink-900 hover:border-ink-950"
                                >
                                    Follow <ArrowRight className="h-4 w-4" />
                                </a>
                            </div>

                            {/* Comments */}
                            <section className="mt-16">
                                <h3 className="flex items-center gap-2 font-display text-2xl font-semibold text-ink-950">
                                    <MessageCircle className="h-5 w-5 text-ember-500" />
                                    Discussion {comments.length > 0 && <span className="text-ink-400">({comments.length})</span>}
                                </h3>

                                <form onSubmit={handleCommentSubmit} className="mt-6 rounded-2xl border border-sand-line bg-white p-4 focus-within:border-ink-300 md:p-5">
                                    <textarea
                                        value={commentText}
                                        onChange={(e) => setCommentText(e.target.value)}
                                        placeholder="Share a thought or ask a question…"
                                        rows={3}
                                        required
                                        className="w-full resize-none bg-transparent text-[15px] leading-relaxed text-ink-900 outline-none placeholder:text-ink-300"
                                    />
                                    <div className="mt-3 flex flex-col gap-3 border-t border-sand-line pt-3 sm:flex-row sm:items-center">
                                        <input
                                            value={commentName}
                                            onChange={(e) => setCommentName(e.target.value)}
                                            placeholder="Your name (optional)"
                                            className="flex-1 bg-transparent text-sm text-ink-800 outline-none placeholder:text-ink-300"
                                        />
                                        <button
                                            type="submit"
                                            disabled={!commentText.trim() || submittingComment}
                                            className="rounded-full bg-ink-950 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-ember-600 disabled:cursor-not-allowed disabled:opacity-40"
                                        >
                                            {submittingComment ? "Posting…" : "Post comment"}
                                        </button>
                                    </div>
                                </form>

                                <ul className="mt-8 space-y-6">
                                    {comments.length === 0 && <li className="text-sm text-ink-400">No comments yet — start the conversation.</li>}
                                    {comments.map((c, i) => (
                                        <li key={c._id ?? c.id ?? i} className="flex gap-4">
                                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sand text-sm font-semibold text-ink-700">
                                                {(c.name || "A").charAt(0).toUpperCase()}
                                            </span>
                                            <div className="min-w-0 flex-1">
                                                <p className="flex flex-wrap items-baseline gap-x-2 text-sm">
                                                    <span className="font-semibold text-ink-950">{c.name || "Anonymous"}</span>
                                                    {c.createdAt && <span className="text-xs text-ink-400">{formatDate(c.createdAt)}</span>}
                                                </p>
                                                <p className="mt-1 whitespace-pre-wrap text-[15px] leading-relaxed text-ink-700">{c.text}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        </div>
                    </div>
                </div>
            </section>

            {/* Keep reading */}
            {related.length > 0 && (
                <section className="border-t border-sand-line bg-sand/50">
                    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                        <div className="mb-8 flex items-end justify-between">
                            <h2 className="font-display text-3xl font-semibold text-ink-950">Keep reading</h2>
                            <Link to="/blog" className="inline-flex items-center gap-1 text-sm font-semibold text-ink-700 hover:text-ember-600">
                                All logs <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {related.map((b) => <BlogCard key={b.id} blog={b} compact />)}
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
};

export default BlogPost;
