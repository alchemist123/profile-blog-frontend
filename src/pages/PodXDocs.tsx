/** PodX documentation — static site from /public/podx/docs.html */
export default function PodXDocs() {
    return (
        <div className="flex flex-col min-h-[calc(100vh-4rem)] bg-[#0d1117]">
            <iframe
                title="PodX documentation"
                src="/podx/docs.html"
                className="w-full flex-1 min-h-[calc(100vh-8rem)] border-0 block bg-[#0d1117]"
                sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
            />
        </div>
    );
}
