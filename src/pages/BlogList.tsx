import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import { getBlogsSearch, getBlogTags, type BlogPost } from "@/lib/storage";
import BlogCard, { FeaturedCard } from "@/components/blog/BlogCard";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const BlogList = () => {
    const [result, setResult] = useState<{ key: string; blogs: BlogPost[]; error: string | null } | null>(null);
    const [tags, setTags] = useState<string[]>([]);
    const [searchInput, setSearchInput] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedTag, setSelectedTag] = useState("");

    // Debounce typing so we don't hit the API on every keystroke.
    useEffect(() => {
        const t = setTimeout(() => setSearchQuery(searchInput), 300);
        return () => clearTimeout(t);
    }, [searchInput]);

    const queryKey = `${searchQuery}\u0000${selectedTag}`;
    useEffect(() => {
        let cancelled = false;
        getBlogsSearch({ search: searchQuery || undefined, tag: selectedTag || undefined })
            .then((blogs) => !cancelled && setResult({ key: queryKey, blogs, error: null }))
            .catch((err) => !cancelled && setResult({ key: queryKey, blogs: [], error: (err as Error).message }));
        return () => {
            cancelled = true;
        };
    }, [queryKey, searchQuery, selectedTag]);

    const loading = result?.key !== queryKey;
    const blogs = loading ? [] : result.blogs;
    const error = loading ? null : result.error;

    useEffect(() => {
        getBlogTags().then(setTags).catch(() => setTags([]));
    }, []);

    useEffect(() => {
        document.title = "Logs | Amal V S";
    }, []);

    const filtering = Boolean(searchQuery || selectedTag);
    const [featured, ...rest] = blogs;
    const gridPosts = filtering ? blogs : rest;

    return (
        <div className="bg-paper font-reading text-ink-800">
            {/* Hero */}
            <section className="relative overflow-hidden bg-ink-950 text-white">
                <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-ember-500/30 blur-[120px]" aria-hidden />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:linear-gradient(to_bottom,black,transparent)]" aria-hidden />
                <div className="relative mx-auto max-w-6xl px-4 pb-14 pt-16 sm:px-6 md:pb-20 md:pt-24 lg:px-8">
                    <p className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-ember-300">
                        <span className="h-px w-8 bg-ember-400" /> Engineering logs
                    </p>
                    <h1 className="max-w-3xl font-display text-4xl font-semibold leading-[1.1] tracking-tight md:text-6xl">
                        Notes on building systems that <em className="font-medium italic text-ember-400">hold up</em>.
                    </h1>
                    <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-200 md:text-lg">
                        Field notes on AI, backend architecture and cloud infrastructure — what worked, what broke, and why.
                    </p>

                    <div className="relative mt-10 max-w-xl">
                        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-300" />
                        <input
                            type="search"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            placeholder="Search articles, topics, tags…"
                            className="h-12 w-full rounded-full border border-white/10 bg-white/5 pl-11 pr-11 text-sm text-white placeholder:text-ink-300 outline-none backdrop-blur transition focus:border-ember-400 focus:bg-white/10 focus:ring-4 focus:ring-ember-500/20"
                        />
                        {searchInput && (
                            <button
                                type="button"
                                onClick={() => setSearchInput("")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-ink-300 hover:bg-white/10 hover:text-white"
                                title="Clear search"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                </div>
            </section>

            {/* Tag filter */}
            {tags.length > 0 && (
                <div className="sticky top-16 z-30 border-b border-sand-line bg-paper/90 backdrop-blur">
                    <div className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 py-3 sm:px-6 lg:px-8 [scrollbar-width:none]">
                        {["", ...tags].map((tag) => (
                            <button
                                key={tag || "all"}
                                type="button"
                                onClick={() => setSelectedTag(tag)}
                                className={cn(
                                    "shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                                    selectedTag === tag
                                        ? "border-ink-950 bg-ink-950 text-white"
                                        : "border-sand-line bg-white text-ink-600 hover:border-ink-300 hover:text-ink-950"
                                )}
                            >
                                {tag || "All"}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
                {loading && (
                    <div className="space-y-10">
                        <Skeleton className="h-[340px] w-full rounded-3xl bg-sand" />
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {[0, 1, 2].map((i) => <Skeleton key={i} className="h-80 rounded-2xl bg-sand" />)}
                        </div>
                    </div>
                )}

                {!loading && error && (
                    <div className="rounded-2xl border border-ember-200 bg-ember-50 p-8 text-center text-ember-800">
                        Couldn&apos;t load posts. {error}
                    </div>
                )}

                {!loading && !error && blogs.length === 0 && (
                    <div className="rounded-3xl border border-dashed border-sand-line py-20 text-center">
                        <p className="font-display text-2xl text-ink-900">Nothing matches that yet.</p>
                        <p className="mt-2 text-ink-500">Try another keyword or clear the filter.</p>
                        {filtering && (
                            <button
                                type="button"
                                onClick={() => { setSearchInput(""); setSelectedTag(""); }}
                                className="mt-6 rounded-full bg-ink-950 px-5 py-2 text-sm font-semibold text-white hover:bg-ember-600"
                            >
                                Clear filters
                            </button>
                        )}
                    </div>
                )}

                {!loading && !error && blogs.length > 0 && (
                    <>
                        {filtering ? (
                            <p className="mb-8 text-sm text-ink-500">
                                {blogs.length} {blogs.length === 1 ? "article" : "articles"}
                                {selectedTag && <> tagged <strong className="text-ink-950">{selectedTag}</strong></>}
                                {searchQuery && <> matching “<strong className="text-ink-950">{searchQuery}</strong>”</>}
                            </p>
                        ) : (
                            <FeaturedCard blog={featured} />
                        )}

                        {gridPosts.length > 0 && (
                            <>
                                {!filtering && (
                                    <div className="mb-8 mt-16 flex items-end justify-between border-b border-sand-line pb-4">
                                        <h2 className="font-display text-2xl font-semibold text-ink-950 md:text-3xl">More articles</h2>
                                        <span className="text-sm text-ink-400">{blogs.length} published</span>
                                    </div>
                                )}
                                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                    {gridPosts.map((blog) => <BlogCard key={blog.id} blog={blog} />)}
                                </div>
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default BlogList;
