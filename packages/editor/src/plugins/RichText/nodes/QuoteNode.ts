import type { NodeMarkdownSerializer } from "#core/markdown"
import { type SerializedElementBlockNode } from "#core/nodes"
import { __assert__ } from "#shared/dev.ts"
import { $warpContinuosInlineNodes } from "#shared/node.ts"
import {
  $createParagraphNode,
  ElementNode,
  type DOMConversionMap,
  type DOMExportOutput,
  type EditorConfig,
  type ElementFormatType,
  type LexicalEditor,
  type LexicalNode,
  type NodeKey,
  type ParagraphNode,
  type RangeSelection,
} from "lexical"
import type { Simplify } from "type-fest"

export type SerializedQuoteNode = Simplify<SerializedElementBlockNode>

export class QuoteNode extends ElementNode {
  static override getType(): string {
    return "quote"
  }

  static override clone(node: QuoteNode): QuoteNode {
    return new QuoteNode(node.__key)
  }

  constructor(key?: NodeKey) {
    super(key)
  }

  override canIndent(): boolean {
    return false
  }

  /* ---------------------------------- View ---------------------------------- */

  override createDOM(config: EditorConfig, editor: LexicalEditor): HTMLElement {
    const element = document.createElement("blockquote")
    if (config.theme.quote) {
      element.className = config.theme.quote
    }
    return element
  }

  override updateDOM(_prevNode: this, _dom: HTMLElement, _config: EditorConfig): boolean {
    return false
  }

  /* ------------------------------ Serialization ----------------------------- */

  override exportDOM(editor: LexicalEditor): DOMExportOutput {
    const element = this.createDOM(editor._config, editor)
    const formatType = this.getFormatType()
    element.style.textAlign = formatType
    return {
      element,
    }
  }

  static override importDOM(): DOMConversionMap {
    return {
      blockquote: () => ({
        conversion: element => {
          const node = $createQuoteNode()
          node.setFormat(element.style.textAlign as ElementFormatType)
          return { node }
        },
        priority: 0,
      }),
    }
  }

  override exportJSON(): SerializedQuoteNode {
    return {
      ...super.exportJSON(),
      type: QuoteNode.getType(),
    }
  }

  static override importJSON(serializedNode: SerializedQuoteNode): QuoteNode {
    return $createQuoteNode().updateFromJSON(serializedNode)
  }

  override exportMarkdown: NodeMarkdownSerializer = exportChildren => {
    return exportChildren(this, { linePrefix: "> " })
  }

  /* -------------------------------- Mutation -------------------------------- */

  override append(...nodes: LexicalNode[]): this {
    return super.append(...$warpContinuosInlineNodes(nodes, $createParagraphNode))
  }

  override insertNewAfter(_selection: RangeSelection, restoreSelection?: boolean): ParagraphNode {
    const paragraph = $createParagraphNode()
    this.insertAfter(paragraph, restoreSelection)
    return paragraph
  }

  override collapseAtStart(selection: RangeSelection): boolean {
    const paragraph = $createParagraphNode()
    const children = this.getChildren()
    paragraph.append(...children)
    this.replace(paragraph)
    return true
  }

  static override transform(): (node: LexicalNode) => void {
    return node => {
      __assert__($isQuoteNode(node))
      if (node.isEmpty()) {
        node.remove()
      }
    }
  }
}

export function $createQuoteNode(): QuoteNode {
  return new QuoteNode()
}

export function $isQuoteNode(node: LexicalNode | null | undefined): node is QuoteNode {
  return node instanceof QuoteNode
}
