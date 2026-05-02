/**
 * Embeds the PodX landing site from /public/podx/index.html (built from web-site/).
 */
export default function PodXProject() {
    return (
        <div className="flex flex-col min-h-[calc(100vh-4rem)] bg-[#050709]">
            <iframe
                title="PodX — Distributed LLM cluster"
                src="/podx/index.html"
                className="w-full flex-1 min-h-[calc(100vh-8rem)] border-0 block bg-[#050709]"
                sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
            />
        </div>
    );
}
