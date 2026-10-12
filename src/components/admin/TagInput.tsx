import { useState } from "react";
import { X } from "lucide-react";

/** Chip input for tags with suggestions from existing tags. */
const TagInput = ({ tags, onChange, suggestions }: { tags: string[]; onChange: (t: string[]) => void; suggestions: string[] }) => {
    const [value, setValue] = useState("");
    const add = (raw: string) => {
        const t = raw.trim().replace(/^#/, "");
        if (t && !tags.some((x) => x.toLowerCase() === t.toLowerCase())) onChange([...tags, t]);
        setValue("");
    };
    const matches = value
        ? suggestions.filter((s) => s.toLowerCase().includes(value.toLowerCase()) && !tags.includes(s)).slice(0, 5)
        : [];

    return (
        <div className="relative">
            <div className="flex flex-wrap items-center gap-2">
                {tags.map((t) => (
                    <span key={t} className="inline-flex items-center gap-1 rounded-full bg-ink-950 py-1 pl-3 pr-1.5 text-xs font-medium text-white">
                        {t}
                        <button type="button" onClick={() => onChange(tags.filter((x) => x !== t))} className="rounded-full p-0.5 hover:bg-white/20" title={`Remove ${t}`}>
                            <X className="h-3 w-3" />
                        </button>
                    </span>
                ))}
                <input
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === ",") {
                            e.preventDefault();
                            add(value);
                        } else if (e.key === "Backspace" && !value && tags.length) {
                            onChange(tags.slice(0, -1));
                        }
                    }}
                    onBlur={() => value && add(value)}
                    placeholder={tags.length ? "Add tag" : "Add tags (press Enter)…"}
                    className="min-w-[140px] flex-1 bg-transparent py-1 text-sm text-ink-800 outline-none placeholder:text-ink-300"
                />
            </div>
            {matches.length > 0 && (
                <div className="absolute left-0 top-full z-30 mt-1 flex flex-wrap gap-1 rounded-xl border border-sand-line bg-white p-2 shadow-lg">
                    {matches.map((m) => (
                        <button key={m} type="button" onMouseDown={(e) => { e.preventDefault(); add(m); }} className="rounded-full bg-sand px-3 py-1 text-xs text-ink-700 hover:bg-ink-950 hover:text-white">
                            {m}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TagInput;
