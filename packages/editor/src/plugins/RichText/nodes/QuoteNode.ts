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
  type Spread,
} from "lexical"
import type { Simplify } from "type-fest"

export type ColorValueHex = `#${string}`

export type SerializedQuoteNode = Simplify<
  Spread<
    {
      color?: ColorValueHex
    },
    SerializedElementBlockNode
  >
>

export class QuoteNode extends ElementNode {
  __color?: ColorValueHex

  static override getType(): string {
    return "quote"
  }

  static override clone(node: QuoteNode): QuoteNode {
    return new QuoteNode(node.__color, node.__key)
  }

  constructor(color?: ColorValueHex, key?: NodeKey) {
    super(key)
    this.__color = color
  }

  getColor(): ColorValueHex | undefined {
    return this.getLatest().__color
  }

  setColor(color: ColorValueHex | undefined): this {
    this.getWritable().__color = color
    return this
  }

  override canIndent(): boolean {
    return false
  }

  override canBeEmpty(): boolean {
    return false
  }

  override canInsertTextAfter(): boolean {
    return false
  }

  override canInsertTextBefore(): boolean {
    return false
  }

  /* ---------------------------------- View ---------------------------------- */

  override createDOM(config: EditorConfig, editor: LexicalEditor): HTMLElement {
    const element = document.createElement("blockquote")
    if (config.theme.quote) {
      element.className = config.theme.quote
    }
    $updateQuoteColor(this, element)
    return element
  }

  override updateDOM(prevNode: this, dom: HTMLElement, _config: EditorConfig): boolean {
    if (prevNode.__color !== this.__color) {
      $updateQuoteColor(this, dom)
    }
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

function $updateQuoteColor(node: QuoteNode, dom: HTMLElement) {
  const color = node.__color
  if (color) {
    dom.style.borderColor = color
    dom.style.backgroundColor = color + "18"
    dom.setAttribute("data-color", color)
  } else {
    dom.style.borderColor = ""
    dom.style.backgroundColor = ""
    dom.removeAttribute("data-color")
  }
}
