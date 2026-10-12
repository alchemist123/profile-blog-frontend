/**
 * Auto-height for sandboxed HTML embeds.
 *
 * Embeds run in an iframe with sandbox="allow-scripts" only (opaque origin), so the page cannot
 * measure them directly. We append a small script that reports the document height via
 * postMessage, and size the iframe to match so the embed reads as part of the article instead
 * of a scrollable box. Embeds styled as full pages (body { min-height: 100vh }) are neutralised,
 * since 100vh inside an iframe is the iframe's own height.
 */

const MAX_EMBED_HEIGHT = 8000;
const MESSAGE_TYPE = "blog-embed-height";

let nextId = 0;

function buildDoc(html: string, id: string): string {
    const style =
        "<style>html,body{min-height:0!important;height:auto!important}" +
        "html{overflow-y:hidden!important;overflow-x:auto}</style>";
    const script = `<script>(function(){
var id=${JSON.stringify(id)},last=0;
function send(){var b=document.body;if(!b)return;
var cs=getComputedStyle(b);
var h=Math.ceil(b.getBoundingClientRect().height+parseFloat(cs.marginTop||0)+parseFloat(cs.marginBottom||0));
if(Math.abs(h-last)<2)return;last=h;
parent.postMessage({type:${JSON.stringify(MESSAGE_TYPE)},id:id,height:h},"*");}
if(window.ResizeObserver)new ResizeObserver(send).observe(document.body||document.documentElement);
window.addEventListener("load",send);
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(send);
setTimeout(send,250);send();
})();</script>`;
    return html + style + script;
}

/** Load `html` into `iframe` and keep the iframe's height in sync with its content. Returns a cleanup. */
export function attachAutoHeightEmbed(iframe: HTMLIFrameElement, html: string, onHeight?: (h: number) => void): () => void {
    const id = `embed-${++nextId}`;
    const onMessage = (e: MessageEvent) => {
        // Only trust messages from this iframe's own window, carrying this embed's id.
        if (e.source !== iframe.contentWindow) return;
        const data = e.data as { type?: string; id?: string; height?: unknown };
        if (data?.type !== MESSAGE_TYPE || data.id !== id || typeof data.height !== "number") return;
        const h = Math.min(Math.max(Math.round(data.height), 40), MAX_EMBED_HEIGHT);
        iframe.style.height = `${h}px`;
        onHeight?.(h);
    };
    window.addEventListener("message", onMessage);
    iframe.setAttribute("sandbox", "allow-scripts");
    iframe.srcdoc = buildDoc(html, id);
    return () => window.removeEventListener("message", onMessage);
}
