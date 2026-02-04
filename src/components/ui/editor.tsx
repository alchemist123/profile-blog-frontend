import { EditorProvider, TiptapFloatingMenu as FloatingMenu, TiptapBubbleMenu as BubbleMenu, useCurrentEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import CodeBlock from '@tiptap/extension-code-block'
import Placeholder from '@tiptap/extension-placeholder'
import Youtube from '@tiptap/extension-youtube'
import BubbleMenuExtension from '@tiptap/extension-bubble-menu'
import FloatingMenuExtension from '@tiptap/extension-floating-menu'
import { EditorState } from '@tiptap/pm/state'
import { Plus, Image as ImageIcon, Youtube as YoutubeIcon, Code, Type, FileCode, Heading1 } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { HtmlBlock } from './editor-html-block'

interface EditorProps {
    content: string;
    onChange: (html: string) => void;
}

const extensions = [
    StarterKit,
    Image.configure({
        HTMLAttributes: {
            class: 'rounded-lg border shadow-sm my-4',
        },
    }),
    CodeBlock.configure({
        HTMLAttributes: {
            class: 'rounded-md bg-muted p-4 font-mono text-sm my-4',
        },
    }),
    Youtube.configure({
        HTMLAttributes: {
            class: 'w-full aspect-video rounded-lg border shadow-sm my-4',
        },
    }),
    HtmlBlock,
    Placeholder.configure({
        placeholder: 'Tell your story...',
    }),
    BubbleMenuExtension,
    FloatingMenuExtension,
]

const editorProps = {
    attributes: {
        class: 'prose prose-zinc dark:prose-invert max-w-none focus:outline-none min-h-[300px]',
    },
}

const Editor = ({ content, onChange }: EditorProps) => {
    return (
        <div className="relative">
            <EditorProvider
                extensions={extensions}
                content={content}
                editorProps={editorProps}
                onUpdate={({ editor }) => {
                    onChange(editor.getHTML())
                }}
                immediatelyRender={true}
            >
                <EditorMenus />
            </EditorProvider>

            <style>{`
                /* Medium-like: story = collection of blocks with spacing */
                .editor-blocks .ProseMirror {
                    position: relative;
                }
                .editor-blocks .ProseMirror > * + * {
                    margin-top: 1.5rem;
                }
                .editor-blocks .ProseMirror p.is-editor-empty::before {
                    color: #adb5bd;
                    content: attr(data-placeholder);
                    float: left;
                    height: 0;
                    pointer-events: none;
                }
                .editor-blocks .ProseMirror p.is-editor-empty:first-child::before {
                    content: "Tell your story...";
                }
                .editor-blocks .ProseMirror p.is-editor-empty:not(:first-child)::before {
                    content: "Write something...";
                }
                .editor-blocks .ProseMirror .is-empty.is-editor-empty::before {
                    content: "Write something...";
                }
                .tippy-box {
                    z-index: 1000 !important;
                }
            `}</style>
        </div>
    )
}

/** Add block "+" that appears on empty lines (e.g. after double Enter) — has its own menu state */
const FloatingAddBlockButton = () => {
    const [open, setOpen] = useState(false)
    return (
        <div className="relative flex items-center -ml-10">
            <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 rounded-full border border-muted-foreground/30 text-muted-foreground hover:text-foreground hover:border-foreground transition-all bg-background shadow-sm"
                onClick={() => setOpen((v) => !v)}
                type="button"
                title="Add block"
            >
                <Plus className={`h-4 w-4 transition-transform ${open ? 'rotate-45' : ''}`} />
            </Button>
            {open && (
                <div className="absolute left-10 top-0 flex items-center gap-1 p-1 bg-background border rounded-lg shadow-md animate-in slide-in-from-left-2 fade-in z-[1000] whitespace-nowrap">
                    <MenuOptions setShowOptions={setOpen} />
                </div>
            )}
        </div>
    )
}

const EditorMenus = () => {
    const { editor } = useCurrentEditor()
    const [showBlockMenu, setShowBlockMenu] = useState(false)

    if (!editor) return null

    return (
        <div className="flex gap-0 w-full">
            {/* Always-visible add block button (Medium-style left gutter) */}
            <div className="flex-shrink-0 pt-[0.35rem] w-10 flex justify-center">
                <div className="relative">
                    <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 rounded-full border border-muted-foreground/30 text-muted-foreground hover:text-foreground hover:border-foreground transition-all bg-background shadow-sm"
                        onClick={() => {
                            editor.commands.focus()
                            setShowBlockMenu((v) => !v)
                        }}
                        type="button"
                        title="Add block"
                    >
                        <Plus className={`h-4 w-4 transition-transform ${showBlockMenu ? 'rotate-45' : ''}`} />
                    </Button>
                    {showBlockMenu && (
                        <>
                            <div
                                className="fixed inset-0 z-[999]"
                                aria-hidden
                                onClick={() => setShowBlockMenu(false)}
                            />
                            <div className="absolute left-10 top-0 flex items-center gap-1 p-1 bg-background border rounded-lg shadow-md animate-in slide-in-from-left-2 fade-in z-[1000] whitespace-nowrap">
                                <MenuOptions setShowOptions={setShowBlockMenu} />
                            </div>
                        </>
                    )}
                </div>
            </div>

            <div className="flex-1 min-w-0 relative">
                {/* Add block "+" when cursor is in an empty line (e.g. after double Enter) */}
                <FloatingMenu
                    className="flex items-center"
                    shouldShow={({ state }: { state: EditorState }) => {
                        const { $from } = state.selection
                        return $from.parent.type.name === 'paragraph' && $from.parent.content.size === 0
                    }}
                >
                    <FloatingAddBlockButton />
                </FloatingMenu>

                <BubbleMenu
                    className="flex items-center gap-1 p-1 bg-background border rounded-lg shadow-lg z-[1000]"
                >
                    <BubbleOptions />
                </BubbleMenu>

                <div className="editor-blocks">
                    <EditorContent editor={editor} />
                </div>
            </div>
        </div>
    )
}

const MenuOptions = ({ setShowOptions }: { setShowOptions: (show: boolean) => void }) => {
    const { editor } = useCurrentEditor()

    if (!editor) return null

    const addImage = () => {
        const url = window.prompt('Image URL')
        if (url) {
            editor.chain().focus().setImage({ src: url }).run()
            setShowOptions(false)
        }
    }

    const addYoutube = () => {
        const url = window.prompt('YouTube URL')
        if (url) {
            editor.commands.setYoutubeVideo({ src: url })
            setShowOptions(false)
        }
    }

    return (
        <>
            <button
                onClick={() => { editor.chain().focus().setParagraph().run(); setShowOptions(false); }}
                className="flex flex-col items-center justify-center w-12 h-12 hover:bg-muted rounded text-muted-foreground hover:text-foreground gap-1"
                title="Text"
            >
                <Type className="h-5 w-5" />
                <span className="text-[10px]">Text</span>
            </button>

            <button
                onClick={() => { editor.chain().focus().toggleHeading({ level: 2 }).run(); setShowOptions(false); }}
                className="flex flex-col items-center justify-center w-12 h-12 hover:bg-muted rounded text-muted-foreground hover:text-foreground gap-1"
                title="Heading"
            >
                <Heading1 className="h-5 w-5" />
                <span className="text-[10px]">Title</span>
            </button>

            <button
                onClick={() => { editor.chain().focus().toggleCodeBlock().run(); setShowOptions(false); }}
                className="flex flex-col items-center justify-center w-12 h-12 hover:bg-muted rounded text-muted-foreground hover:text-foreground gap-1"
                title="Code"
            >
                <Code className="h-5 w-5" />
                <span className="text-[10px]">Code</span>
            </button>

            <button
                onClick={() => { editor.chain().focus().setHtmlBlock().run(); setShowOptions(false); }}
                className="flex flex-col items-center justify-center w-12 h-12 hover:bg-muted rounded text-muted-foreground hover:text-foreground gap-1"
                title="HTML"
            >
                <FileCode className="h-5 w-5" />
                <span className="text-[10px]">HTML</span>
            </button>

            <button
                onClick={addImage}
                className="flex flex-col items-center justify-center w-12 h-12 hover:bg-muted rounded text-muted-foreground hover:text-foreground gap-1"
                title="Image URL"
            >
                <ImageIcon className="h-5 w-5" />
                <span className="text-[10px]">Image</span>
            </button>

            <button
                onClick={addYoutube}
                className="flex flex-col items-center justify-center w-12 h-12 hover:bg-muted rounded text-muted-foreground hover:text-foreground gap-1"
                title="Video URL"
            >
                <YoutubeIcon className="h-5 w-5" />
                <span className="text-[10px]">Video</span>
            </button>
        </>
    )
}

const BubbleOptions = () => {
    const { editor } = useCurrentEditor()

    if (!editor) return null

    return (
        <>
            <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={`p-1.5 rounded hover:bg-muted ${editor.isActive('bold') ? 'text-primary' : 'text-muted-foreground'}`}
                title="Bold"
            >
                <span className="font-bold text-sm">B</span>
            </button>
            <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={`p-1.5 rounded hover:bg-muted ${editor.isActive('italic') ? 'text-primary' : 'text-muted-foreground'}`}
                title="Italic"
            >
                <span className="italic text-sm">I</span>
            </button>
            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={`p-1.5 rounded hover:bg-muted ${editor.isActive('heading', { level: 2 }) ? 'text-primary' : 'text-muted-foreground'}`}
                title="Heading 1"
            >
                <span className="font-bold text-xs">H1</span>
            </button>
            <button
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                className={`p-1.5 rounded hover:bg-muted ${editor.isActive('codeBlock') ? 'text-primary' : 'text-muted-foreground'}`}
                title="Code Block"
            >
                <Code className="h-4 w-4" />
            </button>
        </>
    )
}

export default Editor
