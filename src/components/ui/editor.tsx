import { EditorProvider, TiptapFloatingMenu as FloatingMenu, TiptapBubbleMenu as BubbleMenu, useCurrentEditor, useEditorState, type Editor as TiptapEditor } from '@tiptap/react'
import { Extension } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import Youtube from '@tiptap/extension-youtube'
import BubbleMenuExtension from '@tiptap/extension-bubble-menu'
import FloatingMenuExtension from '@tiptap/extension-floating-menu'
import { EditorState } from '@tiptap/pm/state'
import {
    Plus, Image as ImageIcon, Code, Code2, FileCode, Heading2, Heading3, Pilcrow,
    Bold, Italic, Underline, Strikethrough, Link2, List, ListOrdered, Quote, Minus, Undo2, Redo2,
    type LucideIcon,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { Film, Loader2, X as XIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useMediaPicker } from '@/components/media/useMediaPicker'
import { MAX_BYTES, formatBytes, kindOfFile, probeVideo, uploadMedia } from '@/lib/media'
import { HtmlBlock } from './editor-html-block'
import { MediaBridge, Video, type MediaBridgeStorage } from './editor-media'

interface EditorProps {
    content: string;
    onChange: (html: string) => void;
}

const LinkShortcut = Extension.create({
    name: 'linkShortcut',
    addKeyboardShortcuts() {
        return { 'Mod-k': () => { promptLink(this.editor); return true } }
    },
})

const extensions = [
    LinkShortcut,
    StarterKit.configure({
        heading: { levels: [2, 3, 4] },
        link: { openOnClick: false, autolink: true, defaultProtocol: 'https' },
    }),
    Image,
    Youtube.configure({
        HTMLAttributes: { class: 'w-full aspect-video rounded-2xl my-8' },
    }),
    HtmlBlock,
    Video,
    MediaBridge,
    Placeholder.configure({
        placeholder: ({ pos }) => (pos === 0 ? 'Start writing… (## heading, > quote, ``` code — drop or paste photos & videos)' : 'Write something…'),
    }),
    BubbleMenuExtension,
    FloatingMenuExtension,
]

// Same typography as the published article, so the editor is WYSIWYG.
const editorProps = {
    attributes: {
        class: 'article-body focus:outline-none min-h-[50vh] pb-24',
    },
}

const Editor = ({ content, onChange }: EditorProps) => {
    return (
        <div className="relative">
            <EditorProvider
                extensions={extensions}
                content={content}
                editorProps={editorProps}
                onUpdate={({ editor }) => onChange(editor.getHTML())}
                immediatelyRender={true}
                slotBefore={<><ToolbarSlot /><MediaBridgeSlot /></>}
                editorContainerProps={{ className: 'editor-blocks' }}
            >
                <EditorMenus />
            </EditorProvider>

            <style>{`
                .editor-blocks .ProseMirror .is-empty::before {
                    color: #A29DBD;
                    content: attr(data-placeholder);
                    float: left;
                    height: 0;
                    pointer-events: none;
                    font-size: 1rem;
                }
                .editor-blocks .ProseMirror .ProseMirror-selectednode {
                    outline: 2px solid #FF5C35;
                    outline-offset: 2px;
                    border-radius: 1rem;
                }
                .tippy-box { z-index: 1000 !important; }
            `}</style>
        </div>
    )
}

/* ───────── Actions shared by toolbar, "+" menu and bubble menu ───────── */

function promptLink(editor: TiptapEditor) {
    const prev = editor.getAttributes('link').href as string | undefined
    const url = window.prompt('Link URL (leave empty to remove)', prev ?? 'https://')
    if (url === null) return
    if (url === '' || url === 'https://') {
        editor.chain().focus().extendMarkRange('link').unsetLink().run()
        return
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
}

const bridge = (editor: TiptapEditor) => (editor.storage as unknown as { mediaBridge: MediaBridgeStorage }).mediaBridge

async function orientationOf(src: string): Promise<'portrait' | 'landscape'> {
    try {
        const { width, height } = await probeVideo(src)
        return height > width ? 'portrait' : 'landscape'
    } catch {
        return 'landscape'
    }
}

/** Insert a media block after the current selection (never replacing a selected photo/video). */
function insertBlock(editor: TiptapEditor, type: string, attrs: Record<string, unknown>) {
    editor.chain().focus().insertContentAt(editor.state.selection.to, { type, attrs }).run()
}

async function pickImage(editor: TiptapEditor) {
    const sel = await bridge(editor).pick?.('image')
    if (sel) insertBlock(editor, 'image', { src: sel.url, alt: sel.alt ?? '' })
}

async function pickVideo(editor: TiptapEditor) {
    const sel = await bridge(editor).pick?.('video')
    if (!sel) return
    if (sel.source === 'youtube') insertBlock(editor, 'youtube', { src: sel.url })
    else insertBlock(editor, 'video', { src: sel.url, orientation: await orientationOf(sel.url) })
}

interface Action {
    key: string
    label: string
    icon: LucideIcon
    run: (e: TiptapEditor) => void
    active?: (e: TiptapEditor) => boolean
    shortcut?: string
}

const BLOCK_ACTIONS: Action[] = [
    { key: 'p', label: 'Text', icon: Pilcrow, run: (e) => e.chain().focus().setParagraph().run(), active: (e) => e.isActive('paragraph') },
    { key: 'h2', label: 'Heading', icon: Heading2, run: (e) => e.chain().focus().toggleHeading({ level: 2 }).run(), active: (e) => e.isActive('heading', { level: 2 }), shortcut: '## ' },
    { key: 'h3', label: 'Subheading', icon: Heading3, run: (e) => e.chain().focus().toggleHeading({ level: 3 }).run(), active: (e) => e.isActive('heading', { level: 3 }), shortcut: '### ' },
]

const MARK_ACTIONS: Action[] = [
    { key: 'bold', label: 'Bold', icon: Bold, run: (e) => e.chain().focus().toggleBold().run(), active: (e) => e.isActive('bold'), shortcut: 'Ctrl+B' },
    { key: 'italic', label: 'Italic', icon: Italic, run: (e) => e.chain().focus().toggleItalic().run(), active: (e) => e.isActive('italic'), shortcut: 'Ctrl+I' },
    { key: 'underline', label: 'Underline', icon: Underline, run: (e) => e.chain().focus().toggleUnderline().run(), active: (e) => e.isActive('underline'), shortcut: 'Ctrl+U' },
    { key: 'strike', label: 'Strikethrough', icon: Strikethrough, run: (e) => e.chain().focus().toggleStrike().run(), active: (e) => e.isActive('strike') },
    { key: 'code', label: 'Inline code', icon: Code, run: (e) => e.chain().focus().toggleCode().run(), active: (e) => e.isActive('code'), shortcut: '`code`' },
    { key: 'link', label: 'Link', icon: Link2, run: promptLink, active: (e) => e.isActive('link'), shortcut: 'Ctrl+K' },
]

const STRUCTURE_ACTIONS: Action[] = [
    { key: 'ul', label: 'Bullet list', icon: List, run: (e) => e.chain().focus().toggleBulletList().run(), active: (e) => e.isActive('bulletList'), shortcut: '- ' },
    { key: 'ol', label: 'Numbered list', icon: ListOrdered, run: (e) => e.chain().focus().toggleOrderedList().run(), active: (e) => e.isActive('orderedList'), shortcut: '1. ' },
    { key: 'quote', label: 'Quote', icon: Quote, run: (e) => e.chain().focus().toggleBlockquote().run(), active: (e) => e.isActive('blockquote'), shortcut: '> ' },
    { key: 'codeblock', label: 'Code block', icon: Code2, run: (e) => e.chain().focus().toggleCodeBlock().run(), active: (e) => e.isActive('codeBlock'), shortcut: '``` ' },
    { key: 'hr', label: 'Divider', icon: Minus, run: (e) => e.chain().focus().setHorizontalRule().run(), shortcut: '---' },
]

const MEDIA_ACTIONS: Action[] = [
    { key: 'image', label: 'Photo', icon: ImageIcon, run: pickImage },
    { key: 'video', label: 'Video', icon: Film, run: pickVideo },
    { key: 'html', label: 'HTML embed', icon: FileCode, run: (e) => e.chain().focus().setHtmlBlock().run() },
]

const ToolbarButton = ({ action, editor, active }: { action: Action; editor: TiptapEditor; active: boolean }) => {
    const Icon = action.icon
    return (
        <button
            type="button"
            onMouseDown={(ev) => ev.preventDefault()}
            onClick={() => action.run(editor)}
            title={action.shortcut ? `${action.label} (${action.shortcut})` : action.label}
            aria-label={action.label}
            aria-pressed={active}
            className={cn(
                'inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors',
                active ? 'bg-ink-950 text-white' : 'text-ink-500 hover:bg-sand hover:text-ink-950'
            )}
        >
            <Icon className="h-4 w-4" />
        </button>
    )
}

const Divider = () => <span className="mx-1 h-5 w-px shrink-0 bg-sand-line" />

/** Always-visible formatting bar. */
const Toolbar = ({ editor }: { editor: TiptapEditor }) => {
    const groups = [BLOCK_ACTIONS, MARK_ACTIONS, STRUCTURE_ACTIONS, MEDIA_ACTIONS]
    const state = useEditorState({
        editor,
        selector: ({ editor: e }) => ({
            active: Object.fromEntries(groups.flat().map((a) => [a.key, a.active?.(e) ?? false])),
            canUndo: e.can().undo(),
            canRedo: e.can().redo(),
        }),
    })

    return (
        <div className="sticky top-[7.5rem] z-20 -mx-2 mb-8 flex items-center gap-0.5 overflow-x-auto rounded-xl border border-sand-line bg-white/95 p-1 shadow-sm backdrop-blur [scrollbar-width:none]">
            {groups.map((group, gi) => (
                <div key={gi} className="flex items-center gap-0.5">
                    {gi > 0 && <Divider />}
                    {group.map((a) => <ToolbarButton key={a.key} action={a} editor={editor} active={state.active[a.key]} />)}
                </div>
            ))}
            <div className="ml-auto flex items-center gap-0.5 pl-2">
                <Divider />
                <button type="button" title="Undo (Ctrl+Z)" disabled={!state.canUndo} onClick={() => editor.chain().focus().undo().run()} className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-ink-500 hover:bg-sand hover:text-ink-950 disabled:opacity-30">
                    <Undo2 className="h-4 w-4" />
                </button>
                <button type="button" title="Redo (Ctrl+Shift+Z)" disabled={!state.canRedo} onClick={() => editor.chain().focus().redo().run()} className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-ink-500 hover:bg-sand hover:text-ink-950 disabled:opacity-30">
                    <Redo2 className="h-4 w-4" />
                </button>
            </div>
        </div>
    )
}

/** "+" on empty lines: quick insert of the most common blocks. */
const FloatingAddBlockButton = ({ editor }: { editor: TiptapEditor }) => {
    const [open, setOpen] = useState(false)
    const items = [BLOCK_ACTIONS[1], BLOCK_ACTIONS[2], STRUCTURE_ACTIONS[0], STRUCTURE_ACTIONS[2], STRUCTURE_ACTIONS[3], ...MEDIA_ACTIONS]
    return (
        <div className="relative -ml-12 flex items-center">
            <button
                type="button"
                onMouseDown={(ev) => ev.preventDefault()}
                onClick={() => setOpen((v) => !v)}
                title="Insert block"
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-ink-200 bg-white text-ink-400 shadow-sm transition-all hover:border-ember-500 hover:text-ember-600"
            >
                <Plus className={cn('h-4 w-4 transition-transform', open && 'rotate-45')} />
            </button>
            {open && (
                <div className="absolute left-10 top-0 z-[1000] flex items-center gap-0.5 whitespace-nowrap rounded-xl border border-sand-line bg-white p-1 shadow-lg animate-in fade-in slide-in-from-left-2">
                    {items.map((a) => {
                        const Icon = a.icon
                        return (
                            <button
                                key={a.key}
                                type="button"
                                onMouseDown={(ev) => ev.preventDefault()}
                                onClick={() => { a.run(editor); setOpen(false) }}
                                className="flex h-12 w-14 flex-col items-center justify-center gap-1 rounded-lg text-ink-500 hover:bg-sand hover:text-ink-950"
                            >
                                <Icon className="h-4 w-4" />
                                <span className="text-[10px] font-medium">{a.label.split(' ')[0]}</span>
                            </button>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

interface UploadJob {
    id: number
    name: string
    progress: number
    error?: string
}

let jobSeq = 0

/** Provides the media picker + drag/drop/paste uploads to the editor, and shows upload progress. */
const MediaBridgeSlot = () => {
    const { editor } = useCurrentEditor()
    const picker = useMediaPicker({ allowYouTube: true })
    const [jobs, setJobs] = useState<UploadJob[]>([])
    const openPicker = picker.open

    useEffect(() => {
        if (!editor) return
        const b = bridge(editor)
        b.pick = (kind) => openPicker(kind)
        b.uploadFiles = (files, pos) => {
            const update = (id: number, patch: Partial<UploadJob>) => setJobs((js) => js.map((j) => (j.id === id ? { ...j, ...patch } : j)))
            files.forEach(async (file) => {
                const id = ++jobSeq
                setJobs((js) => [...js, { id, name: file.name, progress: 0 }])
                const kind = kindOfFile(file)
                if (!kind) return update(id, { error: 'Unsupported file type' })
                if (file.size > MAX_BYTES[kind]) return update(id, { error: `Too large (max ${formatBytes(MAX_BYTES[kind])})` })
                try {
                    const item = await uploadMedia(file, { onProgress: (p) => update(id, { progress: p }) })
                    const at = Math.min(pos, editor.state.doc.content.size)
                    if (kind === 'image') {
                        editor.chain().focus().insertContentAt(at, { type: 'image', attrs: { src: item.url, alt: '' } }).run()
                    } else {
                        const orientation = await orientationOf(item.url)
                        editor.chain().focus().insertContentAt(at, { type: 'video', attrs: { src: item.url, orientation } }).run()
                    }
                    setJobs((js) => js.filter((j) => j.id !== id))
                } catch (e) {
                    update(id, { error: (e as Error).message })
                }
            })
        }
        return () => {
            b.pick = null
            b.uploadFiles = null
        }
    }, [editor, openPicker])

    return (
        <>
            {picker.element}
            {jobs.length > 0 && (
                <div className="fixed bottom-6 right-6 z-50 w-72 space-y-2">
                    {jobs.map((j) => (
                        <div key={j.id} className="rounded-xl border border-sand-line bg-white p-3 text-xs shadow-lg">
                            <div className="flex items-center justify-between gap-2">
                                <span className="flex min-w-0 items-center gap-1.5 font-medium text-ink-900">
                                    {!j.error && <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin text-ember-500" />}
                                    <span className="truncate">{j.name}</span>
                                </span>
                                {j.error ? (
                                    <button type="button" onClick={() => setJobs((js) => js.filter((x) => x.id !== j.id))} title="Dismiss">
                                        <XIcon className="h-3.5 w-3.5 text-ink-400" />
                                    </button>
                                ) : (
                                    <span className="tabular-nums text-ink-400">{Math.round(j.progress * 100)}%</span>
                                )}
                            </div>
                            {j.error ? (
                                <p className="mt-1 text-red-600">{j.error}</p>
                            ) : (
                                <div className="mt-2 h-1 overflow-hidden rounded-full bg-sand">
                                    <div className="h-full bg-ember-500 transition-[width]" style={{ width: `${j.progress * 100}%` }} />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </>
    )
}

const ToolbarSlot = () => {
    const { editor } = useCurrentEditor()
    return editor ? <Toolbar editor={editor} /> : null
}

/** Floating "+" and selection bubble; EditorProvider renders the document itself. */
const EditorMenus = () => {
    const { editor } = useCurrentEditor()
    if (!editor) return null

    return (
        <>

            <FloatingMenu
                className="flex items-center"
                shouldShow={({ state }: { state: EditorState }) => {
                    const { $from } = state.selection
                    return $from.parent.type.name === 'paragraph' && $from.parent.content.size === 0
                }}
            >
                <FloatingAddBlockButton editor={editor} />
            </FloatingMenu>

            <BubbleMenu className="z-[1000] flex items-center gap-0.5 rounded-xl bg-ink-950 p-1 shadow-xl">
                <BubbleOptions editor={editor} />
            </BubbleMenu>

        </>
    )
}

/** Dark selection bubble with inline formatting. */
const BubbleOptions = ({ editor }: { editor: TiptapEditor }) => {
    const items = [...MARK_ACTIONS.filter((a) => a.key !== 'strike'), BLOCK_ACTIONS[1], STRUCTURE_ACTIONS[2]]
    const active = useEditorState({
        editor,
        selector: ({ editor: e }) => Object.fromEntries(items.map((a) => [a.key, a.active?.(e) ?? false])),
    })
    return (
        <>
            {items.map((a) => {
                const Icon = a.icon
                return (
                    <button
                        key={a.key}
                        type="button"
                        onClick={() => a.run(editor)}
                        title={a.label}
                        className={cn(
                            'inline-flex h-8 w-8 items-center justify-center rounded-lg transition-colors',
                            active[a.key] ? 'bg-ember-500 text-white' : 'text-ink-200 hover:bg-white/10 hover:text-white'
                        )}
                    >
                        <Icon className="h-4 w-4" />
                    </button>
                )
            })}
        </>
    )
}

export default Editor
