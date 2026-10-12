import { Link } from "react-router-dom";
import { ArrowUpRight, Clock, Eye, Heart, MessageCircle } from "lucide-react";
import type { BlogPost } from "@/lib/storage";
import { commentCountOf, formatDate, readingTimeOf } from "@/lib/blog";
import CoverArt from "@/components/blog/CoverArt";
import { cn } from "@/lib/utils";

const Stats = ({ blog }: { blog: BlogPost }) => {
    const comments = commentCountOf(blog);
    return (
        <div className="flex items-center gap-3 text-xs text-ink-400">
            {(blog.readCount ?? 0) > 0 && (
                <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" />{blog.readCount}</span>
            )}
            {(blog.likes ?? 0) > 0 && (
                <span className="flex items-center gap-1"><Heart className="h-3.5 w-3.5" />{blog.likes}</span>
            )}
            {comments > 0 && (
                <span className="flex items-center gap-1"><MessageCircle className="h-3.5 w-3.5" />{comments}</span>
            )}
        </div>
    );
};

export const MetaLine = ({ blog, className }: { blog: BlogPost; className?: string }) => (
    <div className={cn("flex items-center gap-2 text-xs font-medium uppercase tracking-[0.12em] text-ink-400", className)}>
        <span>{formatDate(blog.createdAt)}</span>
        <span className="h-1 w-1 rounded-full bg-ember-500" />
        <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{readingTimeOf(blog)} min read</span>
    </div>
);

/** Large split card for the most recent post. */
export const FeaturedCard = ({ blog }: { blog: BlogPost }) => (
    <Link
        to={`/blog/${blog.id}`}
        className="group grid overflow-hidden rounded-3xl border border-sand-line bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-ink-950/5 md:grid-cols-[1.15fr_1fr]"
    >
        <CoverArt
            src={blog.coverImage}
            title={blog.title}
            label={blog.tags?.[0]}
            className="aspect-[16/10] md:aspect-auto md:min-h-[340px]"
            imgClassName="transition-transform duration-700 group-hover:scale-[1.03]"
        />
        <div className="flex flex-col gap-4 p-6 md:p-10">
            <span className="w-fit rounded-full bg-ember-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-ember-700">
                Latest
            </span>
            <h2 className="font-display text-3xl font-semibold leading-[1.15] tracking-tight text-ink-950 md:text-4xl">
                {blog.title}
            </h2>
            {blog.summary && <p className="line-clamp-3 text-base leading-relaxed text-ink-500">{blog.summary}</p>}
            <div className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-4">
                <MetaLine blog={blog} />
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-ink-950 group-hover:text-ember-600">
                    Read article <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
            </div>
        </div>
    </Link>
);

const BlogCard = ({ blog, compact = false }: { blog: BlogPost; compact?: boolean }) => (
    <Link
        to={`/blog/${blog.id}`}
        className="group flex h-full flex-col overflow-hidden rounded-2xl border border-sand-line bg-white transition-all duration-300 hover:-translate-y-1 hover:border-ink-200 hover:shadow-xl hover:shadow-ink-950/5"
    >
        <CoverArt
            src={blog.coverImage}
            title={blog.title}
            label={blog.tags?.[0]}
            className={compact ? "aspect-[16/8]" : "aspect-[16/10]"}
            imgClassName="transition-transform duration-700 group-hover:scale-[1.04]"
        />
        <div className="flex flex-1 flex-col gap-3 p-5 md:p-6">
            {(blog.tags?.length ?? 0) > 0 && (
                <div className="flex flex-wrap gap-1.5">
                    {blog.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="rounded-full bg-sand px-2.5 py-0.5 text-[11px] font-medium text-ink-600">
                            {tag}
                        </span>
                    ))}
                </div>
            )}
            <h3 className="line-clamp-2 font-display text-xl font-semibold leading-snug tracking-tight text-ink-950 transition-colors group-hover:text-ember-700">
                {blog.title}
            </h3>
            {!compact && blog.summary && <p className="line-clamp-3 text-sm leading-relaxed text-ink-500">{blog.summary}</p>}
            <div className="mt-auto flex items-center justify-between gap-3 border-t border-sand-line pt-4">
                <MetaLine blog={blog} className="text-[10px]" />
                <Stats blog={blog} />
            </div>
        </div>
    </Link>
);

export default BlogCard;
