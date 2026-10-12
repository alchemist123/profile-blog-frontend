import { Extension, Node, mergeAttributes } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import type { MediaKind, MediaSelection } from '@/lib/media'

/** Self-hosted or direct-URL video block. Portrait clips render narrower, like a reel. */
export const Video = Node.create({
    name: 'video',
    group: 'block',
    atom: true,
    draggable: true,

    addAttributes() {
        return {
            src: { default: null },
            poster: { default: null },
            orientation: {
                default: 'landscape',
                parseHTML: (el) => (el.getAttribute('data-orientation') === 'portrait' ? 'portrait' : 'landscape'),
                renderHTML: (attrs) => ({ 'data-orientation': attrs.orientation }),
            },
        }
    },

    parseHTML() {
        return [{ tag: 'video[src]' }]
    },

    renderHTML({ HTMLAttributes }) {
        return ['video', mergeAttributes({ controls: 'true', playsinline: 'true', preload: 'metadata' }, HTMLAttributes)]
    },

    addCommands() {
        return {
            setVideo:
                (attrs) =>
                ({ commands }) =>
                    commands.insertContent({ type: this.name, attrs }),
        }
    },
})

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        video: {
            setVideo: (attrs: { src: string; poster?: string; orientation?: 'portrait' | 'landscape' }) => ReturnType
        }
    }
}

export interface MediaBridgeStorage {
    /** Opens the media picker; set by the Editor component. */
    pick: ((kind: MediaKind) => Promise<MediaSelection | null>) | null
    /** Uploads dropped/pasted files and inserts them at `pos`; set by the Editor component. */
    uploadFiles: ((files: File[], pos: number) => void) | null
}

/** Connects the editor to the app's media picker and handles dropped / pasted files. */
export const MediaBridge = Extension.create<object, MediaBridgeStorage>({
    name: 'mediaBridge',

    addStorage() {
        return { pick: null, uploadFiles: null }
    },

    addProseMirrorPlugins() {
        const storage = this.storage
        const mediaFiles = (list: FileList | null | undefined) =>
            Array.from(list ?? []).filter((f) => f.type.startsWith('image/') || f.type.startsWith('video/'))

        return [
            new Plugin({
                key: new PluginKey('mediaBridgeDropPaste'),
                props: {
                    handleDrop(view, event, _slice, moved) {
                        const files = mediaFiles(event.dataTransfer?.files)
                        if (moved || !files.length || !storage.uploadFiles) return false
                        event.preventDefault()
                        const pos = view.posAtCoords({ left: event.clientX, top: event.clientY })?.pos ?? view.state.selection.to
                        storage.uploadFiles(files, pos)
                        return true
                    },
                    handlePaste(view, event) {
                        const files = mediaFiles(event.clipboardData?.files)
                        if (!files.length || !storage.uploadFiles) return false
                        storage.uploadFiles(files, view.state.selection.to)
                        return true
                    },
                },
            }),
        ]
    },
})
