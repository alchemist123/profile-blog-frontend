import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { HtmlBlockView } from './HtmlBlockView'

export const HtmlBlock = Node.create({
    name: 'htmlBlock',

    group: 'block',

    atom: true,

    addAttributes() {
        return {
            html: {
                default: '',
                parseHTML: (element) => element.getAttribute('data-html') ?? '',
                renderHTML: (attrs) => (attrs.html ? { 'data-html': attrs.html } : {}),
            },
        }
    },

    parseHTML() {
        return [
            {
                tag: 'div[data-type="html-block"]',
                getAttrs: (dom) => {
                    const el = dom as HTMLElement
                    return { html: el.getAttribute('data-html') ?? '' }
                },
            },
        ]
    },

    renderHTML({ node, HTMLAttributes }) {
        return [
            'div',
            mergeAttributes(
                { 'data-type': 'html-block', class: 'html-block my-4' },
                { 'data-html': node.attrs.html ?? '' },
                HTMLAttributes
            ),
        ]
    },

    addNodeView() {
        return ReactNodeViewRenderer(HtmlBlockView)
    },

    addCommands() {
        return {
            setHtmlBlock:
                (attrs?: { html?: string }) =>
                ({ commands }) =>
                    commands.insertContent({ type: this.name, attrs: { html: attrs?.html ?? '' } }),
        }
    },
})

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        htmlBlock: {
            setHtmlBlock: (attrs?: { html?: string }) => ReturnType
        }
    }
}
