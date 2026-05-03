import { NodeViewWrapper, type ReactNodeViewProps } from '@tiptap/react'
import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'

export function HtmlBlockView({ node, updateAttributes }: ReactNodeViewProps) {
    const attrs = node.attrs as { html?: string }
    const html = attrs.html ?? ''
    const [isEditing, setIsEditing] = useState(!html)
    const [editValue, setEditValue] = useState(html)
    const iframeRef = useRef<HTMLIFrameElement>(null)

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.data?.type === 'iframe-resize') {
                if (iframeRef.current && iframeRef.current.contentWindow === event.source) {
                    iframeRef.current.style.height = `${event.data.height}px`
                    if (iframeRef.current.parentElement) {
                        iframeRef.current.parentElement.style.height = `${event.data.height}px`
                    }
                }
            }
        }
        window.addEventListener('message', handleMessage)
        return () => window.removeEventListener('message', handleMessage)
    }, [])

    const handleApply = () => {
        updateAttributes({ html: editValue })
        setIsEditing(false)
    }

    const handleEdit = () => {
        setEditValue(html)
        setIsEditing(true)
    }

    // Embed script to send messages to parent to automatically resize
    const srcDocContent = html + `
<script>
    const sendHeight = () => {
        const height = document.documentElement.scrollHeight;
        window.parent.postMessage({ type: 'iframe-resize', height }, '*');
    };
    window.addEventListener('load', sendHeight);
    if (window.ResizeObserver) {
        new ResizeObserver(sendHeight).observe(document.body);
    }
</script>
`;

    return (
        <NodeViewWrapper className="html-block-wrapper my-4">
            <div className="rounded-lg border bg-muted/30 overflow-hidden">
                {isEditing ? (
                    <div className="p-3 space-y-2">
                        <textarea
                            className="w-full min-h-[120px] p-3 font-mono text-sm rounded-md bg-background border focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            placeholder="Paste or type HTML here..."
                            spellCheck={false}
                        />
                        <div className="flex gap-2">
                            <Button type="button" size="sm" onClick={handleApply}>
                                Apply & render
                            </Button>
                            {html && (
                                <Button type="button" size="sm" variant="ghost" onClick={() => setIsEditing(false)}>
                                    Cancel
                                </Button>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="relative group">
                        {html ? (
                            <div className="relative w-full resize-y overflow-hidden min-h-[800px] rounded-b-lg bg-white dark:bg-zinc-900 transition-[height]" style={{ height: '800px' }}>
                                <iframe
                                    ref={iframeRef}
                                    title="HTML block preview"
                                    srcDoc={srcDocContent}
                                    sandbox="allow-scripts"
                                    className="html-block-iframe w-full h-full border-0"
                                />
                            </div>
                        ) : (
                            <div
                                className="p-4 text-muted-foreground text-sm cursor-pointer hover:bg-muted/50"
                                onClick={handleEdit}
                            >
                                Click to add HTML...
                            </div>
                        )}
                        {html && (
                            <Button
                                type="button"
                                size="sm"
                                variant="ghost"
                                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={handleEdit}
                            >
                                Edit HTML
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </NodeViewWrapper>
    )
}
